import {
  Field,
  ObjectType,
  ID,
  Float,
  registerEnumType,
} from '@nestjs/graphql';

import { VehicleStatus } from '@prisma/client';

registerEnumType(VehicleStatus, {
  name: 'VehicleStatus',
});

@ObjectType()
export class Position {
  @Field(() => ID)
  id!: number;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;

  @Field()
  timestamp!: Date;
}

@ObjectType()
export class Vehicle {
  @Field(() => ID)
  id!: number;

  @Field()
  brand!: string;

  @Field()
  model!: string;

  @Field()
  licensePlate!: string;

  @Field(() => VehicleStatus, { nullable: true })
  status?: VehicleStatus;

  @Field()
  ownerId!: number;

  @Field(() => [Position], { nullable: true })
  positions?: Position[];
}
