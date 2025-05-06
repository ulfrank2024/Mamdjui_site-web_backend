const transporter = require("../config/emailConfig.js");

async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: '"Mamdjui Cuisine & Events" <ulrichfranklinlontsinobossi@gmail.com>',
            to,
            subject,
            html,
        });
        console.log("📩 E-mail envoyé avec succès ! ID :", info.messageId);
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'e-mail :", error);
    }
}

module.exports = { sendEmail };
