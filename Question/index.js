const express = require('express');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const app = express();
const secretkey = crypto.randomBytes(64).toString('hex');
app.use(session({
    secret: secretkey,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Your user data array
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// Local authentication strategy
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect username or password' });
        }
    }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Routes
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error', 'Incorrect username or password'); 
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/profile');
        });
    })(req, res, next);
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/profile', ensureAuthenticated, (req, res) => {
    res.send('Welcome to your profile');
});

app.get('/', (req, res) => {
    res.send('Home Page');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
