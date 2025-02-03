import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class BalancesService {
  private logger = new Logger(BalancesService.name);

  constructor(private dataSource: DataSource) {}

  async calculateMonthlyUsersBalance(
    userIds: string,
    yesterdayWasHoliday: boolean,
  ) {
    const query = `
          SELECT public.calculate_monthly_users_balance($1, $2);
        `;
    const params = [userIds, yesterdayWasHoliday];

    try {
      const result = await this.dataSource.query(query, params);
      this.logger.log('calculateMonthlyUsersBalance() invoked successfully');
      return result;
    } catch (error) {
      throw new Error('Error calling stored procedure: ' + error.message);
    }
  }

  async calculateDailyUsersBalance(
    userIds: string,
    yesterdayWasHoliday: boolean,
  ) {
    const query = `
          SELECT public.calculate_daily_users_balance($1, $2);
        `;
    const params = [userIds, yesterdayWasHoliday];

    try {
      const result = await this.dataSource.query(query, params);
      this.logger.log('calculateDailyUsersBalance() invoked successfully');
      return result;
    } catch (error) {
      throw new Error('Error calling stored procedure: ' + error.message);
    }
  }
}
