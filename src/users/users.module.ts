import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { envs } from 'src/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService], 
})
export class UsersModule {}
