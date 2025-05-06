const adminModel = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await adminModel.findByUsername(username);
        if (!admin) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }
        const isPasswordValid = await adminModel.comparePassword(
            password,
            admin.password_hash
        );
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }
        const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        }); // Définir JWT_SECRET dans .env
        res.json({ token });
    } catch (error) {
        console.error(
            "Erreur lors de la connexion de l'administrateur:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports = {
    adminLogin,
};
