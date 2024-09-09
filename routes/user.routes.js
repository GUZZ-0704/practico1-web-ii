const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/user.controller.js");

    router.get("/", requireUser, controller.listUser);
    router.get("/:id/edit", requireUser, controller.editUser);
    router.post("/:id/edit", requireUser, controller.updateUser);
    router.post("/:id/delete", requireUser, controller.deleteUser);

    app.use('/users', router);

};