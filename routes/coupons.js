const express = require("express");
const router = express.Router();
const db = require("../models");
const deleteFromDatabase = require("../middlewares/deleteFromDatabase");
const Coupons = db.Coupons;

router.post("/new-coupon", async (req, res) => {
  try {
    let newCoupon = await Coupons.create({
      coupon: req.body.coupon,
      storeId: req.body.storeId,
    });
    return res.json({
      message: "Coupon successfully created!",
      coupon: newCoupon,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occured while creating a new Coupon!" });
  }
});

module.exports = router;
