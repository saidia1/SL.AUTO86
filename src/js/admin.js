// Remplace cette URL par l'URL de ton backend Render si besoin
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
					<td>${rdv.nom || ""}</td>
					<td>${rdv.email || ""}</td>
					<td>${rdv.telephone || ""}</td>
					<td>${rdv.date || ""}</td>
					<td>${rdv.heure || ""}</td>
					<td>${rdv.message || ""}</td>
				`;
				tbody.appendChild(tr);
			});
		})
		.catch(error => {
			console.error("Erreur lors de la récupération des rendez-vous :", error);
		});
});
