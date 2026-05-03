import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: number;

  @Field()
  email!: string;

  @Field()
  role!: string;

  password!: string;
}
