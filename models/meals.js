import mongoose from "mongoose"

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
 
    isReadyToMake: Boolean,
  
  });

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;