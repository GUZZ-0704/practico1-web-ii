const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/burger.controller.js");

    router.get("/", requireUser, controller.listBurger);
    router.get("/create", requireUser, controller.createBurger);
    router.post("/create", requireUser, controller.insertBurger);
    router.get("/:id/edit", requireUser, controller.editBurger);
    router.post("/:id/edit", requireUser, controller.updateBurger);
    router.post("/:id/delete", requireUser, controller.deleteBurger);
    router.get("/:burgerId/restaurant/:restaurantId", requireUser, controller.viewBurger);

    app.use('/burgers', router);

};