// instancio todas las dependencias a usar en el API.
var express = require('express');
var sql = require('mssql');
var cors = require('cors');
var bodyparser = require('body-parser');
var env = require('dotenv');
var multer = require('multer');
var path = require('path');

// Almaceno toda la funcionalidad del espress en la variable app.
var app = express();


// Programo para que el servido me le cambie la extension a los archivos subidos.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + getExtension(file.originalname))
    }
})

function getExtension(filename) {
    var ext = path.extname(filename || '').split('.');
    return ext[ext.length - 1];
}

var upload = multer({
    storage: storage
})

const result = env.config();

// Ejecuto las funciones
app.use(cors());
app.use(bodyparser());
app.use(bodyparser.urlencoded({
    extended: true
}));


// creao una variable que almacenara la funcion de configuracion de acceso a la base detos.
const sqlconfig = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    debug: true,
    options: {
        encrypt: true,
        instanceName: process.env.DB_INSTANCE_NAME
    }
}

// Crear la funcion que me atrapará errores.
app.use(function (err, req, res, next) {
    console.log(err);
    res.send({
        success: false,
        message: err
    });
});

// Escucho el puerto para levantar el servidor
app.listen(parseInt(process.env.APP_PORT), () => {
    console.log("Esta corriendo el servidor!!!")
    console.log(result.parsed);
    console.log(sqlconfig);
});

require("./request/user")(app, sql, sqlconfig);
require("./request/movies")(app, sql, sqlconfig);
