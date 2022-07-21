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

const titleOfProduct = document.getElementById("title");
const priceOfProduct = document.getElementById("price");
const descriptionOfProduct = document.getElementById("description");
const imageOfProduct = document.querySelector(".item__img"); 
const colorsSelection = document.getElementById("colors");
let priceDisplay = " ";
let description = " ";
let nameProduct = " ";
let imageDisplay = " ";
let keySearchValues = window.location.search.replace("?", "");


// Getting id from url using urlSearchParam and for loop and rendering the image
function SearchIdInUrl(productID) {
    for (let i = 0; i < typeProductList.length; i++) {

        if (typeProductList[i]._id === keySearchValues) {

            // setting the informations according to the urlID
            imageDisplay += `<img src="${typeProductList[i].imageUrl}" 
                                alt="${typeProductList[i].altTxt}">`;

            priceDisplay += typeProductList[i].price;
            description += typeProductList[i].description;
            nameProduct += typeProductList[i].name;


            // Setting the dropdown menu for choosing the colors from list related to the product.
            let colorsList = typeProductList[i].colors;
            colorsList.forEach((color) => {
                let optionColor = document.createElement("option");
                optionColor.value = color;
                optionColor.text = color;
                colorsSelection.appendChild(optionColor);
            });

            break;
        }
    }

    imageOfProduct.innerHTML = imageDisplay;
    titleOfProduct.innerHTML = nameProduct;
    priceOfProduct.innerHTML = priceDisplay;
    descriptionOfProduct.innerHTML = description;

}




