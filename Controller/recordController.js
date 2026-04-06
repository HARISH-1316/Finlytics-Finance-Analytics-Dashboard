const wrapAsync = require("../utils/wrapAsync.js");
const Record = require("../Models/Record.js");
const ExpressError = require("../utils/ExpressError.js");

// GET RECORD //
const showRecords = wrapAsync(async (req, res, next) => {
  let records;
  if (["admin", "analyst"].includes(req.user.role)) {
    records = await Record.find().sort({ date: -1 });
  } else {
    records = await Record.find({ userId: req.user.id }).sort({ date: -1 });
  }

  return res.status(200).json({ status: "success", data: records });
});

// GET SPECIFIC USER RECORDS  //
const specificUserRecord = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  let records = await Record.find({ userId: id });

  return res.status(200).json({ status: "success", data: records });
});

// GET SPECIFIC RECORDS  //
const specificRecord = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  let record = await Record.findOne({ _id: id });

  if (!record) {
    throw new ExpressError(404, "Record not found");
  }
  if (
    ["viewer"].includes(req.user.role) &&
    record.userId.toString() != req.user.id
  ) {
    throw new ExpressError(
      403,
      "You are not allowed to view other user's record",
    );
  }

  return res.status(200).json({ status: "success", data: record });
});

//  SEARCH RECORD BY TYPE, DATE AND DATE   //
const showCategoryRecord = wrapAsync(async (req, res, next) => {
  let { type, category, date } = req.query;
  let query = {};
  if (type) {
    if (["income", "expense"].includes(type)) {
      query.type = type;
    } else {
      throw new ExpressError(400, "Invalid Type");
    }
  }
  if (category) {
    if (category.trim() !== "") {
      category = category.toLowerCase();
      query.category = category;
    } else {
      throw new ExpressError(400, "Invalid Category");
    }
  }
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }
  if (["viewer"].includes(req.user.role)) {
    query.userId = req.user.id;
  }
  let record = await Record.find(query).sort({ date: -1 });

  return res.status(200).json({ status: "success", data: record });
});

//  CREATE NEW RECORD  //
const newRecord = wrapAsync(async (req, res, next) => {
  const recordBody = req.body;

  const newData = {
    userId: req.user.id,
    ...recordBody,
  };
  let record = await Record.create(newData);

  return res.status(201).json({ status: "success", data: record });
});

//  EDIT RECORDS  //
const editRecord = wrapAsync(async (req, res, next) => {
  const updateRecord = req.body;

  delete updateRecord.userId;

  const { id } = req.params;
  let query = ["admin"].includes(req.user.role)
    ? { _id: id }
    : { _id: id, userId: req.user.id };

  let record = await Record.findOneAndUpdate(query, updateRecord, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!record) {
    throw new ExpressError(
      403,
      "Invalid ID or you are not authorized to edit other user's record",
    );
  }

  return res.status(200).json({ status: "success", data: record });
});

//  DELETE RECORD  //
const deleteRecord = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  let query = ["admin"].includes(req.user.role)
    ? { _id: id }
    : { _id: id, userId: req.user.id };

  const record = await Record.findOneAndDelete(query);

  if (!record) {
    throw new ExpressError(
      400,
      "Invalid ID or you are not authorized to delete other user's record",
    );
  }
  return res.status(200).json({
    status: "success",
    message: "Record deleted successfully",
    data: record,
  });
});

module.exports = {
  showRecords,
  newRecord,
  specificUserRecord,
  specificRecord,
  editRecord,
  deleteRecord,
  showCategoryRecord,
};
