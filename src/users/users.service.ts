import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(user: CreateUserDTO) {
    const { name, salaryType, baseSalary } = user;
    const newUser = this.userRepository.create({
      name,
      salaryType,
      baseSalary,
    });

    return this.userRepository.save(newUser);
  }

  findByUserID(userID: string) {
    return this.userRepository.findOneBy({ id: userID });
  }
}
