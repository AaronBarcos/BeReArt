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


// Ruta para renderizar el feed
router.get("/cuadroDelDia", isLoggedIn, async (req, res, next) => {
  try {
    const publicaciones = await Publicacion.find();
    const cuadroDelDia = await Cuadro.findOne().sort({ createdAt: -1 });
    const foundUserId = await User.findById(req.session.activeUser._id)
    const fechasPublicaciones = await Publicacion.find().select("createdAt")
    console.log(foundUserId._id)
    
    // Esto se puede meter en utils
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    const fechaDeHoy = hoy.toLocaleDateString()
    const fechaDeAyer = 20/2/2023

    fechasPublicaciones.forEach(cadaPublicacion => {
      if (cadaPublicacion.createdAt.toLocaleDateString() !== fechaDeHoy) {
        cadaPublicacion.delete()
        res.redirect("/logged/cuadroDelDia")
      }
    });
    
    
    res.render("feed/feed.hbs", {
      publicaciones: publicaciones,
      cuadroDelDia: cuadroDelDia,
      foundUserId: foundUserId
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
    const foundUserId = await User.findById(req.session.activeUser._id)

    try {
      const foundUser = await User.findById(req.session.activeUser._id);
      const publicacionByName = await Publicacion.find().select("username");
      const publicacionByDate = await PublicacionCopia.find().select("createdAt");
      
      
      // Esto se puede meter en utils
      const tiempoTranscurrido = Date.now();
      const hoy = new Date(tiempoTranscurrido);
      const fechaDeHoy = hoy.toLocaleDateString()

      if (
        publicacionByDate.filter(
          (cadaPublicacion) => cadaPublicacion.createdAt.toLocaleDateString() === fechaDeHoy
        ).length > 0
      ) {
        res.status(400).render("feed/feed.hbs",{
          errorMessage:"Ya has creado la publicación de hoy",
          publicaciones: publicaciones,
          cuadroDelDia: cuadroDelDia,
          foundUserId: foundUserId
        })
      } else {
        const publicacionCreada = PublicacionCopia.create({
          photo: req.file.path,
          owner: foundUser._id,
          username: foundUser.username,
          comment: req.body.comment,
          cuadroDia: req.body.ubication,
        });
        
      }

      if (
        publicacionByName.filter(
          (cadaPublicacion) => cadaPublicacion.username === foundUser.username
        ).length > 0
      ) {
        res.status(400).render("feed/feed.hbs",{
          errorMessage:"Ya has creado la publicación de hoy",
          publicaciones: publicaciones,
          cuadroDelDia: cuadroDelDia,
          foundUserId: foundUserId
        })
      } else {
        const publicacionCreada = Publicacion.create({
          photo: req.file.path,
          owner: foundUser._id,
          username: foundUser.username,
          comment: req.body.comment,
          cuadroDia: req.body.ubication,
        });
        res.redirect("/logged/cuadroDelDia");
      }
      
      
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para ir al perfil del user
router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.session.activeUser._id);
    res.render("profile/profile.hbs", { foundUser: foundUser });
    // console.log(foundUser)
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
  console.log(req.params.id);
  try {
    await User.findByIdAndDelete(req.params.id);
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para ir al perfil del admin
router.get("/profileAdmin", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const foundAdmin = await User.findById(req.session.activeUser._id);
    res.render("admin/admin.hbs", { foundAdmin: foundAdmin });
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

//Ruta para renderizar página de edición de user
router.get(
  "/profileAdmin/edit",
  isLoggedIn,
  isAdmin,
  async (req, res, next) => {
    try {
      const updateAdmin = await User.findById(req.session.activeUser._id);
      res.render("admin/edit-admin.hbs", { updateAdmin: updateAdmin });
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

// Ruta para eliminar admin, su sesión activa y su user de DB
router.post("/deleteAdmin/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  console.log(req.params.id);
  try {
    await User.findByIdAndDelete(req.params.id);
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
});

//RUTA para que el usuario puede eliminar su publicación
router.post("/cuadroDelDia/:id", isLoggedIn, async (req, res, next) => {
  console.log(req.params)
  try {
   await Publicacion.deleteOne({owner: req.params.id})
    res.redirect("/logged/cuadroDelDia")
  } catch (error) {
    next(error);
  }
});

module.exports = router;
