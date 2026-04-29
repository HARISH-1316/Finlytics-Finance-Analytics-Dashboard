require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const ExpressError = require("./utils/ExpressError.js");

//  MONGOOSE  //
await mongoose.connect(process.env.MONGO_URI);

main()
  .then(() => {
    console.log("mongoose connected successfully");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/zorvyn");
}

//  EXPRESS ROUTER  //
const authRouter = express.Router();
const recordRouter = express.Router();
const dashboardRouter = express.Router();

//  EXPRESS PARSER  //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  SCHEMA VALIDATIION  //
const { userSchema } = require("./validators/userSchema.js");

const {
  recordSchema,
  updateRecordSchema,
} = require("./validators/recordSchema.js");

const { validate } = require("./validators/validate.js");

/////////////////
/////////////////
/////////////////
/////////////////

//  AUTH CONTROLLER  //
const {
  signup,
  login,
  me,
  verifyToken,
  checkRoles,
  statusToggle,
  roleToggle,
  getSpecificUser,
} = require("./Controller/authController.js");

app.use("/auth", authRouter);

//  RECORD CONTROLLER  //
const {
  showRecords,
  newRecord,
  specificUserRecord,
  specificRecord,
  editRecord,
  deleteRecord,
  showCategoryRecord,
} = require("./Controller/recordController.js");

app.use("/records", recordRouter);

//  DASHBOARD CONTROLLER  //
const {
  dashboardSummary,
  dashboardCategory,
  dashboardRecent,
  dashboardTrends,
} = require("./Controller/dashboardController.js");

app.use("/dashboard", dashboardRouter);

/////////////////
/////////////////
/////////////////
/////////////////

//  AUTHORIZATION  //

//  SIGNUP  //
authRouter.post("/signup", validate(userSchema), signup);

//  login  //
authRouter.post("/login", login);

//  ME  //
authRouter.get("/me", verifyToken, me);

//  STATUS TOGGLE //
authRouter.put("/:id/status", verifyToken, checkRoles("admin"), statusToggle);

//  ROLE TOGGLE  //
authRouter.put("/:id/role", verifyToken, checkRoles("admin"), roleToggle);

//  GET SPECIFIC USER  //
authRouter.get("/search", verifyToken, checkRoles("admin"), getSpecificUser);

/////////////////
/////////////////
/////////////////
/////////////////

//  RECORDS  //

//  GET RECORDS  //
recordRouter.get("/", verifyToken, showRecords);

//  GET SPECIFIC USER RECORDS //
recordRouter.get(
  "/user/:id",
  verifyToken,
  checkRoles("admin", "analyst"),
  specificUserRecord,
);

//  SEARCH RECORD BY TYPE, DATE AND DATE   //
recordRouter.get("/search", verifyToken, showCategoryRecord);

//  GET SPECIFIC RECORDS  //
recordRouter.get("/:id", verifyToken, specificRecord);

//  CREATE NEW RECORD  //
recordRouter.post("/", verifyToken, validate(recordSchema), newRecord);

//  EDIT RECORD  //
recordRouter.put("/:id", verifyToken, validate(updateRecordSchema), editRecord);

//  DELETE RECORD  //
recordRouter.delete("/:id", verifyToken, checkRoles("admin"), deleteRecord);

/////////////////
/////////////////
/////////////////
/////////////////

//  DASHBOARD  //

// SUMMARY  //
dashboardRouter.get("/summary", verifyToken, dashboardSummary);

//  CATEGORY  //
dashboardRouter.get("/category", verifyToken, dashboardCategory);

//  RECENT  //
dashboardRouter.get("/recent", verifyToken, dashboardRecent);

//  TRENDS  //
dashboardRouter.get("/trends", verifyToken, dashboardTrends);

/////////////////
/////////////////
/////////////////
/////////////////

//  HOME PAGE //
app.get("/", (req, res) => {
  res.status(200).send("Home Page");
});

//  INVALID ROUTES  //
app.use(() => {
  throw new ExpressError(404, "Route not found");
});

//  ERROR HANDLER  //
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    if (err.path === "date") {
      err = new ExpressError(400, "Invalid Date");
    } else {
      err = new ExpressError(400, "Invalid Id");
    }
  }

  const { statusCode = 500, message = "Some Error Occurred" } = err;
  return res.status(statusCode).json({ status: "fail", message });
});

app.listen(port, () => {
  console.log(`App is listening at: ${port}`);
});
