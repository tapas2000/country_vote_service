import { Request, Response, NextFunction } from 'express';
import { CountryService } from './country.service';

export class CountryController {
  private countryService: CountryService;

  constructor() {
    this.countryService = new CountryService();
  }

  getTopCountries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const countries = await this.countryService.getTopCountries(limit);

      res.status(200).json({
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
        res.status(404).json({
          success: false,
          error: {
            message: 'Country not found'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: country
      });
    } catch (error) {
      next(error);
    }
  };
}
