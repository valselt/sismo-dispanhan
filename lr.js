function passwordValidation() {
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('password-check');
    const passwordIcon = document.getElementById('password-icon');
    const passwordCheckIcon = document.getElementById('password-check-icon');

    if (!passwordInput || !passwordCheckInput || !passwordIcon || !passwordCheckIcon) {
        console.warn("Could not find one or more password input fields or icons.");
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

    // Function to toggle password visibility and icon style
    function togglePasswordVisibility(inputElement, iconElement) {
        if (inputElement.type === 'password') {
            inputElement.type = 'text';
            iconElement.style.backgroundColor = 'var(--color-primary)';
            iconElement.style.color = 'var(--color-white)';
            iconElement.textContent = 'visibility';
        } else {
            inputElement.type = 'password';
            iconElement.style.backgroundColor = 'transparent';
            iconElement.style.color = 'var(--color-black)'; // You might want to define a default color for the icon here, or revert to the one set in CSS
            iconElement.textContent = 'visibility'; // Change icon back to 'visibility'
        }
    }

    // Add event listeners for the password icons
    passwordIcon.addEventListener('click', () => {
        togglePasswordVisibility(passwordInput, passwordIcon);
    });

    passwordCheckIcon.addEventListener('click', () => {
        togglePasswordVisibility(passwordCheckInput, passwordCheckIcon);
    });

    passwordInput.addEventListener('input', validatePassword);
    passwordCheckInput.addEventListener('input', validatePassword);

    validatePassword();
}

document.addEventListener('DOMContentLoaded', passwordValidation);