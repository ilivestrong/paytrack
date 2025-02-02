import { IsDate, IsUUID } from 'class-validator';

export class AttendanceDTO {
  @IsUUID(4)
  userID: string;
}

export class GetCheckedinUsersFilterDTO {
  @IsDate()
  date: string;

  @IsUUID(4)
  companyID: string;
}
