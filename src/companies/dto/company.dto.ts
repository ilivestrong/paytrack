import { IsString, IsUUID } from 'class-validator';

export class CreateCompanyDTO {
  @IsString()
  name: string;
}
