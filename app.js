const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// SESSION
app.use(session({
    secret: 'soulsyncsecret',
    resave: false,
    saveUninitialized: false
}));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// VIEW ENGINE
app.set('view engine', 'ejs');

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
const authRoutes = require('./routes/authRoutes');

app.use('/', authRoutes);

// SERVER
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});