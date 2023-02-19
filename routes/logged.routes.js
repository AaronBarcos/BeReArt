const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const { isLoggedIn } = require("../middlewares/auth-middlewares.js");
const { networkInterfaces } = require("os");

router.get("/feed", isLoggedIn, async (req, res, next) => {
  try {
    //const foundUser = await User.findById(req.session.activeUser._id);
    res.render("feed/feed.hbs"/*, { foundUser: foundUser }*/);
  } catch (error) {
    next(error);
  }
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  // console.log(req.session.activeUser)
  try {
    // const {profileId} = req.session.activeUser._id
    const foundUser = await User.findById(req.session.activeUser._id);
    res.render("profile/profile.hbs", { foundUser: foundUser });
    // console.log(foundUser)
  } catch (error) {
    next(error);
  }
});

//GET=> Ruta para renderizar página de edición
router.get("/profile/edit", isLoggedIn, async (req, res, next) => {
  try {
    const updateUser = await User.findById(req.session.activeUser._id);
    res.render("profile/edit-profile.hbs", { updateUser: updateUser });
  } catch (error) {
    next(error);
  }
});

//POST=> Ruta para editar el valor de campo de usuario
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

module.exports = router;
