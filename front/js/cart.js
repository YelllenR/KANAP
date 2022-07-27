// Class of produit
FetchApiAndRenderElements('http://localhost:3000/api/products');

//  Fetch the API
function FetchApiAndRenderElements(connextionToApi) {
    fetch(connextionToApi)
        .then(response => response.json())
        .then(jsonResponse => RenderSelectedItemsOnHtml(jsonResponse))
        .then(() => DeleteOfItems())
        .then(() => PlusAndMinusQuantity())

}



// Render the cart list with extra elements on Html
function RenderSelectedItemsOnHtml(productList) {
    // let update = UpdateLocalStorage();
    let cart = GetProductListFromLocalStorage();

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

                // let dataQuantity = cart[i].quantity * cart[i];

                // totalQuantity.textContent = parseInt(dataQuantity);
                // console.log(dataQuantity)

                totalPrice.textContent = priceOfProduct * quantity;
            }
        }
    }
    console.log(cart);

}


function DeleteOfItems(productList) {
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

                        cart = cart.filter(productList => productList.id != removeItem.dataset.id && removeItem.dataset.color);
                        console.log(cart)

                        
                        // removeItemFromCartList = cart.indexOf(cart[k]);
                        // let updatCart = cart.slice(removeItemFromCartList);
                        // UpdateLocalStorage(updatCart);
                        // console.log(removeItemFromCartList)
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
    let listProducts = JSON.parse(localStorageList);

    return listProducts;
}


// Updating localStorage according to modifications done by the user (deletion of products, changing quantities)
function UpdateLocalStorage() {
    localStorage.setItem("ListSelectedProduct", JSON.stringify());
}


function PlusAndMinusQuantity() {
    let inputChange = document.getElementsByClassName("itemQuantity");
    for (let i = 0; i < inputChange.length; i++) {

        inputChange[i].addEventListener("change", function (changed) {
            changed.target;

            if (inputChange[i].value <= 0) {
                return inputChange[i].value++;
            }
            if (inputChange[i].value >= 101) {
                return inputChange[i].value = 100;
            }
        })
    }
}
// const firstName = document.getElementById("firstName");
// let orderFormQuestion = document.getElementsByClassName("cart__order__form__question")
// function CheckingFormInputs() {

//     const lastName = document.getElementById("lastName");
//     const address = document.getElementById("address");
//     const city = document.getElementById("city");
//     const email = document.getElementById("email");


//         // .forEach(input => {
//         //      input.addEventListener("input", function(event) {
//         //         console.log(orderFormQuestion);
//         //      })
//         // });

// }
