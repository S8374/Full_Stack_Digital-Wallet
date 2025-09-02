import {Server} from 'http';
import mongoose from 'mongoose';
import { envVariables } from './app/config/envVeriables';
import app from './app';
import { createAdmin } from './app/utils/createAdmin';
import { connectRedis } from './app/config/redis.config';

let server:Server ;

const startServer =  async () => {
  try {
    await mongoose.connect(envVariables.MONGO_URI);
    console.log('Connected to MongoDB');
    server = app.listen(envVariables.PORT, () => {
      console.log(`Server is running on port ${envVariables.PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    
  }
};

(async () => {
  await connectRedis();
  await startServer();
  // Create admin user if it doesn't exist
  await createAdmin();
})();

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
