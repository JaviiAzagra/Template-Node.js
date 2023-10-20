const express = require("express");
const { isAdmin, isAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const { generateSign } = require("../../utils/jwt/jwt");
const User = require("../models/users.model");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find()
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json("Error al leer los usuarios");
  }
});

router.get("/id", [isAuth], async (req, res, next) => {
  try {
    const userID = req.user._id;
    const user = await User.findById(userID);
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});

router.get("/:email", [isAdmin], async (req, res, next) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email: email });
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const userDB = await User.findOne({ email: req.body.email });
    if (!userDB) {
      return res.status(404).json("User does not exist");
    }
    if (bcrypt.compareSync(req.body.password, userDB.password)) {
      const token = generateSign(userDB._id, userDB.email);
      return res.status(200).json({ token, userDB });
    } else {
      return res.status(200).json("Password is incorrect!");
    }
  } catch (error) {
    return next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const token = null;
    return res.status(200).json(token);
  } catch (error) {
    return next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const user = req.body;
    const newUser = new User(user);
    if (newUser.rol === "patient") {
      const created = await newUser.save();
      return res.status(201).json(created);
    } else {
      return res.status(500).json("You're not allowed to create admin account");
    }
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete/:id", [isAdmin], async (req, res, next) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    return res.status(200).json("User deleted successfully!");
  } catch (error) {
    return next(error);
  }
});

router.put("/edit/:id", [isAdmin], async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.body;
    const userModify = new User(user);
    userModify._id = id;
    await User.findByIdAndUpdate(id, userModify);
    return res.status(200).json("User edited successfully!");
  } catch (error) {
    return next(error);
  }
});

router.post("/checksession", [isAuth], async (req, res, next) => {
  console.log(req.header.authorization);
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
