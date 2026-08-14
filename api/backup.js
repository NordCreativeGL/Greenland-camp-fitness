import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const BACKUP_KEY = 'gcf-backup:default';

export default async function handler(req, res) {
  const secret = req.headers['x-backup-secret'];
  if (!secret || secret !== process.env.BACKUP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Invalid payload' });
      }
      await redis.set(BACKUP_KEY, JSON.stringify(data));
      return res.status(200).json({ ok: true, savedAt: new Date().toISOString() });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save backup' });
    }
  }

  if (req.method === 'GET') {
    try {
      const raw = await redis.get(BACKUP_KEY);
      if (!raw) {
        return res.status(404).json({ error: 'No backup found' });
      }
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve backup' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
