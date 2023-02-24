# Project Name

BeReArt

## Description

Proyecto de backend realizado por Aaron Barcos y Alberto Gómez para el segundo proyecto del bootcamp de Ironhack.
Con el modelo de la red social BeReal, los usuarios tendrán que subir cadda dia una foto imitando un cuadro famoso.

## User Stories

- **homepage** - En esta página los usuarios podrán ver la información de la web, y registrarse o iniciar sesión.
- **sign up** - Los usuarios podrán registrarse en la web para disfrutar de todo el contenido.
- **login** - Previo registro, los usuarios deberán activar su usuario para disfrutar de la web.
- **cuadro del día** - Aquí se podrá ver cual es el cuadro del día, y los posts de todos los usuarios. Desde aquí también podrás comentar otros posts y borrar y editar el tuyo.
- **perfil** - Una vista de todos los datos del usuario. Desde aquí se podrá borrar la cuenta o acceder a la página de edición de datos.
- **editar datos perfil** - Como usuario o administrador, podrás editar todos tus datos personales en esta página.
- **crear cuadro del día** - Solo los administradores pueden acceder a esta página. En ella se podrá subir el cuadro del día que todos deberán imitar despues.

## Backlog

Perfil de usuario:

- Ver mi perfil
- Subir y editar foto de usuario.
- Lista de fotos subidas anteriormente por el usuario.

Publicaciones:

- Se actualiza todo en la misma página
- Vista de publicación con nombre y foto de usuario y comentarios de otros usuarios.
- Tu publicación aparece la primera y puedes editar o borrar.
- No puedes publicar mas de una foto al día.

Base de Datos

- Se borra la BBDD automaticamente cada día y se borran del tablón.

## ROUTES:

- GET /
  - Renderiza la página de inicio.
- GET /auth/signup
  - Redirecciona a los usuarios dependiendo de si están registrados o no.
- POST /auth/signup
  - - Redirecciona a los usuarios dependiendo de si están registrados o no.
  - body:
    - username
    - email
    - password
    - ubicación
- GET /auth/login
  - Redirecciona a los usuarios dependiendo de si han iniciado sesión o no.
- POST /auth/login
  - Redirecciona a los usuarios dependiendo de si están registrados o no.
  - body:
    - username
    - password

- GET /logged/cuadroDelDia
  - Renderiza la vista del cuadro del día

- POST /logged/cuadroDelDia
  - Te redirecciona al mismo URL pero con los datos recogidos de las publicaciones.
  
- GET /logged/profile
  - Renderiza página del perfil del usuario.
  - Puedes acceder a la edición y actualización del perfil.
  - Puedes borrar la cuenta.

  - GET /logged/:profileId/edit
  - Renderiza página de edición del perfil del usuario.

- POST /logged/:profileId/edit
  - Redirecciona a la página del perfil.
  - Todos los campos aparecen rellenos con los datos del user.

- GET /logged/:profileId/edit
  - Renderiza la página para subir la foto del día.
  - Acceso permitido solo a administradores.

- POST /logged/profileAdmin/create
  - Redirecciona a la página principal de las publicaciones
  - Envía todos los datos del cuadro del día.

- POST logged/cuadroDelDiaEdit/:id
  - Ruta para editar el cuadro del día.
  - Acceso permitido solo a administradores.
  - Redirecciona a la página principal de las publicaciones.

- POST /logged/profile/photo
  - Redirecciona a la página de perfil.
  - Actualiza la foto del usuario.

- POST /logged/comentario/:idPublicacion
  - Redirecciona a la página principal de las publicaciones
  - Envía los comentarios hechos en una publicación.



## Models

```
User model
```

username: 
    type: String,
    trim: true,
    required: true,
    unique: true,
  
  email: 
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  
  password: 
    type: String,
    required: true,
  
  ubication: 
    type: String,
    required: true,
  
  photos: [
   
      type: mongoose.Schema.Types.ObjectId,
      ref: "publicacion",
   ]

  role: 
    type: String,
    enum: ["user", "admin"],
    default: "user",
  
  profilePhoto: 
    type: String,
  

```

Cuadro model

```
title: 
      type: String,
      required: true,
      unique: true,
    
    description: 
      type: String,
      required: true,
      unique: true,
    
    author: 
      type: String,
      required: true,
    
    year: 
      type: String,
      required: true,
    
    image: 
      type: String,
    
    admin: 
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    
    timestamps: true,

```
Publicación model
```
photo:
      type: String,
      required: true,
    

    owner: 
      type: mongoose.Schema.Types.ObjectId,
      ref: "username",
    

    username: String,

    userPhoto: String,

    comment: 
      type: String,
    

    picture: 
      type: String,
       

    cuadroDia: 
      type: mongoose.Schema.Types.ObjectId,
      ref: "cuadro",
    

    hora: String,

    comentarios: [
        type: String
    ]
  
    timestamps: true,
 
 ```
Publicación Copia model
```
photo:
      type: String,
      required: true,
    

    owner: 
      type: mongoose.Schema.Types.ObjectId,
      ref: "username",
    

    username: String,

    userPhoto: String,

    comment: 
      type: String,
    

    picture: 
      type: String,
       

    cuadroDia: 
      type: mongoose.Schema.Types.ObjectId,
      ref: "cuadro",
    

    hora: String,

    comentarios: [
        type: String
    ]
  
    timestamps: true,

### Git

Las URLs del repositorio y el deploy.

[Link Repositorio](https://github.com/AaronBarcos/BeReArt)

[Link Deploy](https://bereart.cyclic.app/)

### Slides

La URL de la presentación.

[Link Presentación](http://slides.com)
