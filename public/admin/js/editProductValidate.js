const formId = document.getElementById('formId')
const nameInput = document.getElementById('product')
const actualpriceInput = document.getElementById('actualPrice')
const sellingpriceInput = document.getElementById('sellingPrice')
const stockInput = document.getElementById('stock')
const descriptionInput = document.getElementById('description')
const imageInput = document.getElementById('image')
const errorMessage = document.getElementById('errorMessage')



formId.addEventListener('submit',(event)=>{
    const name = nameInput.value;
    const actualprice = actualpriceInput.value;
    const sellingPrice = sellingpriceInput.value;
    const stock = stockInput.value;
    const image = imageInput.value
    const description =  descriptionInput.value;
    
    if(name.length ==0){
        event.preventDefault();
        errorMessage.textContent = "Enter the name"
    }
    else if(actualprice <0 && typeof(actualprice)!=Number){
    event.preventDefault()
    errorMessage.textContent = "enter valid price"
    }
    else if(sellingPrice&& sellingPrice < 0 && typeof(sellingPrice)!=Number){
        event.preventDefault()
        errorMessage.textContent = "Enter valid price"
    }
    else if(stock<=0){
        event.preventDefault()
        errorMessage.textContent="Stock cannot be zero or negative number";
    }
  else if(description.length ==0){
        event.preventDefault()
        errorMessage.textContent = "enter the description"
    }
    else if (imageInput.files.length < 0) {
        event.preventDefault(); // Prevent form submission
        errorMessage.textContent = "Choose an image";
    }  
  })