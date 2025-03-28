import { Injectable, OnModuleInit, Logger, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException, Payload } from '@nestjs/microservices';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from 'src/types/jwtPayload';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

  constructor(private jwtService: JwtService) {
    super();
  }

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

  async findByEmail(FindUserByEmailDto: FindUserByEmailDto) {
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

  async googleLogin(createUserDto: CreateUserDto) {
    try {
      const user = await this.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (user) {
        const payload: AuthJwtPayload = {
          sub: user.id,
        }

        const token = await this.jwtService.signAsync(payload);

        return { user, token };
      } else {
        const createdUser = await this.user.create({
          data: createUserDto,
        });

        const payload: AuthJwtPayload = {
          sub: createdUser.id,
        }

        return { user: createdUser, token: this.jwtService.sign(payload) };
      }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}
