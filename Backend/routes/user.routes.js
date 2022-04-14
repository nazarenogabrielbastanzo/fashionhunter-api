const express = require("express");
const router = express.Router();

// Controllers
const {
  loginUser,
  createDefaultImage,
  selectDefaultImage,
  sendEmailResetPassword,
  resetPassword,
  createUser,
  getAllUsers,
  getUserById,
  updatePasswordUser,
  updatePersonalData,
  updateUserImg,
  deleteUser
} = require("../controllers/user.controllers");

// Middleware
const { validateSession } = require("../middleware/auth.middleware");

// Utils
const { upload } = require("../utils/multer");

// Routes
router.post("/signup", upload.single("userImg"), createUser);

router.post("/login", loginUser);

router.post("/forgotPassword", sendEmailResetPassword);

router.post("/resetpassword/:token", resetPassword);

router
  .route("/img")
  .post(upload.single("userDefaultImg"), createDefaultImage)
  .get(selectDefaultImage);

router.use(validateSession);

router.get("/all-users", getAllUsers);

router.get("/:id", getUserById);

router.patch("/update-personalData/:id", updatePersonalData);

router.patch("/update-userImg/:id", upload.single("userImg"), updateUserImg);

router.patch("/update-password/:id", updatePasswordUser);

router.delete("/delete-user/:id", deleteUser);

module.exports = { userRouter: router };
