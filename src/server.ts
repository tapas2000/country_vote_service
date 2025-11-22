import { createApp } from './app';
import { connectDatabase } from './config/database';
import { config } from './config/config';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server is running on http://localhost:${config.port}`);
      console.log(`📊 API endpoints:`);
      console.log(`   POST http://localhost:${config.port}/api/votes`);
      console.log(`   GET  http://localhost:${config.port}/api/countries/top`);
      console.log(`🏥 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
