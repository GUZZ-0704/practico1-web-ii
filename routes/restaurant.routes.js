const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/restaurant.controller.js");

    router.get("/", requireUser, controller.listRestaurant);
    router.get("/create", requireUser, controller.createRestaurant);
    router.post("/create", requireUser, controller.insertRestaurant);
    router.get("/:id/edit", requireUser, controller.editRestaurant);
    router.post("/:id/edit", requireUser, controller.updateRestaurant);
    router.post("/:id/delete", requireUser, controller.deleteRestaurant);
    router.get("/:id", requireUser, controller.viewRestaurant);

    app.use('/restaurants', router);

};