// Ajoute le bouton Déconnexion sur la page admin
// et gère la déconnexion (suppression du token + redirection)
document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('adminToken');
      window.location.href = 'admin-login.html';
    });
  }
});
