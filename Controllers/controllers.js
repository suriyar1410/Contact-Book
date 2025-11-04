const { User, Contact } = require("../models/User");
const bcrypt = require("bcrypt");

const saltingRound = 10;
let userId;
let contactItems = [];

exports.login = async (req, res) => {
  try {
    const logName = req.body.loginName;
    const logPassword = req.body.loginPassword;
    const foundUser = await User.findOne({ username: logName });

    if (!foundUser) {
      req.session.errormsg = "User not found !!!!";
      return res.redirect("/login");
    }
    bcrypt.compare(logPassword, foundUser.userpassword, (err, result) => {
      if (err) {
        console.error(err);
        req.session.errormsg = "An error occurred during login.";
        return res.redirect("/login");
      }
      if (result === true) {
        userId = foundUser.id;
        return res.redirect("/" + foundUser.id);
      } else {
        req.session.errormsg = "User and password mismatch !!!";
        return res.redirect("/login");
      }
    });
  } catch (err) {
    console.error(err);
    req.session.errormsg = "Unexpected error during login.";
    res.redirect("/login");
  }
};

exports.signin = async (req, res) => {
  try {
    const signName = req.body.signName;
    const signPassword = req.body.signPassword;
    const foundUser = await User.findOne({ username: signName });

    if (foundUser) {
      req.session.errormsg = "User with this name already exists !!!";
      return res.redirect("/signin");
    }

    bcrypt.hash(signPassword, saltingRound, async (err, hashString) => {
      if (err) {
        console.error(err);
        req.session.errormsg = "Error creating account.";
        return res.redirect("/signin");
      }

      const user = new User({
        username: signName,
        userpassword: hashString,
        contactitems: contactItems,
      });

      await user.save();
      req.session.errormsg = "Account created successfully! Please login.";
      res.redirect("/login");
    });
  } catch (err) {
    console.error(err);
    req.session.errormsg = "Unexpected error during signup.";
    res.redirect("/signin");
  }
};

exports.userId = async (req, res) => {
  try {
    const foundUser = await User.findById(userId);
    if (foundUser) {
      res.render("home", {
        foundcontacts: foundUser.contactitems,
        username: foundUser,
      });
    } else {
      req.session.errormsg = "User not found.";
      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
    req.session.errormsg = "Error loading user data.";
    res.redirect("/login");
  }
};

exports.addcontact = async (req, res) => {
  try {
    const contact = new Contact({
      contactname: req.body.contactName,
      contactnumber: req.body.contactNumber,
    });

    const foundUser = await User.findById(userId);
    foundUser.contactitems.push(contact);
    await foundUser.save();

    res.redirect("/" + userId);
  } catch (err) {
    console.error(err);
    req.session.errormsg = "Error adding contact.";
    res.redirect("/" + userId);
  }
};

exports.deletecontact = async (req, res) => {
  try {
    const deleteContactId = req.body.deleteButton;
    await Contact.findByIdAndDelete(deleteContactId);
    await User.findByIdAndUpdate(userId, {
      $pull: { contactitems: { _id: deleteContactId } },
    });

    res.redirect("/" + userId);
  } catch (err) {
    console.error("Error deleting contact:", err);
    req.session.errormsg = "Error deleting contact.";
    res.redirect("/" + userId);
  }
};


exports.deleteaccount = async (req, res) => {
  try {
    const delname = req.body.delName;
    const delPassword = req.body.delPassword;
    const foundUser = await User.findOne({ username: delname });

    if (!foundUser) {
      req.session.errormsg = "User not found";
      return res.redirect("/delete-account");
    }
    await User.findByIdAndDelete(foundUser.id);
    req.session.errormsg = "Account deleted successfully !!";
    res.redirect("/delete-account");
  } catch (err) {
    console.error(err);
    req.session.errormsg = "Error deleting account.";
    res.redirect("/delete-account");
  }
};
