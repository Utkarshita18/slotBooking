document.addEventListener('DOMContentLoaded', function(){
    const bookSlotLink = document.getElementById('bookSlotLink');
    if (bookSlotLink) {
        bookSlotLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'book.html';
        });
    } else {
        console.error('Element with ID "bookSlotLink" not found.');
    }

    const viewCalendarLink = document.getElementById('viewCalendarLink');
    if (viewCalendarLink) {
        viewCalendarLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'calendar.html';
        });
    } else {
        console.error('Element with ID "viewCalendarLink" not found.');
    }

    const viewTableLink = document.getElementById('viewTableLink');
    if (viewTableLink) {
        viewTableLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'table.html';
        });
    } else {
        console.error('Element with ID "viewTableLink" not found.');
    }
    document.getElementById('bookSlotForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const facultyName = document.getElementById('facultyName').value;
        const course = document.getElementById('course').value;
        const year = document.getElementById('year').value;
        const type = document.getElementById('type').value;
        const date = document.getElementById('date').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;

        const response = await fetch('/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ facultyName, course, year, type, date, startTime, endTime })
        });

        const result = await response.json();
        alert(result.message);
        loadBookings(); // Refresh bookings after successful submission
    });


})

async function loadBookings() {
    console.log('Loading bookings...');
    const response = await fetch('/all');
    const bookings = await response.json();
    console.log('Bookings:', bookings);
    const tbody = document.querySelector('#slotTable tbody');
    if (!tbody) {
        console.error('Table body element not found');
        return;
    }
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
}

async function deleteBooking(id) {
    console.log('Deleting booking with ID:', id);
    if (confirm('Do you want to delete this slot?')) {
        try {
            const response = await fetch(`/delete/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                // Check if the response is HTML
                const text = await response.text();
                console.error('Error response:', text);
                throw new Error('Failed to delete booking');
            }

            const result = await response.json();
            alert(result.message);
            loadBookings();
            loadCalendar();
        } catch (error) {
            console.error('Error deleting booking: ', error);
            alert('Failed to delete booking. Please try again.');
        }
    }
}
