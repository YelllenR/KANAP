// Class of produit
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

// Object for product in cart
class ProducInCart {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity
    }
}

/*
 1 - Récupérer local storage === liste des articles dans le panier
 2 - Récupérer la liste des articles du catalogue
 3 - Afficher les données en HTML
*/

FetchApiAndRenderElements('http://localhost:3000/api/products');



//  Fetch the API
function FetchApiAndRenderElements(connextionToApi) {
    fetch(connextionToApi)
        .then(response => response.json())
        .then(jsonResponse => RenderSelectedItemsOnHtml(jsonResponse))
        .then(() => AddEventOnOrderButton())
}


// Render the cart list with extra elements on Html
function RenderSelectedItemsOnHtml(productList) {
    let cart = GetProductListFromLocalStorage();
    let totalPrice = 0;
    let tagToRender = "";
    const sectionItemToRender = document.getElementById("cart__items");


    // Pour chaque éléments, trouver son équivalent dans la liste des produits 
    for (let i = 0; i < cart.length; i++) {

        // console.log(cart[i]); 

        for (let j = 0; j < productList.length; j++) {
            // console.log(productList[i] + "element in api"); 

            // Si c'est vrai, alors on parle du même article dans les deux listes
            for (cart[i].id in productList[j]) {

                let quantity = cart[i].quantity;
                let image = productList[j].imageUrl;
                let name = productList[j].name;
                let id = cart[i].id;
                let textImage = productList[j].altTxt;
                let color = cart[i].color;
                // let price = productList[i].price;

                tagToRender += `
                    <article class="cart__item" data-id="${id}" data-color="${color}">
                    <div class="cart__item__img">
                    <img src="${image}">
                    </div>
                    <div class="cart__item__content">
                    <div class="cart__item__content__description">
                    <h2>${name}</h2>
                    <p>${color}</p>
                    
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
            }

            break;
        };
    };
}

// Extract list of selected products from local storage
function GetProductListFromLocalStorage() {
    let localStorageList = localStorage.getItem("ListSelectedProduct");
    let listProducts = JSON.parse(localStorageList);
    return listProducts;
}


// Listening of clicks on button
function AddEventOnOrderButton() {

}