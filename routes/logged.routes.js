const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const { isLoggedIn } = require("../middlewares/auth-middlewares.js");
const { isCreatingPost } = require("../middlewares/auth-middlewares.js");
const { isAdmin } = require("../middlewares/auth-middlewares.js");
const { networkInterfaces } = require("os");
const Publicacion = require("../models/Publicacion.model.js");
const { trusted } = require("mongoose");
const Cuadro = require("../models/Cuadro.model.js");
const PublicacionCopia = require("../models/PublicacionCopia.model.js");

const uploader = require("../middlewares/cloudinary-user.js");
const uploaderAdmin = require("../middlewares/cloudinary-admin.js");
const uploaderFotoUser = require("../middlewares/cloudinary-fotouser.js");

// Ruta para renderizar el feed
router.get("/cuadroDelDia", isLoggedIn, async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.session.activeUser._id);
    await Publicacion.findOneAndUpdate(
      { owner: foundUser._id },
      {
        userPhoto: foundUser.profilePhoto,
      }
    );
    const publicaciones = await Publicacion.find();
    const cuadroDelDiaArr = await Cuadro.find();
    const cuadroDelDia = await Cuadro.findOne().sort({ createdAt: -1 });
    const foundUserId = await User.findById(req.session.activeUser._id);
    const fechasPublicaciones = await Publicacion.find().select("createdAt");
    let errorMessageCuadro = "";
    let hayCuadro = false;

    // Para saber si no hay cuadro del día
    if (cuadroDelDiaArr.length !== 0) {
      hayCuadro = true;
    } else {
      hayCuadro = false;
      errorMessageCuadro = "¡Aún no hay cuadro del día!";
    }

    //Para actualizar foto de perfil en la colección de publicaciones del día
    const publicacion = await Publicacion.find({ owner: foundUser.id });
    const publicacionByName = await Publicacion.find().select("username");
    const tuPublicacion = await Publicacion.findOne({
      username: foundUser.username,
    });
    const Users = await User.find();
    const fotoPerfilUser = await Publicacion.findById(Users._id).populate(
      "profilePhoto"
    );
    let hayPublicaciones = true;

    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    const fechaDeHoy = hoy.toLocaleDateString();
    const horaActual = hoy.toLocaleTimeString();

    if (
      publicacionByName.filter(
        (cadaPublicacion) => cadaPublicacion.username === foundUser.username
      ).length > 0
    ) {
      hayPublicaciones = false;
    } else {
      hayPublicaciones = true;
    }

    // Para borrar de la DB las publicaciones del día
    fechasPublicaciones.forEach((cadaPublicacion) => {
      if (cadaPublicacion.createdAt.toLocaleDateString() !== fechaDeHoy) {
        cadaPublicacion.delete();
        res.redirect("/logged/cuadroDelDia");
      }
    });

    res.render("feed/feed.hbs", {
      publicaciones: publicaciones,
      cuadroDelDia: cuadroDelDia,
      foundUserId: foundUserId,
      publicacion: publicacion,
      foundUser: foundUser,
      tuPublicacion: tuPublicacion,
      errorMessageCuadro,
      hayPublicaciones,
      hayCuadro,
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para recibir la data del form
router.post(
  "/cuadroDelDia",
  isLoggedIn,
  uploader.single("photo"),
  async (req, res, next) => {
    const publicaciones = await Publicacion.find();
    const cuadroDelDia = await Cuadro.findOne().sort({ createdAt: -1 });
    const foundUserId = await User.findById(req.session.activeUser._id);

    try {
      const foundUser = await User.findById(req.session.activeUser._id);
      const publicacionByName = await Publicacion.find().select("username");
      const publicacionesCopia = await PublicacionCopia.find();

      const tiempoTranscurrido = Date.now();
      const hoy = new Date(tiempoTranscurrido);
      const fechaDeHoy = hoy.toLocaleDateString();

      if (
        publicacionesCopia.filter(
          (cadaPublicacion) =>
            cadaPublicacion.createdAt.toLocaleDateString() === fechaDeHoy &&
            cadaPublicacion.username === foundUser.username
        ).length > 0
      ) {
        res.status(400).render("feed/feed.hbs", {
          errorMessage: "Ya has creado la publicación de hoy",
          publicaciones: publicaciones,
          cuadroDelDia: cuadroDelDia,
          foundUserId: foundUserId,
        });
      } else {
        const horaActual = hoy.toLocaleTimeString().slice(0, 5);
        const fechaHora = `${fechaDeHoy} ${horaActual}`;
        await PublicacionCopia.create({
          photo: req.file.path,
          owner: foundUser._id,
          username: foundUser.username,
          comment: req.body.comment,
          cuadroDia: req.body.ubication,
          fechaHora: fechaHora,
        });
      }

      if (
        publicacionByName.filter(
          (cadaPublicacion) => cadaPublicacion.username === foundUser.username
        ).length > 0
      ) {
        res.status(400).render("feed/feed.hbs", {
          errorMessage: "Ya has creado la publicación de hoy",
          publicaciones: publicaciones,
          cuadroDelDia: cuadroDelDia,
          foundUserId: foundUserId,
        });
      } else {
        const horaActual = hoy.toLocaleTimeString().slice(0, 4);
        const publicacionDelDia = await Publicacion.create({
          photo: req.file.path,
          owner: foundUser._id,
          username: foundUser.username,
          comment: req.body.comment,
          cuadroDia: req.body.ubication,
          hora: horaActual,
        });
        res.redirect("/logged/cuadroDelDia");
      }
      res.redirect("/logged/cuadroDelDia");
    } catch (error) {
      next(error);
    }
  }
);

//RUTA para que el usuario puede eliminar su publicación
router.post("/cuadroDelDiaDelete/:id", isLoggedIn, async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.session.activeUser._id);
    const publicacionCopiaByName = await Publicacion.find().select("username");
    if (
      publicacionCopiaByName.filter(
        (cadaPublicacion) => cadaPublicacion.username === foundUser.username
      ).length > 0
    ) {
      await PublicacionCopia.deleteOne({ owner: req.params.id });
    }
    await Publicacion.deleteOne({ owner: req.params.id });
    res.redirect("/logged/cuadroDelDia");
  } catch (error) {
    next(error);
  }
});

