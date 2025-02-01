import { Body, Controller, Post } from '@nestjs/common';
import { CreateCompanyDTO } from './dto/company.dto';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private companyService: CompaniesService) {}
  @Post()
  create(@Body() company: CreateCompanyDTO) {
    const { name } = company;
    return this.companyService.create({ name });
  }
}
