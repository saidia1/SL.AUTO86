const API_URL = "https://sl-auto86.onrender.com/rdvs";

document.addEventListener("DOMContentLoaded", () => {
	fetch(API_URL)
		.then(response => response.json())
		.then(data => {
			const tbody = document.querySelector("#rdv-table tbody");
			tbody.innerHTML = "";
			data.forEach(rdv => {
				const tr = document.createElement("tr");
				tr.innerHTML = `
					<td>${rdv.lastname || ""} ${rdv.firstname || ""}</td>
					<td>${rdv.email || ""}</td>
					<td>${rdv.phone || ""}</td>
					<td>${rdv.date || ""}</td>
					<td>${rdv.service || ""}</td>
					<td>${rdv.statut || ""}</td>
					<td>
						<button class="valider-btn" data-id="${rdv._id}">Valider</button>
						<button class="refuser-btn" data-id="${rdv._id}">Refuser</button>
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
