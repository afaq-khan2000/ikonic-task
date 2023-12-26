var express = require("express");
const { registerUser, getUserProfile, updateUserProfile, deleteUserProfile, loginUser } = require("../controllers/users");
const requireSignin = require("../middlewares/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", requireSignin, getUserProfile);
router.put("/update", requireSignin, updateUserProfile);
router.delete("/delete", requireSignin, deleteUserProfile);

module.exports = router;
