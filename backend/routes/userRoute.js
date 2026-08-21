const router = require("express").Router();
const userController = require("../controllers/userController");
const checkAuth = require("../middleware/checkAuth");

router.post("/signup", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/", userController.getUsers);
router.post("/login", userController.loginUser);
router.get("/account", checkAuth, userController.getUserAccount);

module.exports = router;
