
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




// Fetch data from API, return JSON
function FetchAndRenderProductsApi(getProductsUrl) {
    fetch(getProductsUrl)
        .then(response => response.json())
        .then(products => TypeProductList(products))
        .then(productList => RenderProducts(productList)) // fonction lambda


}
// Main
FetchAndRenderProductsApi('http://localhost:3000/api/products');
// Getting List of product
function TypeProductList(products) {
    console.log(products);
    let typeProductList = [];
    products.forEach(element => {
        let result = Object.assign(new Product, element);
        typeProductList.push(result);
    });
    return typeProductList;
}


// Rendering elements in html with key
function RenderProducts(productList) {
    const articlesItems = document.querySelector("#items");
    let imgsDom = " ";
    for (let i = 0; i < productList.length; i++) {

        imgsDom +=
            `<a href="./product.html?${productList[i]._id}">
    <article>
        <img src="${productList[i].imageUrl}" alt="${productList[i].altTxt}">
        <h3 class="productName">${productList[i].name}</h3>
        <p class="productDescription">${productList[i].description}</p>
    </article>
    </a>`
    }
    articlesItems.innerHTML = imgsDom;
    return productList;
}

// Function for setting localStorage
function SetLocalStorage(productList) {
    let productListWithoutPrice = NullifyPrice(productList);
    localStorage.setItem("productList", JSON.stringify(productListWithoutPrice));

}


// module.export = {Product};