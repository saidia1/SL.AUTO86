const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://127.0.0.1:3001'
  : 'https://sl-auto86.onrender.com'; // URL publique backend Render

let demandes = [];

function renderTable() {
  const tbody = document.querySelector('#admin-table tbody');
  tbody.innerHTML = '';
  demandes.forEach((d, i) => {
    const tr = document.createElement('tr');
    // Affiche 'nom' si présent, sinon 'lastname' (pour compatibilité)
    const nomAffiche = d.nom || d.lastname || '';
    const prenomAffiche = d.firstname || '';
    const emailAffiche = d.email || '';
    const phoneAffiche = d.phone || '';
    const serviceAffiche = d.service || '';
    const dateAffiche = d.date || '';
    const statutAffiche = d.statut || '';
    let badgeClass = '';
    if (statutAffiche.toLowerCase() === 'validé') badgeClass = 'badge badge-valide';
    else if (statutAffiche.toLowerCase() === 'refusé') badgeClass = 'badge badge-refuse';
    else badgeClass = 'badge badge-attente';
    // Affichage des boutons si statut "en attente" (insensible à la casse et accents)
    // Correction : enlever les accents et vérifier la présence de 'attente' (pour statuts comme 'en attente', 'En attente', etc.)
    const statutNettoye = (statutAffiche || '').toLowerCase().normalize('NFD').replace(/[^a-z]/g, "");
    const isAttente = statutNettoye.includes('attente');
    tr.innerHTML = `
      <td>${nomAffiche}</td>
      <td>${prenomAffiche}</td>
      <td>${emailAffiche}</td>
      <td>${phoneAffiche}</td>
      <td>${serviceAffiche}</td>
      <td>${dateAffiche}</td>
      <td><span class="${badgeClass}">${statutAffiche}</span></td>
      <td>
        ${isAttente ? `<button class='valider-btn' onclick="valider(${d._id || d.id})">Valider</button> <button class='refuser-btn' onclick="refuser(${d._id || d.id})">Refuser</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function chargerDemandes() {
  fetch(`${API_BASE}/rdvs`)
    .then(res => res.json())
    .then(data => {
      demandes = data;
      renderTable();
    })
    .catch(() => {
      alert('Erreur de chargement des rendez-vous.');
    });
}

window.valider = function(id) {
  fetch(`${API_BASE}/rdvs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ statut: 'validé' })
  })
    .then(() => chargerDemandes());
}
window.refuser = function(id) {
  fetch(`${API_BASE}/rdvs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ statut: 'refusé' })
  })
    .then(() => chargerDemandes());
}

chargerDemandes();
