# API MPLAY - by. @JSarmiento
---
## Descripción
MPLAY es un proyecto web, pensado con el propósito de que muchos usuarios tengan acceso desde cualquier dispositivo a ver series televisivas y las mejores peliculas pasadas por el cine americano.

**Detalles:**   

---
URL-Entidad-Relacion: 
[ VER  ESQUEMA RELACIONAL](https://www.lucidchart.com/invitations/accept/1193d43b-9f2d-44a7-811c-a163f718b06d)

---

## Convensión de Nombres


**API MPLAY - Account**
* Registro de usuarios
POST /v1/Account/Register

* Iniciar sesion
POST /v1/Account/Login

* Editar el perfil de usuario (Detalles adicionales, subir foto de perfil).
POST /v1/Account/userDetails?lastName={lastName}&gender={gender}&userName={userName}&profilePicture={profilePicture}&biography={biography}&country={country}&city={city}&areaCode={areaCode}

* Agregar redes sociales
POST /v1/Account/socialNetworks?nameSocialNetworks={nameSocialNetworks}&urlSocialNetworks={urlSocialNetworks}

* Cerrar sesión
POST /v1/Account/Logout

* Informacion de la cuenta
GET /v1/Account/UserInfo/:id

* Cambiar contrasenia (wait the finish)
POST /v1/Account/ChangePassword
------------------------------------------------------------------------------

**API MPLAY - MoviesOrShows**
**ADD**
* Agregar Peliculas.
POST /v1/add/MoviesShows

**FILTER**
* Filtrar por todas las Movies y Shows
GET /v1/MoviesShows/Filter/All

* Filtrar únicamente por movies
GET /v1/MoviesShows/Filter/Movies

* Filtrar únicamente por Shows
GET /v1/MoviesShows/Filter/Shows

* Filtrar por año de lanzamiento,Genero,más rankiandas,clasificación de edad.
GET /v1/MoviesShows/Filter?type={type}&releaseDate={releaseDate}&genred={genred}&rancking={rancking}&classification={classification}


* Realizar una busqueda por nombre de la movie/shows o por genero.
GET /v1/MoviesShows?searchTerm={searchTerm}

* Rankiar las movies o shows
PUT /v1/MoviesShows/Ranking/{id}

* Darle me gusta a cualquier Movie o Shows
PUT /v1/MoviesShows/Like/{id}

DETALLES DE LAS MOVIES O SHOWS PARA EL FRONTEND

* Mostrar la información de la movies
GET /v1/MoviesShows/{id}

* Mostrar los trailer de la movie
GET /v1/MoviesShows/trailler/{id}

* Mostrar las imagenes de la movie
GET /v1/MoviesShows/images/{id}

* Mostrar el rankigs de la movie
GET /v1/MoviesShows?ranking={id}

* Mostrar los me gusta de la movie
GET /v1/MoviesShows?like={id}



DB_SERVER=localhost 
DB_USER=sa 
DB_PASS=Admin123 
DB_DATABASE=DBMPLAY 
DB_PORT=1433 
APP_PORT=8090 
DB_INSTANCE_NAME=SQLEXPRESS
SECRET_KEY=jsarmiento.mplay
SENDGRID_API_KEY=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

Envio de email sendgrid.com