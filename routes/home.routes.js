module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/home.controller.js");

    router.get("/login", controller.login);
    router.post("/login", controller.authenticate);
    router.get("/register", controller.createUsuario);
    router.post("/register", controller.insertUsuario);
    router.get("/logout", controller.logout);
    router.get('/', controller.index);
    app.use('/', router);

};