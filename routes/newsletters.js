const express = require("express");
const router = express.Router();
const db = require("../models");
const deleteFromDatabase = require("../middlewares/deleteFromDatabase");
const Newsletters = db.Newsletters;

router.post("/subscribe", async (req, res) => {
  try {
    let newSubscriber = await Newsletters.create({
      email: req.body.email,
      storeId: req.body.storeId,
    });
    return res.json({
      message: "Successfully subscribed to our store!",
      subscriber: newSubscriber,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while creating a new Subscriber! " });
  }
});

module.exports = router;
