import {
  IsEmail,
  IsIn,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { SALARY_TYPE } from '../user.entity';

const SALARY_TYPE_MONTHLY = 'monthly';
const SALARY_TYPE_DAILY = 'daily';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsIn([SALARY_TYPE_MONTHLY, SALARY_TYPE_DAILY])
  salaryType: SALARY_TYPE;

  @IsNumber()
  @Min(1)
  salaryOrDailyRate: number;

  @IsUUID(4)
  companyId: string;
}

export class GetUserByIdDTO {
  @IsUUID()
  userID: string;
}

export class GetUserByCompanyIdDTO {
  @IsUUID()
  companyID: string;
}
