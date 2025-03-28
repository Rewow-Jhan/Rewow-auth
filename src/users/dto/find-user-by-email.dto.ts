import { IsString } from "class-validator";

export class FindUserByEmailDto {
  @IsString()
  email: string;
}