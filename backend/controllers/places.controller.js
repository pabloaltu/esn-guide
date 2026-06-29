const pool = require("../config/db");

// Récupérer tous les lieux (avec filtre district optionnel)
exports.getAllPlaces = async (req, res) => {
    try {
        const { district } = req.query;
        let queryText = `SELECT * FROM places`;
        const queryParams = [];

        if (district) {
            queryText += ` WHERE LOWER(district) = LOWER($1)`;
            queryParams.push(district);
        }

        queryText += ` ORDER BY views_count DESC`;
        const result = await pool.query(queryText, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("❌ Erreur getAllPlaces :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Récupérer un lieu par son ID unique
exports.getPlaceById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM places WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Lieu introuvable" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("❌ Erreur getPlaceById :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Créer un nouveau lieu
exports.createPlace = async (req, res) => {
    try {
        const { name, latitude, longitude, category, district, external_link, has_isic_discount } = req.body;
        const result = await pool.query(
            `INSERT INTO places (name, latitude, longitude, category, district, external_link, has_isic_discount) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, latitude, longitude, category, district, external_link, has_isic_discount || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("❌ Erreur createPlace :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Mettre à jour un lieu existant
exports.updatePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, latitude, longitude, category, district, external_link, has_isic_discount } = req.body;
        const result = await pool.query(
            `UPDATE places SET name=$1, latitude=$2, longitude=$3, category=$4, district=$5, external_link=$6, has_isic_discount=$7 
             WHERE id=$8 RETURNING *`,
            [name, latitude, longitude, category, district, external_link, has_isic_discount, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("❌ Erreur updatePlace :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Supprimer un lieu
exports.deletePlace = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM places WHERE id = $1", [id]);
        res.status(200).json({ message: "Lieu supprimé avec succès" });
    } catch (err) {
        console.error("❌ Erreur deletePlace :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};