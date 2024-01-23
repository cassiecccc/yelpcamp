const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// npm i method-override
const methodOverride = require("method-override");
const Campground = require("./models/campground");

//* mongoose error handling

const dbConnection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
    console.log("initial db connection successful");
  } catch (error) {
    handleError(error);
  }
};

dbConnection();

mongoose.connection.on("error", (err) => {
  logError(err);
});

//* mongoose error handling

const app = express();
//
//

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//parse form data
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// CAMPGROUND CRUD

// create route
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground); //*grouped in ejs
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// show route
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

// edit route
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

// delete route
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => console.log("Serving on port 3000"));
