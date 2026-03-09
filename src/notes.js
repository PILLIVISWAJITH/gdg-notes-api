const express = require('express');
const db = require('./database');
const { authenticateToken } = require('./middleware');
const router = express.Router();

router.use(authenticateToken);

router.post('/', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

    db.run(`INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)`,
        [title, content, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json({ id: this.lastID, title, content, user_id: req.user.id });
        }
    );
});

router.get('/', (req, res) => {
    if (req.user.role === 'admin') {
        db.all(`SELECT * FROM notes`, [], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(rows);
        });
    } else {
        db.all(`SELECT * FROM notes WHERE user_id = ?`, [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(rows);
        });
    }
});

router.put('/:id', (req, res) => {
    const { title, content } = req.body;
    const noteId = req.params.id;

    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

    db.run(`UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
        [title, content, noteId, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (this.changes === 0) return res.status(404).json({ error: 'Note not found or unauthorized' });
            res.json({ message: 'Note updated successfully' });
        }
    );
});

router.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    const query = req.user.role === 'admin' 
        ? `DELETE FROM notes WHERE id = ?`
        : `DELETE FROM notes WHERE id = ? AND user_id = ?`;
    const params = req.user.role === 'admin' ? [noteId] : [noteId, req.user.id];

    db.run(query, params, function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Note not found or unauthorized' });
        res.json({ message: 'Note deleted successfully' });
    });
});

module.exports = router;
