const express = require("express");
const router = express.Router();
const db = require("../models");
const deleteFromDatabase = require("../middlewares/deleteFromDatabase");
const adminVerify = require("../middlewares/adminVerify");
const Store = db.Store;

router.get("/", adminVerify, async (req, res) => {
  try {
    const stores = await Store.findAll();
    return res.json({
      message: "Stores successfully fetched!",
      stores,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while fetching stores!" });
  }
});
router.put("/update-store/:id", adminVerify, async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found!" });
    }
    store.name = req.body.name;
    store.webaddress = req.body.webaddress;
    await store.save();
    return res.json({ message: "Store updated successfully!", store });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mesage: "Internal server eror!" });
  }
});

router.post("/create-new-store", async (req, res) => {
  console.log(req.body);
  try {
    let newStore = await Store.create({
      name: req.body.name,
      webaddress: req.body.webaddress,
    });
    return res.json({
      message: "Store successfully created!",
      store: newStore,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating a new Store!" });
  }
});

router.delete("/delete-store/:id", adminVerify, deleteFromDatabase(Store));

module.exports = router;
