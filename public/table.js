document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/all');
    const bookings = await response.json();
    const tbody = document.querySelector('#slotTable tbody');
    tbody.innerHTML = '';
    bookings.forEach(booking => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${booking.facultyName}</td>
            <td>${booking.course}</td>
            <td>${booking.year}</td>
            <td>${booking.type}</td>
            <td>${booking.date}</td>
            <td>${booking.startTime}</td>
            <td>${booking.endTime}</td>
            <td><button class="btn" onclick="deleteBooking(${booking.id})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
});


async function deleteBooking(id) {
    if (confirm('Do you want to delete this slot?')) {
        try {
            const response = await fetch(`/delete/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const text = await response.text();
                console.error('Error response:', text);
                alert('Failed to delete booking');
                return;
            }
            const result = await response.json();
            alert(result.message);
            location.reload(); // Reload the page to refresh the table data
        } catch (error) {
            console.error('Error deleting booking: ', error);
            alert('Failed to delete booking. Please try again.');
        }
    }
}

// In calendar.js or table.js
document.getElementById('backToHome').addEventListener('click', () => {
    window.location.href = 'index.html';
});