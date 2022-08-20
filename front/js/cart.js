

// Class of produit
FetchApiAndRenderElements('http://localhost:3000/api/products');

//  Fetch the API
function FetchApiAndRenderElements(connextionToApi) {
    fetch(connextionToApi)
        .then(response => response.json())
        .then(jsonResponse => RenderSelectedItemsOnHtml(jsonResponse))
        .then(() => DeletionOfItems())
        .then((urlConfirmWithId) => RetrievingDataOnEventListener(urlConfirmWithId))
        .then(() => SendingFormData())
}


// Render the cart list with extra elements on Html
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
    CalculateTotal(productList)
}

// Delete selected items on cart and updating the localStorage (calling the function UpdateLocalStorage(cart))
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


// Extract list of selected products from local storage and if it is empty, it trigers an alert
function GetProductListFromLocalStorage() {
    let localStorageList = localStorage.getItem("ListSelectedProduct");
    if (localStorageList == null) {
        submitBtn.style.backgroundColor = 'red';
        alert("Aucun article sélectionné n'a été trouvé");

        return [];
    }
    let listProducts = JSON.parse(localStorageList);
    return listProducts;
}


// Updating localStorage according to modifications done by the user (deletion of products, changing quantities)
function UpdateLocalStorage(cart) {
    localStorage.setItem("ListSelectedProduct", JSON.stringify(cart));
}



