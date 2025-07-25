import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token; // ✅ access JWT from cookie

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next(); // allow to proceed to route
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;