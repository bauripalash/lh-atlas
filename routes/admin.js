const routes = require('express').Router();

const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

const {
    User,
    Marker
} = require('../sequelize');

const {
    check,
    validationResult
} = require('express-validator/check');

const errorFormatter = ({
    location,
    msg,
    param,
    value,
    nestedErrors
}) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `${msg}`;
};

var saltRounds = 10;
var COOKIE_TIME =3600000;
var bcrypt = require('bcrypt');

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

routes.get('/', function (request, response) {
    var sess = request.session;
    console.log("session userid : " + sess.userid);
    user = sess.userid;

    if (user) {
        User.findAll({
                where: {
                    email: user
                }
            })
            .spread((user) => {
                if (user.issuper == 1) {
                    var sess = request.session;
                    sess.issuper = true;
                    // console.log("logged in : " + email);
                    request.session.save(function (err) {
                        console.log("session saved");
                        // response.redirect("/admin");
                    })

                    response.render("admin", {
                        user: request.session.userid,
                        isadmin: "true",
                        errormsg: "",
                        infomsg: "",
                    });
                } else {
                    response.render("admin", {
                        user: request.session.userid,
                        isadmin: request.session.issuper,
                        errormsg: "",
                        infomsg: "",
                    });
                }
            });

    } else {
        response.render("admin", {
            user: request.session.userid,
            isadmin: request.session.issuper,
            errormsg: "",
            infomsg: "",
        });
    }


});

routes.post("/makeadmin", function (req, res) {
    var email = req.params.ue;
    check(email).isEmail();


    var errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
        return;
    }
    var UPDATE = {
        isuper: 1
    };

    User.update(UPDATE, {
            where: {
                email: email
            }
        })
        .then(user => {
            res.render("admin", {
                infomsg: "Selected User Upgraded to SuperUser",
                user: request.session.userid,
            isadmin: request.session.issuper,
            errormsg: "",
            });
        }).catch(function (err) {
            res.render("admin", {
                infomsg: "Failed to Upgrade Selected User to SuperUser , Contact Tech Support!",
                user: request.session.userid,
            isadmin: request.session.issuper,
            errormsg: "",
            });
        });


});

routes.get("/del", function (request, response) {
    response.redirect("/admin");
});

routes.post("/del", check('mid').isNumeric().withMessage("Marker Id is not valid") , function (request, response) {
    data = request.body;
    id = data.mid;
    console.log(id);
    


    var errors = validationResult(request).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        response.render("admin", {
            infomsg: JSON.stringify(errors.array()),
            user: request.session.userid,
            errormsg: "",
            isadmin: request.session.issuper
        })
        return;
    }

    Marker.destroy({
            where: {
                id: id
            }
        })
        .then(marker => {
            response.render("admin", {
                infomsg: "Successfully Deleted Selected Marker",
                user: request.session.userid,
                isadmin: request.session.issuper,
                errormsg: "",
                });
        }).catch(function (err) {
            response.render("admin", {
                infomsg: "Failed to Delete Selected Marker",
                user: request.session.userid,
                isadmin: request.session.issuper,
                errormsg: "",
                });
        });


});

routes.post("/addmarker", [
check('m_name').isString().withMessage("Marker Name is not valid"),
check('m_tool').isString().withMessage("Product Name is not valid"),
check('m_version').isString().withMessage("Product Version is not valid"),
check('m_location').isString().withMessage("Marker Address is not valid"),
check('m_lat').isNumeric().withMessage("Marker Latitude is not valid"),
check('m_lng').isNumeric().withMessage("Marker Longitude is not valid"),
check('m_intro').isString().withMessage("Marker Description is not valid"),
check('m_pnum').isNumeric().withMessage("Marker Patients Number is not valid"),
check('m_contactEmail').isEmail().withMessage("Marker Contact Email is not valid"),
check('m_country').isString().withMessage("Marker Country is not valid")] , (request, response) => {

    var data = request.body;
    var name = data.m_name.trim();
    var tool = data.m_tool.trim();
    var version = data.m_version.trim();
    var location = data.m_location.trim();
    var country = data.m_country.trim();
    var lat = data.m_lat.trim();
    var lng = data.m_lng.trim();
    var intro = data.m_intro.trim();
    var pnum = data.m_pnum.trim();
    var email = data.m_contactEmail.trim();
    var website = data.m_website.trim();
    var phone = data.m_contactPhone.trim();
    var created_by = request.session.userid;
    console.log(created_by);

    // check(name).isString();
    // check(tool).isString();
    // check(version).isString();
    // check(location).isString();
    // check(lat).isLatLong();
    // check(lng).isLatLong();
    // check(website).isURL();
    // check(intro).isString();
    // check(pnum).isNumeric();
    // check(email).isEmail();
    // check(phone).isMobilePhone("any");
    // check(created_by).isString();
    // check(country).isString();

    var errors = validationResult(request).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        response.render("admin", {
            infomsg: JSON.stringify(errors.array()),
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper
        })
        return;
    }


    Marker.create({
        name: name,
        product: tool,
        version: version,
        pnum: pnum,
        lat: lat,
        lng: lng,
        intro : intro,
        country: country,
        address: location,
        email: email,
        phone: phone,
        website: website,
        isvisible: 1,
        creator: created_by,

    }).then(marker => {
        response.render("admin", {
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper,
            infomsg: "Successfully Saved Marker"
        })
    }).catch(function (err) {
        response.render("admin", {
            infomsg: "Failed to Save Marker",
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper
        })
    });


});

