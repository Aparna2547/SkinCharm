const formId = document.getElementById('formId')
const nameInput = document.getElementById('couponName')
const minpurchaseInput = document.getElementById('minimumPurchase')
const maxDiscountInput = document.getElementById('maximumDiscount')
const dateInput = document.getElementById('expiryDate')

const errorMessage = document.getElementById('errorMessage')

formId.addEventListener("submit",(event)=>{
    const name = nameInput.value;
    const minPurchase = minpurchaseInput.value;
    const maxDiscount = maxDiscountInput.value;
    const date = dateInput.value;

    // const image = imageInput.value;
    if(name.length==0){
        event.preventDefault()
        errorMessage.textContent="Enter the name"
    }
    else if (minPurchase<0) {
        // alert("Product image is required.");
        event.preventDefault(); // Prevent form submission
        errorMessage.textContent = "purchase must a number";
    }
    else if (maxDiscount<0) {
        // alert("Product image is required.");
        event.preventDefault(); // Prevent form submission
        errorMessage.textContent = "purchase must a number";
    }else if(date.length===0){
        event.preventDefault()
        errorMessage.textContent="Enter the date"
    }
 
})