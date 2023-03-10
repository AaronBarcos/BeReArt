const isLoggedIn = (req, res, next) => {
  if (req.session.activeUser === undefined) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.activeUser.role !== "admin") {
    res.redirect("/");
  } else {
    next();
  }
};

const updateLocals = (req, res, next) => {
  if (req.session.activeUser === undefined) {
    res.locals.isUserActive = false;
  } else {
    res.locals.isUserActive = true;
    if (req.session.activeUser.role === "admin") {
      res.locals.isUserAdminType = true;
    } else {
      res.locals.isUserAdminType = false;
    }
  }

  next();
};

const isCreatingPost = (req, res, next) => {
  if (isCreating === false || isCreating === undefined) {
    let errorMessage = "Debes terminar la publicación!";
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn: isLoggedIn,
  updateLocals: updateLocals,
  isCreatingPost: isCreatingPost,
  isAdmin: isAdmin,
};
