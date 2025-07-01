function passwordValidation() {
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('password-check');

    if (!passwordInput || !passwordCheckInput) {
        console.warn("Could not find one or both password input fields.");
        return;
    }

    function validatePassword() {
        if (passwordCheckInput.value.length > 0) {
            if (passwordCheckInput.value === passwordInput.value) {
                passwordCheckInput.style.backgroundColor = '';
                passwordCheckInput.style.color = '';
                passwordCheckInput.style.outline = '';
                passwordCheckInput.style.borderColor = '';
                passwordCheckInput.style.boxShadow = '';
                passwordCheckInput.classList.remove('password-mismatch-focus');
            } else {
                passwordCheckInput.style.backgroundColor = '#B71C1C';
                passwordCheckInput.style.color = 'white';
                passwordCheckInput.style.borderColor = 'red';
                passwordCheckInput.style.boxShadow = '0 1px 1px rgba(255, 0, 0, .075), 0 0 8px rgba(255, 0, 0, .2)';
                passwordCheckInput.classList.add('password-mismatch-focus');
            }
        } else {
            passwordCheckInput.style.backgroundColor = '';
            passwordCheckInput.style.color = '';
            passwordCheckInput.style.outline = '';
            passwordCheckInput.style.borderColor = '';
            passwordCheckInput.style.boxShadow = '';
            passwordCheckInput.classList.remove('password-mismatch-focus');
        }
    }

    passwordInput.addEventListener('input', validatePassword);
    passwordCheckInput.addEventListener('input', validatePassword);

    validatePassword();
}

document.addEventListener('DOMContentLoaded', passwordValidation);