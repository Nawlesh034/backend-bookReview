import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  console.log('🔍 Auth Middleware - Checking token...');
  console.log('📝 All cookies:', req.cookies);
  console.log('📝 Authorization header:', req.headers.authorization);

  // Try to get token from Authorization header first, then cookies
  let token = null;

  // Check Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('🎫 Token found in Authorization header');
  } else {
    // Fallback to cookie (for local development)
    token = req.cookies?.token;
    console.log('🎫 Token found in cookies:', token ? 'YES' : 'NO');
  }

  if (!token) {
    console.log('❌ No token found in Authorization header or cookies');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
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