const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User.controller");

//get all Products
//create Product
//get single Product
//update Product
//delete Product

router.post("/login", UserController.login);
router.post("/register", UserController.register);

module.exports = router;
