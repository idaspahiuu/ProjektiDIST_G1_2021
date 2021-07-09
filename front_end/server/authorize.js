const express = require('express')
const router = express.Router();

const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

var user;

const getUsers = router.post("/auth", function (req, res) {
    var username = req.body.username;
    var passwordd = req.body.password;
    var request = require('request');

    request.post(
        'http://sisteme-te-shperndara.herokuapp.com/api/v1/login',
        { json: { email: username, password: passwordd } },
        function (error, responsee, body) {
            if (body.success) {
                console.log(body);
                res.redirect('/')
            }
            else {
                res.send('Incorrect Username and/or Password!');
            }

            user = username;

            res.end();
        });
});

function ensureAuthenticated(req, res, next) {
    if (!user) 
        res.send('<h1 align="center">NOT AUTHORIZED</h1> <hr>');
    else
        return next();
}

router.get('/', function (req, resp) {
    if (user) {
        resp.render('employee', { addresses, javaData })
    }
    else {
        resp.render('index', { addresses })
    }
})

router.get('/modifyAddress', ensureAuthenticated, function (req, resp) {
    resp.render('modifyAddress')
})

router.get('/modifyStreet', ensureAuthenticated, function (req, resp) {
    resp.render('modifyStreet')
})

router.get('/modifyObjects', ensureAuthenticated, function (req, resp) {
    resp.render('modifyObjects')
})

router.get('/chat', ensureAuthenticated, function (req, resp) {
    resp.render('chat')
})

router.get('/logout', ensureAuthenticated, function (req, res) {
    user = null;
    res.redirect('/');
});

module.exports = router;