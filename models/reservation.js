const db = require("../config/db");

const create = async (reservationData) => {
    const {
        service_demande,
        date_evenement,
        heure_evenement,
        budget,
        demandes_additionnelles,
        nom_client,
        email_client,
        telephone_client,
        lieu_evenement, // Ajout
        ville_evenement, // Ajout
    } = reservationData;
    try {
        const result = await db.query(
            "INSERT INTO reservations (service_demande, date_evenement, heure_evenement, budget, demandes_additionnelles, nom_client, email_client, telephone_client, lieu_evenement, ville_evenement) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
            [
                service_demande,
                date_evenement,
                heure_evenement,
                budget,
                demandes_additionnelles,
                nom_client,
                email_client,
                telephone_client,
                lieu_evenement, // Ajout
                ville_evenement, // Ajout
            ]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Erreur lors de la création de la réservation:", error);
        throw error;
    }
};

const getAll = async () => {
    try {
        const result = await db.query("SELECT * FROM reservations");
        return result.rows;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des réservations:",
            error
        );
        throw error;
    }
};

const deleteReservation = async (id) => {
    try {
        await db.query("DELETE FROM reservations WHERE id = $1", [id]);
    } catch (error) {
        console.error(
            "Erreur lors de la suppression de la réservation:",
            error
        );
        throw error;
    }
};
const updateStatus = async (id, status) => {
    try {
        const result = await db.query(
            "UPDATE reservations SET statut = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error(
            "Erreur lors de la mise à jour du statut de la réservation:",
            error
        );
        throw error;
    }
};

// reservationModel.js
const updateValidation = async (id, est_valide) => {
    try {
        const result = await db.query(
            "UPDATE reservations SET est_valide = $1 WHERE id = $2 RETURNING *",
            [est_valide, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la validation de la réservation:", error);
        throw error;
    }
};
const getById = async (id) => {
    try {
        const result = await db.query(
            "SELECT * FROM reservations WHERE id = $1",
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error(
            `Erreur lors de la récupération de la réservation avec l'ID ${id}:`,
            error
        );
        throw error;
    }
};
const getTotalReservations = async () => {
    try {
        const result = await db.query("SELECT COUNT(*) FROM reservations");
        return parseInt(result.rows[0]?.count || 0);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre total de réservations:",
            error
        );
        throw error;
    }
};

const findOneByLieuDateHeure = async (
    lieu_evenement,
    date_evenement,
    heure_evenement
) => {
    try {
        const result = await db.query(
            "SELECT * FROM reservations WHERE lieu_evenement = $1 AND date_evenement = $2 AND heure_evenement = $3",
            [lieu_evenement, date_evenement, heure_evenement]
        );
        return result.rows[0]; // Retourne le premier enregistrement trouvé, ou undefined si aucun
    } catch (error) {
        console.error(
            "Erreur lors de la vérification de l'existence de la réservation:",
            error
        );
        throw error;
    }
};
module.exports = {
    create,
    getAll,
    getById,
    deleteReservation,
    updateStatus,
    updateValidation,
    getTotalReservations,
    findOneByLieuDateHeure,
};
