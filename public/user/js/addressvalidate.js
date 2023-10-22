const formId = document.getElementById("formId")
const nameInput =  document.getElementById("name")
const mobileInput =  document.getElementById("mobile")
const addressInput = document.getElementById("address")
const localityInput = document.getElementById("locality")
const pincodeInput = document.getElementById("pincode")
const cityInput = document.getElementById("city")
const stateInput = document.getElementById("state")
const errorMessage = document.getElementById('errorMessage')


formId.addEventListener('submit',(event)=>{
    const mobile = mobileInput.value;
    const address = addressInput.value;
    const name = nameInput.value;
    const locality = localityInput.value;
    const pincode = pincodeInput.value;
    const city = cityInput.value;
    const state = stateInput.value;

    
if(name.length ==0){
    event.preventDefault();
    errorMessage.textContent="EnterName"
}
    else if(mobile.length!==10 && typeof(mobile)!=Number){
        event.preventDefault();
        errorMessage.textContent="Enter a valid number"
    }
    else if(address.length <5){
        event.preventDefault();
        errorMessage.textContent="Enter a valid address"
    }
    else if(locality.length ==0){
        event.preventDefault();
        errorMessage.textContent="Enter your locality"
    }
    else if(lpincode.length==0 && typeof(pincode)!=Number){
        event.preventDefault();
        errorMessage.textContent="Enter your pincode"
    }
    else if(city.length ==0){
        event.preventDefault();
        errorMessage.textContent="Enter your city"
    }
    else if(state.length ==0){
        event.preventDefault();
        errorMessage.textContent="Enter your state  "
    }

})