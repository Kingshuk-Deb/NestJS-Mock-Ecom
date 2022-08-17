import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userRepository.create(createUserDto);
  }

  async findById(
    id: string,
    projection?: Record<string, unknown>,
  ): Promise<UserDocument> {
    return this.userRepository.findByID(id, projection);
  }

  async findOne(
    body: unknown,
    projection?: Record<string, unknown>,
  ): Promise<UserDocument> {
    return this.userRepository.findOne(body, projection || {});
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userRepository.findByIdAndUpdate(id, updateUserDto);
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userRepository.findByIdAndDelete(id);
  }
}
