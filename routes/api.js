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

routes.get("*", (req, res , next) => {
    var token = req.query.token || req.cookies.token || req.body.token  || req.headers['x-access-token'];
    // console.log(req.cookies.token)

    if (req.originalUrl == "/api/markers" || req.originalUrl == "/api/markers/" ) {
        // skip any /api routes
        next();
    }else{

    jwt.verify(token, JWT_SECRET, function(err, decoded) {
		if (err) return res.status(401).send({auth : false, message: 'Unauthorised!'});
		next();	
    }); 
    }
});

routes.get('/markers/', function (req, res) {
    Marker.findAll()
        .then(marker => {
            console.log("hello all product");
            res.json(marker);
        });

});

routes.get('/markers/product/:tool', function (req, res) {
    var tool = req.params.tool;
    check(tool).isString();
    var country = req.query.country;
    check(country).isString();


    var errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
        return;
    }
    if (country){
        Marker.findAll({
            where: {
                product: tool,
                country : country
            }
        })
        .then(marker => {
            console.log("hello product");
            res.json(marker);
        });
    }else{
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

routes.get('/markers/product/:tool/:pnum', function (req, res) {
    var tool = req.params.tool;
    var pnum = req.params.pnum;
    var country = req.query.country;
    check(tool).isString();
    // var ptotal = 0;

    var errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
        return;
    }

    if (pnum == "pnum"){
        if (country){
            Marker.sum('pnum', { where: { product:  tool , country : country  }})
        .then(sum => {
            res.json({patients : sum});
          })
        }else{
        Marker.sum('pnum', { where: { product:  tool  }})
        .then(sum => {
            res.json({patients : sum});
          })
        }


    }else{
        res.redirect("/markers/product/" + tool)
    }


});


routes.get('/markers/country/:country/:pnum', function (req, res) {
    var country = req.params.country;
    var pnum = req.params.pnum;
    check(country).isString();


    var errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            errors: errors.array()
        });
        return;
    }
    if (pnum == "pnum"){
        Marker.sum('pnum', { where: { country:  country  }})
        .then(sum => {
            res.json({patients : sum});
          })


    }else{
        res.redirect("/markers/country/" + country)
    }

});


routes.get('/markers/country/:country/', function (req, res) {
    var country = req.params.country;
    check(country).isString();


    var errors = validationResult(req).formatWith(errorFormatter);
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

routes.get('/markers/creator/:em', check('em').isEmail() ,function (req, res) {
    var email = req.params.em;
    // check(email).isEmail();


    var errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).send({
            error : "Invalid Email"
        });
        return;
    }
    Marker.findAll({
            where: {
                creator: email
            }
        })
        .then(marker => {
            console.log("hello creator");
            res.json(marker);
        });

});

routes.get("/nonadmins", function (req, res) {
    var token = req.query.token || req.cookies.token || req.body.token  || req.headers['x-access-token'];
    // console.log(req.cookies.token)
    // jwt.verify(token, JWT_SECRET, function (err, decoded) {
    //     if (err){ return res.status(401).send({
    //         auth: false,
    //         message: 'Unauthorised!'
    //     });}else{
            User.findAll({
                where: {
                    issuper: 0 || null
                }
            })
            .then(user => {
                res.json(user)
            });
    //     }
    // });

   

});

routes.get("/admins", function (req, res) {
    var token = req.query.token || req.cookies.token || req.body.token  || req.headers['x-access-token'];
    
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
    var token = req.query.token || req.cookies.token || req.body.token  || req.headers['x-access-token'];
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