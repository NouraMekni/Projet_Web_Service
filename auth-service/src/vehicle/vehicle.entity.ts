import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';

export enum VehicleStatus {
  IN_TRAFFIC = 'IN_TRAFFIC',
  PARKED = 'PARKED',
  MAINTENANCE = 'MAINTENANCE',
}

registerEnumType(VehicleStatus, { name: 'VehicleStatus' });

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
}
