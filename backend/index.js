require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// ===== LOGS DE SÉCURITÉ POUR VOIR SI DOCKER REBOOTE =====
console.log("🔥 ATTENTION : Le nouveau index.js avec la route racine vient de démarrer !");

// ===== ROUTE RACINE PLACÉE EN PREMIER ACCÈS =====
app.get('/', (req, res) => {
    return res.status(200).json({
        status: "success",
        message: "🚀 GG bruh! You did it !"
    });
});

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== IMPORTS DES ROUTES =====
const placesRoutes = require('./routes/places.routes');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const reviewsRoutes = require("./routes/reviews.routes");

// ===== ENREGISTREMENT DES ROUTES =====
app.use('/api/places', placesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use("/api/reviews", reviewsRoutes);

// ===== START SERVER =====
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur backend sur http://localhost:${PORT}`);
});