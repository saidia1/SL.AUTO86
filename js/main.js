// Collecte et envoi des données du formulaire RDV
document.getElementById('rdv-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const appointmentData = {
        lastname: document.getElementById('lastname').value.trim(),
        firstname: document.getElementById('firstname').value.trim(),
        vehicule: document.getElementById('vehicule').value.trim(),
        categorie: document.getElementById('categorie').value,
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        date: document.getElementById('date').value.trim()
    };
    import('./appointments/appointments.js').then(mod => {
        mod.scheduleAppointment(appointmentData);
    });
});
document.addEventListener('DOMContentLoaded', function() {

  const form = document.getElementById('rdv-form');
  const rdvList = document.getElementById('rdv-list');

  // Affiche les rendez-vous validés depuis le backend
  function afficherRdvValidesBackend() {
    if (!rdvList) return;
    rdvList.innerHTML = '';
    fetch('http://localhost:3001/rdvs')
      .then(res => res.json())
      .then(rdvs => {
        rdvs.filter(r => r.statut === 'validé').forEach(rdv => {
          const li = document.createElement('li');
          li.textContent = `${rdv.date}`;
          rdvList.appendChild(li);
        });
      })
      .catch(() => {
        const li = document.createElement('li');
        li.textContent = 'Erreur de chargement du planning.';
        rdvList.appendChild(li);
      });
  }

  afficherRdvValidesBackend();

  if(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const nom = document.getElementById('name').value;
      const service = document.getElementById('service').value;
      const date = document.getElementById('date').value;
      if (nom && service && date) {
        fetch('http://localhost:3001/rdvs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom, service, date })
        })
        .then(res => res.json())
        .then(data => {
          form.reset();
          alert('Votre demande de rendez-vous a été envoyée et sera validée par l\'administrateur.');
          showRdvConfirmation(date);
        })
        .catch(() => {
          alert('Erreur lors de l\'envoi du rendez-vous. Merci de réessayer.');
        });
      }
    });
  }
});

function showRdvConfirmation(dateStr) {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.background = '#23272a';
  popup.style.color = '#fff';
  popup.style.padding = '32px 24px';
  popup.style.borderRadius = '18px';
  popup.style.boxShadow = '0 4px 32px #eab30899';
  popup.style.zIndex = '99999';
  popup.style.fontSize = '1.3rem';
  popup.innerHTML = `<strong>✅ Rendez-vous pris !</strong><br><br>Votre rendez-vous a été enregistré pour le <span style='color:#eab308'>${dateStr}</span>.`;
  document.body.appendChild(popup);
  setTimeout(() => { popup.remove(); }, 3500);
}