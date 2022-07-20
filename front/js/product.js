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




let priceOfProduct = document.getElementById("title");
let titleOfProduct = document.getElementById("price");
let descriptionOfProduct = document.getElementById("description");
let infos = " ";
let image = getQ

// Getting id from url using urlSearchParam and for loop and rendering the image
function SearchIdInUrl(productID) {
    let keySearchValues = window.location.search.replace("?", "");
   

    for (let i = 0; i < typeProductList.length; i++) {  
        if (typeProductList[i]._id === keySearchValues) {
            console.log("Trouvé avec l'ID " + typeProductList[i]._id + " en place " + [i]);
         
            infos += `<img src="${typeProductList[i].imageUrl}" alt="${typeProductList[i].altTxt}">`
            
        }

    }

   

}
// Rendering products informations based on the product clicked on



