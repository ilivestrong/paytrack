import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  CreateCompanyDTO,
  FilterCompaniesDTO,
  GetCompanyUsersDTO,
} from './dto/company.dto';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private companyService: CompaniesService) {}
  @Post()
  create(@Body() company: CreateCompanyDTO) {
    const { name } = company;
    return this.companyService.create({ name });
  }

  @Get()
  findAll(@Body() filter: FilterCompaniesDTO) {
    const { active } = filter;
    return this.companyService.findAll({ active });
  }

  @Get(':companyID/users')
  getUsers(@Param() filter: GetCompanyUsersDTO) {
    return this.companyService.GetCompanyUsers(filter);
  }
}
