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

    //Codigo para Rankiar peliculas
    app.post("/v1/MoviesShows/Ranking", (req,res) =>{
        let iduser = req.body.iduser;
        let idmovie = req.body.idmovie

        var q = `insert into [dbo].[Rancking]([UserID], [MoviesID]) values ('${iduser}', '${idmovie}')`;
        new sql.ConnectionPool(sqlconfig).connect().then(pool =>{
            return pool.query(q)
        })
        .then(result =>{
            var data ={
                success : true,
                message : 'Ranking',
                data : result.recordset
            }
            res.send(data)
        })
        .catch(err =>{
            console.log(err);
        })
    })


    //Codigo para Guardar Likes
     app.post("/v1/MoviesShows/Like", (req,res) =>{
         let iduser = req.body.iduser;
         let idmovie = req.body.idmovie

         var q = `insert into [dbo].[Likes]([UserID], [MoviesID]) values ('${iduser}', '${idmovie}')`;
         new sql.ConnectionPool(sqlconfig).connect().then(pool =>{
             return pool.query(q)
         })
         .then(result =>{
             var data ={
                 success : true,
                 message : 'Gracias por su Like',
                 data : result.recordset
             }
             res.send(data)
         })
         .catch(err =>{
             console.log(err);
         })
     })


    //Codigo para Buscar Por Nombre o Genero

    app.get("/v1/MoviesShows/:searchTerm", (req, res)=>{
        
        let search = req.query.search;

        var q = `select  * from Movies m inner join Movies_Genres mg  on  m.MoviesID = mg.MoviesID inner join Genres g on  mg.Genres_ID = g.Genres_ID where m.Name like '${search}' or g.Genred like '${search}`
        new sql.ConnectionPool(sqlconfig).connect().then(pool =>{
            return pool.query(q)
        })
        .then(result =>{
            var data ={
                success : true,
                message : `Mostrando Busqueda`,
                data : result.recordset
            }
            res.send(data);
        })
        .catch(err =>{
            console.log(err);
        })

    })

    //Codigo de Consulta de los detalles
     
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

     app.get("/v1/MoviesShows/:id/trailler", (req, res)=>{
    
        let id = req.params.id;
                       
        var q =`select Trailler from Trailers inner join Movies on Trailers.MoviesID = Movies.MoviesID  where Movies.MoviesID like ${id}`
        
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

    //Muestra la Imagen del  Show o Pelicula

    app.get("/v1/MoviesShows/:id/images", (req, res)=>{
    
        let id = req.params.id;
                       
        var q =`select Image_URL  from Images inner join Movies on Images.MoviesID = Movies.MoviesID  where Movies.MoviesID like ${id}`
        
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

    //Muestra los Likes de la Pelicula

    app.get("/v1/MoviesShows/:id/Likes", (req, res)=>{
    
        let id = req.params.id;
                       
        // var q =`select count (m.MoviesID) as Movies, count(l.MoviesID) as Likes from Movies m  INNER join [dbo].[Likes] l on m.MoviesID = l.MoviesId GROUP BY m.MoviesID`
         var q = `Select (m.MoviesID) as Movie, count (l.MoviesID) as Likes from [Movies] m inner join [Likes] l on m.MoviesID = l.MoviesID where (m.MoviesID like ${id}) GROUP BY m.MoviesID`

        new sql.ConnectionPool(sqlconfig).connect().then(pool =>{
            return pool.query(q)
        })
        .then(result => {
            var data ={
                success : true,
                message : `Mostrando Likes de la Pelicula`,
                data : result.recordset
            }
            res.send(data);
        })
        .catch(err =>{
            console.error(err);
        })
        
    });

    //Muestra el Ranking de la Pelicula

    app.get("/v1/MoviesShows/:id/Ranking", (req, res)=>{
    
        let id = req.params.id;
                       
        // var q =`select count (m.MoviesID) as Movies, count(l.MoviesID) as Likes from Movies m  INNER join [dbo].[Likes] l on m.MoviesID = l.MoviesId GROUP BY m.MoviesID`
         var q = ` Select (m.MoviesID) as Movie, count (r.MoviesID) as Ranking from [Movies] m inner join [Rancking] r on m.MoviesID = r.MoviesID where (m.MoviesID like ${id}) GROUP BY m.MoviesID`

        new sql.ConnectionPool(sqlconfig).connect().then(pool =>{
            return pool.query(q)
        })
        .then(result => {
            var data ={
                success : true,
                message : `Mostrando Ranking de la Pelicula`,
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
