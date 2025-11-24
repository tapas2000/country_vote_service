import { Router } from 'express';
import { CountryController } from './country.controller';
import { COUNTRY_ROUTES } from './constants';

const router = Router();
const countryController = new CountryController();

// GET /countries/top - Get top countries by votes
router.get(COUNTRY_ROUTES.GET_TOP_COUNTRIES, countryController.getTopCountries);

// GET /countries/:code - Get country details by code
router.get(COUNTRY_ROUTES.GET_COUNTRY_BY_CODE, countryController.getCountryByCode);

export default router;
