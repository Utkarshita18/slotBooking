const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Database setup
const sequelize = new Sequelize('slot_management', 'root', 'utkarshita@18', {
    host: 'localhost',
    dialect: 'mysql'
});

// Define the Booking model
const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    facultyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    timestamps: false,
    uniqueKeys: {
        unique_startTime_endTime: {
            fields: ['date', 'startTime', 'endTime']
        }
    }
});

// Route to book a slot
app.post('/book', async (req, res) => {
    try {
        const { facultyName, course, year, type, date, startTime, endTime } = req.body;

        const booking = await Booking.create({
            facultyName, course, year, type, date, startTime, endTime
        });

        res.json({ message: 'Slot booked successfully!' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.json({ message: 'Slot already booked!' });
        } else {
            console.error('Error booking slot: ', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

// Route to get all bookings
app.get('/all', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            order : [['date','ASC'],['startTime','ASC']]
        });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings: ', error);
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a booking
app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`Deleting booking with ID: ${id}`); 
        const booking = await Booking.destroy({
            where: { id }
        });
        if (booking) {
            res.json({ message: 'Booking deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Booking not found!' });
        }
    } catch (error) {
        console.error('Error deleting booking: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Ensure database connection and start the server
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });