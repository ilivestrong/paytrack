import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDTO, FilterCompaniesDTO } from './dto/company.dto';
import { isDuplicateError } from 'src/shared/util';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(company: CreateCompanyDTO) {
    try {
      const newCompany = this.companyRepository.create(company);
      return await this.companyRepository.save(newCompany);
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new ConflictException(
          `A company with name: ${company.name} already exists`,
        );
      }
      throw error;
    }
  }

  findAll(filter: FilterCompaniesDTO) {
    const { active } = filter;
    return this.companyRepository.findBy({ active });
  }
}
