const router = require("express").Router();
const userCtrl = require("../controllers/users.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Ces deux routes demandent obligatoirement d'être connecté via le token
router.get("/me", authMiddleware, userCtrl.getProfile);
router.put("/me", authMiddleware, userCtrl.updateProfile);

module.exports = router;