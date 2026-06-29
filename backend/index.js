const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

app.get('/api/places', async (req, res) => {
    try {
        const { district } = req.query;
        let queryText = 'SELECT * FROM places';
        let queryParams = [];

        if (district) {
            queryText += ' WHERE LOWER(district) = LOWER($1)';
            queryParams.push(district);
        }

        queryText += ' ORDER BY views_count DESC';

        const result = await pool.query(queryText, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.listen(PORT, () => {
    console.log(`Le serveur Backend tourne sur le port ${PORT}`);
});