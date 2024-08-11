document.addEventListener('DOMContentLoaded', async () => {
    const calendarEl = document.getElementById('calendar');
    const response = await fetch('/all');
    const bookings = await response.json()
    console.log(bookings);
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
        events: bookings.map(booking => ({
            title: `${booking.facultyName} - ${booking.course} (${booking.year}) (${booking.type}) (${booking.date})`,
            start: `${booking.date}T${booking.startTime}`,
            end: `${booking.date}T${booking.endTime}`,
            id: booking.id,
            backgroundColor: booking.type === 'IA' ? '#28a745' : '#007bff',
            borderColor: booking.type === 'IA' ? '#28a745' : '#007bff'
        })),
            
    });

    calendar.render();
    
});


// In calendar.js or table.js
document.getElementById('backToHome').addEventListener('click', () => {
    window.location.href = 'index.html';
});