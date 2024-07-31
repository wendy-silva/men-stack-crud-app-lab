import dotnev from "dotenv";
dotnev.config()
import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import morgan from "morgan";
import Meal from "./models/meals.js";

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 

mongoose.connect(process.env.MONGODB_URI);

app.get("/Home", async (req, res) => {
    res.render("index.ejs");
  });

  app.get("/meals/new", async (req, res) => {
    res.render("meals/new.ejs");
  });

  app.post("/meals", async (req, res) => {
    // talk to the db - through the model
    if (req.body.isReadyToMake === "on") {
      req.body.isReadyToMake = true;
    } else {
      req.body.isReadyToMake = false;
    }
    await Meal.create(req.body);
    res.redirect("/meals");
  });

  app.get("/meals", async (req, res) => {
    const allMeals = await Meal.find();
    res.render("meals/index.ejs", { meals: allMeals });
  });

  app.get("/meals/:mealId", async (req, res) => {
    const foundMeal = await Meal.findById(req.params.mealId);
    res.render("meals/show.ejs", { meal: foundMeal });
  });

  app.delete("/meals/:mealId", async (req, res) => {
    await Meal.findByIdAndDelete(req.params.mealId);
    res.redirect("/meals");
  });

  app.get("/meals/:mealId/edit", async (req, res) => {
    const foundMeal = await Meal.findById(req.params.mealId);
    res.render("meals/edit.ejs", {
      meal: foundMeal,
    });
  });

  app.put("/meals/:mealId", async (req, res) => {
    if (req.body.isReadyToMake === "on") {
      req.body.isReadyToMake = true;
    } else {
      req.body.isReadyToMake = false;
    }
    
    await Meal.findByIdAndUpdate(req.params.MealId, req.body);
   
    res.redirect(`/meals/${req.params.mealId}`);
});

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  
    app.listen(4000, () => {
      console.log("Listening on port 4000");
    });
  });