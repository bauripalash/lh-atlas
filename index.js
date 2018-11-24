var express = require('express');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var session = require('express-session');
var bcrypt = require('bcrypt');

var saltRounds = 10;

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.disable('x-powered-by');
app.use(express.static('public'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    }
}));

// create table markers (
//     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     tool VARCHAR(30) NOT NULL,
//     version VARCHAR(30) NOT NULL,
//     location VARCHAR(255) NOT NULL,
//     coords VARCHAR(255) NOT NULL,
//     phone VARCHAR(255),
//     email VARCHAR(50),
//     c_date TIMESTAMP
//     );


// CREATE TABLE admins(
//     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     EMAIL VARCHAR(255) NOT NULL,
//     PASSWORD VARCHAR(255) NOT NULL,
//     tstamp TIMESTAMP
// );

var connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'lhuser',
    password: 'librepassword',
    database: 'lhatlas'
});

// var sess = req.session;  //initialize session variable
// req.session.userId = results[0].id; //set user id
// req.session.user = results[0];//set user name

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});





app.get('/', function (request, response) {

    var sess = request.session;
    // console.log("session userid : " + sess.userid);
    user = sess.userid;

    response.render("index"  , {user : user});
});
app.get('/signout', function (request, response) {

    request.session.destroy(function (err) {
        console.log("Logged Out");
    })
    response.redirect("/admin");
});

app.get('/admin', function (request, response) {
    var sess = request.session;
    console.log("session userid : " + sess.userid);
    user = sess.userid;
    // var ehr_total = 0;
    // var toolkit_total = 0;
    // var rad_total = 0;
    // connection.query("SELECT * FROM `newmarkers` WHERE tool = 'ehr'", function (error, results, fields) {
    //     if (error) {
    //         console.log(error);
    //         return;
    //     }
    //     for (var i in results){
    //         ehr_total++;
    //     }
    // });
    // console.log(ehr_total);
    response.render("admin", {
        user: user
    });
});

app.post('/login', function (request, response) {
    data = request.body;
    bcrypt.hash(data.password, saltRounds, function (err, hash) {
        // connection.query('INSERT INTO `admins` (EMAIL , PASSWORD) VALUES (' + data.email + ', ' + hash + ')');
        connection.query("SELECT * FROM `admins` WHERE EMAIL = '" + data.email + "';", function (error, results, fields) {
            if (error) {
                console.log(error);
                return;
            }
            // console.log(results[0].PASSWORD);
            bcrypt.compare(data.password, results[0].PASSWORD, function (err, res) {
                if (res) {
                    var sess = request.session;
                    sess.userid = data.email;
                    console.log("logged in : " + data.email);
                    request.session.save(function (err) {
                        console.log("session saved");
                        response.redirect("/admin");
                    })
                } else {
                    console("pass dont match");
                    response.redirect("/admin");
                }
            });
        });
    });
    // bcrypt.hash(data.password, saltRounds, function(err, hash) {
    //     console.log("{ username : " + data.email + " , passwordHash : "+hash + "}");
    // });
    
});
// create table newmarkers (
//     id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     tool VARCHAR(30) NOT NULL,
//     version VARCHAR(30) NOT NULL,
//     location VARCHAR(255) NOT NULL,
//     intro VARCHAR(255) NOT NULL,
//     lat VARCHAR(255) NOT NULL,
//     lng VARCHAR(255) NOT NULL,
//     phone VARCHAR(255),
//     email VARCHAR(50),
//     c_date TIMESTAMP
// );
app.post("/addmarker", function (request, response) {
    data = request.body;
    name = data.name;
    tool = data.tool;
    version = data.version;
    location = data.location;
    lat = data.lat;
    lng = data.lng;
    intro = data.intro;
    email = data.contactEmail;
    phone = data.contactPhone;
    connection.query('INSERT INTO `newmarkers` (name , tool , version , location , lat , lng ,intro, phone , email) VALUES ("' + name + '", "' + tool + '", "' + version + '", "' + location + '", "' + lat + '", "'  + lng + '", "'+ intro + '", "' + phone + '", "' + email + '")', function (error, results, fields) {
        if (error) {
            console.log(error);
            return;
        } else {
            console.log("SUCCESSFULLY SAVED DATA");
        }
    });
    response.redirect("/");
});

app.post("/del", function (request, response) {
    data = request.body;
    id = data.mid;

    connection.query('DELETE FROM `newmarkers` WHERE id = "' + id + '";', function (error, results, fields) {
        if (error) {
            console.log(error);
            return;
        } else {
            response.redirect("/admin");
        }
    });
    
    
});

app.get('/api/markers/', function (req, res) {
    connection.query("SELECT * FROM `newmarkers`", function (error, results, fields) {
        if (error) {
            console.log(error);
            return;
        }
        res.json(results);
    });
});

app.get('/api/markers/:tool', function (req, res) {
    if (req.params.tool.toLowerCase() == "ehr" || req.params.tool.toLowerCase() == "toolkit" || req.params.tool.toLowerCase() == "radiology") {
        connection.query("SELECT * FROM `newmarkers` WHERE tool = '" + req.params.tool.toLowerCase() + "';", function (error, results, fields) {
            if (error) {
                console.log(error);
                return;
            }
            res.json(results);
        });
    } else {
        res.json({
            result: "No Data Found"
        });
    }
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});