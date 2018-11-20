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
app.use(bodyparser.urlencoded({extended:true}));


// creao una variable que almacenara la funcion de configuracion de acceso a la base detos.
const sqlconfig = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    debug: true,
    options: {
        encrypt: false,
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

// Mensaje de Bienvenida
app.get('/', (req, res) => {
    res.send('<h1>BIENVENIDO A MPLAY</h1>')
});

// Funcion que me permite registrar nuevos usuarios
app.post('/v1/Account/Register', (req, res, next) => {
    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.pass;
    let repeatPass = req.body.repeatPass;
    let birthDay = req.body.birthDay;
    let acceptConditions = req.body.acceptConditions;

    //console.log(name,email,pass, repeatPass, birthDay,acceptConditions)
    if (!name || !email || !pass || !repeatPass || !birthDay) {
        res.send("Debes completar los campos del formulario.");
    } else if (!acceptConditions) {
        res.send('Debes aceptar los terminos y condiciones')
    } else if (pass != repeatPass) {
        res.send("Las contraseñas no coinciden.");
    }else{

    var q = `insert into dbo.Users([First_Name], [Email], [User_Password], [Birth_Date]) values('${name}', '${email}', '${pass}', cast(${birthDay} as smalldatetime))`;

    new sql.ConnectionPool(sqlconfig).connect().then(pool => {
            return pool.query(q)
        })
        .then(result => {
            var data = {
                success: true,
                message: `Se ha creado ${result.rowsAffected} registro nuevo`
            }
            res.send(data);
        })
        .catch(err => {
            console.error(err);
        });

    }
});

app.post('/v1/Account/userDetails/:id', (req,res,next) => {
    let id = req.params.id;
    console.log(id)
    if(!id){
        res.send("Error parametro id no existe");
    }
    
    let lastName = req.body.lastName;
    let gender = req.body.gender;
    let userName = req.body.userName;
    let profilePicture = req.body.profilePicture;
    let biography = req.body.biography;
    let country = req.body.country;
    let city = req.body.city;
    let areaCode = req.body.areaCode;
    console.log(lastName, gender, userName, profilePicture, biography, country, city, areaCode);

    if(!lastName, !gender, !userName, !profilePicture, !biography, !country, !city, !areaCode){
        res.send("Campos Vacios");
    }else{

    
   
    var q = `insert into dbo.User_Details([UserID],[Last_Name], [Gender], [UserName], [Profile_Picture], [Biography], [Country], [City], [Area_Code]) values(${id},'${lastName}', '${gender}', '${userName}','${profilePicture}','${biography}','${country}','${city}','${areaCode}')`;

    new sql.ConnectionPool(sqlconfig).connect().then(pool => {
            return pool.query(q)
        })
        .then(result => {
            var data = {
                success: true,
                message: `Se ha creado ${result.rowsAffected} registro nuevo`
            }
            res.send(data);
        })
        .catch(err => {
            console.error(err);
        });
    }
    });


