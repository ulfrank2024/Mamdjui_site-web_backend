const express = require("express");
const adminController = require("../controllers/adminController");
const testimonialsController = require("../controllers/testimonialsController");
const newsletterController = require("../controllers/newsletterController");
const reservationsController = require("../controllers/reservationsController");
const authAdmin = require("../middleware/authAdmin"); // Middleware d'authentification admin (à créer)

const router = express.Router();

router.post("/admin/login", adminController.adminLogin);

// Routes admin pour les témoignages (protégées par le middleware authAdmin)
router.get(
    "/admin/testimonials/all",
    authAdmin,
    testimonialsController.getApprovedTestimonials
); // Ou une fonction spécifique pour tous les témoignages
router.put(
    "/admin/testimonials/:id",
    authAdmin,
    testimonialsController.updateTestimonial
);
router.delete(
    "/admin/testimonials/:id",
    authAdmin,
    testimonialsController.deleteTestimonial
);
router.put(
    "/admin/testimonials/:id/approve",
    authAdmin,
    testimonialsController.approveTestimonial // Créez cette fonction dans le contrôleur
);
router.get(
    "/admin/testimonials/all",
    authAdmin,
    testimonialsController.getAllTestimonialsForAdmin
);
// AJOUTEZ CETTE ROUTE POUR LE REJET
router.put(
    "/admin/testimonials/:id/reject",
    authAdmin,
    testimonialsController.rejectTestimonial // Créez cette fonction dans le contrôleur
);
// Routes admin pour la newsletter (protégées par le middleware authAdmin)
router.get(
    "/admin/newsletter/emails",
    authAdmin,
    newsletterController.getNewsletterList // MODIFICATION ICI : Utiliser getNewsletterList
);
router.delete(
    "/admin/newsletter/emails/:email",
    authAdmin,
    newsletterController.deleteNewsletterEmail
);

// Routes admin pour les réservations (protégées par le middleware authAdmin)
router.get(
    "/admin/reservations",
    authAdmin,
    reservationsController.getAllReservations
);
router.delete(
    "/admin/reservations/:id",
    authAdmin,
    reservationsController.deleteReservation
);
router.put(
    "/admin/reservations/:id/status",
    authAdmin,
    reservationsController.updateReservationStatus
);

// Route admin pour changer l'état de validation (simple booléen)
router.put(
    "/admin/reservations/:id/validate",
    authAdmin,
    reservationsController.updateReservationValidation
);

// Nouvelle route pour effectuer la logique de validation
router.put(
    "/admin/reservations/:id/approve",
    authAdmin,
    reservationsController.validateReservation
);
router.get(
    "/admin/testimonials/count",
    authAdmin,
    testimonialsController.getTestimonialsCount
);

router.get(
    "/admin/reservations/count",
    authAdmin,
    reservationsController.getReservationsCount
);
router.get(
    "/admin/newsletter/count",
    authAdmin,
    newsletterController.getNewsletterCount
);

router.post(
    "/admin/send-bulk",
    authAdmin,
    newsletterController.sendBulkNewsletterEmail
);



module.exports = router;
