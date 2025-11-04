const express = require("express");
const {login,userId,addcontact,deletecontact,signin,deleteaccount,} = require("../Controllers/controllers.js");

const contactroute = express.Router();

contactroute.post("/login", login);
contactroute.post("/signin", signin);
contactroute.post("/add-contact", addcontact);
contactroute.post("/delete-contact", deletecontact);
contactroute.post("/delete-account", deleteaccount);

contactroute.get("/:userId", userId);

module.exports = contactroute;
