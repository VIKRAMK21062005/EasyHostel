// controller/productController.js

import { Product } from "../model/ProductModel.js";


export const createProduct = async (req, res) => {
  try {
    const { product, price } = req.body;
    const imageUrl = req.file?.path; // Cloudinary auto-provides the URL
    
    if (!product || !price || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existProduct = await Product.create({ product, price, image: imageUrl });
    res.status(201).json({ message: "Product created successfully", existProduct });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllProducts=async(req,res)=>{
    try {
        const allProducts=await Product.find();
        if(!allProducts || allProducts.length==0){
           return res.status(400).json({
                message:"No products exist"
            })
        }
        res.status(200).json({
            message:"products retrived success",
            allProducts
        })
    } catch (error) {
        console.log("Error in getAllProducts",error)
    }
}


export const updateProducts = async (req, res) => {
  try {
    const { id } = req.params; 
    const { product, price } = req.body;

    // Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If new image uploaded → upload to Cloudinary
    let imageUrl = existingProduct.image;
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (existingProduct.image && existingProduct.image.includes("cloudinary.com")) {
        const publicId = existingProduct.image.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`EasyHostel/${publicId}`);
        } catch (err) {
          console.warn("⚠️ Could not delete old image:", err.message);
        }
      }

      // Upload new image
      imageUrl = req.file.path;
    }

    // Update product fields
    existingProduct.product = product|| existingProduct.product;
    existingProduct.price = price || existingProduct.price;
    existingProduct.image = imageUrl;

    await existingProduct.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: existingProduct,
    });
  } catch (error) {
    console.error("Error in updateProducts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If product has a Cloudinary image, delete it
    if (product.image && product.image.includes("cloudinary.com")) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`EasyHostel/${publicId}`);
      } catch (err) {
        console.warn("⚠️ Failed to delete image from Cloudinary:", err.message);
      }
    }

    // Delete product from DB
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
