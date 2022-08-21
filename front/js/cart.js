

// Class of produit
FetchApiAndRenderElements('http://localhost:3000/api/products');
/**
 * @param {connextionToApi} connextionToApi-url to connect

 * 1. response.json  
 * 2. Render data on html
 * 3. Delete items and update localstorage if the user clicks on the delete button 
 * 4. Retrieve and prepare data before sending to the API 
 * 5. Sending data to API.
 */
function FetchApiAndRenderElements(connextionToApi) {
    fetch(connextionToApi)
        .then(response => response.json())
        .then(jsonResponse => RenderSelectedItemsOnHtml(jsonResponse))
        .then((productList) => DeletionOfItems(productList))
        .then(() => RetrievingDataOnEventListener())
        .then(() => SubmitOrder())
}



/** Render the cart list on Html
 * @param {productList} productList - products from API
 * 
 * @return {HTMLDataElement} Get the data in localStorage.
 * 1. loops through localStorage
 * 2. loops through products from API 
 * 3. If id in localStorage matches the id of Api, then it render the selected products in html
 */
function RenderSelectedItemsOnHtml(productList) {
    const sectionItemToRender = document.getElementById("cart__items");
    let cart = GetProductListFromLocalStorage();
    let tagToRender = "";
    
    for (let itemInLocalStorage of cart) {

        for (let j = 0; j < productList.length; j++) {

            if (itemInLocalStorage.id === productList[j]._id) {

                let quantity = itemInLocalStorage.quantity;
                let image = productList[j].imageUrl;
                let name = productList[j].name;
                let id = itemInLocalStorage.id;
                let textImage = productList[j].altTxt;
                let color = itemInLocalStorage.color;
                let priceOfProduct = productList[j].price * quantity;

                tagToRender += `
                    <article class="cart__item" data-id="${id}" data-color="${color}">
                        <div class="cart__item__img">
                            <img src="${image}" alt = "${textImage}" >
                        </div>
                        <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${name}</h2>
                            <p>${color}</p>
                            <p>${priceOfProduct}€</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p class="quantityString">Qté : ${quantity}</p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                            </div>
                        </div>
                    </article>`

                sectionItemToRender.innerHTML = tagToRender;
            }
        }
    }
    ModifyQuantity();
    CalculateTotal(productList); 
}


/** Increment or decrement total quantity of products according to the choosen quantity
 * 
 * 1. Loops through parent element
 * 2. loops through cart (localstorage)
 * 3. Conditionnal statement to check if the html data id & color (from html element rendered in the above code) matches the id & color of localStorage
 * 4. Event Listener on input value
 * 5. Render the obtained values on html 
 * 6. Calling the function updateLocalStorage
 */
 function ModifyQuantity() {
    let cart = GetProductListFromLocalStorage();
    let inputChange = document.getElementsByClassName("itemQuantity");
    let parentOfInputChange = document.getElementsByClassName("cart__item");
    let stringQuantity = document.getElementsByClassName("quantityString");
    

    for (let a = 0; a < parentOfInputChange.length; a++) {
        for (let b = 0; b < cart.length; b++) {
            if (cart[b].id === parentOfInputChange[a].dataset.id &&
                cart[b].color === parentOfInputChange[a].dataset.color) {

                inputChange[a].addEventListener("change", function (changed) {
                    changed.preventDefault()
                    let quantity = inputChange[a].value;

                    if (quantity <= 0) {
                        alert("Merci d'indiquer une quantité supérieur à zéro");
                        quantity.value = 1;
                        return false;
                    }
                    if(quantity >= 101){
                        alert("Impossible de commander plus de 100 pour ce même produit avec la même couleur!");
                        quantity.value = 100;
                        return false;
                    }
                    cart[b].quantity = quantity;
                    stringQuantity[a].innerHTML = "Qté " + quantity;
                    UpdateLocalStorage(cart);

                    return;
                });
                break;
            }
        }
    }
}


