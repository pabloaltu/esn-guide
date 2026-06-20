const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Importe le client PostgreSQL

const app = express();
const PORT = process.env.PORT || 8000;

// Configuration de la connexion PostgreSQL en utilisant la variable d'environnement de Docker
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

// 1. Route de test (Ancienne route)
app.get('/', (req, res) => {
    res.json({ message: "API ESN Guide fonctionnelle et connectée !" });
});

// 2. NOUVELLE ROUTE : Récupérer tous les lieux pour la carte
app.get('/api/places', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM places');
        res.json(result.rows); // Renvoie les lieux au format JSON
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur lors de la récupération des lieux" });
    }
});

app.listen(PORT, () => {
    console.log(`Le serveur Backend tourne sur le port ${PORT}`);
});