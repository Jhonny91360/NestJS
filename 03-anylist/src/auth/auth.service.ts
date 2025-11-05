import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(signUpInput: SignUpInput): Promise<AuthResponse> {
    console.log({ signUpInput });

    const user = await this.usersService.create(signUpInput);

    const token = 'abc123';

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(loginInput.email);

    if (!bcrypt.compareSync(loginInput.password, user.password)) {
      throw new BadRequestException('Email/Password is incorrect');
    }
    // todo: token
    const token = 'abc123';
    return { token, user };
  }
}
