const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM movies', (err, result) => {
        if (err) {
            res.status(500).json(err)
        }
        res.json(result)
    })
});

router.post('/create', (req, res) => {
    const { name, age_group, price } = req.body;
    db.query(`INSERT INTO movies SET ?`, { name, age_group, price }, (err, result) => {
        if (err) {
            res.status(500).json(err)
        }
        res.status(201).json({ id: result.insertId, name, age_group, price });
    })
});

module.exports = router