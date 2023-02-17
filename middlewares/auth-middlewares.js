const isLoggedIn = (req, res, next) => {

    if (req.session.activeUser === undefined) {
        res.redirect("/auth/login");
    } else {
        next() // next sin argumentos significa: continua con las rutas
    }

}

const updateLocals = (req, res, next) => {

    // si el usuario esta logeado, creamos una variable local (res.locals) para renderizar enlaces que solo se vean si ha hecho login
    if (req.session.activeUser === undefined) {
      res.locals.isUserActive = false
    } else {
  
      // ejemplo de otra variable para si es admin o no
      // if (req.session.activeUser.role === "admin") {
      //   res.locals.isUserAdminType = true
      // }
  
      res.locals.isUserActive = true
    }
    next() // => crea la variable local de arriba y continua con las rutas
  
  }

module.exports = {
    isLoggedIn: isLoggedIn,
    updateLocals: updateLocals
}