const express = require("express");
const router = express.Router();

router.get("/feed", (req,res,next)=>{
    res.render("feed/feed.hbs")
})


module.exports = router;