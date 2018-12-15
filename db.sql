-- Usuario Db AWS = AdminBd
-- Password = Admin123

-- Access Key ID:
-- AKIAJ6A7EXH2C2LTSW2A
-- Secret Access Key:
-- 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

CREATE DATABASE DBMPLAY;

go

USE DBMPLAY;

go

CREATE TABLE Users (
	[UserID] int not null identity(1,1),
	[First_Name] varchar(50) not null,
	[Email] varchar(50) not null,
	[Password] varchar(25) not null,
	[Birth_Date] date,
	CONSTRAINT PK_Users PRIMARY KEY ([UserID])
)

go

CREATE TABLE User_Details (
	[User_Details_ID] int not null identity(1,1),
	[UserID] int,
	[Last_Name] varchar(50),
	[Gender] varchar(10) not null,
	[UserName] varchar(25) not null,
	[Profile_Picture] nvarchar(max),
	[Biography] varchar(255),
	[Country] varchar(25),
	[City] varchar(25),
	[Area_Code] varchar(10),
	CONSTRAINT PK_User_Details PRIMARY KEY ([User_Details_ID]),
	CONSTRAINT FK_Users FOREIGN KEY ([UserID])
	REFERENCES dbo.Users([UserID]) ON DELETE CASCADE
)

go

CREATE TABLE Movies (
	[MoviesID] int not null primary key identity(1,1),
	[Type] varchar(15) not null,
	[Name] varchar(50) not null,
	[Thumb] nvarchar(max) not null,
	[Classification] varchar(50) not null,
	[Time] smalldatetime not null,
	[Release_Date] date,
	[Director] varchar(50),
	[Sinopsis] varchar(max)
)

go

CREATE TABLE Cast_Movies(
	[Cast_ID] int not null identity(1,1),
	[MoviesID] int,
	[Actor] varchar(50),
	CONSTRAINT PK_Cast_Movies PRIMARY KEY([Cast_ID]),
	CONSTRAINT FK_Movies_Cast FOREIGN KEY ([MoviesID])
	REFERENCES Movies([MoviesID]) ON DELETE CASCADE
)

go

CREATE TABLE Trailers (
	[Trailers_ID] int not null identity(1,1),
	[MoviesID] int,
	[Trailler] varchar(max),
	CONSTRAINT PK_Trailer PRIMARY KEY([Trailers_ID]),
	CONSTRAINT FK_Movies_Trailers FOREIGN KEY ([MoviesID])
	REFERENCES Movies([MoviesID]) ON DELETE CASCADE
)

go

CREATE TABLE Images (
	[Image_ID] int not null identity(1,1),
	[MoviesID] int,
	[Image_URL] varchar(max),
	CONSTRAINT PK_Images PRIMARY KEY([Image_ID]),
	CONSTRAINT FK_MoviesImages FOREIGN KEY ([MoviesID])
	REFERENCES Movies([MoviesID]) ON DELETE CASCADE
)

go

CREATE TABLE Social_Networks (
	[Social_ID] int not null identity(1,1),
	[UserID] int,
	[Name] varchar(25),
	[Url]  varchar(255),
	CONSTRAINT PK_Social_Networks PRIMARY KEY([Social_ID]),
	CONSTRAINT FK_Users_Social FOREIGN KEY ([UserID])
	REFERENCES Users([UserID]) ON DELETE CASCADE
)

go

CREATE TABLE Genres (
	[Genres_ID] int not null identity(1,1),
	[Genred] varchar (50) not null,
	CONSTRAINT  PK_Genres PRIMARY KEY([Genres_ID])
)

go

CREATE TABLE Movies_Genres(
	[Movies_Genres_ID] int not null identity(1,1),
	[MoviesID] int,
	[Genres_ID] int,
	CONSTRAINT PK_Movies_Genres PRIMARY KEY ([Movies_Genres_ID]),
	CONSTRAINT FK_Movies FOREIGN KEY ([MoviesID])
	REFERENCES Movies([MoviesID]) ON DELETE CASCADE,
	CONSTRAINT FK_Genres FOREIGN KEY ([Genres_ID])
	REFERENCES Genres([Genres_ID]) ON DELETE CASCADE,
)

go


CREATE TABLE Interested_Genres_Videos_Users(
	[Interest_Genre_User_ID] int not null identity(1,1),
	[Genres_ID] int,
	[UserID] int,
	CONSTRAINT PK_Interested_Genres_Videos_Users PRIMARY KEY ([Interest_Genre_User_ID]),
	CONSTRAINT FK_GenresInterested FOREIGN KEY ([Genres_ID])
	REFERENCES Genres([Genres_ID]) ON DELETE CASCADE,
	CONSTRAINT FK_UsersInterested FOREIGN KEY ([UserID])
	REFERENCES Users([UserID]) ON DELETE CASCADE
)

