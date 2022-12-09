const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controller/userController");
const SpiceController = require("../controller/spiceController");
require("../middleware/auth");

// welcome api
router.get("/", (req, res) => {
  return res.send(`Welcome to ${process.env.APP_NAME} Application`);
});

// authentication
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
