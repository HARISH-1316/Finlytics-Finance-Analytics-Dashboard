const wrapAsync = require("../utils/wrapAsync.js");
const Record = require("../Models/Record.js");
const mongoose = require("mongoose");

const queryGenerate = (req) => {
  const query = ["admin", "analyst"].includes(req.user.role)
    ? {}
    : { userId: new mongoose.Types.ObjectId(req.user.id) };
  return query;
};

//  SUMMARY  //
const dashboardSummary = wrapAsync(async (req, res) => {
  const query = queryGenerate(req);

  const data = await Record.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  let totalIncome = 0;
  let totalExpense = 0;
  let countIncome = 0;
  let countExpense = 0;

  for (let item of data) {
    if (item._id === "income") {
      totalIncome = item.total;
      countIncome = item.count;
    }
    if (item._id === "expense") {
      totalExpense = item.total;
      countExpense = item.count;
    }
  }

  const summary = {
    Total_Income: totalIncome,
    Count_of_Income: countIncome,
    Total_Expense: totalExpense,
    Count_of_Expense: countExpense,
    Total_Transactions: countIncome + countExpense,
    Balance: totalIncome - totalExpense,
  };

  res.status(200).json({ status: "success", summary });
});

//  Category  //
const dashboardCategory = wrapAsync(async (req, res, next) => {
  const query = queryGenerate(req);

  const data = await Record.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          category: "$category",
          type: "$type",
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  return res.status(200).json({ status: "success", data });
});

//  RECENT  //
const dashboardRecent = wrapAsync(async (req, res, next) => {
  const query = queryGenerate(req);

  const data = await Record.find(query).sort({ date: -1 }).limit(25);

  return res.status(200).json({ status: "success", data });
});

//  TRENDS  //
const dashboardTrends = wrapAsync(async (req, res, next) => {
  const query = queryGenerate(req);

  const data = await Record.aggregate([
    { $match: query },

    {
      $group: {
        _id: {
          month: {
            $dateToString: { format: "%Y-%m", date: "$date" },
          },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: "$_id.month",
        income: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        income: 1,
        expense: 1,
      },
    },
    { $sort: { month: -1 } },
  ]);
  return res.status(200).json({ status: "success", data });
});

module.exports = {
  dashboardSummary,
  dashboardCategory,
  dashboardRecent,
  dashboardTrends,
};