go

CREATE TABLE Likes(
	[UserID] int not null,
	[MoviesID] int not null, 
	CONSTRAINT FK_LikeMovies FOREIGN KEY ([MoviesID])
	REFERENCES Movies([MoviesID]) ON DELETE CASCADE,
	CONSTRAINT FK_LikeUsers FOREIGN KEY ([UserID])
	REFERENCES Users([UserID]) ON DELETE CASCADE,
	CONSTRAINT PK_likes PRIMARY KEY([UserID], [MoviesID])
)

go

CREATE TABLE Rancking(
	[UserID] int not null,
	[MoviesID] int not null, 
	CONSTRAINT FK_MoviesRancking FOREIGN KEY ([MoviesID])
	REFERENCES Movies([MoviesID]) ON DELETE CASCADE,
	CONSTRAINT FK_UsersRancking FOREIGN KEY ([UserID])
	REFERENCES Users([UserID]) ON DELETE CASCADE,
	CONSTRAINT PK_Ranckings PRIMARY KEY([UserID], [MoviesID])
)



/* /////////////////////////////////////////////// */

/* Datos de Prueba Usuarios Registrados */
/* ////////////////////////// */

INSERT INTO dbo.Users ([First_Name], [Email], [Password], [Birth_Date]) VALUES ('Jesus', 'jsarmiento@gmail.com','12345678910',cast(21/05/1998 as smalldatetime))
INSERT INTO dbo.Users ([First_Name], [Email], [Password], [Birth_Date]) VALUES ('Juan', 'Juan@gmail.com','Juan10',cast(11/05/1987 as smalldatetime))
INSERT INTO dbo.Users ([First_Name], [Email], [Password], [Birth_Date]) VALUES ('Marcos', 'Marcos@gmail.com','MarcosMarcos',cast(02/05/1970 as smalldatetime))
INSERT INTO dbo.Users ([First_Name], [Email], [Password], [Birth_Date]) VALUES ('Julio', 'Julio@gmail.com','j_Julio',cast(01/02/1893 as smalldatetime))
INSERT INTO dbo.Users ([First_Name], [Email], [Password], [Birth_Date]) VALUES ('Luis', 'Luis@gmail.com','Luis1614',cast(01/02/1999 as smalldatetime))
INSERT INTO dbo.Users ([First_Name], [Email], [Password], [Birth_Date]) VALUES ('Carlos', 'Carlos@gmail.com','Carlos1614',cast(31/06/1977 as smalldatetime))
INSERT INTO dbo.Users([First_Name], [Email], [Password], [Birth_Date]) VALUES ('Miguel', 'Miguel@gmail.com','Miguel2018',cast(17/01/1999 as smalldatetime))
INSERT INTO dbo.Users([First_Name], [Email], [Password], [Birth_Date]) VALUES ('Victor', 'Victor@gmail.com','Victor_Victor',cast(14/05/2000 as smalldatetime))
INSERT INTO dbo.Users ([First_Name], [Email], [Password], [Birth_Date]) VALUES ('Oslin', 'Oslin@gmail.com','Oslin_2017',cast(16/07/2001 as smalldatetime))
INSERT INTO dbo.Users ([First_Name], [Email], [Password], [Birth_Date]) VALUES ('David', 'David@gmail.com','David_F',cast(20/08/1993 as smalldatetime))

/*/////////////////////////////*/

Datos de Prueba Tabla Movies

