import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Notif {
  @Field(() => Int)
  id!: number;

  @Field()
  message!: string;

  @Field(() => Int)
  userId!: number;

  @Field()
  isRead!: boolean;

  @Field()
  createdAt!: Date;
}
