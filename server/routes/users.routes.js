
const express = require('express');
const { verifyToken } = require("../middleware/auth");
const router = express.Router()
const userService = require("../services/users.service");

router.post ("/register", userService.signUp)
    
router.post("/login", userService.login);

router.post("/logout", verifyToken, userService.logout);

module.exports = router;
