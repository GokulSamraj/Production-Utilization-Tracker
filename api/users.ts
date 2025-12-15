import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './mongodb';
import { User } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

      case 'DELETE': {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ message: 'User ID is required for deletion' });
        }
        
        const deleteResult = await usersCollection.deleteOne({ id: id });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Also delete the user's records
        const recordsCollection = db.collection('records');
        await recordsCollection.deleteMany({ userId: id });

        return res.status(200).json({ message: 'User and their records deleted successfully' });
      }
      
      default:
        res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Users Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
