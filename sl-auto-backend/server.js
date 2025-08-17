
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

// Connexion à MongoDB Atlas via variable d'environnement
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));

// Schéma Mongoose pour un rendez-vous
const rdvSchema = new mongoose.Schema({
  lastname: String,
  firstname: String,
  vehicule: String,
  categorie: String,
  email: String,
  phone: String,
  service: String,
  date: String,
  statut: { type: String, default: 'en attente' }
});
const Rdv = mongoose.model('Rdv', rdvSchema);

app.use(cors({
  origin: [
    "https://saidia1.github.io",
    "https://saidia1.github.io/SL.AUTO86"
  ],
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// GET: liste tous les rdvs
app.get('/rdvs', async (req, res) => {
  try {
    const rdvs = await Rdv.find();
    res.json(rdvs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST: ajoute un rdv
app.post('/rdvs', async (req, res) => {
  try {
    const rdv = new Rdv({ ...req.body });
    await rdv.save();
    res.status(201).json(rdv);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH: modifie le statut d'un rdv
app.patch('/rdvs/:id', async (req, res) => {
  try {
    const rdv = await Rdv.findByIdAndUpdate(req.params.id, { statut: req.body.statut }, { new: true });
    if (!rdv) return res.status(404).json({ error: 'Not found' });
    res.json(rdv);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(PORT, () => console.log('Serveur RDV (MongoDB) sur http://localhost:' + PORT));