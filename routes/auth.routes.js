const express = require("express");
const User = require("../models/User.model.js");
const router = express.Router();
const bcrypt = require("bcrypt");

/* GET Rendererizar formulario de registro */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup-form.hbs");
});

/* POST Recibir la info del formulario y crear el perfil de usuario */
router.post("/signup", async (req, res, next) => {
  if (
    req.body.username === "" ||
    req.body.email === "" ||
    req.body.password === "" ||
    req.body.ubication === ""
  ) {
    res.render("auth/signup-form.hbs", {
      errorMessage: "¡Todos los campos deben estar llenos!",
      valueUsername: req.body.username,
      valueEmail: req.body.email,
      valueUbication: req.body.ubication,
    });
    return;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (!passwordRegex.test(req.body.password)) {
    res.render("auth/signup-form.hbs", {
      errorMessage:
        "La contraseña no es lo sufucientemente segura. Debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un caracter especial",
      valueUsername: req.body.username,
      valueEmail: req.body.email,
      valueUbication: req.body.ubication,
    });
    return;
  }

  try {
    const foundUserName = await User.findOne({ username: req.body.username });
    const foundEmail = await User.findOne({ email: req.body.email });

    if (foundUserName !== null) {
      res.render("auth/signup-form.hbs", {
        errorMessage: "Este nombre de usuario ya existe",
      });
      return;
    } else if (foundEmail !== null) {
      res.render("auth/signup-form.hbs", {
        errorMessage: "Este correo electrónico ya existe",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      ubication: req.body.ubication,
    });

    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

// GET Renderizar el formulario de acceso
router.get("/login", (req, res, next) => {
  res.render("auth/login-form.hbs");
});

// POST Recibir la info del formulario y permitir al usuario acceder (creamos sesión activa)
router.post("/login", async (req, res, next) => {
  console.log(req.body);

  if (req.body.username === "" || req.body.password === "") {
    res.status(401).render("auth/login-form.hbs", {
      errorMessage: "¡Todos los campos deben estar completos!",
      valueUsername: req.body.username,
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ username: req.body.username });
    if (foundUser === null) {
      res.render("auth/login-form.hbs", {
        errorMessage: "Usuario no registrado con ese nombre",
        valueUsername: req.body.username,
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );
    if (isPasswordCorrect === false) {
      res.render("auth/login-form.hbs", {
        errorMessage: "Contraseña incorrecta",
        valueUsername: req.body.username,
      });
      return;
    }

    req.session.activeUser = foundUser;

    req.session.save(() => {
      res.redirect("/logged/cuadroDelDia");
    });
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
