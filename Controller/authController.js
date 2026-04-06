const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../Models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;
const ExpressError = require("../utils/ExpressError.js");

//  SIGNUP  //
const signup = wrapAsync(async (req, res, next) => {
  const { name, password } = req.body;
  const email = req.body.email.toLowerCase();

  let user = await User.findOne({ email });
  if (user) {
    throw new ExpressError(400, "User already registered");
  }

  const hashPass = await bcrypt.hash(password, 10);

  user = new User({
    name: name,
    email: email,
    password: hashPass,
    role: "viewer",
  });

  const result = await user.save();
  const userObj = result.toObject();
  delete userObj.password;
  return res.status(201).json({
    status: "success",
    data: userObj,
  });
});

//  LOGIN  //
const login = wrapAsync(async (req, res, next) => {
  const email = req.body.email?.toLowerCase();
  const password = req.body.password;
  if (!email || !password) {
    throw new ExpressError(400, "Email and password required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ExpressError(400, "Invalid email or password");
  } else if (!user.isActive) {
    throw new ExpressError(403, "Account is Deactivated");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ExpressError(400, "Invalid email or password");
  }

  const accessToken = jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    SECRET,
    { expiresIn: "2h" },
  );

  res.status(200).json({ status: "success", token: accessToken });
});

//  ME  //
const me = wrapAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

//  STATUS TOGGLE //
const statusToggle = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const userToggle = await User.findById(id);

  if (!userToggle) {
    throw new ExpressError(404, "User not found");
  } else if (userToggle.id.toString() == req.user.id) {
    throw new ExpressError(403, "You cannot deactivate yourself");
  }

  const newStatus = !userToggle.isActive;

  let result = await User.findByIdAndUpdate(
    id,
    { isActive: newStatus },
    { returnDocument: "after", runValidators: true },
  );
  return res.status(200).json({ status: "success", data: result });
});

//  ROLE TOGGLE  //
const roleToggle = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new ExpressError(404, "User not found with given id");
  }

  if (id == req.user.id) {
    throw new ExpressError(403, "You cannot change your own role");
  } else if (!["viewer", "analyst", "admin"].includes(role)) {
    throw new ExpressError(400, "Invalid role");
  }

  let result = await User.findByIdAndUpdate(
    id,
    { role },
    { returnDocument: "after", runValidators: true },
  );
  return res.status(200).json({ status: "success", data: result });
});

//   GET SPECIFIC USERS  //
const getSpecificUser = wrapAsync(async (req, res, next) => {
  let { id, name, email, role } = req.query;
  let query = {};
  if (id) {
    query._id = id;
  }
  if (name) {
    query.name = name;
  }
  if (email) {
    query.email = email;
  }
  if (role) {
    query.role = role;
  }
  let result = await User.find(query);

  return res.status(200).json({ status: "success", data: result });
});

//  VERIFY TOKEN //
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ExpressError(401, "Token not found"));
    }

    const decodedUser = jwt.verify(token, SECRET);

    req.user = decodedUser;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ExpressError(401, "Token Expired");
    }

    if (err.name === "JsonWebTokenError") {
      throw new ExpressError(401, "Invalid Token");
    }
    return next(err);
  }
};

//  CHECK ROLES  //
const checkRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ExpressError(
        403,
        "You do not have the permission to perform this action",
      );
    }
    next();
  };
};

module.exports = {
  signup,
  login,
  me,
  verifyToken,
  checkRoles,
  statusToggle,
  roleToggle,
  getSpecificUser,
};
