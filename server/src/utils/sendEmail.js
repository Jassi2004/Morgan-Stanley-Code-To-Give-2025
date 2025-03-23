import nodemailer from "nodemailer";

const sendEmail = async function(email, subject, message){
    try{
        let transporter = nodemailer.createTransport({
            host : process.env.SMTP_HOST,
            port : process.env.SMTP_PORT,
            secure : true,
            auth : {
                user : process.env.SMTP_USERNAME,
                pass : process.env.SMTP_PASSWORD,
            },
            tls : {
                rejectUnauthorized : false
            },
            connectionTimeout : 5000,
            socketTimeout :  5000
        })

        await transporter.sendMail({
            from : process.env.SMTP_FROM_EMAIL,
            to : email,
            subject : subject,
            html : message
        })

    }catch(err){
        console.log(`Error sending email : ${err}`);
        throw new Error("could not send email, please try again later....");
    }
}

export default sendEmail;


