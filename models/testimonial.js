const db = require("../config/db");

const getAllApproved = async () => {
    try {
        const result = await db.query(
            "SELECT * FROM testimonials WHERE is_approved = TRUE"
        );
        return result.rows;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des témoignages approuvés:",
            error
        );
        throw error;
    }
};

const create = async (nom_auteur, texte) => {
    try {
        const result = await db.query(
            "INSERT INTO testimonials (nom_auteur, texte) VALUES ($1, $2) RETURNING *",
            [nom_auteur, texte]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Erreur lors de la création du témoignage:", error);
        throw error;
    }
};

const like = async (testimonialId) => {
    try {
        const result = await db.query(
            "UPDATE testimonials SET likes = likes + 1 WHERE id = $1 RETURNING likes",
            [testimonialId]
        );
        return result.rows[0]?.likes;
    } catch (error) {
        console.error("Erreur lors de l'ajout du like:", error);
        throw error;
    }
};
const getLikesCount = async (testimonialId) => {
    try {
        const result = await db.query(
            "SELECT likes FROM testimonials WHERE id = $1",
            [testimonialId]
        );
        return result.rows[0]?.likes || 0;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre de likes:",
            error
        );
        throw error;
    }
};

const update = async (id, texte, is_approved) => {
    try {
        let query = "UPDATE testimonials SET updated_at = NOW()";
        const values = [];
        let paramIndex = 1;

        if (texte !== undefined) {
            query += `, texte = $${paramIndex++}`;
            values.push(texte);
        }

        if (is_approved !== undefined) {
            query += `, is_approved = $${paramIndex++}`;
            values.push(is_approved);
        }

        query += ` WHERE id = $${paramIndex++} RETURNING *`;
        values.push(id);

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Erreur lors de la mise à jour du témoignage:", error);
        throw error;
    }
};

const deleteTestimonial = async (id) => {
    try {
        await db.query("DELETE FROM testimonials WHERE id = $1", [id]);
    } catch (error) {
        console.error("Erreur lors de la suppression du témoignage:", error);
        throw error;
    }
};
const getAll = async () => {
    try {
        const result = await db.query(
            "SELECT * FROM testimonials ORDER BY created_at DESC"
        );
        return result.rows;
    } catch (error) {
        console.error(
            "Erreur lors de la récupération de tous les témoignages:",
            error
        );
        throw error;
    }
};
const getTotalTestimonials = async () => {
    try {
        const result = await db.query("SELECT COUNT(*) FROM testimonials");
        return parseInt(result.rows[0]?.count || 0);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre total de témoignages:",
            error
        );
        throw error;
    }
};
module.exports = {
    getAllApproved,
    create,
    like,
    getLikesCount,
    update,
    deleteTestimonial,
    getAll,
    getTotalTestimonials,
};
