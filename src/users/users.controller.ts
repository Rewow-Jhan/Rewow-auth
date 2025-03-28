import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('create_user')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('find_user_by_email')
  findByEmail(@Payload() findUserByEmailDto: FindUserByEmailDto) {
    return this.usersService.findByEmail(findUserByEmailDto);
  }

  @MessagePattern('login_with_google')
  loginWithGoogle(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.loginWithGoogle(createUserDto);
  }
}
