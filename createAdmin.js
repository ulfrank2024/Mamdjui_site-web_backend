const bcrypt = require("bcrypt");
const db = require("./config/db"); // Assurez-vous que le chemin vers db.js est correct

async function createAdmin() {
    const username = "mandjui_user_new"; 
    const password = "password123";

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await db.query(
            "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
            [username, hashedPassword]
        );
        console.log("Administrateur créé avec succès!");
        process.exit();
    } catch (error) {
        console.error("Erreur lors de la création de l'administrateur:", error);
        process.exit(1);
    }
}

createAdmin();