/*////////////////////////////*/
INSERT INTO dbo.Movies([Type], [Name], [Thumb],[Classification],[Time],[Release_Date],[Director],[Sinopsis]) VALUES ('Movie', 'Venon','venon-0102.jpg','A','02:00',cast(18/02/2012 as smalldatetime),'Jonh Mclintong','Basada en hechos reales');
INSERT INTO dbo.Movies([Type], [Name], [Thumb],[Classification],[Time],[Release_Date],[Director],[Sinopsis]) VALUES ('Show', 'Smallville','Smallville-0102.jpg','B','02:20',cast(09/04/2013 as smalldatetime),'Luis Lopez','Cuando duperman estaba en nuestra tierra de forma adolecente');
INSERT INTO dbo.Movies([Type], [Name], [Thumb],[Classification],[Time],[Release_Date],[Director],[Sinopsis]) VALUES ('Movie', 'xman','xman-0102.jpg','C','01:00',cast(30/09/2015 as smalldatetime),'Jonh Wood','Hombres Mutante tratando de dominar al mundo');
INSERT INTO dbo.Movies([Type], [Name], [Thumb],[Classification],[Time],[Release_Date],[Director],[Sinopsis]) VALUES ('Movie', 'titanic','titanic-0102.jpg','D','03:40',cast(25/10/2018 as smalldatetime),'Cristopher Lucas','Basada en hechos reales');
INSERT INTO dbo.Movies([Type], [Name], [Thumb],[Classification],[Time],[Release_Date],[Director],[Sinopsis]) VALUES ('Show', 'La Calle','Calle-0102.jpg','A','01:50',cast(19/12/2000 as smalldatetime),'Marco Creativo','Hecho ocurrido hace mas de 100 anios');
INSERT INTO dbo.Movies([Type], [Name], [Thumb],[Classification],[Time],[Release_Date],[Director],[Sinopsis]) VALUES ('Show', 'Bons','Bons-0102.jpg','B','02:00',cast(12/11/2006 as smalldatetime),'Joseph Park','Investigadora de cuerpos fosificados');
INSERT INTO dbo.Movies([Type], [Name], [Thumb],[Classification],[Time],[Release_Date],[Director],[Sinopsis]) VALUES ('Movie', 'Spiderman','Spiderman-0102.jpg','G','01:40',cast(10/08/1997 as smalldatetime),'Jonh Kirk','Hombre drasticamente picado por una arania mutantr');
INSERT INTO dbo.Movies([Type], [Name], [Thumb],[Classification],[Time],[Release_Date],[Director],[Sinopsis]) VALUES ('Show', 'The Walking Dead','Walking-0102.jpg','PG','02:50',cast(15/06/1998 as smalldatetime),'Zillas Zandobal','Sobies come carne, infectados por un virus');
INSERT INTO dbo.Movies([Type], [Name], [Thumb],[Classification],[Time],[Release_Date],[Director],[Sinopsis]) VALUES ('Movie', 'Batman','Batman-0102.jpg','A','01:00',cast(11/10/1995 as smalldatetime),'James Bond','Basada en un joven que se enamoro de los murcielagos');

//////////////////////////////////////////
DATOS DE PRUEBA GENEROS
///////////////////////////////////////
insert into dbo.Genres ([Genred])values('Comedia');
insert into dbo.Genres ([Genred])values('Suspenso');
insert into dbo.Genres ([Genred])values('Terror');
insert into dbo.Genres ([Genred])values('Romance');
insert into dbo.Genres ([Genred])values('Accion');
insert into dbo.Genres ([Genred])values('Misterio');
insert into dbo.Genres ([Genred])values('Misterioso');
///////////////////////////////////////////////

DATOS DE PRUEBA GENEROS DE LAS PELICULAS
//////////////////////////////////////
INSERT INTO dbo.Movies_Genres([MoviesID],[Genres_ID]) values(2,4)
INSERT INTO dbo.Movies_Genres([MoviesID],[Genres_ID]) values(3,5)
INSERT INTO dbo.Movies_Genres([MoviesID],[Genres_ID]) values(4,4)
INSERT INTO dbo.Movies_Genres([MoviesID],[Genres_ID]) values(5,6)
INSERT INTO dbo.Movies_Genres([MoviesID],[Genres_ID]) values(6,7)
//////////////////////////////////////////

DATOS DE PRUEBA

select * from dbo.Movies
select * from dbo.Genres
select * from dbo.Movies_Genres
select * from dbo.Likes

INSERT INTO dbo.Likes (UserID, MoviesID) VALUES(1,1)
INSERT INTO dbo.Likes (UserID, MoviesID) VALUES(1,2)
INSERT INTO dbo.Likes (UserID, MoviesID) VALUES(2,1)
INSERT INTO dbo.Likes (UserID, MoviesID) VALUES(2,1)
INSERT INTO dbo.Likes (UserID, MoviesID) VALUES(1,3)

select * from Users u
inner join Likes l ON u.UserID = l.UserID
inner join Movies m On l.MoviesID = m.MoviesID


select * from dbo.Rancking

INSERT INTO dbo.Rancking (UserID, MoviesID) VALUES(4,3)
INSERT INTO dbo.Rancking (UserID, MoviesID) VALUES(5,2)
INSERT INTO dbo.Rancking (UserID, MoviesID) VALUES(6,4)
INSERT INTO dbo.Rancking (UserID, MoviesID) VALUES(7,5)

select COUNT(*) from Users u
inner join Rancking l ON u.UserID = l.UserID
inner join Movies m On l.MoviesID = m.MoviesID 