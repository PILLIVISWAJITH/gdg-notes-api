const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./database');
const authRoutes = require('./auth');
const notesRoutes = require('./notes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the GDG Notes API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
