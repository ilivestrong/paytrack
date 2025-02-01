import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import {
  CreateCompanyDTO,
  FilterCompaniesDTO,
  GetCompanyUsersDTO,
} from './dto/company.dto';
import { isDuplicateError } from 'src/shared/util';
import { User } from 'src/users/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

  async GetCompanyUsers(filter: GetCompanyUsersDTO) {
    const { companyID } = filter;
    const users = await this.usersRepository.findBy({
      company: { id: companyID },
    });

    if (!users) {
      return new NotFoundException(
        `no users found for company id: ${companyID}`,
      );
    }
    return users;
  }
}
