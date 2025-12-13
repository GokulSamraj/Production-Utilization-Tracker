import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './mongodb';
import { DEFAULT_ADMIN } from '../constants';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { db } = await connectToDatabase();
    
    // Check if admin exists, if not, create it.
    const adminUser = await db.collection('users').findOne({ id: DEFAULT_ADMIN.id });
    if (!adminUser) {
      await db.collection('users').insertOne({ ...DEFAULT_ADMIN });
    }

    const users = await db.collection('users').find({}).project({ password: 0 }).toArray();
    const records = await db.collection('records').find({}).toArray();

    res.status(200).json({ users, records });
  } catch (error) {
    console.error('API Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