/** Calculates total quantity and total price according to localStorage
 * @param {productList} productList
 * 
 * 1. Loops through parent element
 * 2. loops through cart (localstorage)
 * 3. Conditionnal statement to check if the html data id & color (from html element rendered in the above code) matches the id & color of localStorage
 * 4. Event Listener on input value
 * 5. Render the obtained values on html 
 * 6. Calling the function updateLocalStorage
 */
function CalculateTotal(productList) {
    let cart = GetProductListFromLocalStorage();
    let totalPrice = document.getElementById("totalPrice");
    let totalQuantity = document.getElementById("totalQuantity");
    let sumPrice = 0;
    let sumQuantity = 0;

    for (let itemQuantity of cart) {

        for (let price = 0; price < productList.length; price++) {

            if (itemQuantity.id === productList[price]._id) {
                sumPrice += productList[price].price * itemQuantity.quantity;
                totalPrice.innerHTML = sumPrice;
            }
        }
        sumQuantity += itemQuantity.quantity++;
        totalQuantity.innerHTML = sumQuantity;
    }
}


/** Delete selected items on cart and updating the localStorage
 * @param {productList} productList
 * 
 * 1. get the html elements
 * 2. the variable cart contain the localStorage 
 * 3. Loops through the delete button and add an event listener and remove the selected item 
 * 4. Loops through the localStorage to update accordingly - calling the function UpdateLocalStorage(cart)
 */
function DeletionOfItems(productList) {
    let deleteItem = document.getElementsByClassName("deleteItem");
    let productToDelete = document.getElementsByClassName("cart__item");
    let cart = GetProductListFromLocalStorage();
    let removeItemFromCartList = "";

    for (let i = 0; i < productToDelete.length; i++) {

        for (let deleteItemButton of deleteItem) {
            deleteItemButton.addEventListener("click", function (event) {
                event.currentTarget;
                this.closest(".cart__item").remove();
                removeItem = this.closest(".cart__item");

                for (let valueK of cart) {
                    if (valueK.id === removeItem.dataset.id && valueK.color === removeItem.dataset.color) {
                        removeItemFromCartList = cart.indexOf(valueK.id);
                        cart.splice(removeItemFromCartList, 1);
                        UpdateLocalStorage(cart);
                    }
                }
            });
        }
    }
}


/** Extract list of selected products from local storage and if it is empty
 * @return {listProducts} listProducts 
 * 1. Get the localStorage 
 * 2. Check if null and return an empty array 
 * 3. Parsing the data of localStorage
 */
function GetProductListFromLocalStorage() {
    let localStorageList = localStorage.getItem("ListSelectedProduct");
    if (localStorageList == null) {
        submitBtn.style.backgroundColor = 'red';
        alert("Aucun article n'a été trouvé");

        return [];
    }
    let listProducts = JSON.parse(localStorageList);

    return listProducts;
}

/** Updating localStorage according to modifications done by the user (deletion of products, changing quantities)
 * @param {cart} cart 
 * 
 * 1. Sets the localStorage and stringifying it
 */
 function UpdateLocalStorage(cart) {
    localStorage.setItem("ListSelectedProduct", JSON.stringify(cart));
}



/** checks if localStorage is empty or not and the calling the ListenOnChangeEvent
 */
 function RetrievingDataOnEventListener() {
    if (IsStorageNotEmpty()) {
        ListenOnChangeEvent();
    }
}

/** 
 * Check if storage is empty or not
 * 
 * @return {boolean} Is empty or not
*/
function IsStorageNotEmpty() {
    let productInStorage = GetProductListFromLocalStorage();

    let hasValueInStorage = true;
    submitBtn.disabled = false;

    if (productInStorage.length === 0) {
        console.log("No products found in local storage");
        alert("Votre panier est vide");
        hasValueInStorage = false;
        submitBtn.disabled = true;
    }

    return hasValueInStorage;
}



/** Loops through localStorage to get only the ProductId, 
 * variable orderInformations stores the requested results and converts it into Json.
 * 
*/
function ListenOnChangeEvent() {
    document.querySelector("form").setAttribute("id", "formPurchase");
    GetFormById();
    CheckingOfInputsInForm();

    form.addEventListener("change", (event) => {
        CheckingOfInputsInForm();
        event.preventDefault();
    });
}



