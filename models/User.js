const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  contactname: String,
  contactnumber: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  userpassword: String,
  contactitems: [contactSchema], 
});

const Contact = mongoose.model("Contact", contactSchema);
const User = mongoose.model("User", userSchema);

module.exports = { User, Contact };