const express = require("express");
const router = express.Router();
const db = require("../models");
const Address = db.Address;
const verify = require("../middlewares/verify");
const deleteFromDatabase = require("../middlewares/deleteFromDatabase");
const adminVerify = require("../middlewares/adminVerify");
const checkOwner = require("../middlewares/checkOwner");

router.get("/", adminVerify, async (req, res) => {
  try {
    const addresses = await Address.findAll();
    return res.json(addresses);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while fetching addresses!" });
  }
});

//TODO CheckOwner skinuti i provjeravati iz req.userId
router.get(
  "/get-addresses/:id",
  verify,
  checkOwner(Address),
  async (req, res) => {
    try {
      const { id } = req.params;
      const addresses = await Address.findAll({ where: { userId: id } });
      return res.json({
        message: "Addresses for User fetched successfully!",
        addresses,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "An error ocured while fetching addresses from User!",
      });
    }
  }
);

router.post("/create-new-address", verify, async (req, res) => {
  try {
    const { street, city, state, country } = req.body;
    const errors = [];
    street
      ? city
        ? state
          ? country
            ? null
            : errors.push("Address country is invalid!")
          : errors.push("Address state is invalid!")
        : errors.push("Address city is invalid!")
      : errors.push("Address street is invalid!");
    if (errors.length > 0) {
      return res.status(500).json({ message: "Invalid address data!", errors });
    }
    const newAddress = await Address.create({
      street: street,
      city: city,
      state: state,
      country: country,
      userId: req.user.id,
    });
    return res.json({
      message: "Address created successfully!",
      address: newAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while creating address" });
  }
});

router.delete("/delete-address/:id", verify, deleteFromDatabase(Address));
module.exports = router;
