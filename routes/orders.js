const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM orders', (err, result) => {
        if (err) {
            res.status(500).json(err)
        }
        res.json(result);
    })
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM orders WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Check if any order was found
        if (result.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(result[0]);
    });
});


router.post('/create/:movie_id', (req, res) => {
    const movie_id = req.params.movie_id;
    const { user_id, price, quantity } = req.body;

    // Use a JOIN to fetch movie and user information in one query
    const query = `
        SELECT m.*, u.age AS user_age
        FROM movies m
        JOIN users u ON u.id = ?
        WHERE m.id = ?;
    `;

    db.query(query, [user_id, movie_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Check if the movie or user was found
        if (results.length === 0) {
            return res.status(404).json({ message: 'Movie or User not found' });
        }

        const movie = results[0];
        const user_age = results[0].user_age;

        // Check if the user is in the target age group
        if (user_age < movie.age_group) {
            return res.status(400).json({ message: 'User is not in the target age group' });
        }

        // Insert the order
        db.query('INSERT INTO orders SET ?', { movie_id, user_id, price, quantity }, (err) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(400).json({ message: 'Invalid data provided' });
            }
            res.status(201).json({ message: "Order Created Successfully" });
        });
    });
});




module.exports = router;