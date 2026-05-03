import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/user.entity'; // Import UserRole

@Resolver()
export class AuthResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Auth Service is running!';
  }

  @Mutation(() => User)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    // Use the enum type here instead of string
    @Args('role', { type: () => UserRole, defaultValue: UserRole.OPERATOR })
    role: UserRole,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role,
      },
    });
  }
}
