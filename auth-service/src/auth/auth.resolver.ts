import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  health() {
    return 'GraphQL is working 🚀';
  }

  @Mutation(() => User)
  register(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.register(email, password);
  }

  @Mutation(() => String)
  login(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.login(email, password);
  }
}
