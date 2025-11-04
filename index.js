const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const contactroutes = require("./Routes/Routes.js");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {console.log("Database connected");
    app.listen(process.env.PORT, () => console.log("Server started "));})
  .catch((error) => console.log("DB Connection Error:", error));


app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.errormsg = req.session.errormsg || "";
  req.session.errormsg = ""; 
  next();
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signin", (req, res) => {
  res.render("signup");
});

app.get("/add-contact", (req, res) => {
  res.render("add");
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});

app.get("/delete-account", (req, res) => {
  res.render("delete");
});

app.use(contactroutes);
