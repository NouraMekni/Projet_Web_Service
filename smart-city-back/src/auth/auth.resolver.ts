import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User, Role } from '../user/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { AuthResponse } from './AuthResponse';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Auth Service is running!';
  }

  @Mutation(() => User)
  register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('role', { type: () => Role, defaultValue: Role.OPERATOR })
    role: Role,
  ) {
    return this.authService.register(email, password, role);
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const result = await this.authService.login(email, password);

    return {
      access_token: result.access_token,
      role: result.role,
      email: result.email,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => String)
  protectedData() {
    return 'You are authenticated!';
  }
}
