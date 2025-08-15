const API_URL = "https://sl-auto86.onrender.com/rdvs";

document.addEventListener("DOMContentLoaded", () => {
	fetch(API_URL)
		.then(response => response.json())
		.then(data => {
			const tbody = document.querySelector("#rdv-table tbody");
			tbody.innerHTML = "";
			data.forEach(rdv => {
				const tr = document.createElement("tr");
				let statutColor = '';
				if (rdv.statut === 'validé') statutColor = 'style="color:green;font-weight:bold"';
				else if (rdv.statut === 'refusé') statutColor = 'style="color:red;font-weight:bold"';
				else statutColor = 'style="color:orange;font-weight:bold"';
				tr.innerHTML = `
					<td>${rdv.lastname || ""}</td>
					<td>${rdv.firstname || ""}</td>
					<td>${rdv.phone || ""}</td>
					<td>${rdv.email || ""}</td>
					<td>${rdv.service || ""}</td>
					<td ${statutColor}>${rdv.date || ""}</td>
					<td>
						${rdv.statut === 'en attente' ? `
						<button class="valider-btn" data-id="${rdv._id}" style="background:#22c55e;color:#fff;border:none;padding:6px 14px;border-radius:6px;margin-right:6px;cursor:pointer;">Valider</button>
						<button class="refuser-btn" data-id="${rdv._id}" style="background:#ef4444;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;">Refuser</button>
						` : '<span style="color:#888;">-</span>'}
					</td>
				`;
				tbody.appendChild(tr);
			});

			// Ajout des listeners pour les boutons Valider/Refuser
			document.querySelectorAll('.valider-btn').forEach(btn => {
				btn.addEventListener('click', function() {
					const id = this.getAttribute('data-id');
					fetch(`${API_URL}/${id}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ statut: 'validé' })
					})
					.then(res => res.json())
					.then(() => location.reload())
					.catch(err => alert('Erreur lors de la validation'));
				});
			});
			document.querySelectorAll('.refuser-btn').forEach(btn => {
				btn.addEventListener('click', function() {
					const id = this.getAttribute('data-id');
					fetch(`${API_URL}/${id}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ statut: 'refusé' })
					})
					.then(res => res.json())
					.then(() => location.reload())
					.catch(err => alert('Erreur lors du refus'));
				});
			});
		})
		.catch(error => {
			console.error("Erreur lors de la récupération des rendez-vous :", error);
		});
});
