import express from "express";
import upload from "../middleware/multer.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createProduct, deleteProduct, getAllProducts, updateProducts } from "../controller/productController.js";

const productRouter = express.Router();
productRouter.use(protect)
// Admin only route
productRouter.post("/create", authorizeRoles("Admin"), upload.single("image"), createProduct);
productRouter.get("/get",getAllProducts)
productRouter.put("/update/:id",
  protect,
  authorizeRoles("Admin"),
  upload.single("image"),
  updateProducts
);
productRouter.delete("/delete/:id",authorizeRoles("Admin"),deleteProduct)

export default productRouter;
