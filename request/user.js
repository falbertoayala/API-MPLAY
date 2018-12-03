let auth = require("./auth");
const sgMail = require('@sendgrid/mail');
module.exports = (app, sql, sqlconfig) => {
    // Mensaje de Bienvenida
    app.get('/', (res) => {
        res.send('<h1>BIENVENIDO A MPLAY</h1>')
    });

    // Funcion para realizar una sola conexion con la DB al introducir data.
    var ConnectionPool_POST = (q, res) => {
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

    // Funcion para realizar una sola conexion con la DB al consultar data.
    var ConnectionPool_GET = (q, res) => {
        new sql.ConnectionPool(sqlconfig).connect().then(pool => {
                return pool.query(q)
            })
            .then(result => {
                var data = {
                    success: true,
                    message: ``,
                    result: result.recordset
                }
                res.send(data);
            })
            .catch(err => {
                console.error(err);
            });
    }

    // Funcion para registrar nuevos usuarios
    app.post('/v1/Account/Register', (req, res) => {
        let name = req.body.name;
        let email = req.body.email;
        let pass = req.body.pass;
        let repeatPass = req.body.repeatPass;
        let birthDay = req.body.birthDay;
        let acceptConditions = req.body.acceptConditions;

        if (!name || !email || !pass || !repeatPass || !birthDay) {
            res.send("Debes completar los campos del formulario.");
        } else if (!acceptConditions) {
            res.send('Debes aceptar los terminos y condiciones')
        } else if (pass != repeatPass) {
            res.send("Las contraseñas no coinciden.");
        } else {

            var q = `insert into dbo.Users([First_Name], [Email], [Password], [Birth_Date]) values('${name}', '${email}', '${pass}', cast(${birthDay} as smalldatetime))`;
            new sql.ConnectionPool(sqlconfig).connect().then(pool => {
                    return pool.query(q)
            })
            .then(result => {
                var data = {
                    success: true,
                    message: `Se ha creado ${result.rowsAffected} registro nuevo`,
                }
                res.send(data);
                // Funcion para generar el id mandando el email, pass y quien genera la llamada para obtener el respectivo id.
                generateId(email, pass, 'userDetails');
                 // envio de email a traves de sendgrid.com
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: email,
                    from: 'admin@mplay.com',
                    subject: 'Welcome to aur Service',
                    text: 'Hey, Welcome to MPLAY!!!',
                    html: `${name} You new account <strong> is ready </strong>`,
                };
                //console.log(msg);
                sgMail.send(msg);
                //console.log(sgMail);    
            })
            .catch(err => {
                console.error(err);
            });
           
        }
    });

    // funcion para agregar redes sociales por el usuario
    app.post('/v1/Account/socialNetworks:id', (req, res) => {
        var id = req.params.id;

        if (!id) {
            res.send("Error parametro id no existe");
        }

        let Name_Social_Networks = req.body.Name_Social_Networks;
        let Url_Social_Networks = req.body.Url_Social_Networks;

        if (!Name_Social_Networks || !Url_Social_Networks) {
            res.send("Los campos estan vacios");
        } else {
            var q = `INSERT INTO dbo.Social_Networks ([UserID], [Name_Social_Networks], [Url_Social_Networks]) 
            VALUES ('${UserID}','${Name_Social_Networks}', '${Url_Social_Networks}')`

            console.log(q);

            ConnectionPool_POST(q, res);
        }
    });

    // funcion para cerrar sesion.
    app.post('/v1/Account/Logout', (req, res) => {
        //esperando codigo
    });

    app.post('/v1/Account/Login', (req, res, next)=>{
        var email = req.body.email;
        var password = req.body.password;

       // console.log(email + password)
        if(!email || !password){
            res.status(403).send({ message: "missing parameters"});
        }

        var q = `select top 1 * from dbo.Users u where u.Email = '${email}' and u.Password = '${password}'`
        new sql.ConnectionPool(sqlconfig).connect().then(request => {
            return request.query(q);
        })
        .then(result => {

            if(result.recordset.length > 0)
            {
                res.send({ 
                        success: true, 
                        message: "",
                        token: auth.CreateToken(result.recordset.UserID),
                        user: result.recordset
                    });
            } else {
                res.status(403).send({
                    success: false,
                    message: "wrong user or password"
                })
            }
        })
        .catch(err =>{
            return next(err);
        })
    });

    // Obtener Id del usuario registrado
    var generateId = (email, pass, generateTypeId) => {
        var q = `select UserID from dbo.Users where [Email]='${email}' and [Password]='${pass}'`;

        new sql.ConnectionPool(sqlconfig).connect().then(pool => {
                return pool.query(q)
            })
            .then(result => {
                var data = {
                    result: result.recordset
                }
                if (generateTypeId === 'userDetails') {
                    userDefaultData(data.result[0].UserID);
                } else {
                    console.log('Generacion de Id incorrecta');
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    // Funcion para llenar datos por default al usuario registrado
    var userDefaultData = (UserIdData) => {
        let id = UserIdData;
        let lastName = '';
        let gender = '';
        let userName = '';
        let profilePicture = '';
        let biography = '';
        let country = '';
        let city = '';
        let areaCode = '';
        console.log(lastName, gender, userName, profilePicture, biography, country, city, areaCode);

        var q = `insert into dbo.User_Details([UserID],[Last_Name], [Gender], [UserName], [Profile_Picture], [Biography], [Country], [City], [Area_Code]) values(${id},'${lastName}', '${gender}', '${userName}','${profilePicture}','${biography}','${country}','${city}','${areaCode}')`;
        new sql.ConnectionPool(sqlconfig).connect().then(pool => {
                return pool.query(q)
            })
            .catch(err => {
                console.error(err);
            });
    }

    // Funcion para actualizar los detalles del perfil de usuario
    app.put('/v1/Account/userDetails/:id', (req, res) => {
        let id = req.params.id;
        console.log(id)
        if (!id) {
            res.send({
                message: 'Error parametro id no existe'
            });
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

        if (!lastName, !gender, !userName, !profilePicture, !biography, !country, !city, !areaCode) {
            res.send("Campos Vacios");
        } else {
            var q = `insert into dbo.User_Details([UserID],[Last_Name], [Gender], [UserName], [Profile_Picture], [Biography], [Country], [City], [Area_Code]) values(${id},'${lastName}', '${gender}', '${userName}','${profilePicture}','${biography}','${country}','${city}','${areaCode}')`;
            ConnectionPool_POST(q, res);
        }
    });

    // funcion para obtener toda la informacion del usuario.
    app.get('/v1/Account/UserInfo/:id', (req, res) => {
        var id = req.params.id;

        if (!id) {
            res.send("Error parametro id no existe");
        }

        var q = `select * from [dbo].[Users] u inner join [dbo].[User_Details] d on u.UserID = d.UserID`;
        ConnectionPool_GET(q, res);
    });
}