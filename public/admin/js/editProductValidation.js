const formId = document.getElementById("editformId")
const nameInput = document.getElementById("productname")
const categoryInput = document.getElementById("categoryname")
const brandInput = document.getElementById("brandname")
const actualpriceInput = document.getElementById("actualprice")
const sellingpriceInput = document.getElementById("sellingprice")
const stockInput = document.getElementById("stocks")
const descriptionInput = document.getElementById("Description")
const errorMessage = document.getElementById("errorMessage")


editformId.addEventListener("submit",(event)=>{
const name = nameInput.value;
const category = categoryInput.value;
const brand = brandInput.value;
const actualprice = actualpriceInput.value;
const sellingprice = sellingpriceInput  .value;
const stock = stockInput.value;
const description = descriptionInput.value;

if(name.length < 5){
    event.preventDefault();
    errorMessage.textContent = " Enter the name of the product";
}else if(category == 'selected'){
    event.preventDefault();
    errorMessage.textContent = "Select the category";
}else if(brand == 'selected'){
    event.preventDefault();
    errorMessage.textContent = "Select the brand";
}else if(actualprice <= 0 && typeof(actualprice)!=Number && actualprice == ""){
    event.preventDefault();
    errorMessage.textContent = "Enter valid price"
}else if(sellingprice <= 0 && typeof(sellingprice)!=Number && sellingprice == ""){
    event.preventDefault();
    errorMessage.textContent = "Enter valid price"
}else if(stock <= 0 && typeof(stock)!=Number && stock == ""){
    event.preventDefault();
    errorMessage.textContent = "Stock cannot be zero or negative number"
}else if(description.length == 0){
    event.preventDefault();
    errorMessage.textContent = "Enter description"
}
});
