import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { Vehicle } from './vehicle.entity';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GraphQLContext } from '../auth/GraphQLContext';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private vehicleService: VehicleService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Vehicle)
  async createVehicle(
    @Args('brand') brand: string,
    @Args('model') model: string,
    @Args('licensePlate') licensePlate: string,
    @Context() context: GraphQLContext,
  ) {
    const user = context.req.user;

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Seul un ADMIN peut ajouter des véhicules');
    }

    return this.vehicleService.create({
      brand,
      model,
      licensePlate,
      ownerId: user.sub,
    });
  }
}
