const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const expressValidator = require('express-validator');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const cookieParser = require('cookie-parser')
const cors = require('cors');
require("dotenv").config();
const admin_route = require("./routes/admin.js");
const api_route = require("./routes/api.js");

const saltRounds = 10;
const COOKIE_TIME = 3600000;

let app = express();
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

let PORT = process.env.PORT || 5005


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(expressValidator());
app.use(cookieParser())

app.use("/admin", admin_route);
app.use("/api", api_route);




app.get('/', (request, response) => {

    let sess = request.session;
    // console.log("session userid : " + sess.userid);
    let user = sess.userid;

    response.render("index", {
        user: user
    });
});
app.get('/signout', (request, response) => {


    request.session.destroy((err) => {
        console.log("Logged Out");
    })
    response.clearCookie('token');
    response.redirect("/admin");
});



app.get('/login', (request, response) => {
    response.redirect("/admin");
});


app.get("/register", (request, response) => {

    response.render("reg", {
        user: request.session.userid,
        errormsg: ""
    });

});




app.get("/del", (request, response) => {
    response.redirect("/admin");
});




// listen for requests :)
let listener = app.listen(PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});