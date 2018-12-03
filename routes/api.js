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
    return `${location}[${param}]: ${msg}`;
};


require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

routes.get("*", (req, res, next) => {
    let token = req.query.token || req.cookies.token || req.body.token || req.headers['x-access-token'];
    // console.log(req.cookies.token)

    if (req.originalUrl == "/api/markers" || req.originalUrl == "/api/markers/") {
        // skip any /api routes
        next();
    } else {

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).send({
                auth: false,
                message: 'Unauthorised!'
            });
            next();
        });
    }
});

routes.get('/markers/', (req, res) => {
    let forbulk = req.query.forbulk;

    if (forbulk == "true"){
        Marker.findAll({ attributes: ["id" , 'name' , "creator" , "lat" , "lng"]})
        .then(marker => {
            console.log("hello all product with bulk");
            res.json(marker);
        });

    }else{
    Marker.findAll()
        .then(marker => {
            console.log("hello all product");
            res.json(marker);
        });
    }

});

routes.get('/markers/product/:tool', (req, res) => {
    let tool = req.params.tool;
    check(tool).isString();
    let country = req.query.country;
    check(country).isString();


    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
        return;
    }
    if (country) {
        Marker.findAll({
                where: {
                    product: tool,
                    country: country
                }
            })
            .then(marker => {
                console.log("hello product");
                res.json(marker);
            });
    } else {
        Marker.findAll({
                where: {
                    product: tool
                }
            })
            .then(marker => {
                console.log("hello product");
                res.json(marker);
            });
    }


});

routes.get('/markers/product/:tool/:pnum', (req, res) => {
    let tool = req.params.tool;
    let pnum = req.params.pnum;
    let country = req.query.country;
    check(tool).isString();
    // let ptotal = 0;

    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
        return;
    }

    if (pnum == "pnum") {
        if (country) {
            Marker.sum('pnum', {
                    where: {
                        product: tool,
                        country: country
                    }
                })
                .then(sum => {
                    res.json({
                        patients: sum
                    });
                })
        } else {
            Marker.sum('pnum', {
                    where: {
                        product: tool
                    }
                })
                .then(sum => {
                    res.json({
                        patients: sum
                    });
                })
        }


    } else {
        res.redirect("/markers/product/" + tool)
    }


});


routes.get('/markers/country/:country/:pnum', (req, res) => {
    let country = req.params.country;
    let pnum = req.params.pnum;
    check(country).isString();


    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
        return;
    }
    if (pnum == "pnum") {
        Marker.sum('pnum', {
                where: {
                    country: country
                }
            })
            .then(sum => {
                res.json({
                    patients: sum
                });
            })


    } else {
        res.redirect("/markers/country/" + country)
    }

});


routes.get('/markers/country/:country/', (req, res) => {
    let country = req.params.country;
    check(country).isString();


    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
        return;
    }

    Marker.findAll({
            where: {
                country: country
            }
        })
        .then(marker => {
            console.log("hello country");
            res.json(marker);
        });

});

routes.get('/markers/creator/:em', check('em').isEmail(), (req, res) => {
    let email = req.params.em;
    let forbulk = req.query.forbulk;
    // check(email).isEmail();


    let errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            error: "Invalid Email"
        });
        return;
    }
    if (forbulk == "true"){

        Marker.findAll({ attributes: ["id" , 'name' , "creator" , "lat" , "lng"] ,
            where: {
                creator: email
            }
        })
        .then(marker => {
            console.log("hello creator for bulk");
            res.json(marker);
        });

    }else{
    Marker.findAll({
            where: {
                creator: email
            }
        })
        .then(marker => {
            console.log("hello creator");
            res.json(marker);
        });
    }

});

routes.get("/nonadmins", (req, res) => {
    // let token = req.query.token || req.cookies.token || req.body.token || req.headers['x-access-token'];
    let forbulk = req.query.forbulk;
    // console.log(req.cookies.token)
    // jwt.verify(token, JWT_SECRET, function (err, decoded) {
    //     if (err){ return res.status(401).send({
    //         auth: false,
    //         message: 'Unauthorised!'
    //     });}else{

    if (forbulk == "true"){
    User.findAll({ attributes: ["id" , 'email' , "createdAt"] ,
            where: {
                issuper: 0 || null
            }
        })
        .then(user => {
            res.json(user)
        });
    //     }
    // });
    } else{
        User.findAll({ 
            where: {
                issuper: 0 || null
            }
        })
        .then(user => {
            res.json(user)
        });
    }



});

routes.get("/admins", (req, res) => {
    let token = req.query.token || req.cookies.token || req.body.token || req.headers['x-access-token'];

    // jwt.verify(token, JWT_SECRET, function (err, decoded) {
    //     if (err){ return res.status(401).send({
    //         auth: false,
    //         message: err
    //     });}else{
    User.findAll({
            where: {
                issuper: 1
            }
        })
        .then(user => {
            res.json(user)
        });
    //     }
    // });


});

routes.get("/allusers", (req, res) => {
    let token = req.query.token || req.cookies.token || req.body.token || req.headers['x-access-token'];
    // console.log(req.cookies.token)
    // jwt.verify(token, JWT_SECRET, function (err, decoded) {
    //     if (err){ return res.status(401).send({
    //         auth: false,
    //         message: 'Unauthorised!'
    //     });}else{
    User.findAll()
        .then(user => {
            res.json(user);
        });
    //     }
    // });
    // User.findAll({where : {id : 1}})
    // // .then(users => res.json(users))
    // .spread(( user) => {
    //     // console.log(user.get({
    //     //   plain: true
    //     // }))
    //     console.log(user.id , user.issuper);
    // });

});

module.exports = routes;