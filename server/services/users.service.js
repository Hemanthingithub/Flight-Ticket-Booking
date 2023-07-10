// importing user context
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Session = require("../models/Session");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }
    const user = JSON.parse(JSON.stringify(await User.findOne({ username })));

    if (user && (await bcrypt.compare(password, user.password))) {
      const data = { user_id: user._id, username, role: user.role };
      const token = jwt.sign(data, process.env.TOKEN_KEY, {
        expiresIn: 600,
      });
      user.token = token;
      await Session.findOneAndDelete({ username });
      await Session.create({
        username: username.toLowerCase(),
        token,
        expiresAt: new Date(),
      });
      return res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
};

const signUp = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!(password && username)) {
      return res.status(400).send("All input is required");
    }
    const oldUser = await User.findOne({ username });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.toLowerCase(),
      password: encryptedPassword,
      role,
    });
    const data = { user_id: user._id, username, role };
    const token = jwt.sign(data, process.env.TOKEN_KEY, {
      expiresIn: 600,
    });
    await Session.create({
      username: username.toLowerCase(),
      token,
      expiresAt: new Date(),
    });
    user.token = token;
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).send("Something went wrong");
  }
};

const logout = async (req, res) => {
    try {
        await Session.deleteOne({ username: req.user.username });
        res.status(201).json({ message: "Logout success"});
    } catch (err) {
        console.error(err);
        res.status(400).send("Something went wrong");
    }
};

module.exports = { login, signUp, logout };
