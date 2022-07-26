// Class of produit
FetchApiAndRenderElements('http://localhost:3000/api/products');

//  Fetch the API
function FetchApiAndRenderElements(connextionToApi) {
    fetch(connextionToApi)
        .then(response => response.json())
        .then(jsonResponse => RenderSelectedItemsOnHtml(jsonResponse))
        .then(() => DeleteOfItems())
}


const cart = GetProductListFromLocalStorage();
// Render the cart list with extra elements on Html
function RenderSelectedItemsOnHtml(productList) {

    let update = UpdateLocalStorage();

    let tagToRender = "";
    const sectionItemToRender = document.getElementById("cart__items");
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
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                            </div>
                        </div>
                    </article>`

                sectionItemToRender.innerHTML = tagToRender;

                // totalQuantity.textContent = quantity + card[i];
                totalPrice.textContent = priceOfProduct * quantity;
            }
        }
    }
}


function DeleteOfItems() {
    let deleteItem = document.getElementsByClassName("deleteItem");
    let productToDelete = document.querySelector(".cart__item");

    let productToRemove = "";
        

    for (let j = 0; j < deleteItem.length; j++) {
        deleteItem[j].addEventListener("click", function (event) {
            deleteItem = event.target;
            productToRemove = productToDelete.remove();
        });
    }
}


// Extract list of selected products from local storage
function GetProductListFromLocalStorage() {
    let localStorageList = localStorage.getItem("ListSelectedProduct");
    let listProducts = JSON.parse(localStorageList);

    return listProducts;
}



function UpdateLocalStorage(productList) {
    let changeInputQuantity = document.getElementsByClassName("cart__item__content__settings__quantity");
    let inputChange = document.getElementsByClassName(".itemQuantity");

    for (let a = 0; a < inputChange.length; a++) {
        inputChange[i].addEventListener("input", function (modifyQuantity) {
            if(inputChange[i] != cart.quantity){
                cart.quantity = inputChange[i];
            }
        });

    }
    console.log(cart.quantity)
}