routes.post("/addmarker", [
check('m_name').isString().withMessage("Marker Name is not valid"),
check('m_tool').isString().withMessage("Product Name is not valid"),
check('m_version').isString().withMessage("Product Version is not valid"),
check('m_location').isString().withMessage("Marker Address is not valid"),
check('m_lat').isNumeric().withMessage("Marker Latitude is not valid"),
check('m_lng').isNumeric().withMessage("Marker Longitude is not valid"),
check('m_intro').isString().withMessage("Marker Description is not valid"),
check('m_pnum').isNumeric().withMessage("Marker Patients Number is not valid"),
check('m_contactEmail').isEmail().withMessage("Marker Contact Email is not valid"),
check('m_country').isString().withMessage("Marker Country is not valid")] , (request, response) => {

    var data = request.body;
    var name = data.m_name.trim();
    var tool = data.m_tool.trim();
    var version = data.m_version.trim();
    var location = data.m_location.trim();
    var country = data.m_country.trim();
    var lat = data.m_lat.trim();
    var lng = data.m_lng.trim();
    var intro = data.m_intro.trim();
    var pnum = data.m_pnum.trim();
    var email = data.m_contactEmail.trim();
    var website = data.m_website.trim();
    var phone = data.m_contactPhone.trim();
    var created_by = request.session.userid;
    console.log(created_by);

    // check(name).isString();
    // check(tool).isString();
    // check(version).isString();
    // check(location).isString();
    // check(lat).isLatLong();
    // check(lng).isLatLong();
    // check(website).isURL();
    // check(intro).isString();
    // check(pnum).isNumeric();
    // check(email).isEmail();
    // check(phone).isMobilePhone("any");
    // check(created_by).isString();
    // check(country).isString();

    var errors = validationResult(request).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        response.render("admin", {
            infomsg: JSON.stringify(errors.array()),
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper
        })
        return;
    }


    Marker.create({
        name: name,
        product: tool,
        version: version,
        pnum: pnum,
        lat: lat,
        lng: lng,
        intro : intro,
        country: country,
        address: location,
        email: email,
        phone: phone,
        website: website,
        isvisible: 1,
        creator: created_by,

    }).then(marker => {
        response.render("admin", {
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper,
            infomsg: "Successfully Saved Marker"
        })
    }).catch(function (err) {
        response.render("admin", {
            infomsg: "Failed to Save Marker",
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper
        })
    });


});



routes.post("/register", function (request, response) {
    data = request.body;
    email = data.n_email.trim();
    rawpass = data.n_pass.trim();
    matchpass = data.n_pass2.trim();

    User.count({
            where: {
                email: email
            }
        })
        .then(count => {
            if (count != 0) {
                response.render("reg", {
                    errormsg: "User With This Email Already Exists!",
                    infomsg: "",
                    user: request.session.userid,
                    isadmin: request.session.isadmin,
                })
            } else {

                if (rawpass == matchpass) {

                    bcrypt.hash(rawpass, saltRounds, function (err, hash) {

                        User.create({
                            email: email,
                            password: hash
                        }).then(user => {
                            // SET SESSION
                            response.render("admin", {
                                errormsg: "Now Login to Access Dashboard",
                                infomsg: "",
                                user: request.session.userid,
                                isadmin: request.session.isadmin,
                            })
                        }).catch((err) => {
                            response.render("reg", {
                                errormsg: "Failed To Register!",
                                infomsg: "",
                                user: request.session.userid,
                                isadmin: request.session.isadmin,
                            })
                        })

                    });
                }



            }
        });


});


routes.post('/login', (request, response) => {
    var data = request.body;
    var email = data.email.trim();
    var pass = data.password.trim();

    User.count({
            where: {
                email: email
            }
        })
        .then(count => {
            console.log(count);
            if (count == 1) {
                User.findAll({
                        where: {
                            email: email
                        }
                    })
                    .spread((user) => {
                        // console.log(user.get({
                        //   plain: true
                        // }))
                        console.log(user.id, user.password);
                        bcrypt.compare(pass, user.password, (err, resp) => {
                            console.log(resp);
                            if (resp) {
                                var sess = request.session;
                                sess.userid = email;
                                console.log("logged in : " + email);
                                request.session.save(function (err) {
                                    console.log("session saved");
                                    let token = jwt.sign({ id: user.id, issuper : user.issuper }, JWT_SECRET , { expiresIn: 86400 });
                                    console.log(token);
                                    response.cookie("token" , token ,{maxAge :COOKIE_TIME , httpOnly: true })
                                    response.redirect("/admin");
                                    // response.setHeader('x-access-token', token);
                                    // response.status(200).send({ auth: true, token: token });
                                })
                            } else {
                                // console("pass dont match");
                                response.render("admin", {
                                    infomsg: "",
                                    user: request.session.user,
                                    errormsg: "Wrong Password For This Email",
                                    isadmin: request.session.issuper
                                })
                            }

                        });

                    });
            } else {
                response.render("admin", {
                    infomsg: "",
                    user: request.session.user,
                    errormsg: "No User With This Email Found!",
                    isadmin: request.session.issuper
                })
            }
        });




});

routes.get('/gettoken', (request, response) => {
    var data = request.session;
    var email = data.userid;
    var issuper = data.issuper;
    if (email){
        User.findAll({where : {email : email}})
        .spread(user =>{
            let token = jwt.sign({ id: user.id, issuper : user.issuper }, JWT_SECRET , { expiresIn: 86400 });
            response.status(200).json({token : token})
        })
        
    }else{
        response.status(200).json({token : null})
    }




});

module.exports = routes;