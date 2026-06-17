const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Autorise ton frontend React à communiquer avec l'API
app.use(cors());
app.use(express.json());

// Une route de test simple
app.get('/', (req, res) => {
    res.json({ message: "API ESN Guide fonctionnelle et connectée !" });
});

app.listen(PORT, () => {
    console.log(`Le serveur Backend tourne sur le port ${PORT}`);
});