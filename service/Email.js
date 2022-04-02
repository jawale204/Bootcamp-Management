const nodemailer = require('nodemailer')

exports.sendMail =async (options)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, 
        port: process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_USERNAME,
            pass:process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from:`${process.env.FROM_EMAIL}`,
        to:options.to,
        subject:options.subject,
        text:options.text
    }

    const res = await transporter.sendMail(message);

    console.log(res);

    return res;
}