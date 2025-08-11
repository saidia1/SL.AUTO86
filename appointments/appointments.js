// Utilitaire pour formater une date en français
function formatDateFr(date) {
    const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const d = new Date(date);
    const jour = jours[d.getDay()];
    const jourNum = d.getDate();
    const moisNom = mois[d.getMonth()];
    const annee = d.getFullYear();
    return `${jour} ${jourNum} ${moisNom} ${annee}`;
}
export function scheduleAppointment(appointmentData) {
    // Validate appointment data
    if (!validateAppointmentData(appointmentData)) {
        alert("Veuillez remplir tous les champs requis.");
        return;
    }

    // Empêche la sélection d'une date dans le passé, le weekend, ou moins de 24h avant
    const selectedDate = new Date(appointmentData.date);
    const now = new Date();
    now.setSeconds(0,0);
    // Date dans le passé
    if (selectedDate < now) {
        alert("Impossible de prendre rendez-vous dans le passé.");
        return;
    }
    // Weekend
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        alert("Impossible de prendre rendez-vous le week-end.");
        return;
    }
    // Moins de 24h avant intervention
    const diffMs = selectedDate - now;
    if (diffMs < 24*60*60*1000) {
        alert("Impossible de prendre rendez-vous moins de 24h avant l'intervention.");
        return;
    }
    // Empêche la sélection d'une heure après 16h
    if (appointmentData.time) {
        const hour = parseInt(appointmentData.time.split(":")[0], 10);
        if (hour >= 17) {
            alert("Les rendez-vous ne sont possibles que jusqu'à 16h.");
            return;
        }
    }

    // Envoi au backend
    // Ajoute le champ 'nom' pour compatibilité admin
    const dataToSend = { ...appointmentData, nom: appointmentData.lastname };
    fetch('http://localhost:3001/rdvs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        if (!response.ok) throw new Error('Erreur lors de la prise de rendez-vous');
        return response.json();
    })
    .then(data => {
        alert(`Votre rendez-vous a été enregistré pour le ${formatDateFr(appointmentData.date)} !`);
        console.log("RDV enregistré:", data);
    })
    .catch(err => {
        alert("Erreur serveur: " + err.message);
    });
}

function validateAppointmentData(data) {
    // Vérifie tous les champs requis
    return data.lastname && data.firstname && data.vehicule && data.categorie && data.email && data.phone && data.date && data.service;
}

export function getAvailableTimes(date) {
    // Empêche la sélection du weekend et des dates dans le passé
    const selectedDate = new Date(date);
    const now = new Date();
    now.setSeconds(0,0);
    // Bloque les dates passées
    if (selectedDate < now) return [];
    const dayOfWeek = selectedDate.getDay();
    // Interdiction stricte : aucun créneau si samedi ou dimanche
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return [];
    }

    // Plage horaire de 9h à 16h (format français)
    const availableTimes = [];
    for (let hour = 9; hour <= 16; hour++) {
        let displayHour = hour < 10 ? `0${hour}` : `${hour}`;
        // Si la date est aujourd'hui, bloque les horaires déjà passés
        if (selectedDate.toDateString() === now.toDateString() && hour <= now.getHours()) continue;
        availableTimes.push(`${displayHour}:00`);
    }
    return availableTimes;
}