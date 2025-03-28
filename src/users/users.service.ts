import { Injectable, OnModuleInit, Logger, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';

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

  async findByEmail (FindUserByEmailDto: FindUserByEmailDto) {
    const user = await this.user.findUnique({
      where: {
        email: FindUserByEmailDto.email,
      },
    });

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return user;
  }

  async loginWithGoogle(createUserDto: CreateUserDto) {
    try {
      const user = await this.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (user) {
        return user;
      }

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
}
