import {
  Field,
  ObjectType,
  ID,
  Float,
  registerEnumType,
} from '@nestjs/graphql';

export enum VehicleStatus {
  IN_TRAFFIC = 'IN_TRAFFIC',
  PARKED = 'PARKED',
  MAINTENANCE = 'MAINTENANCE',
}

registerEnumType(VehicleStatus, { name: 'VehicleStatus' });

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

  @Field(() => VehicleStatus)
  status!: VehicleStatus;

  @Field()
  ownerId!: number;

  // IMPORTANT: GraphQL only declares field
  @Field(() => [Position], { nullable: true })
  positions?: Position[];
}
