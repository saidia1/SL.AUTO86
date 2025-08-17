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
    tr.innerHTML = `
      <td>${nomAffiche}</td>
      <td>${d.service}</td>
      <td>${d.date}</td>
      <td>${d.statut}</td>
      <td>
        ${d.statut === 'en attente' ? `<button onclick="valider(${d.id})">Valider</button> <button onclick="refuser(${d.id})">Refuser</button>` : ''}
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
