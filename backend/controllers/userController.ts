import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { Response, Request } from 'express';
const prisma = new PrismaClient();

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, fullname, role } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (userExists) {
    res.status(400).json({ error: 'User with this username already exists' });
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {

      username: username,
      password: hashedPassword,
      fullname:fullname,
      role:role,
    },
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      username: user.username,
      role:user.role,
      
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});



//LOGIN
export const loginUser = asyncHandler(async(req, res) => {
  const {username, password} = req.body

   if (!username || typeof username !== 'string') {
    res.status(400);
    throw new Error('Invalid username');
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username
    },
  });

  if(user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name:user.fullname,
      token: generateToken(res, user.id, user.role)
    })
  }else {
    res.status(400)
    throw new Error('Invalid credentials')
  }

})

//Generate JWT
const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';

const generateToken = (res:Response, id:String, role:string) => {
  const token =  jwt.sign({ id, role },jwtSecret, {
    expiresIn: '30d',
  });
   res.cookie('jwt',token,{
    
   } )
   
   console.log(token)
};