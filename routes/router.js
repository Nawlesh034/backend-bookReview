import express from 'express';
import verifyToken from '../middleware/auth.middleware.js';

import {Register,login,AddBook,logout, getBooks, ReviewBook,getReviews} from '../controller/user.controller.js';


const router = express.Router();
router.post('/register',Register);
router.post('/login',login);
router.get('/main', (req, res) => {
    res.send('Hello World!');
});
router.get('/', getBooks); 
router.post('/logout',logout)
router.post('/addBook',verifyToken,AddBook);
router.post('/review', verifyToken, ReviewBook);
router.get("/book/:bookId/reviews", getReviews);


export default router;