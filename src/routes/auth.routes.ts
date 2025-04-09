import express, { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user.model';

interface JwtPayload {
  _id: string;
}

const router = express.Router();


router.post('/signup', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }


    const user = new User({ email, password });
    await user.save();

    
    const payload: JwtPayload = { _id: user._id.toString() };
    const secret = process.env.JWT_SECRET || 'default-secret';
    const options: SignOptions = { expiresIn: '24h' };
    
    const token = jwt.sign(payload, secret, options);

    res.status(201).json({ user: { email: user.email }, token });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});


router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    const payload: JwtPayload = { _id: user._id.toString() };
    const secret = process.env.JWT_SECRET || 'default-secret';
    const options: SignOptions = { expiresIn: '24h' };
    
    const token = jwt.sign(payload, secret, options);

    res.json({ user: { email: user.email }, token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

export const authRoutes = router; 