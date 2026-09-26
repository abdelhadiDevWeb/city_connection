import mongoose from 'mongoose';

interface ConnectionConfig {
  uri?: string;
  dbName?: string;
}

let isConnected = false;

export async function connectToDatabase(config?: ConnectionConfig): Promise<typeof mongoose> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const uri = config?.uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/saas_db';
  const dbName = config?.dbName || process.env.MONGODB_DB_NAME || 'saas_db';

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`[MongoDB] Successfully connected to database: ${dbName}`);
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
