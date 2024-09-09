const fs = require('fs');
const path = require('path');
const db = require("../models");

// Listar restaurantes
exports.listRestaurant = function (req, res) {
    db.restaurants.findAll({
        include: 'burgers'
    }).then(restaurants => {
        res.render('restaurants/list.ejs', { restaurants: restaurants });
    });
};

// Formulario para crear restaurante
exports.createRestaurant = async function (req, res) {
    const restaurants = await db.restaurants.findAll();
    res.render('restaurants/form.ejs', { restaurant: null, restaurants, errors: null });
};

// Insertar nuevo restaurante
exports.insertRestaurant = async function (req, res) {
    const { errors, restaurant } = validateRestaurantForm(req);
    
    if (errors) {
        return res.render('restaurants/form.ejs', { restaurant: restaurant, errors: errors });
    }

    try {
        const newRestaurant = await db.restaurants.create({
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            image: '' // Aún no ponemos la imagen
        });

        if (req.files?.image) {
            const image = req.files.image;
            // eslint-disable-next-line no-undef
            const uploadPath = path.join(__dirname, '/../public/images/profile/', `${newRestaurant.id}.jpg`);

            if (!fs.existsSync(path.dirname(uploadPath))) {
                fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
            }

            image.mv(uploadPath, async function (err) {
                if (err) {
                    console.error(err);
                    return res.render('restaurants/form.ejs', { errors: { message: 'Error al subir la imagen' }, restaurant: newRestaurant });
                }

                newRestaurant.image = `${newRestaurant.id}/${newRestaurant.id}.jpg`;
                await newRestaurant.save();

                res.redirect('/restaurants');
            });
        } else {
            res.redirect('/restaurants');
        }
    } catch (error) {
        console.error(error);
        res.render('restaurants/form.ejs', { errors: { message: 'Error al crear el restaurante' }, restaurant });
    }
};

// Editar restaurante
exports.editRestaurant = async function (req, res) {
    const id = req.params.id;
    const restaurant = await db.restaurants.findByPk(id);
    res.render('restaurants/form.ejs', { restaurant: restaurant, errors: null });
};

// Actualizar restaurante
exports.updateRestaurant = async function (req, res) {
    const { errors, restaurant: restaurantErrors } = validateRestaurantNoImageForm(req);
    
    if (errors) {
        return res.render('restaurants/form.ejs', { restaurant: restaurantErrors, errors: errors });
    }

    const id = req.params.id;
    const restaurant = await db.restaurants.findByPk(id);

    restaurant.name = req.body.name;
    restaurant.description = req.body.description;
    restaurant.address = req.body.address;

    if (req.files?.image) {
        const image = req.files.image;
        // eslint-disable-next-line no-undef
        const uploadPath = path.join(__dirname, '/../public/images/profile/', `${restaurant.id}.jpg`);

        if (!fs.existsSync(path.dirname(uploadPath))) {
            fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
        }

        image.mv(uploadPath, function (err) {
            if (err) {
                console.error(err);
                return res.render('restaurants/form.ejs', { errors: { message: 'Error al subir la imagen' }, restaurant });
            }
        });
    }

    restaurant.image = `${restaurant.id}/${restaurant.id}.jpg`;
    await restaurant.save();
    res.redirect('/admin/restaurants');
};

// Eliminar restaurante
exports.deleteRestaurant = async function (req, res) {
    const id = req.params.id;
    const restaurant = await db.restaurants.findByPk(id);
    await restaurant.destroy();
    res.redirect('/admin/restaurants');
};

exports.viewRestaurant = async function (req, res) {
    const id = req.params.id;
    const restaurant = await db.restaurants.findByPk(id, {
        include: {
            model: db.burgers,
            as: 'burgers', // Usar el alias correcto
            include: {
                model: db.restaurants,
                as: 'restaurant' // Usar el alias correcto para la asociación inversa
            }
        }
    });
    res.render('burgers/list.ejs', { burgers: restaurant.burgers });
};


// Validar formulario de restaurante
const validateRestaurantForm = function (req) {
    const errors = {
        name: !req.body.name,
        description: !req.body.description,
        address: !req.body.address,
        image: !req.files?.image
    };
    
    if (errors.name || errors.description || errors.address || errors.image) {
        errors.message = 'Todos los campos obligatorios deben ser llenados';
        const restaurant = {
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            image: req.files?.image
        };
        return { errors, restaurant };
    }
    return { errors: null, restaurant: null };
};

const validateRestaurantNoImageForm = function (req) {
    const errors = {
        name: !req.body.name,
        description: !req.body.description,
        address: !req.body.address
    };
    
    if (errors.name || errors.description || errors.address) {
        errors.message = 'Todos los campos obligatorios deben ser llenados';
        const restaurant = {
            name: req.body.name,
            description: req.body.description,
            address: req.body.address
        };
        return { errors, restaurant };
    }
    return { errors: null, restaurant: null };
}
