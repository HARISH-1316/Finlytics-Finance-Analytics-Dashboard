const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      min: 1,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      trim: true,
      type: String,
    },
  },
  { timestamps: true },
);

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
