import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signUpInput: SignUpInput): Promise<AuthResponse> {
    console.log({ signUpInput });

    const user = await this.usersService.create(signUpInput);

    const token = this.getJwtToken(user.id);

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(loginInput.email);

    if (!bcrypt.compareSync(loginInput.password, user.password!)) {
      throw new BadRequestException('Email/Password is incorrect');
    }

    const token = this.getJwtToken(user.id);

    return { token, user };
  }

  async validateUser(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOneById(id);

    if (!user.isActive) {
      throw new UnauthorizedException('User not active, talk with an admin');
    }

    const { password, ...rest } = user;

    return rest;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return { token, user };
  }
}
