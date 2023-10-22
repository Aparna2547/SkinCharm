const formId = document.getElementById('formId')
const categoryInput = document.getElementById('category')
const imageInput = document.getElementById('catImage')
const errorMessage = document.getElementById('errorMessage')

formId.addEventListener("submit",(event)=>{
    const category = categoryInput.value;
    // const image = imageInput.value;
    if(category.length<4){
        event.preventDefault()
        errorMessage.textContent="Enter the category"
    }
    else if (imageInput.files.length === 0) {
        // alert("Product image is required.");
        event.preventDefault(); // Prevent form submission
        errorMessage.textContent = "Choose an image";
    }
 
})