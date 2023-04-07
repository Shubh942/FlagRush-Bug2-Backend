const express = require("express");
/*disable eslint*/
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/changePassword").post(userController.changePassword);
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/userPass").get(userController.userPass);

module.exports = router;
