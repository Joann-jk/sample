document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("BZST9ktJ0ufH_WXaH"); // Initialize EmailJS with your Public Key

    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        const form = this;

        // Send email to ADMIN (so you receive the user's message)
        emailjs.sendForm(
            "service_o65q3yt",  // Your EmailJS Service ID
            "template_5pkwnd8", // Template for Admin (receiving the user's message)
            form,
            "BZST9ktJ0ufH_WXaH" // Your EmailJS Public Key
        )
        .then(response => {
            console.log("Email sent to admin:", response);
            showMessage("Success! Your message has been sent.", "alert-success");
            form.reset();
        })
        .catch(error => {
            console.error("Email send failed:", error);
            showMessage("Error! Your message could not be sent.", "alert-danger");
            form.reset();
        });
    });

    function showMessage(message, alertType) {
        const responseMessage = document.getElementById("response-message");
        responseMessage.textContent = message;
        responseMessage.className = `alert ${alertType}`;
        responseMessage.style.display = "block";

        // Hide the message after 5 seconds
        setTimeout(() => {
            responseMessage.style.display = "none";
        }, 3000);
    }
});
