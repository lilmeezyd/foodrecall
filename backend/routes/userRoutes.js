const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  createUser,
  unsubscribeUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  loginAdmin,
  getMe,
  changeNotifications,
  updateDetails
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post('/subscribe', createUser);
router.delete('/unsubscribe/:id', unsubscribeUser);
router.post("/", registerAdmin);
router.post("/login", loginAdmin);
router.post("/requestResetPassword", requestPasswordReset)
router.post("/resetPassword", resetPassword)
router.put("/newPassword", protect, changePassword)
router.put('/notifications', protect, changeNotifications)
router.put('/updateDetails', protect, updateDetails)
router.get("/me", protect, getMe);

module.exports = router;
