const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const testsSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    img: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("tests", testsSchema);

module.exports = Test;
