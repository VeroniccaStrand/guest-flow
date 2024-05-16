import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const protectVisit = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Extract token from request cookies if cookies are defined
  if (req.cookies) {
    token = req.cookies.jwt;
  }

  // If token exists, verify it
  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Check if userId is present in the decoded token
      if (!decoded.id) {
        res.status(401).json({ message: 'Not authorized, token is missing userId' });
        return;
      }

      // Attach user to request
      req.user = decoded;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token found' });
  }
});

export { protectVisit };
