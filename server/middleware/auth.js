const jwt = require("jsonwebtoken");
const config = process.env;
const Session = require("../models/Session");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Unauthorized");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    const isExist = await Session.findOne({ username: decoded.username });
    if (!isExist) return res.status(401).send("Invalid Token");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const checkRole = (roles) => async (req, res, next) => {
  const { role } = req.user;

  !roles.includes(role)
    ? res.status(401).json("Invalid access - No permission allowed")
    : next();
};

module.exports = { verifyToken, checkRole };
