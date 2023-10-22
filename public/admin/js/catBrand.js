const formIdBrand = document.getElementById('formIdBrand')
const brandInput = document.getElementById('brand')
const errorMessage = document.getElementById('errorMessage')

formIdBrand.addEventListener("submit",(event)=>{
    const brand = brandInput.value;
    // const image = imageInput.value;
    if(brand.length<4){
        event.preventDefault()
        errorMessage.textContent="Enter the category"
    }
   
})