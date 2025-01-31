import { IsUUID } from 'class-validator';

export class AttendanceDTO {
  @IsUUID(4)
  userID: string;
}
