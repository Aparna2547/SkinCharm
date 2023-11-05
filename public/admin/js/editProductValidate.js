
const formId = document.getElementById("editformId");
const nameInput = document.getElementById("productname");
const categoryInput = document.getElementById("categoryname")
const brandInput = document.getElementById("brandname")
const actualpriceInput = document.getElementById("actualprice");
const sellingpriceInput = document.getElementById("sellingPrice");
const stockInput = document.getElementById("stocks");
const descriptionInput = document.getElementById("Description");
const imageInput2 = document.getElementById("image2")
const imageInput1 = document.getElementById("image1")
const imageInput3 = document.getElementById("image3")
const errorMessage = document.getElementById("errorMessage");

formId.addEventListener("submit", (event) => {
  console.log("form submitted");
  const name = nameInput.value;
  const category = categoryInput.value;
  const brand = brandInput.value
  const actualprice = actualpriceInput.value;
  const sellingPrice = sellingpriceInput.value;
  const stock = stockInput.value;
  // const image1 = imageInput1.value;
  // const image2 = imageInput2.value;
  // const image3 = imageInput3.value
  const description = descriptionInput.value;
  

  if (name.trim().length <= 5 ) {
     console.log(name)
    event.preventDefault();
    errorMessage.textContent = "Enter the name of the product";
  }
  else if (category=='selected'){
    event.preventDefault()
    errorMessage.textContent = "Select the category"
  }
  else if (brand == 'selected'){
    event.preventDefault()
    errorMessage.textContent = "Select the brand"
  }
  else if (actualprice <= 10) {
    event.preventDefault();
    errorMessage.textContent = "Enter  actual price of the product";
  }
  else if (sellingPrice <= 10) {
    event.preventDefault();
    errorMessage.textContent = "Enter selling price of the product";
  }
  else if(sellingPrice>actualprice){
    event.preventDefault();
    errorMessage.textContent = "selling proce must be less than actual price"
  }
  else if (stock <= 0 ) {
    event.preventDefault();
    errorMessage.textContent = "Stock cannot be zero or negative number";
  }
  else if (description.length == 0) {
    event.preventDefault();
    errorMessage.textContent = "Enter the description";
  }
  else if (image1.files.length === 0 && image2.files.length === 0 && image3.files.length === 0) {
    event.preventDefault(); // Prevent form submission
    errorMessage.textContent = "Choose an image";
  }
  
});
