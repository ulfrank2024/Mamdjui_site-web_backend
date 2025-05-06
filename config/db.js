// config/db.js
const { Pool } = require("pg");
require("dotenv").config(); // Assurez-vous que dotenv est configuré

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

// Tester la connexion à la base de données (optionnel)
pool.connect()
    .then(() => console.log("Connecté à PostgreSQL avec succès"))
    .catch((err) => console.error("Erreur de connexion à PostgreSQL", err));

module.exports = pool;
