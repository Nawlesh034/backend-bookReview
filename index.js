import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import connection from './db/dbConnection.js'
import cookieParser from 'cookie-parser'
import userRouter from './routes/router.js'
import cors from 'cors'

const app =express()

app.use(express.json()) 
app.use(cookieParser())

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://frontend-book-review-bay.vercel.app', // Add your Vercel domain here
        process.env.FRONTEND_URL // Environment variable for production
    ].filter(Boolean), // Remove undefined values
    credentials: true,
  }));


app.use(express.urlencoded({ extended: true }));


















app.use('/api/v1',userRouter)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connection()
  });