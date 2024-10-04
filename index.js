const express = require('express');
const app = express();
const PORT = 3000;
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const ordersRoutes = require('./routes/orders');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // for parsing application/x-www-form-urlencoded


// Using JWT Token for  Authentication
const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        jwt.verify(token, 'yourSecretKey', (err, payload) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token',
                });
            } else {
                req.user = payload;
                next();
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Unauthenticated user request',
        });
    }
}

app.use('/auth', authRoutes);

const routesWithMiddleware = [
    { path: '/users', route: userRoutes },
    { path: '/movies', route: movieRoutes },
    { path: '/orders', route: ordersRoutes },
];

routesWithMiddleware.forEach(({ path, route }) => {
    app.use(path, validateToken, route);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
