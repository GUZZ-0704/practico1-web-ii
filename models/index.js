const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.burgers = require("./burger.model.js")(sequelize, Sequelize);
db.restaurants = require("./restaurant.model.js")(sequelize, Sequelize);
db.reviews = require("./review.model.js")(sequelize, Sequelize);

db.restaurants.hasMany(db.burgers, {
    foreignKey: 'restaurantId',
    as: 'burgers',
});
db.burgers.belongsTo(db.restaurants, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
});
db.burgers.hasMany(db.reviews, {
    foreignKey: 'burgerId',
    as: 'reviews',
});
db.reviews.belongsTo(db.burgers, {
    foreignKey: 'burgerId',
    as: 'burger',
});
db.users.hasMany(db.reviews, {
    foreignKey: 'userId',
    as: 'reviews',
});
db.reviews.belongsTo(db.users, {
    foreignKey: 'userId',
    as: 'user',
});

module.exports = db;
