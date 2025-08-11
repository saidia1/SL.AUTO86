function initializeCalendar() {
    const calendarElement = document.getElementById('calendar');
    const date = new Date();
    
    // Set the current month and year
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Render the calendar for the current month
    renderCalendar(month, year, calendarElement);
}

function renderCalendar(month, year, calendarElement) {
    // Clear previous calendar
    calendarElement.innerHTML = '';

    // Create header for the calendar
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `<h2>${getMonthName(month)} ${year}</h2>`;
    calendarElement.appendChild(header);

    // Create days of the week header
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysHeader = document.createElement('div');
    daysHeader.className = 'days-row';
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.innerText = day;
        daysHeader.appendChild(dayElement);
    });
    calendarElement.appendChild(daysHeader);

    // Calculate the first day of the month and the number of days in the month
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Create weeks
    let currentDay = 1;
    for (let week = 0; week < 6; week++) { // max 6 weeks in a month
        const weekRow = document.createElement('div');
        weekRow.className = 'days-row';
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            if (week === 0 && dayOfWeek < firstDay) {
                // Empty slots before first day
                const emptySlot = document.createElement('div');
                emptySlot.className = 'day empty';
                weekRow.appendChild(emptySlot);
            } else if (currentDay > totalDays) {
                // Empty slots after last day
                const emptySlot = document.createElement('div');
                emptySlot.className = 'day empty';
                weekRow.appendChild(emptySlot);
            } else {
                // Actual day
                const dayElement = document.createElement('div');
                dayElement.className = 'day';
                dayElement.innerText = currentDay;
                dayElement.onclick = () => scheduleAppointment(year, month, currentDay);
                weekRow.appendChild(dayElement);
                currentDay++;
            }
        }
        calendarElement.appendChild(weekRow);
        if (currentDay > totalDays) break;
    }
}

function getMonthName(month) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
}

function scheduleAppointment(year, month, day) {
    // Logic to schedule an appointment
    alert(`Appointment scheduled for ${day}/${month + 1}/${year}`);
}

// Initialize the calendar when the script loads
document.addEventListener('DOMContentLoaded', initializeCalendar);