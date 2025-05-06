const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ulrichfranklinlontsinobossi@gmail.com",
        pass: "cgoj oppb offl rgqm",
    },
});

module.exports = transporter;
