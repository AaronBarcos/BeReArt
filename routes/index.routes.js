const express = require("express");
const router = express.Router();

const { updateLocals } = require("../middlewares/auth-middlewares.js");
router.use(updateLocals);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Rutas auth
const authRoutes = require("./auth.routes.js");
router.use("/auth", authRoutes);

//Rutas logged
const loggedRoutes = require("./logged.routes.js");
router.use("/logged", loggedRoutes);

module.exports = router;
