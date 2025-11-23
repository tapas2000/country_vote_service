import { Vote } from '../modules/votes/vote.model';

/**
 * Seed data for development and testing
 */
export const seedVotes = [
  // United States (5 votes)
  { name: 'John Smith', email: 'john.smith@example.com', country: 'US' },
  { name: 'Sarah Johnson', email: 'sarah.johnson@example.com', country: 'US' },
  { name: 'Michael Brown', email: 'michael.brown@example.com', country: 'US' },
  { name: 'Emily Davis', email: 'emily.davis@example.com', country: 'US' },
  { name: 'David Wilson', email: 'david.wilson@example.com', country: 'US' },
  
  // Germany (4 votes)
  { name: 'Hans Mueller', email: 'hans.mueller@example.com', country: 'DE' },
  { name: 'Anna Schmidt', email: 'anna.schmidt@example.com', country: 'DE' },
  { name: 'Peter Weber', email: 'peter.weber@example.com', country: 'DE' },
  { name: 'Maria Fischer', email: 'maria.fischer@example.com', country: 'DE' },
  
  // France (3 votes)
  { name: 'Pierre Dubois', email: 'pierre.dubois@example.com', country: 'FR' },
  { name: 'Marie Martin', email: 'marie.martin@example.com', country: 'FR' },
  { name: 'Jean Bernard', email: 'jean.bernard@example.com', country: 'FR' },
  
  // Japan (3 votes)
  { name: 'Yuki Tanaka', email: 'yuki.tanaka@example.com', country: 'JP' },
  { name: 'Hiroshi Sato', email: 'hiroshi.sato@example.com', country: 'JP' },
  { name: 'Sakura Yamamoto', email: 'sakura.yamamoto@example.com', country: 'JP' },
  
  // Brazil (2 votes)
  { name: 'Carlos Silva', email: 'carlos.silva@example.com', country: 'BR' },
  { name: 'Ana Santos', email: 'ana.santos@example.com', country: 'BR' },
  
  // United Kingdom (2 votes)
  { name: 'James Taylor', email: 'james.taylor@example.com', country: 'GB' },
  { name: 'Emma Thompson', email: 'emma.thompson@example.com', country: 'GB' },
  
  // Spain (2 votes)
  { name: 'Pablo Garcia', email: 'pablo.garcia@example.com', country: 'ES' },
  { name: 'Isabella Rodriguez', email: 'isabella.rodriguez@example.com', country: 'ES' },
  
  // Canada (1 vote)
  { name: 'Sophie Tremblay', email: 'sophie.tremblay@example.com', country: 'CA' },
  
  // Italy (1 vote)
  { name: 'Marco Rossi', email: 'marco.rossi@example.com', country: 'IT' },
  
  // Australia (1 vote)
  { name: 'Olivia Mitchell', email: 'olivia.mitchell@example.com', country: 'AU' },
];

/**
 * Seed the database with initial data
 */
export async function seedDatabase(): Promise<void> {
  try {
    // Check if database is already seeded
    const existingVotes = await Vote.count();
    
    if (existingVotes > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    console.log('Seeding database with mock data...');
    
    // Insert all seed votes
    await Vote.bulkCreate(seedVotes);
    
    console.log(`✅ Successfully seeded ${seedVotes.length} votes`);
    console.log('Countries represented:');
    console.log('  - United States: 5 votes');
    console.log('  - Germany: 4 votes');
    console.log('  - France: 3 votes');
    console.log('  - Japan: 3 votes');
    console.log('  - Brazil: 2 votes');
    console.log('  - United Kingdom: 2 votes');
    console.log('  - Spain: 2 votes');
    console.log('  - Canada: 1 vote');
    console.log('  - Italy: 1 vote');
    console.log('  - Australia: 1 vote');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

/**
 * Clear all data from the database
 */
export async function clearDatabase(): Promise<void> {
  try {
    console.log('Clearing database...');
    await Vote.destroy({ where: {}, truncate: true });
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

/**
 * Reset database: clear and reseed
 */
export async function resetDatabase(): Promise<void> {
  await clearDatabase();
  await seedDatabase();
}
