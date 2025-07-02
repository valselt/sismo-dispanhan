function passwordValidation() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('password-icon');

    const passwordCheckInput = document.getElementById('password-check');
    const passwordCheckIcon = document.getElementById('password-check-icon');

    if (!passwordInput || !passwordIcon) {
        console.warn("Could not find password input field or its icon.");
        return;
    }

    function validatePassword() {
        if (passwordCheckInput) { // This part is only relevant for the registration page if passwordCheckInput exists
            if (passwordCheckInput.value.length > 0) {
                if (passwordCheckInput.value === passwordInput.value) {
                    // Passwords match, revert to default styling (or potentially a success styling)
                    passwordCheckInput.style.backgroundColor = '';
                    passwordCheckInput.style.color = '';
                    passwordCheckInput.style.outline = '';
                    passwordCheckInput.style.borderColor = ''; // Revert to default border
                    passwordCheckInput.style.boxShadow = '';
                    passwordCheckInput.classList.remove('password-mismatch-focus');
                } else {
                    // Passwords do not match, apply red styling
                    passwordCheckInput.style.backgroundColor = '#B71C1C';
                    passwordCheckInput.style.color = 'white';
                    passwordCheckInput.style.borderColor = 'red';
                    passwordCheckInput.style.boxShadow = '0 1px 1px rgba(255, 0, 0, .075), 0 0 8px rgba(255, 0, 0, .2)';
                    passwordCheckInput.classList.add('password-mismatch-focus');
                }
            } else {
                // If passwordCheckInput has no value, revert to default styling
                passwordCheckInput.style.backgroundColor = '';
                passwordCheckInput.style.color = '';
                passwordCheckInput.style.outline = '';
                passwordCheckInput.style.borderColor = '';
                passwordCheckInput.style.boxShadow = '';
                passwordCheckInput.classList.remove('password-mismatch-focus');
            }
        }
    }

    function togglePasswordVisibility(inputElement, iconElement) {
        if (inputElement.type === 'password') {
            inputElement.type = 'text';
            iconElement.style.backgroundColor = 'var(--color-primary)';
            iconElement.style.color = 'var(--color-white)';
            iconElement.textContent = 'visibility_off'; // Changed icon to indicate password is now visible
        } else {
            inputElement.type = 'password';
            iconElement.style.backgroundColor = 'transparent';
            iconElement.style.color = 'var(--color-black)';
            iconElement.textContent = 'visibility';
        }
    }

    passwordIcon.addEventListener('click', () => {
        togglePasswordVisibility(passwordInput, passwordIcon);
    });

    if (passwordCheckInput && passwordCheckIcon) {
        // Add focus listener to apply blue styling when it's being typed into
        passwordCheckInput.addEventListener('focus', () => {
            if (passwordCheckInput.value.length === 0) {
                // Apply the blue focus styling from input-lr:focus
                passwordCheckInput.style.backgroundColor = 'var(--color-secondary)';
                passwordCheckInput.style.color = 'var(--color-white)';
                passwordCheckInput.style.outline = 'none';
                passwordCheckInput.style.borderColor = 'var(--color-primary)';
                passwordCheckInput.style.boxShadow = '0 1px 1px rgba(26, 115, 232, .075), 0 0 8px rgba(26, 115, 232, .2)';
            }
        });

        // Add blur listener to revert to default if no value, or validate if value exists
        passwordCheckInput.addEventListener('blur', () => {
            if (passwordCheckInput.value.length === 0) {
                passwordCheckInput.style.backgroundColor = '';
                passwordCheckInput.style.color = '';
                passwordCheckInput.style.outline = '';
                passwordCheckInput.style.borderColor = '';
                passwordCheckInput.style.boxShadow = '';
                passwordCheckInput.classList.remove('password-mismatch-focus');
            } else {
                validatePassword(); // Validate when focus is lost
            }
        });

        passwordCheckIcon.addEventListener('click', () => {
            togglePasswordVisibility(passwordCheckInput, passwordCheckIcon);
        });
        
        passwordInput.addEventListener('input', validatePassword);
        passwordCheckInput.addEventListener('input', validatePassword);
    }
}

document.addEventListener('DOMContentLoaded', passwordValidation);