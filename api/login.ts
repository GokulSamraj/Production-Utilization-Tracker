import { Request, Response } from 'express';
import { connectToDatabase } from './mongodb';
import { User } from '../types';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { username, password } = req.body;
    const { db } = await connectToDatabase();

    const user = await db.collection<User>('users').findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isDisabled) {
      return res.status(403).json({ message: 'This account has been disabled.' });
    }

    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('API Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
