const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
require("dotenv/config");

const verify = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "You're not authorized!" });
    }
    const verified = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // TODO prebaciti req.headers u req.cookie i dodati da li je nalog aktivan i aktiviran
    // const korisnik = await User.findByPk(verified.id, {
    //   attributes: ["aktivan"],
    //   raw: true,
    // });
    // if (!korisnik.aktivan) {
    //   res.clearCookie("token");
    //   return res.status(401).json({ message: "Nalog deaktiviran!" });
    // }
    req.user = verified;

    next();
  } catch (error) {
    return res.status(401).json({ message: "You're not authorized!" });
  }
};

module.exports = verify;
