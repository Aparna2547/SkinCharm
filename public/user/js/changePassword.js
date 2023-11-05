// $(document).ready(function (){
//     $('#formId').submit(function(event){
//         event.preventDefault();

//         const formData = {
//             currentPassword: $('#currentpassword').val(),
//             newPassword : $('#newpassword').val(),
//             confirmPassword : $('#confimpassword').val()
//         };


//         $.ajax({
//             type:'POST',
//             url:'/changePassword',
//             data : formData,
//             success : function(response){
//                 if(response.status == 'empty'){
//                     $('#warnings').text('Password does not match')
//                 }
//                 else if(response.status =='different'){
//                     $('#warnings').text('Password does not match')
//                 }
//                 else if(response.status == 'mot matching'){
//                     $('#warnings').text("Current Password is incorrect");
//                 }
//                 else if(formData.newPassword.length<4){
//                     $('#warnings').text('Password contains minimum 4charcters');
//                 }
//                 else if(response.status == 'done'){
//                     $('#staticBackdrop').modal('hide');
//                     // $('#changed').text('Password Changed successfully')
//                     const notification = document.getElementById('notification');
//                     $('#notification').text('Password changed successfully');
//                     // Show the notification
//                     notification.style.right = '10px';
              
//                     // Set a timeout to hide the notification after 3 seconds (adjust as needed)
//                     setTimeout(function () {
//                       notification.style.right = '-250px';
//                     }, 3000);
//                 }
//             }
//         })
//     })
// })

const formId = document.getElementById('formId')
const currentPasswordInput = document.getElementById('currentpassword')
const newPasswordInput = document.getElementById('newpassword')
const confirmPasswordInput = document.getElementById('confirmpassword')
const errorMessage = document.getElementById('errorMessage')

formId.addEventListener("submit",(event)=>{
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
   

    // const image = imageInput.value;
    if(currentPassword.length==0){
        event.preventDefault()
        errorMessage.textContent="Enter the password"
    }
    else if (newPassword.length == 0) {
        // alert("Product image is required.");
        event.preventDefault(); // Prevent form submission
        errorMessage.textContent = "Enter the password";
    }
    else if (confirmPassword.length == 0 && newPassword!==confirmPassword) {
        // alert("Product image is required.");
        event.preventDefault(); // Prevent form submission
        errorMessage.textContent = "passwords are not matching";
    }
 
})