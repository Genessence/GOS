import app from './app';
import dotenv from 'dotenv';
import prisma from './config/prisma';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log('Connected to database');
  } catch (err) {
    console.error('Database connection error', err);
  }
});

process.on('SIGINT', async () => {
  console.log('Shutting down');
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
