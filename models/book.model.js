import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:String,
    author:String,
    genre:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})


const Book = mongoose.model("Book",bookSchema);

export default Book;