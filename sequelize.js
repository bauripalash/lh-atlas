const Sequelize = require('sequelize');
const UserModel = require('./models/user');
const MarkerModel = require('./models/marker');

require("dotenv").config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const User = UserModel(sequelize, Sequelize)
// BlogTag will be our way of tracking relationship between Blog and Tag models
// each Blog can have multiple tags and each Tag can have multiple blogs
const Marker = MarkerModel(sequelize, Sequelize);


sequelize.sync()
  .then(() => {
    // return User.create({
    //   email: 'e@mail.com',
    //   password : "password",
    //   issuper : 1
    // });
    console.log(`DB Init Success`);
  });



module.exports = {
  User,
  Marker
}