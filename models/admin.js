const db = require("../config/db");
const bcrypt = require("bcrypt");

const findByUsername = async (username) => {
    try {
        const result = await db.query(
            "SELECT * FROM admins WHERE username = $1",
            [username]
        );
        return result.rows[0];
    } catch (error) {
        console.error(
            "Erreur lors de la recherche de l'administrateur par nom d'utilisateur:",
            error
        );
        throw error;
    }
};

// Fonction pour comparer le mot de passe fourni avec le hash stocké
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
    findByUsername,
    comparePassword,
};
