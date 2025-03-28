import { Injectable, OnModuleInit, Logger, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('UsersService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.user.create({
        data: createUserDto,
      });

      return createdUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new RpcException({
          message: 'This email is already in use',
          status: HttpStatus.CONFLICT,
        });
      }

      throw error;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
