import { IsIn, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { SALARY_TYPE } from '../user.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

const SALARY_TYPE_MONTHLY = 'monthly';
const SALARY_TYPE_DAILY = 'daily';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsIn([SALARY_TYPE_MONTHLY, SALARY_TYPE_DAILY])
  salaryType: SALARY_TYPE;

  @IsNumber()
  @Min(1)
  baseSalary: number;
}

export class FindUserDTO {
  @IsUUID(4)
  userID: string;
}
