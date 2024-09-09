module.exports = app => {
    require('./home.routes')(app);
    require('./restaurant.routes')(app);
    require('./burger.routes')(app);
    require('./user.routes')(app);
    require('./review.routes')(app);
    require('./admin.routes')(app);
}