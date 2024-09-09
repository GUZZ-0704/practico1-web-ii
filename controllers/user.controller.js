const db = require("../models");

exports.listUser = async function (req, res) {
    const users = await db.users.findAll({
        include: 'persona'
    });
    res.render('users/list.ejs', { users: users });
}

exports.editUser = async function (req, res) {
    const id = req.params.id;
    const user = await db.users.findByPk(id);
    res.render('users/form.ejs', { user: user, errors: null });
}

exports.updateUser = async function (req, res) {
    const id = req.params.id;
    const validacion = await validateUserForm(req, id);
    const errors = validacion.errors;
    const userErrors = validacion.user;
    
    if (errors) {
        res.render('users/form.ejs', { user: userErrors, errors: errors });
        return;
    }
    
    const user = await db.users.findByPk(id);

    user.email = req.body.email;
    user.password = req.body.password;
    await user.save();
    res.redirect('/users');
}

exports.deleteUser = async function (req, res) {
    const id = req.params.id;
    const user = await db.users.findByPk(id);
    await user.destroy();
    res.redirect('/users');
}

const validateUserForm = async function (req, userId) {
    const errors = {
        email: !req.body.email,
        password: !req.body.password
    };

    // Check if email already exists
    if (errors.email || errors.password) {
        errors.message = 'Todos los campos son obligatorios';
        const user = {
            email: req.body.email,
            password: req.body.password
        };
        return { errors, user };
    }

    const existingUser = await db.users.findOne({
        where: {
            email: req.body.email,
            id: {
                [db.Sequelize.Op.ne]: userId
            }
        }
    });

    if (existingUser) {
        errors.email = true;
        errors.message = 'El correo electrónico ya está registrado';
        const user = {
            email: req.body.email,
            password: req.body.password
        };
        return { errors, user };
    }

    return { errors: null, user: null };
}