/** Checks all the inputs with and without regex
 * @return {boolean} Is check valid? 
 * If statement on regex and render message
 */
 function CheckingOfInputsInForm() {
    GetFormById();
    GetIdErrorMessage();
    let validInputCheck = true;

    const messageForEmptyFields = "Le champs ne peut être vide";
    const regexErrorMessage = "Veuillez respecter la saisie des champs";

    if (IsLettersInFirstNameTrue(firstName)) {
        errorFirstName.innerHTML = "";


    } else if (firstName.value === "") {
        errorFirstName.innerHTML = messageForEmptyFields;
        validInputCheck = false;

    } else {
        errorFirstName.innerHTML = regexErrorMessage;
        validInputCheck = false;
    }

    if (IsLettersInLastNameTrue(lastName)) {
        errorLastName.innerHTML = "";


    } else if (lastName.value === "") {
        errorLastName.innerHTML = messageForEmptyFields;
        validInputCheck = false;

    } else {
        errorLastName.innerHTML = regexErrorMessage;
        validInputCheck = false;
    }

    if (IsAddressTrue(address)) {
        errorAddress.innerHTML = "";


    } else if (address.value === "") {
        errorAddress.innerHTML = messageForEmptyFields;
        validInputCheck = false;

    } else {
        errorAddress.innerHTML = regexErrorMessage;
        validInputCheck = false;
    }

    if (IsCityTrue(city)) {
        errorCity.innerHTML = "";


    } else if (city.value === "") {
        errorCity.innerHTML = messageForEmptyFields;
        validInputCheck = false;

    } else {
        errorCity.innerHTML = regexErrorMessage;
        validInputCheck = false;
    }

    if (IsEmailTrue(email)) {
        errorEmail.innerHTML = "";

    } else if (email.value === "") {
        errorEmail.innerHTML = messageForEmptyFields;
        validInputCheck = false;

    } else {
        errorEmail.innerHTML = regexErrorMessage;
        validInputCheck = false;
    }

    // If value is true then disable the order button
    if (validInputCheck) {
        document.getElementById("order").disabled = false;
    } else {
        document.getElementById("order").disabled = true;
    }

    return validInputCheck;
}


/**  function to build request for SendingData function()
getting Id's of form fields and removing required in html
*/
function GetFormById() {
    const idTag = (id) => document.getElementById(id);

    form = idTag("formPurchase"),
        firstName = idTag("firstName"),
        lastName = idTag("lastName"),
        address = idTag("address"),
        city = idTag("city"),
        email = idTag("email");

    firstName.required = false;
    lastName.required = false;
    address.required = false;
    city.required = false;
    email.required = false;

}


/** Function to get error tag IDs*/

function GetIdErrorMessage() {
    let error = (errorMessage) => document.getElementById(errorMessage);
    errorLastName = error("lastNameErrorMsg"),
        errorFirstName = error("firstNameErrorMsg"),
        errorEmail = error("emailErrorMsg"),
        errorAddress = error("addressErrorMsg"),
        errorCity = error("cityErrorMsg");
}


/** Test on regex Email
 * @param {firstName}
 * 
 * @return {boolean} Is email valid then removes extra spaces
 */
function IsLettersInFirstNameTrue(firstName) {
    let lettersInRegexFirstName = new RegExp("^[a-zA-Z][A-zÀ-ú]{0,40}$", "g");

    return lettersInRegexFirstName.test(firstName.value.trim(''));
}

/** Test on regex Email
 * @param {lastName}
 * 
 * @return {boolean} Is email valid then removes extra spaces
 */
function IsLettersInLastNameTrue(lastName) {
    let letterInRegexLastName = new RegExp("^[a-zA-Z][A-zÀ-ú]+$", "g");

    return letterInRegexLastName.test(lastName.value.trim(''));
}

/** Test on regex Email
 * @param {address}
 * 
 * @return {boolean} Is email valid then removes extra spaces
 */
function IsAddressTrue(address) {
    let addressRegex = new RegExp("d{0,4} +[a-zA-Z][A-zÀ-ú]{1,5} ?D?$", "g");

    return addressRegex.test(address.value.trim(''))
}

