import { Request, Response, NextFunction } from 'express';
import { CountryService } from './country.service';
import { COUNTRY_MESSAGES, COUNTRY_STATUS_CODES } from './constants';

export class CountryController {
  private countryService: CountryService;

  constructor() {
    this.countryService = new CountryService();
  }

  getTopCountries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limitParam = req.query.limit ? parseInt(req.query.limit as string) : 10;
      // Validate limit: use default if invalid, cap at 50
      const limit = isNaN(limitParam) ? 10 : Math.min(Math.max(1, limitParam), 50);
      const countries = await this.countryService.getTopCountries(limit);

      res.status(COUNTRY_STATUS_CODES.OK).json({
        success: true,
        data: countries
      });
    } catch (error) {
      next(error);
    }
  };

  getCountryByCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code } = req.params;
      const country = await this.countryService.getCountryByCode(code);

      if (!country) {
        res.status(COUNTRY_STATUS_CODES.NOT_FOUND).json({
          success: false,
          error: {
            message: COUNTRY_MESSAGES.COUNTRY_NOT_FOUND
          }
        });
        return;
      }

      res.status(COUNTRY_STATUS_CODES.OK).json({
        success: true,
        data: country
      });
    } catch (error) {
      next(error);
    }
  };
}
