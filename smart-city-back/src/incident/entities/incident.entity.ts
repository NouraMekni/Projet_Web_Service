import {
  ObjectType,
  Field,
  Int,
  Float,
  registerEnumType,
} from '@nestjs/graphql';

export enum IncidentType {
  ACCIDENT = 'ACCIDENT',
  ROADWORK = 'ROADWORK',
  ROAD_CLOSED = 'ROAD_CLOSED',
  TRAFFIC_JAM = 'TRAFFIC_JAM',
}

export enum IncidentStatus {
  REPORTED = 'REPORTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

registerEnumType(IncidentType, { name: 'IncidentType' });
registerEnumType(IncidentStatus, { name: 'IncidentStatus' });

@ObjectType()
export class Incident {
  @Field(() => Int)
  id!: number;

  @Field()
  title!: string;

  @Field(() => IncidentType)
  type!: IncidentType;

  @Field(() => IncidentStatus)
  status!: IncidentStatus;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  reportedById!: number;

  @Field(() => Int, { nullable: true })
  vehicleId?: number;
}
