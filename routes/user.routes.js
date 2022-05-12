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
  deleteUser,
  addFriend,
  getAllFriends,
  deleteFriend
} = require("../controllers/user.controllers");

// Middleware
const { validateSession, protectAccountOwner } = require("../middleware/auth.middleware");

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

router.get("/get-friends", getAllFriends);

router.get("/:id", getUserById);

router.post("/add-friend/:id", addFriend);

router.delete("/delete-friend/:id", deleteFriend);

router.patch("/update-personalData/:id", protectAccountOwner, updatePersonalData);

router.patch(
  "/update-userImg/:id",
  upload.single("userImg"),
  protectAccountOwner,
  updateUserImg
);

router.patch("/update-password/:id", protectAccountOwner, updatePasswordUser);

router.delete("/delete-user/:id", protectAccountOwner, deleteUser);

module.exports = { userRouter: router };
