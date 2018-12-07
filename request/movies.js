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

    app.get("/v1/MoviesShows/Filter/All", (req, res) =>{

       
        var q = `select * from [dbo].[Movies]`
        
        new sql.ConnectionPool(sqlconfig).connect().then(pool => {
                return pool.query(q)
        })
        .then(result =>{
            var data ={
                success: true,
                message : 'Mostrando Series y Peliculas',
                data : result.recordset,
            }
            res.send(data);
            console.log(q)
        })
        .catch(err => {
            console.error(err);
        });

    })

    //Filtra por Peliculas

    app.get("/v1/MoviesShows/Filter/Movies", (req, res) =>{
       
        var q = `select * from [dbo].[Movies] where [Type] like 'Movie'`

        new sql.ConnectionPool(sqlconfig).connect().then(pool =>{

            return pool.query(q)

        })

        .then(result => {
            var data ={
                success :true,
                message : 'Mostrando Peliculas',
                data : result.recordset
            }
            res.send(data);
        })
        .catch(err =>{
            console.error(err);
        })
    });

    //Filtra por Series

    app.get("/v1/MoviesShows/Filter/Shows", (req, res) =>{
        
       
        var q = `select * from [dbo].[Movies] where [Type] like 'Show'`

        new sql.ConnectionPool(sqlconfig).connect().then(pool =>{

            return pool.query(q)

        })

        .then(result => {
            var data ={
                success :true,
                message : 'Mostrando Series',
                data : result.recordset
            }
            res.send(data);
        })
        .catch(err =>{
            console.error(err);
        })
    });

     
    //Detalle de las Peliculas y Show

    app.get("/v1/MoviesShows/:id/detalle", (req, res)=>{
    
        let id = req.params.id;
        
               
        var q =`select * from [dbo].[Movies] where [dbo].[Movies].[MoviesID] = ${id}`
        
        new sql.ConnectionPool(sqlconfig).connect().then(pool =>{
            return pool.query(q)
        })
        .then(result => {
            var data ={
                success : true,
                message : `Mostrando detalle`,
                data : result.recordset
            }
            res.send(data);
        })
        .catch(err =>{
            console.error(err);
        })
        
    });

     //Muestra el Trailer Show o Pelicula

     app.get("/v1/MoviesShows/:id/trailler/", (req, res)=>{
    
        let id = req.params.id;
        
               
        var q =`select Trailler from Trailers inner join Movies on Trailers.MoviesID = Movies.MoviesID = ${id}`
        
        new sql.ConnectionPool(sqlconfig).connect().then(pool =>{
            return pool.query(q)
        })
        .then(result => {
            var data ={
                success : true,
                message : `Mostrando Trailer`,
                data : result.recordset
            }
            res.send(data);
        })
        .catch(err =>{
            console.error(err);
        })
        
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //Filtros por Tipo Genero Año y Clasificacion

     /* app.get("/v1/MoviesShows/Filter/:Type", (req, res) =>{

        let Type = req.params.Type;
        let Release_Date = req.query.Release_Date;
        let Genred = req.query.Genred;
        let Rancking = req.params.Rancking;
        let Classification = req.query.Classification;
                
               
        var q = `select * from [dbo].[Movies] where [Type] like 'Show'`

        new sql.ConnectionPool(sqlconfig).connect().then(pool =>{

            return pool.query(q)

        })

        .then(result => {
            var data ={
                success :true,
                message : 'Mostrando Series',
                data : result.recordset
            }
            res.send(data);
        })
        .catch(err =>{
            console.error(err);
        })
    });


 */

}
