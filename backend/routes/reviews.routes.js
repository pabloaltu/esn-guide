const router = require("express").Router();
const reviewCtrl = require("../controllers/reviews.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Tout le monde peut voir les avis d'un lieu
router.get("/place/:placeId", reviewCtrl.getPlaceReviews);

// Il faut OBLIGATOIREMENT être connecté pour poster ou modifier son avis
router.post("/", authMiddleware, reviewCtrl.createOrUpdateReview);

module.exports = router;