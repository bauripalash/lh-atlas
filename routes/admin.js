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
    return `${msg}`;
};

let saltRounds = 10;
let COOKIE_TIME = 3600000;
var bcrypt = require('bcrypt');

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

routes.get('/', (request, response) => {
    let sess = request.session;
    console.log("session userid : " + sess.userid);
    let user = sess.userid;

    if (user) {
        User.findAll({
                where: {
                    email: user
                }
            })
            .spread((user) => {
                if (user.issuper == 1) {
                    let sess = request.session;
                    sess.issuper = true;
                    // console.log("logged in : " + email);
                    request.session.save((err) => {
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

routes.post("/makeadmin", (req, res) => {
    let email = req.body.ue;
    // check(email).isEmail();


    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
        return;
    }
    let updateValues = { issuper : 1 };
    User.update(updateValues , { where: {email: email}})
        .then(() => {
            res.render("admin", {
                infomsg: "Selected User Upgraded to SuperUser",
                user: req.session.userid,
                isadmin: req.session.issuper,
                errormsg: "",
            });
        }).catch(function (err) {
            res.render("admin", {
                infomsg: "Failed to Upgrade Selected User to SuperUser , Contact Tech Support!",
                user: req.session.userid,
                isadmin: req.session.issuper,
                errormsg: "",
            });
        });


});

routes.get("/del", (request, response) => {
    response.redirect("/admin");
});

routes.post("/del", check('mid').isNumeric().withMessage("Marker Id is not valid"), (request, response) => {
    let data = request.body;
    let id = data.mid;
    console.log(id);



    let errors = validationResult(request).formatWith(errorFormatter);
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
        }).catch((err) => {
            response.render("admin", {
                infomsg: "Failed to Delete Selected Marker",
                user: request.session.userid,
                isadmin: request.session.issuper,
                errormsg: "",
            });
        });


});

routes.post("/bdel", (request, response) => {
    let data = request.body;
    let id = data.mid;
    console.log(id);



    // let errors = validationResult(request).formatWith(errorFormatter);
    // if (!errors.isEmpty()) {
    //     response.render("admin", {
    //         infomsg: JSON.stringify(errors.array()),
    //         user: request.session.userid,
    //         errormsg: "",
    //         isadmin: request.session.issuper
    //     })
    //     return;
    // }

    Marker.destroy({
            where: {
                id: id
            }
        })
        .then(marker => {
            response.json({msg : "success"})
        }).catch((err) => {
            response.json({msg : "fail"})
        });


});

routes.post("/budel", (request, response) => {
    let data = request.body;
    let email = data.email;
    console.log(email);

    User.destroy({
            where: {
                email: email
            }
        })
        .then(marker => {
            response.json({msg : "success"})
        }).catch((err) => {
            response.json({msg : "fail"})
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
    check('m_country').isString().withMessage("Marker Country is not valid")
], (request, response) => {

    let data = request.body;
    let name = data.m_name.trim();
    let tool = data.m_tool.trim();
    let version = data.m_version.trim();
    let location = data.m_location.trim();
    let country = data.m_country.trim();
    let lat = data.m_lat.trim();
    let lng = data.m_lng.trim();
    let intro = data.m_intro.trim();
    let pnum = data.m_pnum.trim();
    let email = data.m_contactEmail.trim();
    let website = data.m_website.trim();
    let phone = data.m_contactPhone.trim();
    let created_by = request.session.userid;
    let isindex = data.isindex;
    console.log(created_by);

    let errors = validationResult(request).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        response.render("admin", {
            infomsg: JSON.stringify(errors.array()),
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper
        })
        // response.json({msg : errors.array()})
        return;
    }


    Marker.create({
        name: name,
        product: tool,
        version: version,
        pnum: pnum,
        lat: lat,
        lng: lng,
        intro: intro,
        country: country,
        address: location,
        email: email,
        phone: phone,
        website: website,
        isvisible: 1,
        creator: created_by,

    }).then(marker => {
      if (isindex == "yes"){
        let string = encodeURIComponent('Successfully Saved Marker');
        response.redirect('/?infomsg=' + string);
      }else{
        response.render("admin", {
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper,
            infomsg: "Successfully Saved Marker"
          })
        
        }
        // response.json({msg : "success"})
    }).catch((err) => {
        // response.json({msg : "fail"})
        response.render("admin", {
            infomsg: "Failed to Save Marker",
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper
        })
    });


});

routes.get("/editmarker/" , (request , response) =>{
    let user = request.session.userid;
    let issuper = request.session.issuper;
    response.render("admin", {
        infomsg: "No Marker Found!",
        user: user,
        errormsg: "",
        isadmin: request.session.issuper
    })
})

routes.get("/editmarker/:id" , (request , response) =>{
    
    let marker_id = parseInt(request.params.id);
    let user = request.session.userid;
    let issuper = request.session.issuper;
    // marker_id = marker_id.toInteger();
    // console.log(typeof marker_id)
    // request.checkBody(marker_id).isNumeric().withMessage("Marker Id is not valid")

    // let errors = validationResult(request).formatWith(errorFormatter);
    // if (Number.isInteger(marker_id)){
    if (user){
    if (!Number.isInteger(marker_id)) {
        response.render("admin", {
            infomsg: "Invalid Id",
            user: user,
            errormsg: "",
            isadmin: request.session.issuper
        })
        return;
    }


    Marker.findAll({where : {id : marker_id , creator : user}})
    .then((marker)=>{
        console.log(marker)
        if (JSON.stringify(marker) != "[]" || issuper ){
            Marker.findAll({where:{id :marker_id}})
            .spread((marker) =>{
                // console.log(marker)
                response.render("editmarker", {
                    infomsg: "",
                    user: user,
                    tool : marker.product,
                    isadmin:issuper,
                    name : marker.name,
                    pnum : marker.pnum,
                    version : marker.version,
                    location : marker.address,
                    country : marker.country,
                    lat : marker.lat,
                    lng : marker.lng,
                    intro : marker.intro,
                    email : marker.email,
                    website  : marker.website,
                    phone : marker.phone,
                    mid : marker.id

                })
            })
            .catch((err) =>{
                response.render("admin", {
                    infomsg: "No Marker Found With This Id",
                    user: user,
                    errormsg: "",
                    isadmin: request.session.issuper
                })
            })

        }else{
            response.render("admin", {
                infomsg: "You have no permission to edit other's marker",
                user: user,
                errormsg: "",
                isadmin: request.session.issuper
            })
        }
    })
    .catch((err) =>{
        response.render("admin", {
            infomsg: err,
            user: user,
            errormsg: "",
            isadmin: request.session.issuper
        })
    })
    }else{
        response.render("admin", {
            infomsg: "Please Login",
            user: user,
            errormsg: "",
            isadmin: request.session.issuper
        })
    }
    // }else{
    //     response.render("admin", {
    //         infomsg: "You Don't Have Any Marker!",
    //         user: user,
    //         errormsg: "",
    //         isadmin: request.session.issuper
    //     })
    // }

    
});

routes.get("/managemarkers" , (request , response)=>{
    let user = request.session.userid;
    let issuper = request.session.issuper;

    if (!user){
        response.render("admin", {
            infomsg: "Please Login",
            user: user,
            errormsg: "",
            isadmin: request.session.issuper
        })
    }else{
        response.render("manmarker", {
            infomsg: "",
            user: user,
            errormsg: "",
            isadmin: request.session.issuper
        })
    }
});

routes.get("/manageusers" , (request , response)=>{
    let user = request.session.userid;
    let issuper = request.session.issuper;

    if (!user){
        response.render("admin", {
            infomsg: "Please Login",
            user: user,
            errormsg: "",
            isadmin: request.session.issuper
        })
    }else{
        response.render("manuser", {
            infomsg: "",
            user: user,
            errormsg: "",
            isadmin: request.session.issuper
        })
    }
});

routes.post("/editmarker", [
    check('m_name').isString().withMessage("Marker Name is not valid"),
    check('m_tool').isString().withMessage("Product Name is not valid"),
    check('m_version').isString().withMessage("Product Version is not valid"),
    check('m_location').isString().withMessage("Marker Address is not valid"),
    check('m_intro').isString().withMessage("Marker Description is not valid"),
    check('m_contactEmail').isEmail().withMessage("Marker Contact Email is not valid"),
    check('m_country').isString().withMessage("Marker Country is not valid")
], (request, response) => {

    let data = request.body;
    let name = data.m_name.trim();
    let tool = data.m_tool.trim();
    let version = data.m_version.trim();
    let location = data.m_location.trim();
    let country = data.m_country.trim();
    let lat = data.m_lat.trim();
    let lng = data.m_lng.trim();
    let intro = data.m_intro.trim();
    let pnum = data.m_pnum.trim();
    let email = data.m_contactEmail.trim();
    let website = data.m_website.trim();
    let phone = data.m_contactPhone.trim();
    let created_by = request.session.userid;
    let marker_id = data.marker_id;

    console.log(created_by);

    let errors = validationResult(request).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        response.render("admin", {
            infomsg: JSON.stringify(errors.array()),
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper
        })
        return;
    }

    let updateValues = {
        name: name,
        product: tool,
        version: version,
        pnum: pnum,
        lat: lat,
        lng: lng,
        intro: intro,
        country: country,
        address: location,
        email: email,
        phone: phone,
        website: website,
        isvisible: 1,
        creator: created_by,

    };

    Marker.update(updateValues , {where : {id : marker_id}}).then(marker => {
        response.render("admin", {
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper,
            infomsg: "Successfully Updated Marker"
        })
    }).catch((err) => {
        response.render("admin", {
            infomsg: "Failed to Update Marker",
            user: created_by,
            errormsg: "",
            isadmin: request.session.issuper
        })
    });


});

routes.post("/register", (request, response) => {
    let data = request.body;
    let email = data.n_email.trim();
    let rawpass = data.n_pass.trim();
    let matchpass = data.n_pass2.trim();

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

                    bcrypt.hash(rawpass, saltRounds, (err, hash) => {

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
                }else{
                  response.render("reg",{
                    errormsg : "Passwords Don't Match!",
                    infomsg : "",
                    user : request.session.user,
                    isadmin : request.session.isadmin,
                  });
                }



            }
        });


});


routes.post('/login', (request, response) => {
    let data = request.body;
    let email = data.email.trim();
    let pass = data.password.trim();

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
                                let sess = request.session;
                                sess.userid = email;
                                console.log("logged in : " + email);
                                request.session.save((err) => {
                                    console.log("session saved");
                                    let token = jwt.sign({
                                        id: user.id,
                                        issuper: user.issuper
                                    }, JWT_SECRET, {
                                        expiresIn: 86400
                                    });
                                    // console.log(token);
                                    response.cookie("token", token, {
                                        maxAge: COOKIE_TIME,
                                        httpOnly: true
                                    })
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
    let data = request.session;
    let email = data.userid;
    let issuper = data.issuper;
    if (email) {
        User.findAll({
                where: {
                    email: email
                }
            })
            .spread(user => {
                let token = jwt.sign({
                    id: user.id,
                    issuper: user.issuper
                }, JWT_SECRET, {
                    expiresIn: 86400
                });
                response.status(200).json({
                    token: token
                })
            })

    } else {
        response.status(200).json({
            token: null
        })
    }




});

module.exports = routes;