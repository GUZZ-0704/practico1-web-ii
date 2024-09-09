const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/review.controller.js");

    router.get("/create", requireUser, controller.createReviewNew);
    router.get("/:burgerId/:userId", requireUser, controller.createReview);
    router.post("/create", requireUser, controller.insertReviewNew);
    router.post("/:burgerId/:userId", requireUser, controller.insertReview);
    router.get("/edit/:id", requireUser, controller.editReview);
    router.post("/edit/:id", requireUser, controller.updateReview);
    router.post("/:id/delete", requireUser, controller.deleteReview);

    app.use('/reviews', router);
};
