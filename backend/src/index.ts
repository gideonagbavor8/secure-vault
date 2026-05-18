import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'SecureVault Backend API is running securely.' });
});

// Sample vault route
app.get('/api/vault', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Sample Bank Account', username: 'user@example.com', category: 'Finance' },
      { id: 2, title: 'Email Service', username: 'admin@securevault.io', category: 'Productivity' }
    ]
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
