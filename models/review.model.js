module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("review", {
        title: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
        rating: {
            type: Sequelize.INTEGER,
        },
        burgerId: {
            type: Sequelize.INTEGER,
        },
        userId: {
            type: Sequelize.INTEGER,
        },
    });
    return Review;
}