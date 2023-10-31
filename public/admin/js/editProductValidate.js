// const formId = document.getElementById('formId')
// const nameInput = document.getElementById('product')
// const actualpriceInput = document.getElementById('actualPrice')
// const sellingpriceInput = document.getElementById('sellingPrice')
// const stockInput = document.getElementById('stock')
// const descriptionInput = document.getElementById('description')
// const imageInput = document.getElementById('image')
// const errorMessage = document.getElementById('errorMessage')



// formId.addEventListener('submit',(event)=>{
//     const name = nameInput.value;
//     const actualprice = actualpriceInput.value;
//     const sellingPrice = sellingpriceInput.value;
//     const stock = stockInput.value;
//     const image = imageInput.value
//     const description =  descriptionInput.value;
    
//     if(name.length ==0){
//         event.preventDefault();
//         errorMessage.textContent = "Enter the name"
//     }
//     else if(actualprice <0 && typeof(actualprice)!=Number){
//     event.preventDefault()
//     errorMessage.textContent = "enter valid price"
//     }
//     else if(sellingPrice&& sellingPrice < 0 && typeof(sellingPrice)!=Number){
//         event.preventDefault()
//         errorMessage.textContent = "Enter valid price"
//     }
//     else if(stock<=0){
//         event.preventDefault()
//         errorMessage.textContent="Stock cannot be zero or negative number";
//     }
//   else if(description.length ==0){
//         event.preventDefault()
//         errorMessage.textContent = "enter the description"
//     }
//     else if (imageInput.files.length < 0) {
//         event.preventDefault(); // Prevent form submission
//         errorMessage.textContent = "Choose an image";
//     }  
//   })

const formId = document.getElementById("formId");
const nameInput = document.getElementById("product");
const categoryInput = document.getElementById("category")
const brandInput = document.getElementById("brand")
const actualpriceInput = document.getElementById("actualPrice");
const sellingpriceInput = document.getElementById("sellingPrice");
const stockInput = document.getElementById("stock");
const descriptionInput = document.getElementById("description");
const imageInput2 = document.getElementById("image2")
const imageInput1 = document.getElementById("image1")
const imageInput3 = document.getElementById("image3")
const errorMessage = document.getElementById("errorMessage");

formId.addEventListener("submit", (event) => {
  const name = nameInput.value;
  const category = categoryInput.value;
  const brand = brandInput.value
  const actualprice = actualpriceInput.value;
  console.log(actualprice)
  const sellingPrice = sellingpriceInput.value;
  const stock = stockInput.value;
  // const image1 = imageInput1.value;
  // const image2 = imageInput2.value;
  // const image3 = imageInput3.value
  const description = descriptionInput.value;
  

  if (name.length < 5) {
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
  else if (actualprice < 0 && typeof(actualprice)!=Number && actualprice == "") {
    event.preventDefault();
    errorMessage.textContent = "Enter valid price";
  }
  else if (sellingPrice < 0 && typeof(sellingPrice)!=Number && sellingPrice == "") {
    event.preventDefault();
    errorMessage.textContent = "Enter valid price";
  }
  else if (stock <= 0 && typeof(stock)!=Number && stock =="") {
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
