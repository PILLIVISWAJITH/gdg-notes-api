const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === 'admin' ? 'admin' : 'user';

        db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
            [username, hashedPassword, userRole],
            function(err) {
                if (err) return res.status(400).json({ error: 'Username already exists' });
                res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in', token });
    });
});

module.exports = router;
