import nodemailer from "nodemailer";

/* 
 - Mailtrap is the email service, which provides mail servers. i.e. noreply@sydneykart.com
 - NodeMailer is the package that allows us to send emails via a Server
*/

export const sendEmail = async (options) => {
    /* Server Config from MailTrap */
    let transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST ,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    /* From Nodemailer Doc */
    /* 
        Since we are testing, it is advisable to use a Dummy Server Email instead of 
        Organization email.
    */
    let message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transport.sendMail(message)
}