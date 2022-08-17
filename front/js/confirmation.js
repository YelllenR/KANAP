// Get the actual url 
const idInUrlConfirmation = new URLSearchParams(window.location.search);

// Get the the id
const idOrder = document.getElementById("orderId");

// Set the order id in html
idOrder.innerText = idInUrlConfirmation.get("OrderId");




