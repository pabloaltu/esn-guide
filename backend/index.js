require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== DATABASE =====
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test connexion DB au démarrage
pool.connect()
    .then(() => console.log("✅ Connecté à PostgreSQL"))
    .catch((err) => console.error("❌ Erreur DB :", err));

// ===== ROUTES =====

// GET /api/places
app.get('/api/places', async (req, res) => {
    try {
        const { district } = req.query;

        let queryText = `
            SELECT *
            FROM places
        `;

        const queryParams = [];

        if (district) {
            queryText += ` WHERE LOWER(district) = LOWER($1)`;
            queryParams.push(district);
        }

        queryText += ` ORDER BY views_count DESC`;

        const result = await pool.query(queryText, queryParams);

        res.status(200).json(result.rows);

    } catch (err) {
        console.error("❌ Erreur /api/places :", err);
        res.status(500).json({
            error: "Erreur serveur"
        });
    }
});

// Route test
app.get('/', (req, res) => {
    res.send("🚀 Backend ESN Guide OK");
});

// ===== START SERVER =====
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur backend sur http://localhost:${PORT}`);
});