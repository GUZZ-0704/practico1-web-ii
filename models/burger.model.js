module.exports = (sequelize, Sequelize) => {
    const Burger = sequelize.define("burger", {
        name: {
            type: Sequelize.STRING,
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
        },
        description: {
            type: Sequelize.STRING,
        },
        image: {
            type: Sequelize.STRING,
        },
        restaurantId: {
            type: Sequelize.INTEGER,
        },
    });
    return Burger;
}