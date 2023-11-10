const express = require("express");
const router = express.Router();
const db = require("../models");
const Order = db.Order;
const OrderHasProduct = db.OrderHasProduct;
const verify = require("../middlewares/verify");
const deleteFromDatabase = require("../middlewares/deleteFromDatabase");
const adminVerify = require("../middlewares/adminVerify");
const checkOwner = require("../middlewares/checkOwner");

router.post("/create-new-order", verify, async (req, res) => {
  try {
    let newOrder = await Order.create({
      storeId: req.user.storeId,
      totalAmount: req.body.totalAmount,
      userId: req.user.id,
      status: "Pending",
    });

    const products = req.body.products;
    const errors = [];
    products.forEach((product) => {
      product.id
        ? product.quantity
          ? newOrder.id
            ? product.price
              ? null
              : errors.push("Product price is invalid!")
            : errors.push("Order id is invalid!")
          : errors.push("Product quantity is invalid!")
        : errors.push("Product id is invalid!");
    });
    if (errors.length > 0) {
      return res.status(500).json({ message: "Invalid product data!", errors });
    }
    const orderProducts = products.map((product) => ({
      orderId: newOrder.id,
      productId: product.id,
      quantity: product.quantity,
      price: product.price,
    }));
    try {
      const createdProducts = await OrderHasProduct.bulkCreate(orderProducts);
      return res.json({ message: "Item placed into the Order!" });
    } catch (error) {
      await Order.destroy({
        where: {
          id: newOrder.id,
        },
      });
      return res
        .status(500)
        .json({ message: "Error while putting items in Order." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while creating new order!" });
  }
});

// -- get orders full details
router.get(
  "/ordered-items/:id",
  verify,
  checkOwner(Order),
  async (req, res) => {
    try {
      const { id } = req.params;
      const fullOrder = await OrderHasProduct.findAll({
        where: { orderId: id },
      });
      if (!fullOrder) return res.json({ message: "Order not found!" });
      return res.json({
        message: "Order fetched with all products!",
        order: fullOrder,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error!" });
    }
  }
);

router.put("/cancel-order/:id", adminVerify, async (req, res) => {
  try {
    const { id } = req.params;
    const existingOrder = await Order.findByPk(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }
    existingOrder.status = "Canceled";
    await existingOrder.save();
    return res.json({ message: "Order canceled!", order: existingOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while canceling order!" });
  }
});
router.put("/confirm-order/:id", adminVerify, async (req, res) => {
  try {
    const { id } = req.params;
    const existingOrder = await Order.findByPk(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }
    existingOrder.status = "Confirmed";
    await existingOrder.save();
    return res.json({ message: "Order confirmed!", order: existingOrder });
    //TODO da li vratiti sve narudzbe ili samo jednu pa je azurirati samo u niz svih narudzbi
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while confirming order!" });
  }
});
router.get("/", adminVerify, async (req, res) => {
  try {
    const orders = await Order.findAll();
    return res.json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while fetching orders!" });
  }
});
router.delete("/delete-order/:id", adminVerify, deleteFromDatabase(Order));

module.exports = router;
