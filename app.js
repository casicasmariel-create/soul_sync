const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');
const bcrypt = require('bcrypt');

const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'soulsyncsecret',
    resave: false,
    saveUninitialized: true
}));

// VIEW ENGINE
app.set('view engine', 'ejs');

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// HOMEPAGE
app.get('/', (req, res) => {
    res.render('index');
});

// LOGIN PAGE
app.get('/login', (req, res) => {
    res.render('login');
});

// REGISTER PAGE
app.get('/register', (req, res) => {
    res.render('register');
});

// ADMIN DASHBOARD
app.get('/admin-dashboard', (req, res) => {

    if(!req.session.user){
        return res.redirect('/login');
    }

    res.render('admin-dashboard', {
        user: req.session.user
    });

});

// USER DASHBOARD
app.get('/user-dashboard', (req, res) => {

    if(!req.session.user){
        return res.redirect('/login');
    }

    res.render('user-dashboard', {
        user: req.session.user
    });

});

// REGISTER USER
app.post('/register', async (req, res) => {

    const { fullname, email, password, role } = req.body;

    // CHECK IF EMAIL EXISTS
    const checkQuery = 'SELECT * FROM users WHERE email = ?';

    db.query(checkQuery, [email], async (err, results) => {

        if (err) {
            console.log(err);
            return res.send(err.message);
        }

        // EMAIL ALREADY EXISTS
        if (results.length > 0) {
            return res.send('Email already exists');
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // INSERT USER
        const insertQuery = `
            INSERT INTO users(fullname, email, password, role)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            insertQuery,
            [fullname, email, hashedPassword, role],
            (err, result) => {

                if (err) {
                    console.log(err);
                    return res.send(err.message);
                }

                console.log('User Registered');

                res.redirect('/login');

            }
        );

    });

});

// LOGIN USER
app.post('/login', (req, res) => {

    const { email, password } = req.body;

    // FIND USER
    const query = 'SELECT * FROM users WHERE email = ?';

    db.query(query, [email], async (err, results) => {

        if(err){
            console.log(err);
            return res.send(err.message);
        }

        // USER NOT FOUND
        if(results.length === 0){
            return res.send('Invalid Email or Password');
        }

        const user = results[0];

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.send('Invalid Email or Password');
        }

        // CREATE SESSION
        req.session.user = {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        };

        console.log('Login Successful');

        // ADMIN
        if(user.role === 'admin'){
            return res.redirect('/admin-dashboard');
        }

        // USER
        else{
            return res.redirect('/user-dashboard');
        }

    });

});

// LOGOUT
app.get('/logout', (req, res) => {

    req.session.destroy(() => {

        res.redirect('/login');

    });

});

// SERVER
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});