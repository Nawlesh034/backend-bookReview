import Book from "../models/book.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Review from "../models/review.model.js";




const Register = async(req,res)=>{
    const {name,email,password} = req.body;
    console.log(name)
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user =await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({name,email,password:hashedPassword});
        await newUser.save();
        return res.status(201).json({message:"User created successfully"});

    }
    catch( error){
        return res.status(500).json({message:"Internal server error"});
    }
}

const login =async(req,res)=>{
    const {email,password} = req.body;
    console.log(email)
    console.log(password)
    try{
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user =await User.findOne({email});
       
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        console.log(isMatch)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        // token generation using jwt
        
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        console.log('🎫 Generated token:', token);

        const cookieOptions = {
            httpOnly:true,
            maxAge:1000*60*60*24,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Allow cross-origin in production
        };

        console.log('🍪 Setting cookie with options:', cookieOptions);
        res.cookie("token",token, cookieOptions);
        return res.status(200).json({
            message:"Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch( error){
        return res.status(500).json({message:"Internal server error"});
    }
}
const logout = async(req,res)=>{
    res.clearCookie("token", {
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    return res.status(200).json({message:"Logout successful"});
}
const AddBook = async(req,res)=>{
    const {title,author,genre} = req.body;
    
    try{
        if(!title || !author || !genre){
            return res.status(400).json({message:"All fields are required"});
        }
         
        const book = new Book({title,author,genre});
       
       await book.save();
       
        
        return res.status(201).json({message:"Book added successfully"});
    }
    catch( error){
        return res.status(500).json({message:"Internal server error"});
    }
}

const getBooks = async(req,res)=>{
    try{
        const {genre ,author,page=1,limit=10}=req.query;
        const query = {};
        if(genre){
            query.genre = genre;
        }
        if(author){
            query.author = author;
        }
        const books = await Book.find(query).skip((page-1)*limit).limit(parseInt(limit));
        const totalBooks = await Book.countDocuments(query);

        res.status(200).json({
        total: totalBooks,
        page: parseInt(page),
        totalPages: Math.ceil(totalBooks / limit),
        books
        });
    }
    catch( error){
        return res.status(500).json({message:"Internal server error"});
    }
}

const ReviewBook = async (req, res) => {
  const { bookId, rating,review } = req.body;

  try {
    if (!bookId || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book does not exist" });
    }

    // Optional: prevent duplicate review by the same user
    const existingReview = await Review.findOne({ book: bookId, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this book." });
    }

    const newReview = new Review({
      book: bookId,
      user: req.user.id,
      rating,
     review_text:review
    });

    await newReview.save();

    return res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error while adding review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getReviews = async (req, res) => {
  const { bookId } = req.params;
  try {
    const reviews = await Review.find({ book: bookId }).populate("user", "name");
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error while fetching reviews:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export {Register,login,AddBook,ReviewBook,logout,getBooks,getReviews};
