const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { generateToken } = require('../utils/jwtUtils');

router.post('/register', async (req, res) => {
    const { name, email, age, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const query = `SELECT * FROM users WHERE email = ?;`;
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(400).json({ message: 'Invalid data provided' });
            }
            if (results.length > 0) {
                return res.status(409).json({ success: false, message: 'Email already exists' });
            }

            const insertQuery = `INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?);`;
            db.query(insertQuery, [name, email, hashPassword, age], (err) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(400).json({ message: 'Invalid data provided' });
                }
                return res.status(201).json({ success: true, message: 'Registered successfully' });
            });
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        return res.status(500).json({ message: 'Server error' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const findQuery = `SELECT * FROM users WHERE email = ?;`;
        const user = await new Promise((resolve, reject) => {
            db.query(findQuery, [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
        if (user.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        const existedPassword = user[0].password;

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, existedPassword);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken({ email, password });
        return res.status(200).json({ success: true, message: 'Login successful', token });
    }
    catch (error) {
        console.error("Error hashing password:", error);
        return res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router