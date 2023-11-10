const jwt = require("jsonwebtoken");
const db = require("../models");
const Admin = db.Admin;
require("dotenv/config");

const AdminVerify = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "You're not authorized!" });
    }
    const verified = jwt.verify(
      req.headers.authorization,
      process.env.JWT_ADMIN_SECRET
    );
    const admin = await Admin.findByPk(verified.id, {
      where: {
        isAdmin: true,
      },
    });
    if (!admin) {
      return res.status(401).json({ message: "You're not Administrator!" });
    }
    req.user = verified;

    next();
  } catch (error) {
    return res.status(401).json({ message: "You're not authorized!" });
  }
};

module.exports = AdminVerify;
