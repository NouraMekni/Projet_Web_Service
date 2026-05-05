import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { Vehicle } from './vehicle.entity';
import { Position } from './vehicle.entity';

@Resolver(() => Vehicle)
export class VehicleRelationResolver {
  constructor(private prisma: PrismaService) {}

  @ResolveField(() => [Position])
  async positions(@Parent() vehicle: Vehicle) {
    return this.prisma.position.findMany({
      where: {
        vehicleId: Number(vehicle.id),
      },
    });
  }
}
