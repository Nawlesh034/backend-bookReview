import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  console.log('🔍 Auth Middleware - Checking token...');
  console.log('📝 All cookies:', req.cookies);

  const token = req.cookies?.token; // ✅ access JWT from cookie
  console.log('🎫 Token found:', token ? 'YES' : 'NO');

  if (!token) {
    console.log('❌ No token found in cookies');
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully for user:', decoded.id);
    req.user = decoded; // attach user info to request
    next(); // allow to proceed to route
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;