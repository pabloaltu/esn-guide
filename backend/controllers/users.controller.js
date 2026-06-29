const pool = require("../config/db");

// Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            "SELECT u.id, u.email, u.role, p.username, p.avatar_url, p.age, p.gender, p.school, p.isic_number FROM users u JOIN profiles p ON u.id = p.user_id WHERE u.id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User profile not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error in getProfile:", err);
        res.status(500).json({ error: "Server error while fetching profile" });
    }
};

// Mettre à jour (ou créer automatiquement si manquant) le profil
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { birth_date, gender, school, isic_number } = req.body;

        // 1. Calcul dynamique de l'âge en années
        let age = null;
        if (birth_date) {
            const today = new Date();
            const birth = new Date(birth_date);
            age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
        }

        // 2. Tenter de mettre à jour le profil existant
        let result = await pool.query(
            `UPDATE profiles 
             SET age = $1, gender = $2, school = $3, isic_number = $4, updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = $5 
             RETURNING *`,
            [age, gender, school, isic_number, userId]
        );

        // 3. SECOURS AUTOMATIQUE : Si aucune ligne n'a été modifiée, on la crée !
        if (result.rows.length === 0) {
            console.log(`⚠️ Profile missing for user ID ${userId}. Creating it automatically...`);
            
            // On récupère le pseudo ou on met une valeur par défaut "Student"
            const userCheck = await pool.query("SELECT email FROM users WHERE id = $1", [userId]);
            const defaultUsername = userCheck.rows.length > 0 ? userCheck.rows[0].email.split('@')[0] : "Student";

            result = await pool.query(
                `INSERT INTO profiles (user_id, username, age, gender, school, isic_number) 
                 VALUES ($1, $2, $3, $4, $5, $6) 
                 RETURNING *`,
                [userId, defaultUsername, age, gender, school, isic_number]
            );
        }

        res.status(200).json({ 
            message: "Profile successfully updated!", 
            user: result.rows[0] 
        });
    } catch (err) {
        console.error("Error in updateProfile:", err);
        res.status(500).json({ error: "Server error during profile update" });
    }
};