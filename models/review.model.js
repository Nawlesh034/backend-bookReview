import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
   book:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Book",
    required:true,
   },
   user:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User",
     required:true,
   },
   review_text: {
    type: String,
    required: true,
  },
   rating:{
    type:Number,
    required:true,
   }
},{timestamps:true})

const Review = mongoose.model("Review", reviewSchema);

export default Review;