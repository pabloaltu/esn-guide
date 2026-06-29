const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token manquant" });
        }

        // Format attendu: "Bearer TOKEN"
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Token invalide" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // on stocke user dans req

        next(); // autorise accès à la route

    } catch (err) {
        return res.status(401).json({ error: "Non autorisé" });
    }
};