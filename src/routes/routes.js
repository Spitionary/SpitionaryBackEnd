const express = require("express");
const router = express.Router();
const UserController = require("../controller/userController").default;
require("../middleware/auth");

// welcome api
router.get("/", (req, res) => {
  return res.send(`Welcome to ${process.env.APP_NAME} Application`);
});

// authentication
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
