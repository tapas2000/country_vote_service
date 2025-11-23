import { sequelize } from '../config/database';
import * as countriesSeeder from './countries.seeder';

/**
 * Seeder CLI
 * 
 * Usage:
 *   npm run seed:up      - Run seeder (populate database)
 *   npm run seed:down    - Rollback seeder (remove seeded data)
 *   npm run seed:stats   - Show database statistics
 * 
 * Or specify a seeder:
 *   ts-node src/seeders/index.ts up countries
 */

const seeders: Record<string, any> = {
  countries: countriesSeeder,
};

async function main() {
  const command = process.argv[2]; // up, down, or stats
  const seederName = process.argv[3]; // countries, etc.

  try {
    if (!command || !seederName) {
      console.log('Usage: ts-node src/seeders/index.ts <command> <seeder>');
      console.log('Commands: up, down, stats');
      console.log('Seeders:', Object.keys(seeders).join(', '));
      console.log('\nOr use npm scripts:');
      console.log('  npm run seed:up      - Run countries seeder');
      console.log('  npm run seed:down    - Rollback countries seeder');
      console.log('  npm run seed:stats   - Show countries seeder statistics');
      process.exit(1);
    }

    const seeder = seeders[seederName];
    if (!seeder) {
      console.error(`❌ Seeder "${seederName}" not found.`);
      console.log('Available seeders:', Object.keys(seeders).join(', '));
      process.exit(1);
    }

    // Connect to database
    await sequelize.authenticate();
    await sequelize.sync();

    switch (command) {
      case 'up':
      case 'rollout':
        console.log(`\n🌱 Running ${seederName} seeder...`);
        await seeder.rollout();
        break;

      case 'down':
      case 'rollback':
        console.log(`\n🔄 Rolling back ${seederName} seeder...`);
        await seeder.rollback();
        break;

      case 'stats':
      case 'status':
        console.log(`\n📊 ${seederName} seeder statistics:`);
        await seeder.stats();
        break;

      default:
        console.error('❌ Invalid command. Use: up, down, or stats');
        process.exit(1);
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    await sequelize.close();
    process.exit(1);
  }
}

main();
