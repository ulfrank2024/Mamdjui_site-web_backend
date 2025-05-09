const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_DATABASE,
});

pool.connect()
    .then(() => console.log("✅ Connecté à PostgreSQL avec succès"))
    .catch((err) => console.error("❌ Erreur de connexion à PostgreSQL", err));

module.exports = pool;
