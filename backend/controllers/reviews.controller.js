const pool = require("../config/db");

// Récupérer les avis d'un lieu spécifique
exports.getPlaceReviews = async (req, res) => {
    try {
        const { placeId } = req.params;
        const result = await pool.query(
            `SELECT r.id, r.rating, r.comment, r.created_at, p.username 
             FROM reviews r
             JOIN profiles p ON r.user_id = p.user_id
             WHERE r.place_id = $1 ORDER BY r.created_at DESC`,
            [placeId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erreur getPlaceReviews:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Créer ou mettre à jour un avis (Bloqué si non connecté)
exports.createOrUpdateReview = async (req, res) => {
    try {
        const userId = req.user.id; // Injecté par authMiddleware
        const { place_id, rating, comment } = req.body;

        if (!place_id || !rating) {
            return res.status(400).json({ error: "Lieu et note obligatoires" });
        }

        // Insère l'avis ou le met à jour s'il existe déjà (ON CONFLICT grâce à l'index UNIQUE)
        const result = await pool.query(
            `INSERT INTO reviews (user_id, place_id, rating, comment)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, place_id) 
             DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [userId, place_id, rating, comment]
        );

        res.status(200).json({ message: "Avis enregistré avec succès !", review: result.rows[0] });
    } catch (err) {
        console.error("Erreur createOrUpdateReview:", err);
        res.status(500).json({ error: "Erreur serveur lors de l'enregistrement de l'avis" });
    }
};