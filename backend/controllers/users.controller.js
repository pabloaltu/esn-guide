const pool = require("../config/db");

// Récupérer le profil de l'utilisateur actuellement connecté
exports.getProfile = async (req, res) => {
    try {
        // req.user est injecté par ton auth.middleware.js
        const userId = req.user.id; 

        const result = await pool.query(
            "SELECT username, avatar_url, has_isic_card FROM profiles WHERE user_id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profil introuvable" });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error("Erreur getProfile:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Mettre à jour son pseudo ou sa carte ISIC
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, avatar_url, has_isic_card } = req.body;

        const result = await pool.query(
            `UPDATE profiles 
             SET username = COALESCE($1, username), 
                 avatar_url = COALESCE($2, avatar_url), 
                 has_isic_card = COALESCE($3, has_isic_card),
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $4 RETURNING username, avatar_url, has_isic_card`,
            [username, avatar_url, has_isic_card, userId]
        );

        res.status(200).json({
            message: "Profil mis à jour !",
            profile: result.rows[0]
        });

    } catch (err) {
        console.error("Erreur updateProfile:", err);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour" });
    }
};