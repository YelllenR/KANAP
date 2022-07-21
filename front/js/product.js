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

function FetchAndRenderProductsApi(getProductsUrl) {
    fetch(getProductsUrl)
        .then(response => response.json())
        .then((products) => TypeProductList(products))
        .then((productID) => SearchIdInUrl(productID))
}

// Main-Fetch - Calling the function with the acces route
FetchAndRenderProductsApi('http://localhost:3000/api/products');

let typeProductList = [];

function TypeProductList(products) {
    products.forEach(element => {
        let result = Object.assign(new Product, element);
        typeProductList.push(result);
    });

    console.log(typeProductList);
}


const imageOfProduct = document.getElementsByClassName("item__img"); 
console.log(imageOfProduct);
const titleOfProduct = document.getElementById("title");
const priceOfProduct = document.getElementById("price");
const descriptionOfProduct = document.getElementById("description");
let imageDisplay = " ";
let priceDisplay = " ";
let description = " ";

// Getting id from url using urlSearchParam and for loop and rendering the image
function SearchIdInUrl(productID) {
    let keySearchValues = window.location.search.replace("?", "");

    for (let i = 0; i < typeProductList.length; i++) {
        if (typeProductList[i]._id === keySearchValues) {

            console.log("Trouvé avec l'ID " + typeProductList[i]._id + " en place " + [i]);
            
            imageDisplay += `<img src="${typeProductList[i].imageUrl}" alt="${typeProductList[i].altTxt}">`;
            priceDisplay += typeProductList[i].price;
            description += typeProductList[i].description;
        }
        imageOfProduct.innerHTML = imageDisplay;
        priceOfProduct.innerHTML = priceDisplay;
        descriptionOfProduct.innerHTML = description;
    }

}








