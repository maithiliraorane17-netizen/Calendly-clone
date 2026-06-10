const express  = require("express");
const router   = express.Router();
const { protect }       = require("../middleware/auth");
const validate          = require("../middleware/validate");
const upload            = require("../middleware/upload");
const {
  getProfile,
  updateProfile,  updateProfileRules,
  uploadAvatar,
  changePassword,
  getDashboardStats,
  deleteAccount,
} = require("../controllers/userController");

// All user routes require auth
router.use(protect);

router.get("/profile",          getProfile);
router.put("/profile",          updateProfileRules, validate, updateProfile);
router.put("/avatar",           upload.single("avatar"), uploadAvatar);
router.put("/change-password",  changePassword);
router.get("/dashboard-stats",  getDashboardStats);
router.delete("/account",       deleteAccount);

module.exports = router;
