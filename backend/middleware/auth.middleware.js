const jwt = require("jsonwebtoken");
const pool = require("../config/db");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token manquant" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token invalide" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Le token JWT peut rester valide jusqu'à 24h après sa création, même si
        // l'utilisateur qu'il référence a entre-temps disparu de la base
        // (ex: réinitialisation de la BDD en dev/docker). Sans cette vérification,
        // les routes protégées en aval (avis, profil...) plantent avec une erreur
        // de contrainte de clé étrangère au lieu de demander une reconnexion propre.
        const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [decoded.id]);
        if (userCheck.rows.length === 0) {
            return res.status(401).json({
                error: "Votre session n'est plus valide. Veuillez vous reconnecter.",
                code: "STALE_SESSION"
            });
        }

        req.user = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ error: "Non autorisé" });
    }
};