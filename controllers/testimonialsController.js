const testimonialModel = require("../models/testimonial");

const getApprovedTestimonials = async (req, res) => {
   try {
       const testimonials = await testimonialModel.getAllApproved();
       res.json(testimonials);
   } catch (error) {
       console.error("Erreur lors de la récupération des témoignages:", error);
       res.status(500).json({ error: "Erreur serveur" });
   }
};

const addTestimonial = async (req, res) => {
    const { nom_auteur, texte } = req.body;
    if (!nom_auteur || !texte) {
        return res
            .status(400)
            .json({ error: "Nom de l'auteur et texte sont requis" });
    }
    try {
        const newTestimonial = await testimonialModel.create(nom_auteur, texte);
        res.status(201).json(newTestimonial);
    } catch (error) {
        console.error("Erreur lors de l'ajout du témoignage:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const likeTestimonial = async (req, res) => {
    const { id } = req.params;
    try {
        const likes = await testimonialModel.like(id); // Appeler la fonction like modifiée
        if (likes !== undefined) {
            res.json({ likes }); // Renvoyer le nouveau nombre de likes
        } else {
            res.status(500).json({ error: "Erreur lors de l'incrémentation des likes" });
        }
    } catch (error) {
        console.error("Erreur lors de l'incrémentation du like:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
const getTestimonialLikes = async (req, res) => {
    const { id } = req.params;
    try {
        const likes = await testimonialModel.getLikesCount(id);
        res.json({ testimonial_id: id, likes });
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des likes du témoignage:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const updateTestimonial = async (req, res) => {
    const { id } = req.params;
    const { texte, is_approved } = req.body;
    try {
        const updatedTestimonial = await testimonialModel.update(
            id,
            texte,
            is_approved
        );
        if (!updatedTestimonial) {
            return res.status(404).json({ message: "Témoignage non trouvé" });
        }
        res.json(updatedTestimonial);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du témoignage:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const deleteTestimonial = async (req, res) => {
    const { id } = req.params;
    try {
        await testimonialModel.deleteTestimonial(id);
        res.status(204).send(); // No content
    } catch (error) {
        console.error("Erreur lors de la suppression du témoignage:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
// Dans testimonialsController.js (exemple)
const rejectTestimonial = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTestimonial = await testimonialModel.update(
            id,
            undefined, // Ne pas modifier le texte
            false // Définir is_approved à false pour rejeter
        );
        if (!updatedTestimonial) {
            return res.status(404).json({ message: "Témoignage non trouvé" });
        }
        res.json({
            message: "Témoignage rejeté avec succès",
            testimonial: updatedTestimonial,
        });
    } catch (error) {
        console.error("Erreur lors du rejet du témoignage:", error);
        res.status(500).json({
            error: "Erreur serveur lors du rejet du témoignage",
        });
    }
};

const approveTestimonial = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTestimonial = await testimonialModel.update(
            id,
            undefined, // Ne pas modifier le texte
            true // Définir is_approved à true pour approuver
        );
        if (!updatedTestimonial) {
            return res.status(404).json({ message: "Témoignage non trouvé" });
        }
        res.json({
            message: "Témoignage approuvé avec succès",
            testimonial: updatedTestimonial,
        });
    } catch (error) {
        console.error("Erreur lors de l'approbation du témoignage:", error);
        res.status(500).json({
            error: "Erreur serveur lors de l'approbation du témoignage",
        });
    }
};
const getAllTestimonialsForAdmin = async (req, res) => {
    try {
        const testimonials = await testimonialModel.getAll(); // Utilise la fonction getAll de votre modèle
        res.json(testimonials);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération de tous les témoignages pour l'admin:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};
const getTestimonialsCount = async (req, res) => {
    try {
        const count = await testimonialModel.getTotalTestimonials();
        res.json({ count });
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre total de témoignages:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports = {
    getApprovedTestimonials,
    addTestimonial,
    likeTestimonial,
    getTestimonialLikes,
    updateTestimonial,
    deleteTestimonial,
    rejectTestimonial,
    approveTestimonial,
    getAllTestimonialsForAdmin,
    getTestimonialsCount,
};
