const router = require("express").Router();
const productController = require("../controllers/productController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});

router.post("/", productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductsById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/category/:categoryId", productController.getProductsByCategoryId);
router.post("/:id", upload.array("images", 5), productController.uploadImages);
router.delete("/deleteImage/:id", productController.deleteProductImage);

module.exports = router;
