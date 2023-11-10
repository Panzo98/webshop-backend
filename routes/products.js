const express = require("express");
const router = express.Router();
const db = require("../models");
const Product = db.Product;
const adminVerify = require("../middlewares/adminVerify");
const deleteFromDatabase = require("../middlewares/deleteFromDatabase");

// TODO get products by store

router.get("/", adminVerify, async (req, res) => {
  try {
    const allProducts = await Product.findAll();
    return res.json({
      message: "Products successfully fetched!",
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});
router.post("/create-new-product", adminVerify, async (req, res) => {
  try {
    let newProduct = await Product.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      primaryImageUrl: req.body.primaryImageUrl,
      storeId: req.body.storeId,
      discount: req.body.discount,
    });
    return res.json({
      message: "Product successfully created!",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});
router.delete("/delete-product/:id", adminVerify, deleteFromDatabase(Product));
module.exports = router;
