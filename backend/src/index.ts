import { prisma } from './lib/prisma';
import app from './app';

const PORT = process.env.PORT || 5000;

// Start Server & Test Database Connection
async function startServer() {
  try {
    await prisma.$connect();
    console.log('[database]: Successfully connected to PostgreSQL via Prisma.');

    app.listen(PORT, () => {
      console.log(`[server]: Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[database]: Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
}

startServer();
