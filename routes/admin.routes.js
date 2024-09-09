const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/admin.controller.js");
    const controllerBurger =
        require("../controllers/burger.controller.js");
    const controllerRestaurant =
        require("../controllers/restaurant.controller.js");
    const controllerReview =
        require("../controllers/review.controller.js");


    router.get("/burgers", requireUser, controller.listBurger);
    router.get("burgers/createBurger", requireUser, controllerBurger.createBurger);
    router.post("burgers/createBurger", requireUser, controllerBurger.insertBurger);
    router.get("/burgers/:id/edit", requireUser, controllerBurger.editBurger);
    router.post("/burgers/:id/edit", requireUser, controllerBurger.updateBurger);
    router.post("/burgers/:id/delete", requireUser, controllerBurger.deleteBurger);

    router.get("/restaurants", requireUser, controller.listRestaurant);
    router.get("restaurants/createRestaurant", requireUser, controllerRestaurant.createRestaurant);
    router.post("restaurants/createRestaurant", requireUser, controllerRestaurant.insertRestaurant);
    router.get("/restaurants/:id/edit", requireUser, controllerRestaurant.editRestaurant);
    router.post("/restaurants/:id/edit", requireUser, controllerRestaurant.updateRestaurant);
    router.post("/restaurants/:id/delete", requireUser, controllerRestaurant.deleteRestaurant);

    router.get("/reviews", requireUser, controller.listReview);
    router.get("/reviews/createReview", requireUser, controllerReview.createReview);
    router.post("/reviews/createReview", requireUser, controllerReview.insertReview);
    router.get("/admin/reviews/:id/edit", requireUser, controllerReview.editReview);
    router.post("/admin/reviews/:id/edit", requireUser, controllerReview.updateReview);
    router.post("/admin/reviews/:id/delete", requireUser, controllerReview.deleteReview);


    app.use('/admin', router);

};