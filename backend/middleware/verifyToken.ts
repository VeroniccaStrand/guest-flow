const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';
import jwt from 'jsonwebtoken'

export const verifyToken = (req:any, res:any, next:any) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach the decoded token data (e.g., user ID and role) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};