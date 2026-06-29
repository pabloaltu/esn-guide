const router = require("express").Router();
const ctrl = require("../controllers/places.controller");

router.get("/", ctrl.getAllPlaces);
router.get("/:id", ctrl.getPlaceById);
router.post("/", ctrl.createPlace);
router.put("/:id", ctrl.updatePlace);
router.delete("/:id", ctrl.deletePlace);

module.exports = router;