const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get All Users
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// Create User
router.post('/create', (req, res) => {
    const { name, age, email, password } = req.body;
    db.query('INSERT INTO users  SET ?', { name, age, email, password }, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(201).json({ id: results.insertId, name, age });
    })
});

// Get User by ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.query(`SELECT * FROM users WHERE id = ${id}`, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(results);
    })
});

// Update User
router.put('/:id', (req, res) => {
    const { name, age, email } = req.body;
    const userId = req.params.id;
    db.query(`UPDATE users SET name = ?, age = ?,email= ?, WHERE id = ?`, [name, age, email, userId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ id: userId, name, age });
    })
});


// Delete User
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted' });
    });
});

module.exports = router


