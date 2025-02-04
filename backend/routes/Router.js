const express = require("express");
const router = express();

router.get("/", (req, res)=> {
    res.send("API Funcionando!");
})

module.exports = router;