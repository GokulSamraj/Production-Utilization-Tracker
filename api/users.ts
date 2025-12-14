import { Request, Response } from 'express';
import { connectToDatabase } from './mongodb';
import { User } from '../types';

export default async function handler(req: Request, res: Response) {
  const { db } = await connectToDatabase();
  const usersCollection = db.collection<User>('users');

  try {
    switch (req.method) {
      case 'POST': {
        const newUser: User = req.body;
        await usersCollection.insertOne(newUser);
        const { password, ...userWithoutPassword } = newUser;
        return res.status(201).json(userWithoutPassword);
      }
      
      case 'PUT': {
        const updatedUser: Partial<User> = req.body;
        const { id, ...updates } = updatedUser;
        if (!id) {
          return res.status(400).json({ message: 'User ID is required for updates' });
        }
        await usersCollection.updateOne({ id: id }, { $set: updates });
        const finalUser = await usersCollection.findOne({ id: id });

        if (!finalUser) {
          return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = finalUser;
        return res.status(200).json(userWithoutPassword);
      }
      
      default:
        res.setHeader('Allow', ['POST', 'PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Users Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
