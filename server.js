const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Create transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true,
    logger: true
});

// Verify transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('Transporter verification failed:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// Handle form submission
app.post('/submit-query', async (req, res) => {
    try {
        const { name, email, phone, address, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        console.log('Attempting to send email...');
        console.log('From:', process.env.EMAIL_USER);
        console.log('To: joannjkoodathil@gmail.com');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'joannjkoodathil@gmail.com',
            subject: `New Query from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
${address ? `Address: ${address}\n` : ''}
Message: ${message}
            `,
            replyTo: email
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);

        return res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully! We will contact you soon.'
        });

    } catch (error) {
        console.error('Error sending email:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });

        return res.status(500).json({
            success: false,
            message: 'Unable to send message. Please try again later.'
        });
    }
});

// Try multiple ports if the default one is in use
const tryPort = (port) => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}...`);
            tryPort(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
};

// Start server with initial port
const initialPort = process.env.PORT || 3008;
tryPort(initialPort);