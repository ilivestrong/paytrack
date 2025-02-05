import { IsBoolean, IsDate, IsOptional, IsUUID } from 'class-validator';

export class AttendanceDTO {
  @IsUUID(4)
  userID: string;

  @IsOptional()
  @IsBoolean()
  isTest: boolean;
}

export class GetCheckedinUsersFilterDTO {
  @IsDate()
  date: string;

  @IsUUID(4)
  companyID: string;
}
