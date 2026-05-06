import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from '../user/user.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token!: string;

  @Field()
  email!: string;

  @Field(() => Role)
  role!: Role;
}
