const express = require("express");
const { uploadFile, deleteFile } = require("../middlewares/cloudinary");
const Test = require("../models/test.model")
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allTests = await Test.find();
    return res.status(200).json(allTests);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const testToFind = await Test.findById(id);
    return res.status(200).json(testToFind);
  } catch (error) {
    return next(error);
  }
});

router.post("/create", uploadFile.single("img"), async (req, res, next) => {
  try {
    const test = req.body;
    if (req.file) {
      test.img = req.file.path;
    }
    const newTest = new Test(test);
    const created = await newTest.save();
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const test = await Test.findById(id);
    if (test.img) {
      deleteFile(test.img);
    }
    const testToDelete = await Test.findByIdAndDelete(id);
    return res.status(200).json(`The 'test' has been deleted --> ${testToDelete}`);
  } catch (error) {
    return next(error);
  }
});

router.put("/edit/:id", uploadFile.single("img"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const testDb = await Test.findById(id);
    if (testDb.img) {
      deleteFile(testDb.img);
    }
    const test = req.body;
    if (req.file) {
      test.img = req.file.path;
    }
    const testModify = new Test(test);
    testModify._id = id;
    const testUpdated = await Test.findByIdAndUpdate(id, testModify);
    return res.status(200).json(`Successfully updated --> ${testUpdated}`);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;