// increment or decrement total quantity of products according to the choosen quantity
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

                    if (quantity <= 0 || quantity >= 101) {
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



// Listening on submit, condition to send data only if the check has been successfull
function RetrievingDataOnEventListener() {
    document.querySelector("form").setAttribute("id", "formPurchase");
    GetFormById();
    ChangeFormEvent()
}


function ChangeFormEvent() {
    form.addEventListener("change", (event) => {
        event.preventDefault()
        if (CheckingOfInputsInForm()) {
            SendingFormData();
            return true;
        }
    });
}

const submitBtn = document.getElementById("order");

// event handler on btn and redirect to confirmation page with id 
function Redirect(dataOfOrderId) {
    let formAction = document.getElementById("formPurchase");
    GetProductListFromLocalStorage();
    CheckingOfInputsInForm();
    submitBtn.onclick = (e => {

        e.preventDefault();
        formAction.setAttribute("method", "post");
        window.location.href = SetIdInUrl(dataOfOrderId);
    })

}

// Checks all the inputs, calling this function in RetrievingDataOnEventListener()
function CheckingOfInputsInForm() {
    GetFormById();
    GetIdErrorMessage();

    const messageForEmptyFields = "Le champs ne peut être vide";
    const regexErrorMessage = "Veuillez respecter la saisie des champs";

    if (IsLettersInFirstNameTrue(firstName)) {
        errorFirstName.innerHTML = "";


    } else if (firstName.value === "") {
        errorFirstName.innerHTML = messageForEmptyFields;
        document.getElementById("order").disabled = true;

    } else {
        errorFirstName.innerHTML = regexErrorMessage;
        document.getElementById("order").disabled = true;
    }

    if (IsLettersInLastNameTrue(lastName)) {
        errorLastName.innerHTML = "";


    } else if (lastName.value === "") {
        errorLastName.innerHTML = messageForEmptyFields;
        document.getElementById("order").disabled = true;

    } else {
        errorLastName.innerHTML = regexErrorMessage;
        document.getElementById("order").disabled = true;
    }

    if (IsAddressTrue(address)) {
        errorAddress.innerHTML = "";


    } else if (address.value === "") {
        document.getElementById("order").disabled = true;
        errorAddress.innerHTML = messageForEmptyFields;

    } else {
        errorAddress.innerHTML = regexErrorMessage;
        document.getElementById("order").disabled = true;
    }

    if (IsCityTrue(city)) {
        errorCity.innerHTML = "";


    } else if (city.value === "") {
        errorCity.innerHTML = messageForEmptyFields;
        document.getElementById("order").disabled = true;

    } else {
        errorCity.innerHTML = regexErrorMessage;
        document.getElementById("order").disabled = true;

    }

    if (IsEmailTrue(email)) {
        errorEmail.innerHTML = "";

    } else if (email.value === "") {
        errorEmail.innerHTML = messageForEmptyFields;
        document.getElementById("order").disabled = true;;

    } else {
        errorEmail.innerHTML = regexErrorMessage;
        document.getElementById("order").disabled = true;
    }

    return true;
}



// Function to send the data
function SendingFormData() {
    GetFormDataInputs();

    let orderInformations = FormatingRequestForPost();

    let formHeader = new Headers();
    formHeader.append('Content-type', 'application/json');

    const urlOrder = "http://localhost:3000/api/products/order";

    const request = new Request(urlOrder, {
        headers: formHeader,
        method: 'POST',
        body: JSON.stringify(orderInformations)
    });

    try {
        fetch(request)
            .then(response => response.json())
            .then((data) => StockInformationsOfInputFields(data))
            .then((dataOfOrderId) => Redirect(dataOfOrderId))
    }
    catch (error) {
        console.log(error)
    }


}


// getting Id's of form fields and removing required in html
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

// Function to get error tag IDs
function GetIdErrorMessage() {
    let error = (errorMessage) => document.getElementById(errorMessage);
    errorLastName = error("lastNameErrorMsg"),
        errorFirstName = error("firstNameErrorMsg"),
        errorEmail = error("emailErrorMsg"),
        errorAddress = error("addressErrorMsg"),
        errorCity = error("cityErrorMsg");
}


// Checking input fields with regex and testing them
function IsLettersInFirstNameTrue(firstName) {
    let lettersInRegexFirstName = new RegExp("^[a-zA-Z][A-zÀ-ú]{0,40}$", "g");

    return lettersInRegexFirstName.test(firstName.value.trim(''));
}

function IsLettersInLastNameTrue(lastName) {
    let letterInRegexLastName = new RegExp("^[a-zA-Z][A-zÀ-ú]+$", "g");

    return letterInRegexLastName.test(lastName.value.trim(''));
}

function IsAddressTrue(address) {
    let addressRegex = new RegExp("d{0,4} +[a-zA-Z][A-zÀ-ú]{1,5} ?D?$", "g");

    return addressRegex.test(address.value.trim(''))
}

function IsCityTrue(city) {
    let cityRegex = new RegExp("[a-zA-Z-][a-zA-Z]{1,5} ?[0-9]{0,5} ?$", "g");

    return cityRegex.test(city.value.trim(''));
}


function IsEmailTrue(email) {
    let emailRegex = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");

    return emailRegex.test(email.value.trim(''));
}




// To get all the values of the form with formData
function GetFormDataInputs() {
    GetFormById();

    const formInputData = new FormData(form);
    let contact = {};

    for (let keysOfData of formInputData.keys()) {
        contact[keysOfData] = formInputData.get(keysOfData);

    }

    return contact;
}



// Loops through localStorage to get only the ProductId, 
// variable orderInformations stores the requested results and converts it into Json.
function FormatingRequestForPost() {
    let productsId = GetProductListFromLocalStorage();
    let products = [];

    for (let i = 0; i < productsId.length; i++) {
        products.push(productsId[i].id);
    }

    let orderInformations = {
        contact: GetFormDataInputs(),
        products: products
    }

    return orderInformations;
}


// Creates a new object that contains the information got from the response.
// Leave contactInformations in object in case of future use
function StockInformationsOfInputFields(data) {
    let informationsData = Object.assign(new OrderConfirmation, data);

    let dataOfOrderId = informationsData.orderId;
    contactInformations = informationsData.contact;

    SetIdInUrl(dataOfOrderId);

    return dataOfOrderId;
}

function SetIdInUrl(dataOfOrderId) {

    let urlConfirmWithId = new URL("http://127.0.0.1:5500/html/confirmation.html");
    urlConfirmWithId.searchParams.append("OrderId", dataOfOrderId);
    urlConfirmWithId.toString();

    console.log(urlConfirmWithId);

    return urlConfirmWithId;
}

