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
  // VALIDACIONES DE BACK-END

  // Todos los campos deben estar completos
  if (
    req.body.username === "" ||
    req.body.email === "" ||
    req.body.password === "" ||
    req.body.ubication === ""
  ) {
    res.render("auth/signup-form.hbs", {
      errorMessage: "Todos los campos deben estar llenos!",
      valueUsername: req.body.username,
      valueEmail: req.body.email,
      valueUbication: req.body.ubication,
    });
    return;
  }
  // La password debe tener ciertas características
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
    // Que no exista un usuario igual con este username/email
    const foundUserName = await User.findOne({ username: req.body.username });
    const foundEmail = await User.findOne({ email: req.body.email });
    // foundUser si existe será el documento, si no existe será null
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
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10); // Creamos cuantas rondas de sal
    const hashPassword = await bcrypt.hash(req.body.password, salt); // Creamos la contraseña encriptada
    // 2. CREAR EL PERFIL DE USUARIO
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      ubication: req.body.ubication,
    });
    // 3. SI TODO FUE BIEN, SE HACE EL REDIRECT
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
  // VALIDACIONES DE BACK-END
  console.log(req.body);
  // Todos los campos deben estar completos
  if (req.body.username === "" || req.body.password === "") {
    res.status(401).render("auth/login-form.hbs", {
      errorMessage: "Todos los campos deben estar completos!",
      valueUsername: req.body.username,
    });
    return;
  }

  try {
    // Si el usuario está creado en la DB
    const foundUser = await User.findOne({ username: req.body.username });
    if (foundUser === null) {
      res.render("auth/login-form.hbs", {
        errorMessage: "Usuario no registrado con ese nombre",
        valueUsername: req.body.username,
      });
      return;
    }
    // 2. VERIFICAR LA PASSWORD
    // Si la contraseña puesta por el usuario coincide con la de la DB
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

    // Activar una sesión
    req.session.activeUser = foundUser; // Esto crea la sesión en la DB y envía la cookie al usuario
    // Automaticamente, en TODAS las rutas vamos a tener acceso a req.session.activeUser => siempre nos dará el user que hace la llamada
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
