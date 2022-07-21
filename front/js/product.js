// class Product {
//     import = ("./script");
// }

class Product {
    constructor(colors, _id, name, price, imageUrl, description, altTxt) {
        this.colors = colors;
        this._id = _id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.altTxt = altTxt;
    }
}

// getting the id of the product with window lcoation search
const keySearchValues = window.location.search.replace("?", "");

// Fetch - Calling the API adresse with the id route (also using the file Product.js in the models file)
FetchAndRenderProductsApi('http://localhost:3000/api/products/' + keySearchValues);

// fetch, get response in json, convert it into an object, rendering the informations in html and checking the values before redirection
function FetchAndRenderProductsApi(getProductsUrl) {
    fetch(getProductsUrl)
        .then(response => response.json())
        .then((product) => TypeProduct(product))
        .then((product) => SetHtmlElements(product))
        .then((valuesInChoice) => ClickCartButton(valuesInChoice))
}

// assigning product as a new product object
function TypeProduct(product) {
    return Object.assign(new Product, product);
}


// const to access on a global scope
const titleOfProduct = document.getElementById("title");
const priceOfProduct = document.getElementById("price");
const descriptionOfProduct = document.getElementById("description");
const imageOfProduct = document.querySelector(".item__img");
const colorsSelection = document.getElementById("colors");


// Setting the informations according to the urlID
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

    AddOnClickToCartButton();
}


function AddOnClickToCartButton(valuesInChoice){
    CheckingValues(valuesInChoice);
    
    const addingToCart = document.getElementById("addToCart"); 
    let renderMessage = "";

}


function OnClickCardButton(){
    CheckingValues();
    SaveProductToLocalStorage();
    NotifyProductAddToBasket();
}


function CheckingValues(valuesInChoice) {
    const inputQuantities = document.getElementsByName("input");

    inputQuantities.forEach((valueInput) => {
        valueInput.addEventlistener("input", function (){
            if (valueInput <= 0 && valueInput >= 101) {
                console.error("error");
            }
      
        })
    })

    return valuesInChoice;
}


function SaveProductToLocalStorage(){

}

function NotifyProductAddToBasket(){

}