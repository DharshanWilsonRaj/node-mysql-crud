const express = require('express');
const app = express();
const PORT = 3000;
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const ordersRoutes = require('./routes/orders');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // for parsing application/x-www-form-urlencoded

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/orders', ordersRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});