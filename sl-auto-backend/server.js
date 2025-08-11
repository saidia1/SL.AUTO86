const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;
const DATA_FILE = './rdvs.json';

app.use(cors());
app.use(express.json());

// Helper pour lire/écrire le fichier
function readRdvs() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeRdvs(rdvs) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(rdvs, null, 2));
}

// GET: liste tous les rdvs
app.get('/rdvs', (req, res) => {
  res.json(readRdvs());
});

// POST: ajoute un rdv
app.post('/rdvs', (req, res) => {
  const rdvs = readRdvs();
  const rdv = { ...req.body, statut: 'en attente', id: Date.now() };
  rdvs.push(rdv);
  writeRdvs(rdvs);
  res.status(201).json(rdv);
});

// PATCH: modifie le statut d'un rdv
app.patch('/rdvs/:id', (req, res) => {
  const rdvs = readRdvs();
  const idx = rdvs.findIndex(r => r.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  rdvs[idx].statut = req.body.statut;
  writeRdvs(rdvs);
  res.json(rdvs[idx]);
});

app.listen(PORT, () => console.log('Serveur RDV sur http://localhost:' + PORT));