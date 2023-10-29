const nodemailer = require('nodemailer');
require('dotenv').config();

const { GMAIL_MAIL, GMAIL_MAIL_PASSWORD } = process.env;

const nodemailerConfig = {
    host: 'smtp.ukr.net',
    port: 465,
    secure: true,
    auth: {
        user: GMAIL_MAIL,
        pass: GMAIL_MAIL_PASSWORD,
    }
};
const transporter = nodemailer.createTransport(nodemailerConfig);

// const data = {
//     to: 'sejito9223@hondabbs.com',
//     subject: 'Hello world',
//     html: '<strong>Hello from nodemailer</strong>',
// }


const sendEmail = (data) => {
    const message = { ...data, from: GMAIL_MAIL };
    return transporter.sendMail(message);
}


module.exports = sendEmail;