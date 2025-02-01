import { IsBoolean, isBoolean, IsString, IsUUID } from 'class-validator';

export class CreateCompanyDTO {
  @IsString()
  name: string;
}

export class FilterCompaniesDTO {
  @IsBoolean()
  active: boolean;
}
