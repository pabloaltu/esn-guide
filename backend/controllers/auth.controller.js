const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const password_hash = await bcrypt.hash(password, 10);

        // 1. On commence une transaction pour être sûr que tout se passe bien
        await pool.query("BEGIN");

        // 2. Insérer dans 'users'
        const userResult = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
            [email, password_hash]
        );
        const userId = userResult.rows[0].id;

        // 3. Insérer automatiquement dans 'profiles' avec le même ID
        await pool.query(
            "INSERT INTO profiles (user_id, username) VALUES ($1, $2)",
            [userId, username || email.split('@')[0]]
        );

        await pool.query("COMMIT"); // Valider tout
        res.status(201).json({ message: "Compte créé avec succès !" });
    } catch (err) {
        await pool.query("ROLLBACK"); // Annuler si erreur
        res.status(500).json({ error: "Erreur lors de la création du compte" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Veuillez remplir tous les champs" });
        }

        // 1. Chercher l'utilisateur
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Identifiants incorrects" });
        }

        const user = userResult.rows[0];

        // 2. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: "Identifiants incorrects" });
        }

        // 3. Récupérer les infos de son profil pour le Front-end
        const profileResult = await pool.query("SELECT username, avatar_url, isic_number FROM profiles WHERE user_id = $1", [user.id]);
        const profile = profileResult.rows[0];

        // 4. Générer le Token de session JWT (expire dans 24 heures)
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // 5. Renvoyer le token et les infos au Front-end
        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: profile.username,
                avatar_url: profile.avatar_url,
                isic_number: profile.isic_number
            }
        });

    } catch (err) {
        console.error("Erreur connexion:", err);
        res.status(500).json({ error: "Erreur serveur lors de la connexion" });
    }
};