module.exports = (sequelize, type) => {
    return sequelize.define('marker', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING,
        product : type.STRING,
        version : type.STRING,
        pnum : type.INTEGER,
        lat : type.STRING,
        lng : type.STRING,
        country : type.STRING,
        address : type.STRING,
        email : type.STRING,
        phone : type.STRING,
        website : type.STRING,
        intro : type.STRING,
        isvisible : type.TINYINT,
        creator : type.STRING,
    });
};