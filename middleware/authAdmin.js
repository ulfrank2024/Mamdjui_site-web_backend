// middleware/authAdmin.js
const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.admin = admin; // Ajouter les informations de l'admin à la requête si nécessaire
        next();
    });
};

module.exports = authAdmin;
