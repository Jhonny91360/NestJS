import { Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(signUpInput: SignUpInput): Promise<AuthResponse> {
    console.log({ signUpInput });

    const user = await this.usersService.create(signUpInput);

    const token = 'abc123';

    return { token, user };
  }
}
