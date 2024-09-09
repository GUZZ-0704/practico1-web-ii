const db = require("../models");
const sha1 = require('sha1');

exports.login = async function (req, res) {
    res.render('users/login.ejs', { errors: null });
}

exports.authenticate = async function (req, res) {
    const user = await db.users.findOne({
        where: {
            email: req.body.email,
            password: sha1(req.body.password)
        }
    });
    if (user) {
        req.session.user = user;
        res.redirect('restaurants');
    } else {
        res.render('users/login.ejs', { errors: { message: 'Usuario o contraseña incorrectos' } });
    }
}

exports.logout = async function (req, res) {
    req.session.user = null;
    res.redirect('/login');
}

exports.createUsuario = async function (req, res) {
    res.render('users/form.ejs', { user: null, errors: null });
}

exports.insertUsuario = async function (req, res) {
    const { errors, user } = validateUsuarioForm(req);
    if (errors) {
        res.render('users/form.ejs', { user, errors });
        return;
    }

    try {
        // Verificar si el correo electrónico ya está registrado
        const existingUser = await db.users.findOne({
            where: { email: req.body.email }
        });

        if (existingUser) {
            // Si el correo ya está registrado, mostrar un error
            const error = { email: true, message: 'El correo electrónico ya está registrado' };
            res.render('users/form.ejs', { user, errors: error });
            return;
        }

        // Crear nuevo usuario
        await db.users.create({
            username: req.body.username,
            email: req.body.email,
            password: sha1(req.body.password),
        });
        res.redirect('/restaurants');
    } catch (error) {
        console.error(error);
        res.render('users/form.ejs', { user, errors: { message: 'Error al registrar el usuario' } });
    }
}

exports.index = async function (req, res) {
    res.render('dashboard.ejs');
}

const validateUsuarioForm = function (req) {
    if (!req.body.username || !req.body.email || !req.body.password) {
        const errors = {
            username: !req.body.username,
            email: !req.body.email,
            password: !req.body.password
        };
        errors.message = 'Todos los campos son obligatorios';
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        return { errors, user };
    }
    return { errors: null, user: null };
}
