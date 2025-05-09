const bcrypt = require("bcrypt");
const db = require("./config/db");
require("dotenv").config();

async function createAdmin() {
   const username = process.env.ADMIN_USERNAME; 
   const password = process.env.ADMIN_PASSWORD; 

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
            [username, hashedPassword]
        );
        console.log("✅ Administrateur créé avec succès !");
        process.exit();
    } catch (error) {
        console.error(
            "❌ Erreur lors de la création de l'administrateur :",
            error
        );
        process.exit(1);
    }
}

createAdmin();
