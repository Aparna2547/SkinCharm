const formId = document.getElementById("loginValidate")
const passwordInput =  document.getElementById("password")
const errorMessage = document.getElementById('errorMessage')


formId.addEventListener('submit',(event)=>{
    const email = mobileInput.value;
    const password = passwordInput.value

    if(email.length!==10){
        event.preventDefault();
        errorMessage.textContent="Enter a valid mail"
    }else if(password.length ==0){
        event.preventDefault()
        errorMessage.textContent = "password must minimum 4 character"
    }

})