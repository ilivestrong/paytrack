import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserDTO,
  GetUserByCompanyIdDTO,
  GetUserByIdDTO,
} from './dto/user.dto';
import {
  isDuplicateError,
  isForeignKeyViolationError,
  isNotNullViolationError,
} from 'src/shared/util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDTO) {
    try {
      const { name, email, salaryType, baseSalary, companyId } = user;
      const newUser = this.userRepository.create({
        name,
        email,
        salaryType,
        baseSalary,
        company: { id: companyId },
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new ConflictException(
          `A user with name: ${user.name} and email: ${user.email} already exists`,
        );
      }
      if (isNotNullViolationError(error)) {
        throw new BadRequestException(`companyId is required`);
      }
      if (isForeignKeyViolationError(error)) {
        throw new BadRequestException(`invalid companyId provided`);
      }

      throw error;
    }
  }

  findByUserID(filter: GetUserByIdDTO) {
    const { userID } = filter;
    return this.userRepository.findOneBy({ id: userID });
  }

  findByCompanyID(filter: GetUserByCompanyIdDTO) {
    const { companyID } = filter;
    return this.userRepository.findBy({ company: { id: companyID } });
  }
}
