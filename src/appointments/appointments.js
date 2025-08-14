
const API_URL = "https://sl-auto86.onrender.com/rdvs";

document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("rdv-form");
	if (!form) return;
	form.addEventListener("submit", function(e) {
		e.preventDefault();
		const formData = new FormData(form);
		const data = {};
		formData.forEach((value, key) => { data[key] = value; });
		fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		})
		.then(res => {
			if (res.ok) {
				document.getElementById("confirmation").style.display = "block";
				form.reset();
			} else {
				alert("Erreur lors de l'envoi du rendez-vous");
			}
		})
		.catch(() => alert("Erreur lors de l'envoi du rendez-vous"));
	});
});
