import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignUpInput,
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  // @Mutation(  ,{name: 'login'} )
  // async login(   ):Promise<any> {
  //   return this.authService.login()
  // }

  // @Query  ,{name: 'revalidate'} )
  // async revalidateToken(   ):Promise<any> {
  //   return this.authService.revalidateToken()
  // }
}
