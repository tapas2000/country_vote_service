import axios from 'axios';
import { Vote } from '../modules/votes/vote.model';
import { config } from '../config/config';

interface Country {
  cca2: string;
  cca3: string;
  name: {
    common: string;
  };
}

/**
 * Fetch all countries from REST Countries API
 */
async function fetchAllCountries(): Promise<Country[]> {
  try {
    console.log('Fetching all countries from REST Countries API...');
    const response = await axios.get(`${config.restCountriesApi}/all?fields=cca2,cca3,name`);
    console.log(`✓ Fetched ${response.data.length} countries`);
    return response.data;
  } catch (error) {
    console.error('✗ Failed to fetch countries:', error);
    throw error;
  }
}

/**
 * Generate mock email for a country
 */
function generateMockEmail(countryCode: string, index: number): string {
  return `vote-${countryCode.toLowerCase()}-${index}@example.com`;
}

/**
 * Generate mock name for a country
 */
function generateMockName(countryName: string, index: number): string {
  const firstNames = ['John', 'Jane', 'Maria', 'Carlos', 'Anna', 'Pierre', 'Yuki', 'Ahmed', 'Sofia', 'Hans'];
  const lastNames = ['Smith', 'Garcia', 'Silva', 'Mueller', 'Tanaka', 'Kim', 'Johnson', 'Brown', 'Lee', 'Wang'];
  
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  
  return `${firstName} ${lastName} (${countryName})`;
}

/**
 * Seed database with votes for all countries
 */
export async function rollout(): Promise<void> {
  try {
    console.log('=================================');
    console.log('Starting Country Votes Seeder');
    console.log('=================================\n');

    // 1. Fetch all countries
    const countries = await fetchAllCountries();
    
    // 2. Create votes for each country (1-3 votes per country for variety)
    const votesToCreate = [];
    let emailIndex = 0;

    for (const country of countries) {
      // Random number of votes per country (1-3)
      const numVotes = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numVotes; i++) {
        votesToCreate.push({
          name: generateMockName(country.name.common, emailIndex),
          email: generateMockEmail(country.cca2, emailIndex),
          country: country.cca2
        });
        emailIndex++;
      }
    }

    console.log(`\nCreating ${votesToCreate.length} votes for ${countries.length} countries...`);

    // 3. Bulk insert votes
    await Vote.bulkCreate(votesToCreate, {
      validate: true,
      individualHooks: false
    });

    console.log(`✓ Successfully created ${votesToCreate.length} votes`);
    console.log('\n=================================');
    console.log('Seeding Complete!');
    console.log('=================================');
    
  } catch (error) {
    console.error('\n✗ Seeding failed:', error);
    throw error;
  }
}

/**
 * Remove all seeded data (votes with @example.com emails)
 */
export async function rollback(): Promise<void> {
  try {
    console.log('=================================');
    console.log('Rolling back Country Votes Seeder');
    console.log('=================================\n');

    // Delete all votes with @example.com emails
    const deletedCount = await Vote.destroy({
      where: {
        email: {
          [require('sequelize').Op.like]: '%@example.com'
        }
      }
    });

    console.log(`✓ Deleted ${deletedCount} seeded votes`);
    console.log('\n=================================');
    console.log('Rollback Complete!');
    console.log('=================================');
    
  } catch (error) {
    console.error('\n✗ Rollback failed:', error);
    throw error;
  }
}

/**
 * Get seeder statistics
 */
export async function stats(): Promise<void> {
  try {
    const totalVotes = await Vote.count();
    const seededVotes = await Vote.count({
      where: {
        email: {
          [require('sequelize').Op.like]: '%@example.com'
        }
      }
    });
    const realVotes = totalVotes - seededVotes;

    console.log('=================================');
    console.log('Database Statistics');
    console.log('=================================');
    console.log(`Total votes:   ${totalVotes}`);
    console.log(`Seeded votes:  ${seededVotes}`);
    console.log(`Real votes:    ${realVotes}`);
    console.log('=================================');
  } catch (error) {
    console.error('✗ Failed to get stats:', error);
    throw error;
  }
}
