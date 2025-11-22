import { Sequelize } from 'sequelize';
import { config } from './config';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.databasePath,
  logging: config.nodeEnv === 'development' ? console.log : false
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    await sequelize.sync({ alter: config.nodeEnv === 'development' });
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};
