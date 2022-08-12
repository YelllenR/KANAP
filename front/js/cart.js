// Class of produit
FetchApiAndRenderElements('http://localhost:3000/api/products');

//  Fetch the API
function FetchApiAndRenderElements(connextionToApi) {
    fetch(connextionToApi)
        .then(response => response.json())
        .then(jsonResponse => RenderSelectedItemsOnHtml(jsonResponse))
        .then(() => DeletionOfItems())
        .then(() => CheckingOfInputsInForm())

}


// Render the cart list with extra elements on Html
function RenderSelectedItemsOnHtml(productList) {
    const sectionItemToRender = document.getElementById("cart__items");
    let cart = GetProductListFromLocalStorage();
    let tagToRender = "";

    for (let i = 0; i < cart.length; i++) {
        for (let j = 0; j < productList.length; j++) {

            if (cart[i].id === productList[j]._id) {
                console.log("id = " + cart[i].id);

                let quantity = cart[i].quantity;
                let image = productList[j].imageUrl;
                let name = productList[j].name;
                let id = cart[i].id;
                let textImage = productList[j].altTxt;
                let color = cart[i].color;
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
        for (let j = 0; j < deleteItem.length; j++) {
            deleteItem[j].addEventListener("click", function (event) {
                event.currentTarget;
                this.closest(".cart__item").remove();
                removeItem = this.closest(".cart__item");

                for (let k = 0; k < cart.length; k++) {
                    if (cart[k].id === removeItem.dataset.id && cart[k].color === removeItem.dataset.color) {
                        removeItemFromCartList = cart.indexOf(cart[k]);
                        cart.splice(removeItemFromCartList, 1);
                        UpdateLocalStorage(cart);
                    }
                }
            });
        }
    }
}

// Extract list of selected products from local storage
function GetProductListFromLocalStorage() {
    let localStorageList = localStorage.getItem("ListSelectedProduct");
    if (localStorageList == null) {
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
    let totalQuantity = document.getElementById("totalQuantity");



    for (let a = 0; a < parentOfInputChange.length; a++) {
        for (let b = 0; b < cart.length; b++) {
            if (cart[b].id === parentOfInputChange[a].dataset.id &&
                cart[b].color === parentOfInputChange[a].dataset.color) {

                inputChange[a].addEventListener("change", function (changed) {
                    changed.preventDefault()
                    let quantity = inputChange[a].value;

                    if (quantity <= 0 || quantity >= 101) {
                        return false
                    }
                    cart[b].quantity = quantity
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
    // let totalQuantity = document.getElementById("totalQuantity");

    for (let a = 0; a < cart.length; a++) {
        for (let i = 0; i < productList.length; i++) {

            if (productList[i]._id === cart[a].id && productList[i].colors === cart[a].color) {
                console.log("ok");
                totalPrice.innerHTML = productList[i].price * cart[a].quantity
            }

            totalPrice.innerHTML = productList[i].price * cart[a].quantity
        }
    }
}

function CheckingOfInputsInForm() {
    document.querySelector("form").setAttribute("id", "formPurchase");
    let form = document.getElementById("formPurchase");
    //  .addEventListener("submit", function(formInputData){

    // formInputData.preventDefault()
    // let formOnCart = formInputData.target;
    //     let formData = new FormData(form);


    //     let firstName = formData.get("firstName");
    //     let lastName = formData.get("lastName");
    //     let address = formData.get("address");
    //     let city = formData.get("city");
    //     let email = formData.get("email");

    //     for(let key of formData.key()){
    //         console.log(key, formData.get(key))
    //     }
    // // });

}

// function IsValid() {
//     IsValid.preventDefault();


//     for (let value of formData) {
//         if (firstName[value] == "") {
//             errorFirstName.innerText = "Merci de remplir ce champ avec votre nom";
//         }else{
//             errorFirstName.innerText = "";
//         }

//         RenderErrorMessage(messageError) 
//     }
// }

function SendingFormData() {

}

function RenderErrorMessage(messageError) {
    const errorLastName = document.getElementById("lastNameErrorMsg");
    const errorFirstName = document.getElementById("firstNameErrorMsg");
    const errorEmail = document.getElementById("emailErrorMsg");
    const errorAddress = document.getElementById("addressErrorMsg");
    const errorCity = document.getElementById("cityErrorMsg");



    //     errorLastName.innerText = "Merci de remplir ce champ avec votre nom",
    //     errorFirstName.innerText = "Merci de remplir ce champ avec votre prénom",
    //     errorEmail.innerText = "Veuillez mettre une adresse email valide",
    //     errorAddress.innerText = "Veuillez indiquer votre adresse",
    //     errorCity.innerText = "Veuillez indiquer la ville",

}

