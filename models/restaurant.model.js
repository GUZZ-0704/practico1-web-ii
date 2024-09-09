module.exports = (sequelize, Sequelize) => {
    const Restaurant = sequelize.define("restaurant", {
        name: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
        image: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
    });
    return Restaurant;
}