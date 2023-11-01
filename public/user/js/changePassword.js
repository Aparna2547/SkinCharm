const formId = document.getElementById("formId");
const currentPswd = document.getElementById("currentpassword");
const newPswd = document.getElementById("newpassword");
const confirmNewPswd = document.getElementById("confirmpassword");
const errorMessage = document.getElementById('errorMessage');

formId.addEventListener('submit', (event) => {
    const currentPassword = currentPswd.value;
    const newPassword = newPswd.value;
    const confirmNewPassword = confirmNewPswd.value;

    if (currentPassword.length === 0) {
        event.preventDefault();
        errorMessage.textContent = "Enter the current password";
    } else if (newPassword.length < 4) {
        event.preventDefault();
        errorMessage.textContent = "Password must be at least 4 characters long";
    } else if (newPassword !== confirmNewPassword) {
        event.preventDefault();
        errorMessage.textContent = 'Passwords do not match';
    }
});
