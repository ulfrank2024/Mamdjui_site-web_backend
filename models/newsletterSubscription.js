const db = require("../config/db");

const subscribe = async (email, nom) => {
    try {
        const check = await db.query(
            "SELECT * FROM newsletter_subscriptions WHERE email = $1",
            [email]
        );
        if (check.rows.length > 0) {
            return null; // Email déjà abonné
        }
        const result = await db.query(
            "INSERT INTO newsletter_subscriptions (email, nom, subscription_date) VALUES ($1, $2, NOW()) RETURNING *",
            [email, nom] // Inclure le nom dans l'insertion
        );
        return result.rows[0];
    } catch (error) {
        console.error("Erreur lors de l'abonnement à la newsletter:", error);
        throw error;
    }
};

const getAllEmails = async () => {
    try {
        const result = await db.query(
            "SELECT email FROM newsletter_subscriptions"
        );
        return result.rows.map((row) => row.email);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des emails de la newsletter:",
            error
        );
        throw error;
    }
};

const getAllSubscribersWithName = async () => {
    try {
        const result = await db.query(
            "SELECT email, nom, TO_CHAR(subscription_date AT TIME ZONE 'UTC', 'YYYY-MM-DDTHH:mm:ssZ') AS subscription_date FROM newsletter_subscriptions"
        );
        return result.rows;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération de la liste des abonnés à la newsletter:",
            error
        );
        throw error;
    }
};

const deleteByEmail = async (email) => {
    try {
        await db.query(
            "DELETE FROM newsletter_subscriptions WHERE email = $1",
            [email]
        );
    } catch (error) {
        console.error(
            "Erreur lors de la suppression de l'email de la newsletter:",
            error
        );
        throw error;
    }
};
const findByEmail = async (email) => {
    try {
        const result = await db.query(
            "SELECT email, nom FROM newsletter_subscriptions WHERE email = $1",
            [email]
        );
        return result.rows[0]; // Retourne l'abonné trouvé ou undefined si non trouvé
    } catch (error) {
        console.error("Erreur lors de la recherche par email:", error);
        throw error;
    }
};
const getTotalSubscribers = async () => {
    try {
        const result = await db.query(
            "SELECT COUNT(*) FROM newsletter_subscriptions"
        ); // Adjust table name if needed
        return parseInt(result.rows[0]?.count || 0);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre total d'abonnés:",
            error
        );
        throw error;
    }
};

module.exports = {
    subscribe,
    getAllEmails,
    getAllSubscribersWithName, // Ajout de la fonction manquante
    deleteByEmail,
    findByEmail,
    getTotalSubscribers,
};
