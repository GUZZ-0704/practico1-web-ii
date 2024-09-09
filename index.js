const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fileUpload = require('express-fileupload');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));


const db = require("./models");
const session = require('express-session');
db.sequelize.sync({
    //force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});

app.use(session({
    secret: 'esta es la clave de encriptación de la sesión y puede ser cualquier texto'
}))

//middleware
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});
require('./routes')(app);


app.listen(3000, function () {
    console.log('Ingrese a http://localhost:3000')
})