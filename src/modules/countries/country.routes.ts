import { Router } from 'express';
import { CountryController } from './country.controller';

const router = Router();
const countryController = new CountryController();

// GET /countries/top - Get top countries by votes
router.get('/countries/top', countryController.getTopCountries);

// GET /countries/:code - Get country details by code
router.get('/countries/:code', countryController.getCountryByCode);

export default router;
