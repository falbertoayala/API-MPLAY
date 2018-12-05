module.exports = (app, sql, sqlconfig) => {

    // Agregar Peliculas
    app.post('/v1/add/MoviesShows', (req, res) => {
        let Type = req.body.Type;
        let Name = req.body.Name;
        let Thumb = req.body.Thumb;
        let Classification = req.body.Classification;
        let Time = req.body.Time;
        let Release_Date = req.body.Release_Date;
        let Director = req.body.Director;
        let Sinopsis = req.body.Sinopsis;

        if ( !Type || !Name || !Thumb || !Classification || !Time || !Release_Date || !Director || !Sinopsis )  {
            res.send("Debes completar los campos del formulario.");
        } else {

            var q = `insert into [dbo].[Movies]([Type], [Name], [Thumb], [Classification], [Time],[Release_Date], [Director], [Sinopsis]) values('${Type}', '${Name}', '${Thumb}', '${Classification}', cast(${Time} as smalldatetime), cast(${Release_Date} as date), '${Director}', '${Sinopsis}')`;
            // ConnectionPool(q, res);
            new sql.ConnectionPool(sqlconfig).connect().then(pool => {
                    return pool.query(q)
                })
                .then(result => {
                    var data = {
                        success: true,
                        message: `Se ha creado ${result.rowsAffected} registro nuevo`,
                        result: result.recordset
                    }
                    res.send(data);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    });
    // Filtrar Peliculas y Shows

    app.get("/v1/MoviesShows/Filter/All", req, res =>{

        let Type = req.query.Type;

        var q = `select * from [dbo].[Movies] where [Type] like '${Type}'`
        
        new sql.ConnectionPool(sqlconfig).connect().then(pool => {
                return pool.query(q)
        })
        .then(result =>{
            var data ={
                success: true,
                message : '',
                result : result.recordset
            }
            res.send(data);
        })
        .catch(err => {
            console.error(err);
        });


    })
}
