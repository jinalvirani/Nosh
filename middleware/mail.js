const nodemailer = require("nodemailer");
var obj = {
    sendMail: async function (obj,callback) {
        console.log("sendMail() called " , obj);
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "jinalvirani79@gmail.com", // generated ethereal user
                pass: "8866175323" // generated ethereal password
            }
        });
        let mailOptions = {
            from: 'Nosh Dabba Service', // sender address
            to: obj.receiver, // list of receivers
            subject: obj.subject, // Subject line
            text: obj.text, // plain text body
            html: obj.text // html body
        };
        let info = await transporter.sendMail(mailOptions,callback);
    },
};
module.exports = obj;