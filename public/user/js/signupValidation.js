const formId = document.getElementById("SignupValidate")
const nameInput = document.getElementById("username")
const mobileInput =  document.getElementById("mobile")
const emailInput = document.getElementById("email")
const passwordInput =  document.getElementById("password")
const c_passwordInput =  document.getElementById("c_password")
const errorMessage = document.getElementById('errorMessage')


formId.addEventListener('submit',(event)=>{
    const username =nameInput.value;
    const mobile = mobileInput.value;
    const password = passwordInput.value
    const c_password = c_passwordInput.value;

    if(username.length == 0){
        event.preventDefault()
        errorMessage.textContent="Please enter the name";
    }else if(mobile.length!==10 && typeof(mobile)!=Number){
        event.preventDefault();
        errorMessage.textContent="Enter a valid number"
    }else if(password.length ==0){
        event.preventDefault()
        errorMessage.textContent = "password must minimum 4 character"
    }
    else if(password !== c_password){
        event.preventDefault()
        errorMessage.textContent = "Passwords are not matching"
    }
})

  