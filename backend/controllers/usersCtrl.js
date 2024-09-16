//!  User Registration
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersController = {
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    //! validate
    if (!username || !email || !password) {
      throw new Error("Please all felids are required");
    }
    //! Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }
    //! Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //! Create the user and save into DB
    const userCreated = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),
  login: asyncHandler(async (req, res) => {
    //! Get the user data
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }
    //! Generate a token for the user
    const token = jwt.sign({ id: user._id }, "anykey", {
      expiresIn: "30d",
    });
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),
  //!profile
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }
    //!send response
    res.json({
      username: user.username,
      email: user.email,
    });
  }),
  changePassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    } //!
    //! Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.save(
      {validateBeforeSave:false}
    );
    //!send response
    res.json({
      message: "Password changed successfully",
    });
  }),
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true, //* in order to return the record we need to put this.
      }
    );
    res.json({ message: "user profile updated successfully", updatedUser });
  }),
};

module.exports = usersController;
