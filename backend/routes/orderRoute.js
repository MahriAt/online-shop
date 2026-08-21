const router = require("express").Router();
const orderController = require("../controllers/orderController");
const checkAuth = require("../middleware/checkAuth");

router.post("/", checkAuth, orderController.createOrder);
router.get("/", checkAuth, orderController.getAllOrders);
router.get("/:id", checkAuth, orderController.getOrderById);

router.post("/orderItem", checkAuth, orderController.addProductInOrder);
router.delete("/orderItem", checkAuth, orderController.removeProductInOrder);

router.put("/status/:id", checkAuth, orderController.updateOrderStatus);
router.delete("/:id", checkAuth, orderController.deleteOrder);
module.exports = router;
