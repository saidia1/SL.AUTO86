// Injecte dynamiquement le footer SL AUTO sur toutes les pages
fetch('footer.html')
  .then(response => response.text())
  .then(html => {
    document.querySelectorAll('#footer-placeholder').forEach(el => {
      el.outerHTML = html;
    });
  });
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
  // Animation ripple sur tous les liens de menu (nav a)
  document.querySelectorAll('nav a, .mechanic-nav a').forEach(link => {
    link.addEventListener('pointerdown', function(e) {
      // Ne déclenche le ripple que pour un vrai clic utilisateur (évite focus/chargement)
      if (e.isTrusted && (e.button === 0 || e.pointerType === 'touch')) {
        const ripple = document.createElement('span');
        ripple.className = 'menu-ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
        this.style.position = 'relative';
        this.appendChild(ripple);
        setTimeout(() => { ripple.remove(); }, 600);
      }
    });
  });

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

// Style ripple menu (à ajouter dynamiquement si pas déjà dans le CSS)
if (!document.getElementById('menu-ripple-style')) {
  const style = document.createElement('style');
  style.id = 'menu-ripple-style';
  style.textContent = `
    .menu-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(234,179,8,0.25);
      transform: scale(0);
      animation: menu-ripple-anim 0.6s cubic-bezier(.4,2,.6,1);
      pointer-events: none;
      z-index: 2;
    }
    @keyframes menu-ripple-anim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

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