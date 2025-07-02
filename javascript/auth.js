document.addEventListener('DOMContentLoaded', () => {
    const authCheckButton = document.getElementById('authCheck');

    if (authCheckButton) {
        authCheckButton.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent default button behavior

            try {
                const response = await fetch('php/auth.php', {
                    method: 'POST',
                    // No need to send specific data, as the username is in the session
                });
                const data = await response.json();

                if (data.status === 'success') {
                    alert(data.message); // Optional: show success message
                    window.location.href = 'index.html'; // Redirect to index.html for login flow
                } else if (data.status === 'success_register') {
                    alert(data.message); // Optional: show success message
                    window.location.href = 'login.html'; // Redirect to login.html for registration flow
                }
                else {
                    alert(data.message); // Show error message
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during authorization. Please try again.');
            }
        });
    }
});