// Ruta para ir al perfil del user
router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    let isAdmin = false;
    if (req.session.activeUser.role === "admin") {
      isAdmin = true;
    } else {
      next;
    }

    const foundUser = await User.findById(req.session.activeUser._id);

    const publicacionesDeUser = await PublicacionCopia.find({
      owner: foundUser.id,
    });

    res.render("profile/profile.hbs", {
      foundUser: foundUser,
      publicacionesDeUser: publicacionesDeUser,
      isAdmin,
    });
  } catch (error) {
    next(error);
  }
});

//Ruta para renderizar página de edición de user
router.get("/profile/edit", isLoggedIn, async (req, res, next) => {
  try {
    const updateUser = await User.findById(req.session.activeUser._id);
    res.render("profile/edit-profile.hbs", { updateUser: updateUser });
  } catch (error) {
    next(error);
  }
});

//POST=> Ruta para editar el valor de campo de user
router.post("/:profileId/edit", isLoggedIn, async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.session.activeUser._id);

    // PROBANDO COSITAS PARA ACTUALIZAR TAMBIÉN LOS COMENTARIOS
    // const comentariosDePublicaciones = await Publicacion.find().select("comentarios")
    // comentariosDePublicaciones.forEach((element) => {
    //   for(let i = 0; i < element.comentarios.length; i++) {
    //     element.comentarios[i] = element.comentarios[i].replace(foundUser.username, req.body.username)
    //     console.log(element.comentarios[i])
    //   }
    // });

    //   await Publicacion.updateMany(
    //     { comentarios : foundUser.username},
    //     { $set : {"comentarios" : "hola"}}
    // )

    await Publicacion.findOneAndUpdate(
      { username: foundUser.username },
      {
        username: req.body.username,
      }
    );
    const { profileId } = req.params;
    await User.findByIdAndUpdate(profileId, {
      username: req.body.username,
      email: req.body.email,
      ubication: req.body.ubication,
    });
    res.redirect("/logged/profile");
  } catch (error) {
    next(error);
  }
});

// Ruta para eliminar usuario, su sesión activa y su user de DB
router.post("/deleteUser/:id", isLoggedIn, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para ir a la creación del cuadro del día
router.get("/profileAdmin/create", isLoggedIn, isAdmin, (req, res, next) => {
  res.render("admin/upload-cuadro.hbs");
});

//POST => Para subir el cuadro del día
router.post(
  "/profileAdmin/create",
  isLoggedIn,
  isAdmin,
  uploaderAdmin.single("image"),
  async (req, res, next) => {
    try {
      await Cuadro.create({
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        description: req.body.description,
        image: req.file.path,
        admin: req.session.activeUser._id,
      });
      res.redirect("/logged/cuadroDelDia");
    } catch (error) {
      next(error);
    }
  }
);

//POST=> Ruta para editar el valor de campo de admin
router.post("/:profileId/edit", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const { profileId } = req.params;
    await User.findByIdAndUpdate(profileId, {
      username: req.body.username,
      email: req.body.email,
      ubication: req.body.ubication,
    });
    res.redirect("/logged/profileAdmin");
  } catch (error) {
    next(error);
  }
});

//POST=> Ruta para editar la publicación del día
router.post(
  "/cuadroDelDiaEdit/:id",
  isLoggedIn,
  uploader.single("photo"),
  async (req, res, next) => {
    try {
      const foundUser = await User.findById(req.session.activeUser._id);
      const publicacionCopiaByName = await Publicacion.find().select(
        "username"
      );
      const tiempoTranscurrido = Date.now();
      const hoy = new Date(tiempoTranscurrido);
      const fechaDeHoy = hoy.toLocaleDateString();
      const horaActual = hoy.toLocaleTimeString().slice(0, 5);

      await Publicacion.findOneAndUpdate(
        { owner: req.params.id },
        {
          photo: req.file.path,
          comment: req.body.comment,
          hora: horaActual,
        }
      );
      res.redirect("/logged/cuadroDelDia");
    } catch (error) {
      next(error);
    }
  }
);

// POST => Ruta para recibir imagen de perfil
router.post(
  "/profile/photo",
  isLoggedIn,
  uploaderFotoUser.single("profilePhoto"),
  async (req, res, next) => {
    try {
      await User.findByIdAndUpdate(req.session.activeUser._id, {
        profilePhoto: req.file.path,
      });
      res.redirect("/logged/profile");
    } catch (error) {
      next(error);
    }
  }
);

// POST=> Ruta para recibir comentarios
router.post(
  "/comentario/:idPublicacion",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { idPublicacion } = req.params;
      const foundUser = await User.findById(req.session.activeUser._id);
      await Publicacion.findByIdAndUpdate(idPublicacion, {
        $push: { comentarios: `${foundUser.username}: ${req.body.comentario}` },
      });
      res.redirect("/logged/cuadroDelDia");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
