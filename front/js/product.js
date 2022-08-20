// const to access on a global scope
const titleOfProduct = document.getElementById("title");
const priceOfProduct = document.getElementById("price");
const descriptionOfProduct = document.getElementById("description");
const imageOfProduct = document.querySelector(".item__img");
const colorsSelection = document.getElementById("colors");


/** variable that contains the window location search */
const keySearchValues = new URLSearchParams(window.location.search);

/** Fetch - Calling the API adresse with keySearchValues to get the id of the product*/
FetchAndRenderProductsApi('http://localhost:3000/api/products/' + keySearchValues.get("id"));


// fetch, get response in json, convert it into an object, rendering the informations in html and checking the values before redirection
/**
 * @param {getProductsUrl} getProductsUrl url to connect
 *
 * 1. response.json  
 * 2. Object product
 * 3. Render html elements
 * 4. Event on cart button
 */
function FetchAndRenderProductsApi(getProductsUrl) {
    fetch(getProductsUrl)
        .then(response => response.json())
        .then((product) => TypeProduct(product))
        .then((product) => SetHtmlElements(product))
        .then(() => AddEventListenerToCartButton())
}

/** 
 * @param {product} product
 * @return {product} product
 * 
 * Assigning product as a new product object
 * */
function TypeProduct(product) {
    return Object.assign(new Product, product);
}



/** 
* @param {product} product 
*
*Setting the informations according to the ID of the product selected
*/
function SetHtmlElements(product) {
    imageOfProduct.innerHTML += `<img src="${product.imageUrl}" 
                                alt="${product.altTxt}">`;
    priceOfProduct.innerHTML += product.price;
    descriptionOfProduct.innerHTML += product.description;
    titleOfProduct.innerHTML += product.name;

    // Setting the dropdown menu for choosing the colors from list related to the product.
    let colorsList = product.colors;
    colorsList.forEach((color) => {
        let optionColor = document.createElement("option");
        optionColor.value = color;
        optionColor.text = color;
        colorsSelection.appendChild(optionColor);
    });
}


/** Event Listener on addToCart button that calls the OnClickCardButton.*/
function AddEventListenerToCartButton() {
    const addingToCart = document.getElementById("addToCart");
    addingToCart.addEventListener("click", OnClickCardButton)
}


// --------------- Below are functions that are called only if button is clicked -----------------------------------


/** function that checks if values are Ok and then save them to localstorage. 
 * @param {event} event
 * 
*/
function OnClickCardButton(event) {
    event.preventDefault();
    if (CheckingValues()) {
        SaveProductToLocalStorage();
    }
}


/** Checking colors and quantity
 * If statement on quantity and color then returns true or false
 * 
 * @return {boolean}
*/
function CheckingValues() {
    if (CheckQuantities() == false) {
        return false;
    }
    if (CheckColors() == false) {
        return false;
    }
    return true;
}

/** Checking input values in quantities
 * 
 * @return {boolean}
*/
function CheckQuantities() {
    const inputQuantities = document.getElementById("quantity").value;

    if (inputQuantities == 0) {
        alert("Veuillez indiquer une quantité.");
        return false;
    }

    if (inputQuantities < 0) {
        alert("Veuillez indiquer une quantité supérieure à 0.");
        return false;
    }

    if (inputQuantities > 100) {
        alert("Veuillez indiquer une quantité inférieure à 100.");
        return false;
    }
    return true;
}



/** Checking selected color
 * 
 * @return {boolean}
*/
function CheckColors() {
    const selectColor = document.getElementById("colors").value;
    if (selectColor.value === selectColor[0]) {
        alert("Veuillez choisir une couleur");
        return false;
    }
    return true;
}


/** Get localstorage, checking if localstorage has data and if not setting them in an array.*/
function SaveProductToLocalStorage() {

    // new variable that call the function GetProductToLocalStorage();
    let oldLocalStorage = GetProductToLocalStorage();

    const inputQuantities = document.getElementById("quantity").value;
    const selectColor = document.getElementById("colors").value;

    // Create new object (from model ProducInCart) that holds the selected values 
    let productCart = new ProducInCart(keySearchValues.get("id"), selectColor, inputQuantities);

    let newListProductInBasket = [];

    if (oldLocalStorage != null) {

        newListProductInBasket = oldLocalStorage;

        for (let i = 0; i < newListProductInBasket.length; i++) {
            if (newListProductInBasket[i].id === productCart.id && newListProductInBasket[i].color === productCart.color) {
                newListProductInBasket[i].quantity = parseInt(newListProductInBasket[i].quantity) + parseInt(productCart.quantity);
                productCart = null;
                break;
            }
        }
    }

    if (productCart != null) {
        newListProductInBasket.push(productCart);
    }


    // Save and replace old local storage with new list.
    localStorage.setItem("ListSelectedProduct", JSON.stringify(newListProductInBasket));

}


/** Get local storage for product selected 
 * @return {storedList} storedList
 * 
*/
function GetProductToLocalStorage() {
    let storage = localStorage.getItem("ListSelectedProduct");
    let storedList = JSON.parse(storage);


    return storedList;
}