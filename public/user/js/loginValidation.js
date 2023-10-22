const formId = document.getElementById("loginValidate")
const mobileInput =  document.getElementById("mobile")
const passwordInput =  document.getElementById("password")
const errorMessage = document.getElementById('errorMessage')


formId.addEventListener('submit',(event)=>{
    const mobile = mobileInput.value;
    const password = passwordInput.value

    if(mobile.length!==10 && typeof(mobile)!=Number){
        event.preventDefault();
        errorMessage.textContent="Enter a valid number"
    }else if(password.length <4){
        event.preventDefault()
        errorMessage.textContent = "password must minimum 4 character"
    }

})