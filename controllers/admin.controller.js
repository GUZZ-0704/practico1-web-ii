const db = require("../models");

exports.listBurger = function (req, res) {
    db.burgers.findAll({
        include: 'restaurant'
    }).then(burgers => {
        res.render('burgers/admin.ejs', { burgers: burgers });
    });
}

exports.listRestaurant = function (req, res) {
    db.restaurants.findAll().then(restaurants => {
        res.render('restaurants/admin.ejs', { restaurants: restaurants });
    });
}

exports.listUser = function (req, res) {
    db.users.findAll().then(users => {
        res.render('users/admin.ejs', { users: users });
    });
}

exports.listReview = function (req, res) {
    db.reviews.findAll({
        include: ['burger', 'user']
    }).then(reviews => {
        res.render('reviews/admin.ejs', { reviews: reviews });
    });
}



