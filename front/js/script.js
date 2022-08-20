
/**
* @param {getProductsUrl} getProductsUrl url to connect
* 
* @return {Promise} Promise; 
* 1. response.json  
* 2. Products from API 
* 3. Render products in html
*/
function FetchAndRenderProductsApi(getProductsUrl) {
    fetch(getProductsUrl)
        .then(response => response.json())
        .then(products => TypeProductList(products))
        .then(productList => RenderProducts(productList)) // fonction lambda
}

FetchAndRenderProductsApi('http://localhost:3000/api/products');


// Getting List of product, to a new object from the model Product
function TypeProductList(products) {

    let typeProductList = [];
    products.forEach(element => {
        let result = Object.assign(new Product, element);
        typeProductList.push(result);
    });
    return typeProductList;
}


/**Rendering elements in html with key
* @param {productList} getProductsUrl url to connect
* 
* @return {productList} productList; 
* 1. Rendering the products  
*/
function RenderProducts(productList) {
    const articlesItems = document.querySelector("#items");
    let imgsDom = " ";

    productList.forEach(product => {
        imgsDom +=
        `<a href="./product.html?id=${product._id}">
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>`
    });


    articlesItems.innerHTML = imgsDom;
    return productList;
}



