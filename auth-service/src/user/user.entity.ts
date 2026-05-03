import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';

// This tells GraphQL about your Roles
export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

// Register the enum so GraphQL recognizes it
registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id!: number;

  @Field()
  email!: string;

  @Field(() => UserRole) // Use the Enum here for better validation
  role!: UserRole;

  // No @Field() here because we never want to expose passwords in GraphQL
  password!: string;
}
