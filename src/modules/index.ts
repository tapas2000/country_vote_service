import { Router } from 'express';
import voteRoutes from './votes/vote.routes';
import countryRoutes from './countries/country.routes';

export const registerModules = (): Router => {
  const router = Router();

  // Register all module routes
  router.use('/', voteRoutes);
  router.use('/', countryRoutes);

  return router;
};

// Export all modules
export * from './votes';
export * from './countries';
export * from './shared';
