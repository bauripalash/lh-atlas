var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
const expressValidator = require('express-validator');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
var cookieParser = require('cookie-parser')
const cors = require('cors');
require("dotenv").config();
var admin_route = require("./routes/admin.js");
var api_route = require("./routes/api.js");

var saltRounds = 10;
var COOKIE_TIME =3600000;

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(cors()); 

app.set('view engine', 'ejs');

app.disable('x-powered-by');
app.use(express.static('public'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: COOKIE_TIME
    }
}));

var PORT = process.env.PORT || 5005


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(expressValidator());
app.use(cookieParser())
// CREATE TABLE admins(
//     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     EMAIL VARCHAR(255) NOT NULL,
//     PASSWORD VARCHAR(255) NOT NULL,
//     tstamp TIMESTAMP
// );

// var connection = mysql.createConnection({
//     host: 'db4free.net',
//     user: 'lhuser',
//     password: 'librepassword',
//     database: 'lhatlas'
// });

// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }

//     console.log('connected as id ' + connection.threadId);
// });

// const jwtMW = exjwt({
//     secret: process.env.JWT_SECRET
// });

app.use("/admin" , admin_route);
app.use("/api" , api_route);




app.get('/', function (request, response) {

    var sess = request.session;
    // console.log("session userid : " + sess.userid);
    user = sess.userid;

    response.render("index", {
        user: user
    });
});
app.get('/signout', function (request, response) {

    
    request.session.destroy(function (err) {
        console.log("Logged Out");
    })
    response.clearCookie('token');
    response.redirect("/admin");
});



app.get('/login', function (request, response) {
    response.redirect("/admin");
});


app.get("/register", function (request, response) {

    response.render("reg", {
        user: request.session.userid,
        errormsg: ""
    });

});




app.get("/del", function (request, response) {
    response.redirect("/admin");
});




// listen for requests :)
var listener = app.listen(PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});