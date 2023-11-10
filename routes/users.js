const express = require("express");
const router = express.Router();
const db = require("../models");
const deleteFromDatabase = require("../middlewares/deleteFromDatabase");
const User = db.User;
const Admin = db.Admin;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../middlewares/verify");
const adminVerify = require("../middlewares/adminVerify");
const sendEmail = require("../utils/sendEmail");

require("dotenv/config");
//TODO get users by store

router.get("/check", verify, async (req, res) => {
  try {
    let user = await User.findOne({ where: { id: req.user.id } });
    user.password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    return res.status(201).json({ message: "Authorized!", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const verifyToken = jwt.verify(token, process.env.JWT_MAIL_SECRET);
    if (!verifyToken) {
      return res.status(404).json({ message: "Invalid token!" });
    }
    let user = await User.findByPk(verifyToken.id);
    user.isVerified = true;
    await user.save();
    return res.json({ message: "Successfully verified!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});

router.post("/create-new-user", async (req, res) => {
  try {
    const { username, password, repassword, name, surname, storeId, email } =
      req.body;
    if (!username || !password || !repassword || !email) {
      return res.status(400).json({ error: "Fill required fields!" });
    }
    if (username.includes(" ")) {
      return res.status(400).json({
        error: "The white spaces aren't allowed in username!",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "Please enter correct format of email!" });
    }
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    let user = await User.create({
      username,
      password: bcrypt.hashSync(password, 10),
      name,
      surname,
      storeId,
      email,
    });
    user.password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;

    let token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname,
        storeId: user.storeId,
      },
      process.env.JWT_SECRET
    );
    let mailVerify = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname,
        storeId: user.storeId,
      },
      process.env.JWT_MAIL_SECRET
    );

    //TODO rijesiti izgled maila jer button ne vuce style, sve wrappovati u div pa namjestiti
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Verify account!",
      html: `
      <div style="text-align: center;">
      <h1 style="font-size: 18px; font-weight: bold;">Verify</h1>
      <p>We're contacting you to verify your account by clicking on the button below.</p>
      <a href="http://localhost:3000/verify/${mailVerify}">
        <button style="margin-top: 5px; width: 100%; background-color: #b88f2e; hover:background-color: #614b17; active:background-color: #3b2d0e; transition: duration: 500ms; text-align: center; color: white; padding: 16px; font-size: 16px; font-weight: bold; border: none; cursor: pointer; border-radius: 4px;">
          Click to verify
        </button>
      </a>
    </div>
    `,
    };
    sendEmail(mailOptions);
    return res.json({ message: "User successfully created!", token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while creating new user!" });
  }
});
router.get("/", adminVerify, async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while fetching users!" });
  }
});
router.delete("/delete-user/:id", adminVerify, deleteFromDatabase(User));

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
      raw: true,
    });
    if (!user) return res.status(400).json({ message: "Wrong username!" });
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).json({ message: "Wrong password!" });
    }
    user.password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;

    let token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname,
        storeId: user.storeId,
      },
      process.env.JWT_SECRET
    );

    return res.json({ token, user, message: "Logged in!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error!" });
  }
});

router.put("/update-user/:id", verify, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, oldPassword, newPassword, name, surname, email } =
      req.body;

    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!bcrypt.compareSync(req.body.oldPassword, existingUser.password)) {
      console.log();
      return res.status(400).json({ message: "Wrong password!" });
    }

    existingUser.username = username;
    existingUser.password = bcrypt.hashSync(newPassword, 10);
    existingUser.name = name;
    existingUser.surname = surname;
    // existingUser.storeId = storeId;
    existingUser.email = email;

    await existingUser.save();
    existingUser.password = undefined;
    existingUser.createdAt = undefined;
    existingUser.updatedAt = undefined;
    return res.json({
      message: "User successfully updated!",
      user: existingUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while updating user!" });
  }
});

//================== A D M I N ======================//

router.post("/create-admin", adminVerify, async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await Admin.create({
      username,
      password: bcrypt.hashSync(password, 10),
    });
    user.password = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;

    let token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_ADMIN_SECRET
    );

    return res.json({ message: "User successfully created!", token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while creating new user!" });
  }
});
router.get("/get-all-admins", adminVerify, async (req, res) => {
  try {
    const admins = await Admin.findAll();
    return res.json(admins);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while fetching Admins!" });
  }
});

router.delete("/delete-admin/:id", adminVerify, deleteFromDatabase(Admin));
module.exports = router;