/** Test on regex Email
 * @param {city}
 * 
 * @return {boolean} Is email valid then removes extra spaces
 */
function IsCityTrue(city) {
    let cityRegex = new RegExp("[a-zA-Z-][a-zA-Z]{1,5} ?[0-9]{0,5} ?$", "g");

    return cityRegex.test(city.value.trim(''));
}


/** Test on regex Email
 * @param {email}
 * 
 * @return {boolean} Is email valid then removes extra spaces
 */
function IsEmailTrue(email) {
    let emailRegex = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");

    return emailRegex.test(email.value.trim(''));
}



const submitBtn = document.getElementById("order");

/**  Event Handler onclick
 * 1. Call the sendingFormData
 * 2. Resets the form field
 * 3. Sets the method to post
*/
function SubmitOrder() {
    let formAction = document.getElementById("formPurchase");

    submitBtn.onclick = (e => {
        e.preventDefault();
        SendingFormData();
        document.getElementById("formPurchase").reset();
        formAction.setAttribute("method", "post");
    });
}


/** Function fetch to connect to Api with promise 
* 
*/
function SendingFormData() {
    let request = BuildRequestPostToApi();
    fetch(request)
        .then(response => response.json())
        .then((data) => StockInformationsOfInputFields(data))
        .then((dataOfOrderId) => Redirect(dataOfOrderId))
}


/**  
 * function to build request for SendingData function()
 * @return {request} request 
*/
function BuildRequestPostToApi() {
    let contact = GetFormDataInputs();
    let orderInformations = FormatingRequestForPost(contact);

    let formHeader = new Headers();
    formHeader.append('Content-type', 'application/json');

    const urlOrder = "http://localhost:3000/api/products/order";

    const request = new Request(urlOrder, {
        headers: formHeader,
        method: 'POST',
        body: JSON.stringify(orderInformations)
    });

    return request;
}

/** 
 * @param {contactOnly} contactOnly contact informations
 * 
 * @return {orderInformations} order informations (with contact)
 * 
*/
function FormatingRequestForPost(contactOnly) {
    let productsId = GetProductListFromLocalStorage();
    let products = [];

    for (let i = 0; i < productsId.length; i++) {
        products.push(productsId[i].id);
    }

    let orderInformations = {
        contact: contactOnly,
        products: products
    }

    return orderInformations;
}



/** To get all the values of the form with formData
 * 
 * @return {contact} contact informations
*/
function GetFormDataInputs() {
    GetFormById();

    const formInputData = new FormData(form);
    let contact = {};

    for (let keysOfData of formInputData.keys()) {
        contact[keysOfData] = formInputData.get(keysOfData);
    }

    return contact;
}


/** 
 * @param {data} data from API's response
 * 
 * @return {dataOfOrderId} url of confirmation page with order id 
 * 1.Creates a new object that contains the information got from the response.
 * 
*/
function StockInformationsOfInputFields(data) {
    let informationsData = Object.assign(new OrderConfirmation, data);

    let dataOfOrderId = informationsData.orderId;

    SetIdInUrl(dataOfOrderId);

    return dataOfOrderId;
}



/** 
 * @param {dataOfOrderId} dataOfOrderId from function stockInformation...
 * 
 * @return {urlConfirmWithId} url of confirmation page with order id 
 * 1.Creates a new object that contains the information got from the response.
 * 
*/
function SetIdInUrl(dataOfOrderId) {
    let urlConfirmWithId = new URL("http://127.0.0.1:5500/front/html/confirmation.html");
    urlConfirmWithId.searchParams.append("OrderId", dataOfOrderId);
    let tostring = urlConfirmWithId.toString();

    console.log(tostring);

    return urlConfirmWithId;
}

/**  function to build request for SendingData function()
 * @param {dataOfOrderId} dataOfOrderId
 * 
 * @return {URL} url of confirmation page with order id 
*/
function Redirect(dataOfOrderId) {
    return window.location.href = SetIdInUrl(dataOfOrderId);
}




