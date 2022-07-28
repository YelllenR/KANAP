// Class of produit
FetchApiAndRenderElements('http://localhost:3000/api/products');

//  Fetch the API
function FetchApiAndRenderElements(connextionToApi) {
    fetch(connextionToApi)
        .then(response => response.json())
        .then(jsonResponse => RenderSelectedItemsOnHtml(jsonResponse))
        .then(() => DeletionOfItems())
        .then(() => ValidationOfForm())
        .then(() => SettingAttributesOnInput())

}



// Render the cart list with extra elements on Html
function RenderSelectedItemsOnHtml(productList) {
    const sectionItemToRender = document.getElementById("cart__items");
    let cart = GetProductListFromLocalStorage();

    let tagToRender = "";

    let totalQuantity = document.getElementById("totalQuantity");
    let totalPrice = document.getElementById("totalPrice");

    for (let i = 0; i < cart.length; i++) {

        for (let j = 0; j < productList.length; j++) {

            if (cart[i].id === productList[j]._id) {
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
                                <p>Qté : ${quantity}</p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                            </div>
                        </div>
                    </article>`

                sectionItemToRender.innerHTML = tagToRender;

                totalPrice.textContent = priceOfProduct * quantity;
            }
        }
    }
    ModifyQuantity();
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
        break;
    }
}

// Extract list of selected products from local storage
function GetProductListFromLocalStorage() {
    let localStorageList = localStorage.getItem("ListSelectedProduct");

    if (localStorageList == null) {
        return [];

    } else {
        let listProducts = JSON.parse(localStorageList);
        return listProducts;
    }
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


    for (let a = 0; a < parentOfInputChange.length; a++) {
        for (let b = 0; b < cart.length; b++) {
            if (cart[b].id === parentOfInputChange[a].dataset.id &&
                cart[b].color === parentOfInputChange[a].dataset.color) {


                inputChange[a].addEventListener("change", function (changed) {
                    changed.preventDefault()

                    if (inputChange[a].value <= 0) {
                        return false
                    }
                    if (inputChange[a].value >= 101) {
                        return false
                    }
                    cart[b].quantity = inputChange[a].value;
                    UpdateLocalStorage(cart);
                    return;
                });
                break;
            }
        }
    }
}



function ValidationOfForm() {
    document.querySelector("form").setAttribute("id", "form");
    let getForm = document.querySelector("#form input[type = 'submit']");

    getForm.addEventListener("click", (event) => {
        
       

        if(getForm.value === ""){
            event.preventDefault();
            console.log("this is an error")
        }

    })
    console.log(getForm)
}

function SettingAttributesOnInput() {

    document.getElementById("firstName").setAttribute("pattern", "^[A-Za-z]+$");
    document.getElementById("lastName").setAttribute("pattern", "/^[a-zA-Z]+$/i");
    document.getElementById("address").setAttribute("pattern", "");
    document.getElementById("city").setAttribute("pattern", "");
    document.getElementById("email").setAttribute("pattern", "");

}

function RenderErrorMessage() {
    let errorFirstName = document.getElementById("firstNameErrorMsg");
    let errorLastName = document.getElementById("lastNameErrorMsg");
    let errorAddress = document.getElementById("addressErrorMsg");
    let errorCity = document.getElementById("cityErrorMsg");
    let errorEmail = document.getElementById("emailErrorMsg");

    const errorMessages = [
        errorFirstName.innerText = "Merci d'indiquer uniquement des lettres",
        errorLastName.textContent = "Veuillez mettre des lettres",
        errorAddress.textContent = "",
        errorCity.textContent = "",
        errorEmail.textContent = ""
    ]
}

