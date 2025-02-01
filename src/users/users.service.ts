import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDTO) {
    try {
      const { name, email, salaryType, baseSalary } = user;
      const newUser = this.userRepository.create({
        name,
        email,
        salaryType,
        baseSalary,
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new ConflictException(
          `A user with name: ${user.name} and email: ${user.email} already exists`,
        );
      }
      throw error;
    }
  }

  findByUserID(userID: string) {
    return this.userRepository.findOneBy({ id: userID });
  }
}

function isDuplicateError(error: Error): boolean {
  return (
    error instanceof QueryFailedError &&
    (error as QueryFailedError).message.includes('duplicate key value')
  );
}
