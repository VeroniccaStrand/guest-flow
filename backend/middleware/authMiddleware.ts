import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { log } from 'console';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; 
    }
  }
}

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Extract token from request cookies if cookies are defined
  if (req.cookies) {
    token = req.cookies.jwt;
  }
console.log(req.cookies)
console.log(token)
  // If token exists, verify it
  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Check if user role is ADMIN
      if (decoded.role !== 'ADMIN') {
        res.status(403).json({ error: 'Not authorized, user is not an admin' }); // Send JSON response for 403 error
        return;
      }

      // If the user is an admin, set the decoded user information in the request object
      req.user = decoded;

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token verification failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token found');
  }
});

export { protect };
