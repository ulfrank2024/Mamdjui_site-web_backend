const express = require("express");
const testimonialsController = require("../controllers/testimonialsController");

const router = express.Router();

router.get("/testimonials", testimonialsController.getApprovedTestimonials);
router.post("/testimonials", testimonialsController.addTestimonial);
router.post("/testimonials/:id/like", testimonialsController.likeTestimonial);
router.get(
    "/testimonials/:id/likes",
    testimonialsController.getTestimonialLikes
);
module.exports = router;
