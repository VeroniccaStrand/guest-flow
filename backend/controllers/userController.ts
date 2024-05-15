import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { Response, Request, response } from 'express';

const prisma = new PrismaClient();

// @desc    Register new user
// @route   POST /api/users
// @access  Private / ADMIN
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, fullname, role } = req.body;

  // Check if user with the given username already exists
  const userExists = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (userExists) {
    // If user exists, send a 400 error response
    res.status(400).json({ error: 'User with this username already exists' });
    return;
  }

  // Hash the user's password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the new user
  const user = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
      fullname: fullname,
      role: role,
    },
  });

  // Send response if user is created successfully
  if (user) {
    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } else {
    // If user creation fails, send a 400 error response
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login User / generate token
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  console.log('backend login')
  const { username, password } = req.body;

  // Validate the username
  if (!username || typeof username !== 'string') {
    res.status(400);
    throw new Error('Invalid username');
  }

  // Find the user by username
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  // Check if user exists and password matches
  if (user && (await bcrypt.compare(password, user.password))) {
    // If valid, generate and send token along with user details
    const token = generateToken(res, user.id, user.role)
    
    res.json({
      id: user.id,
      name: user.fullname,
      token:token,
      
    });
  } else {
    // If invalid, send a 400 error response
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Delete User
// @route   DELETE /api/users
// @access  Private / ADMIN
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.body;

  // Check if the user exists before attempting to delete
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    // Throw an error if user is not found
    res.status(404);
    throw new Error('User not found');
  }

  // Proceed with deletion if user exists
  await prisma.user.delete({
    where: { username },
  });

  // Send response indicating successful deletion
  res.status(200).json({
    username: user.username,
    message: 'User deleted successfully',
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private / ADMIN
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  // Retrieve all users from the database
  const users = await prisma.user.findMany();

  // Send the list of users as the response
  res.status(200).json(users);
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  // Clear the JWT cookie by setting it to an empty string and setting the expiration date to the past
  res.cookie('jwt', '', {
    httpOnly: false,
    expires: new Date(0),
  });

  // Send a success response indicating the user has been logged out
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private ADMIN
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
   const { username, fullname, password } = req.body;

  if (!username) {
    res.status(400);
    throw new Error('Username is required');
  }

  const user = await prisma.user.findUnique({
    where: { username: username }, // Assuming req.user contains the logged-in user's info
  });

  if (user) {
    user.username = req.body.username || user.username;
    user.fullname = req.body.fullname || user.fullname;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
  
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        fullname: user.fullname,
        password: user.password,
      },
    });

    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      fullname: updatedUser.fullname,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// Generate JWT
const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';

const generateToken = (res: Response, id: string, role: string) => {
  // Generate a JWT token with the user's ID and role, and an expiration of 30 days
  const token = jwt.sign({ id, role }, jwtSecret, {
    expiresIn: '30d',
  });

  // Set the token as a cookie in the response
  res.cookie('jwt', token, {
    httpOnly: false,
     // Use secure cookies in production
    
  });

return token
};
