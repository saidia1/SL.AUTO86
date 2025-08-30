// Script Node.js pour injecter les rendez-vous du fichier rdvs.json dans MongoDB
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sl-auto';
const rdvsPath = path.join(__dirname, 'rdvs.json');

const rdvSchema = new mongoose.Schema({
  lastname: String,
  firstname: String,
  vehicule: String,
  categorie: String,
  email: String,
  phone: String,
  service: String,
  date: String,
  statut: { type: String, default: 'en attente' },
  id: Number
});
const Rdv = mongoose.model('Rdv', rdvSchema);

async function importRdvs() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const data = JSON.parse(fs.readFileSync(rdvsPath, 'utf-8'));
  if (!Array.isArray(data)) throw new Error('rdvs.json doit être un tableau');
  // On évite les doublons sur le champ id
  for (const rdv of data) {
    await Rdv.findOneAndUpdate({ id: rdv.id }, rdv, { upsert: true, new: true });
  }
  console.log('Import terminé.');
  await mongoose.disconnect();
}

importRdvs().catch(e => { console.error(e); process.exit(1); });
