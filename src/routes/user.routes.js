import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  testUser,
  test
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/").get(test)
router.route("/user").get(testUser);
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

// ---------------- Secured Routes -----------------

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

// router.route("/upate").post(updateUser);

router.route("/change-password").post(changeCurrentPassword);

router.route("/whoiam").get(getCurrentUser);

router.route("/update-account-details").post(updateAccountDetails);

router.route("/update-profile").post(updateUserAvatar);

router.route("/update-cover-image").post(updateUserCoverImage);

export default router;
