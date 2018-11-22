module.exports = (app, sql, sqlconfig) => {
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
        console.log(birthDay);
        //console.log(name,email,pass, repeatPass, birthDay,acceptConditions)
        if (!name || !email || !pass || !repeatPass || !birthDay) {
            res.send("Debes completar los campos del formulario.");
        } else if (!acceptConditions) {
            res.send('Debes aceptar los terminos y condiciones')
        } else if (pass != repeatPass) {
            res.send("Las contraseñas no coinciden.");
        } else {

            var q = `insert into dbo.Users([First_Name], [Email], [Password], [Birth_Date]) values('${name}', '${email}', '${pass}', cast(${birthDay} as smalldatetime))`;
            ConnectionPool(q, res);

            getIdUserRegister(email, pass, res);
        }
    });
    
    // Obtener Id del usuario registrado
    var getIdUserRegister = (email, pass, res)=>{
        var q = `select UserID from dbo.Users where [Email]='${email}' and [Password]='${pass}'`;

        new sql.ConnectionPool(sqlconfig).connect().then(pool => {
            return pool.query(q)
        })
        .then(result => {
            var data = {
                success: true,
                message: '',
                UserID: result.recordset
            }
            UserIdData = data.UserID[0].UserID
            userDefaultData(UserIdData);
        })
        .catch(err => {
            console.error(err);
        });

        
    }

   


// Funcion para llenar datos por defalut al usuario registrado
 var userDefaultData = (UserIdData, res) => {
        let id=UserIdData;
        console.log(`Estoy imprimiendo ${id}`);
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
            .then(result => {
            
            })
            .catch(err => {
                console.error(err);
            });
           
        }

         // Declaro Funcion para realizar una sola conexion con la DB al introducir data.
    var ConnectionPool = (q, res)=>{
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

    app.post('/v1/Account/userDetails/:id', (req, res, next) => {
        let id = req.params.id;
        console.log(id)
        if (!id) {
            res.send({message: 'Error parametro id no existe'});
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

    app.post('/v1/Account/socialNetworks:id', (req, res, next) => {
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

            new sql.ConnectionPool(sqlconfig).connect().then(pool => {
                    return pool.query(q)
                })
                .then(result => {
                    var data = {
                        sucess: true,
                        message: `Se ha creado ${result.rowsAffected} registro nuevo`
                    }
                    res.send(data);
                })
                .catch(err => {
                    return next(err);
                })
        }
    });
}