import { Module } from '@nestjs/common';
import { BalancesService } from './balances.service';

@Module({
  providers: [BalancesService],
})
export class BalancesModule {}
