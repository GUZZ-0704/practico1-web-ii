const fs = require('fs');
const path = require('path');
const db = require("../models");

// Listar burgeres
exports.listBurger = function (req, res) {
    db.burgers.findAll({
        include: 'restaurant'
    }).then(burgers => {
        console.log(burgers); // Revisa los datos en la consola
        res.render('burgers/list.ejs', { burgers: burgers });
    });
};


// Formulario para crear burgere
exports.createBurger = async function (req, res) {
    const restaurants = await db.restaurants.findAll();
    res.render('burgers/form.ejs', { burger: null, restaurants, errors: null });
};

// Insertar nuevo burgere
exports.insertBurger = async function (req, res) {
    const { errors, burger } = validateBurgerForm(req);
    
    if (errors) {
        const restaurants = await db.restaurants.findAll();
        return res.render('burgers/form.ejs', { burger: burger,restaurants, errors: errors });
    }
    

    try {
        // Crear la hamburguesa en la base de datos
        const newBurger = await db.burgers.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: '', // La imagen se actualizará después
            restaurantId: req.body.restaurantId
        });

        // Obtener el id del restaurante
        const restaurantId = req.body.restaurantId;
        const burgerId = newBurger.id;

        // Construir la ruta de la imagen
        const image = req.files.image;
        // eslint-disable-next-line no-undef
        const uploadPath = path.join(__dirname, '/../public/images/profile/', `${newBurger.restaurantId}/${newBurger.id}.jpg`);

        // Crear el directorio del restaurante si no existe
        if (!fs.existsSync(path.dirname(uploadPath))) {
            fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
        }

        // Mover la imagen a la carpeta del restaurante
        image.mv(uploadPath, async function (err) {
            if (err) {
                console.error(err);
                return res.render('burgers/form.ejs', { errors: { message: 'Error al subir la imagen' }, burger: newBurger });
            }

            // Actualizar la hamburguesa con la ruta de la imagen
            newBurger.image = `${restaurantId}/${burgerId}.jpg`;
            await newBurger.save();

            res.redirect('/burgers');
        });
    } catch (error) {
        console.error(error);
        res.render('burgers/form.ejs', { errors: { message: 'Error al crear la hamburguesa' }, burger });
    }
};

// Editar burgere
exports.editBurger = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);
    const restaurants = await db.restaurants.findAll();
    res.render('burgers/form.ejs', { burger: burger, errors: null, restaurants });
};


exports.updateBurger = async function (req, res) {
    const { errors, burger: burgerErrors } = validateBurgerNoImage(req);
    
    if (errors) {
        const restaurants = await db.restaurants.findAll();
        return res.render('burgers/form.ejs', { burger: burgerErrors, errors: errors , restaurants});
    }

    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);

    burger.name = req.body.name;
    burger.description = req.body.description;
    burger.price = req.body.price;
    burger.restaurantId = req.body.restaurantId;

    if (req.files?.image) {
        const image = req.files.image;
        // eslint-disable-next-line no-undef
        const uploadPath = path.join(__dirname, '/../public/images/profile/', `${burger.restaurantId}/${id}.jpg`);

        image.mv(uploadPath, function (err) {
            if (err) {
                console.error(err);
                return res.render('burgers/form.ejs', { errors: { message: 'Error al subir la imagen' }, burger });
            }
        });
    }

    await burger.save();
    res.redirect('/admin/burgers');
};

// Eliminar burgere
exports.deleteBurger = async function (req, res) {
    const id = req.params.id;
    const burger = await db.burgers.findByPk(id);
    await burger.destroy();
    res.redirect('/admin/burgers');
};

exports.viewBurger = async function (req, res) {
    const id = req.params.burgerId;
    const burger = await db.burgers.findByPk(id, {
        include: 'restaurant'
    });
    const reviews = await db.reviews.findAll({
        where: { burgerId: id },
        include: 'user'
    });
    res.render('burgers/burgerDetail.ejs', { burger: burger, reviews });
}

// Validar formulario de burgere

const validateBurgerForm = function (req) {
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.restaurantId || !req.files?.image) {
        const errors = {
            name: !req.body.name,
            description: !req.body.description,
            price: !req.body.price,
            restaurantId: !req.body.restaurantId,
            image: !req.files?.image
        };
        errors.message = 'Todos los campos son obligatorios';
        const burger = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            restaurantId: req.body.restaurantId,
            image: req.files?.image
        };
        return { errors, burger };
    }
    return { errors: null, burger: null };
};

const validateBurgerNoImage = function (req) {
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.restaurantId) {
        const errors = {
            name: !req.body.name,
            description: !req.body.description,
            price: !req.body.price,
            restaurantId: !req.body.restaurantId
        };
        errors.message = 'Todos los campos son obligatorios';
        const burger = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            restaurantId: req.body.restaurantId
        };
        return { errors, burger };
    }
    return { errors: null, burger: null };
}
