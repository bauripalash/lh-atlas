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

    response.render("index", {
        user: user
    });
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
    if (user){
        connection.query("SELECT * FROM `admins` WHERE EMAIL = '" + user  + "';", function (error, results, fields) {
            if (results[0].SUPER == 1){
                response.render("admin", {
                    user: user,
                    isadmin : "true",
                    errormsg: ""
                });
            }else{
                response.render("admin", {
                    user: user,
                    isadmin : "",
                    errormsg: ""
                });
            }
        });
    }else{
        response.render("admin", {
            user: user,
            isadmin : "",
            errormsg: ""
        });
    }

    // response.render("admin", {
    //     user: user,
    //     isadmin : "false",
    //     errormsg: ""
    // });

});

app.get('/login', function (request, response) {
    response.redirect("/admin");
});

app.post('/login', function (request, response) {
    var data = request.body;
    var email = data.email.trim();
    var pass = data.password.trim();

    connection.query("SELECT * FROM `admins` WHERE EMAIL = '" + email + "';", function (error, results, fields) {
        if (JSON.stringify(results) == "[]") {
            response.render('admin', {
                user: request.session.userid,
                errormsg: "Wrong Email Address"
            });
        } else {
            bcrypt.hash(pass, saltRounds, function (err, hash) {
                // connection.query('INSERT INTO `admins` (EMAIL , PASSWORD) VALUES (' + data.email + ', ' + hash + ')');
                connection.query("SELECT * FROM `admins` WHERE EMAIL = '" + email + "';", function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    // console.log(results[0].PASSWORD);
                    bcrypt.compare(pass, results[0].PASSWORD, function (err, res) {
                        if (res) {
                            var sess = request.session;
                            sess.userid = email;
                            console.log("logged in : " + email);
                            request.session.save(function (err) {
                                console.log("session saved");
                                response.redirect("/admin");
                            })
                        } else {
                            // console("pass dont match");
                            response.render('admin', {
                                user: request.session.user,
                                errormsg: "Wrong Password For this email address"
                            });
                        }
                    });
                });
            });
        }
    });


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
    var data = request.body;
    var name = data.m_name.trim();
    var tool = data.m_tool.trim();
    var version = data.m_version.trim();
    var location = data.m_location.trim();
    var lat = data.m_lat.trim();
    var lng = data.m_lng.trim();
    var intro = data.m_intro.trim();
    var pnum = data.m_pnum.trim();
    var email = data.m_contactEmail.trim();
    var phone = data.m_contactPhone.trim();
    var created_by = request.session.userid;
    console.log(created_by);

    connection.query('INSERT INTO `newmarkers` (name , tool , version , location , lat , lng ,intro, phone , pnum , email , created_by) VALUES ("' + name + '", "' + tool + '", "' + version + '", "' + location + '", "' + lat + '", "' + lng + '", "' + intro + '", "' + phone + '", "' + pnum + '","' + email + '","' + created_by + '")', function (error, results, fields) {
        if (error) {
            console.log(error);
            return;
        } else {
            console.log("SUCCESSFULLY SAVED DATA");
        }
    });
    response.redirect("/admin");
});

app.get("/register", function (request, response) {

    response.render("reg", {
        user: request.session.userid,
        errormsg: ""
    });

});


app.post("/register", function (request, response) {
    data = request.body;
    email = data.n_email.trim();
    rawpass = data.n_pass.trim();
    matchpass = data.n_pass2.trim();
    connection.query("SELECT * FROM `admins` WHERE EMAIL = '" + email + "';", function (error, results, fields) {
        if (JSON.stringify(results) == "[]") {
            if (rawpass == matchpass) {

                bcrypt.hash(rawpass, saltRounds, function (err, hash) {
                    // connection.query('INSERT INTO `admins` (EMAIL , PASSWORD) VALUES (' + data.email + ', ' + hash + ')');
                    connection.query("INSERT INTO `admins` (EMAIL , PASSWORD , SUPER) VALUES ('" + email + "','" + hash + "',0);", function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            response.render('reg', {
                                user: request.session.userid,
                                errormsg: "OMG! Cannot Create account! MySQL Error!"
                            });
                        } else {
                            console.log("Sucessfully Registered!");
                            response.render('admin', {
                                user: request.session.userid,
                                errormsg: "Now Login to Use Admin Dashboard!"
                            });
                        }

                    });
                });

                // console.log("OK REG" , email);
                // console.log(results);
            } else {
                response.render("reg", {
                    user: request.session.userid,
                    errormsg: "Password's do not match"
                });
                console.log("PASS MATCH NO");
            }
        } else {
            response.render("reg", {
                user: request.session.userid,
                errormsg: "User Account with this email already exists"
            });
            // console.log("ALRDY REG");
        }
    });


});

app.get("/del", function (request, response) {
    response.redirect("/admin");
});

app.post("/del", function (request, response) {
    data = request.body;
    id = data.mid;
    console.log(id);

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

app.get('/api/markers/admin/:em', function (req, res) {
    if (req.session.userid) {
        connection.query("SELECT * FROM `admins` WHERE EMAIL = '" + req.params.em.toLowerCase() + "';", function (error, results, fields) {
            if (results[0].SUPER == 0) {
                connection.query("SELECT * FROM `newmarkers` WHERE created_by = '" + req.params.em.toLowerCase() + "';", function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    res.json(results);
                });
            } else if (results[0].SUPER == 1) {
                connection.query("SELECT * FROM `newmarkers`", function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    res.json(results);
                });
            } else {
                connection.query("SELECT * FROM `newmarkers` WHERE created_by = '" + req.params.em.toLowerCase() + "';", function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    res.json(results);
                });
            }


        });
    } else {
        res.redirect("/");
    }
});

app.get("/api/nonadmin" , function (req, res) {
    if (req.session.userid){

    
    connection.query("SELECT * FROM `admins` WHERE SUPER != 1 ;", function (error, results, fields) {
        if (error) {
            console.log(error);
            return;
        }
        res.json(results);
    });
}else{
    res.redirect("/");
}
});

app.get("/api/admins" , function (req, res) {
    if (req.session.userid){

    
    connection.query("SELECT * FROM `admins` WHERE SUPER = 1 ;", function (error, results, fields) {
        if (error) {
            console.log(error);
            return;
        }
        res.json(results);
    });
}else{
    res.redirect("/");
}
});

app.post("/makeadmin" , function (req, res) {
    email = req.body.ue;

    if (req.session.userid){

    
    connection.query("UPDATE `admins` SET SUPER = 1  WHERE EMAIL = '"+email+"';", function (error, results, fields) {
        if (error) {
            console.log(error);
            return;
        }
        res.json(results);
    });
}else{
    res.redirect("/");
}
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});