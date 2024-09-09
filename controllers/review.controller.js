const db = require("../models");

// Formulario para crear nueva review sin pasar IDs en la ruta
exports.createReviewNew = async function (req, res) {
    try {
        const burgers = await db.burgers.findAll();
        const users = await db.users.findAll();
        res.render('reviews/form.ejs', { review: null, burgers, users,burger: null, isBlock: false, errors: null });
    } catch (error) {
        console.error(error);
        res.render('reviews/form.ejs', { review: null, burgers: [], users: [], isBlock: false, errors: { message: 'Error al cargar el formulario' } });
    }
};

// Formulario para editar o crear una review con IDs en la ruta (puede estar bloqueado)
exports.createReview = async function (req, res) {
    const { burgerId, userId } = req.params;
    
    try {
        const burger = await db.burgers.findByPk(burgerId);
        const user = await db.users.findByPk(userId);
        
        if (!burger || !user) {
            return res.render('reviews/form.ejs', { review: null, burger: null, user: null, isBlock: true, errors: { message: 'Hamburguesa o usuario no encontrados' } });
        }
        
        const review = await db.reviews.findOne({ where: { burgerId, userId } });
        res.render('reviews/form.ejs', { review, burger, user, isBlock: true, errors: null });
    } catch (error) {
        console.error(error);
        res.render('reviews/form.ejs', { review: null, burger: null, user: null, isBlock: true, errors: { message: 'Error al cargar el formulario' } });
    }
};

// Crear nueva review desde el formulario sin IDs en la ruta
exports.insertReviewNew = async function (req, res) {
    const { errors, review } = validateReviewForm(req);
    
    if (errors) {
        const burgers = await db.burgers.findAll();
        const users = await db.users.findAll();
        return res.render('reviews/form.ejs', { review, burgers, users, isBlock: false, errors });
    }

    try {
        await db.reviews.create({
            title: req.body.title,
            description: req.body.description,
            rating: req.body.rating,
            burgerId: req.body.burgerId,
            userId: req.body.userId
        });
        res.redirect('/admin/reviews'); // O donde sea que redirijas después de crear una review
    } catch (error) {
        console.error(error);
        const burgers = await db.burgers.findAll();
        const users = await db.users.findAll();
        res.render('reviews/form.ejs', { review, burgers, users, isBlock: false, errors: { message: 'Error al crear la review' } });
    }
};

// Crear o actualizar una review con IDs en la ruta (bloqueado)
exports.insertReview = async function (req, res) {
    const { burgerId, userId } = req.params;
    const { errors, review: reviewErrors } = validateReviewForm(req);
    
    if (errors) {
        const burger = await db.burgers.findByPk(burgerId);
        const user = await db.users.findByPk(userId);
        return res.render('reviews/form.ejs', { review: reviewErrors, burger, user, isBlock: true, errors });
    }

    try {
        let review = await db.reviews.findOne({ where: { burgerId, userId } });
        
        if (review) {
            // Actualizar review existente
            review.title = req.body.title;
            review.description = req.body.description;
            review.rating = req.body.rating;
            await review.save();
        } else {
            // Crear nueva review
            await db.reviews.create({
                title: req.body.title,
                description: req.body.description,
                rating: req.body.rating,
                burgerId,
                userId
            });
        }
        const burger = await db.burgers.findByPk(burgerId);
        res.redirect(`/burgers/${burgerId}/restaurant/${burger.restaurantId}`);
    } catch (error) {
        console.error(error);
        const burger = await db.burgers.findByPk(burgerId);
        const user = await db.users.findByPk(userId);
        res.render('reviews/form.ejs', { review: reviewErrors, burger, user, isBlock: true, errors: { message: 'Error al crear o actualizar la review' } });
    }
};

exports.editReview = async function (req, res) {
    const { id } = req.params;

    try {
        const review = await db.reviews.findByPk(id);
        if (!review) {
            return res.redirect('/admin/reviews?error=Review no encontrada');
        }

        const burgers = await db.burgers.findAll();
        const users = await db.users.findAll();
        const user = await db.users.findByPk(review.userId);
        const burger = await db.burgers.findByPk(review.burgerId);
        res.render('reviews/form.ejs', { review, burgers, users, user, burger, isBlock: false, errors: null });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/reviews?error=Error al cargar el formulario');
    }
};

// Actualizar una review
exports.updateReview = async function (req, res) {
    const { id } = req.params;
    const { errors, review } = validateReviewForm(req);

    if (errors) {
        try {
            const burgers = await db.burgers.findAll();
            const users = await db.users.findAll();
            const user = await db.users.findByPk(req.body.userId);
            const burger = await db.burgers.findByPk(req.body.burgerId);
            return res.render('reviews/form.ejs', { 
                review, 
                burgers, 
                users, 
                user,
                burger,
                isBlock: false, 
                errors 
            });
        } catch (error) {
            console.error(error);
            return res.redirect('/admin/reviews?error=Error al cargar el formulario');
        }
    }

    try {
        let reviewToUpdate = await db.reviews.findByPk(id);
        if (!reviewToUpdate) {
            return res.redirect('/admin/reviews?error=Review no encontrada');
        }

        reviewToUpdate.title = req.body.title;
        reviewToUpdate.description = req.body.description;
        reviewToUpdate.rating = req.body.rating;
        reviewToUpdate.burgerId = req.body.burgerId;
        reviewToUpdate.userId = req.body.userId;
        await reviewToUpdate.save();
        res.redirect('/admin/reviews?success=Review actualizada exitosamente');
    } catch (error) {
        console.error(error);
        try {
            const burgers = await db.burgers.findAll();
            const users = await db.users.findAll();
            const user = await db.users.findByPk(req.body.userId);
            const burger = await db.burgers.findByPk(req.body.burgerId);
            return res.render('reviews/form.ejs', { 
                review, 
                burgers, 
                users, 
                user,
                burger,
                isBlock: false, 
                errors: { message: 'Error al actualizar la review' } 
            });
        } catch (err) {
            console.error(err);
            res.redirect('/admin/reviews?error=Error al cargar el formulario');
        }
    }
};

exports.deleteReview = async function (req, res) {
    console.log('deleteReview function called');
    const { id } = req.params;
    console.log(`Received ID: ${id}`);

    // Validar que el ID sea un número
    if (isNaN(id)) {
        console.log('Invalid ID');
        return res.redirect('/admin/reviews?error=ID inválido');
    }

    try {
        const review = await db.reviews.findByPk(id);
        if (!review) {
            console.log('Review not found');
            return res.redirect('/admin/reviews?error=Review no encontrada');
        }

        await review.destroy();
        console.log('Review deleted successfully');
        res.redirect('/admin/reviews?success=Review eliminada exitosamente');
    } catch (error) {
        console.error('Error deleting review:', error);
        res.redirect('/admin/reviews?error=Error al eliminar la review');
    }
};



// Validación de formulario de review
const validateReviewForm = function (req) {
    console.log(req.body);
    if (!req.body.title || !req.body.description || !req.body.rating || !req.body.burgerId || !req.body.userId) {
        const errors = {
            title: !req.body.title,
            description: !req.body.description,
            rating: !req.body.rating,
            burgerId: !req.body.burgerId,
            userId: !req.body.userId
        };
        errors.message = 'Todos los campos son obligatorios';
        const review = {
            title: req.body.title,
            description: req.body.description,
            rating: req.body.rating,
            burgerId: req.body.burgerId,
            userId: req.body.userId
        };
        return { errors, review };
    }
    return { errors: null, review: null };
};
