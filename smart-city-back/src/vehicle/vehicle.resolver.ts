import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { Vehicle } from './vehicle.entity';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private vehicleService: VehicleService) {}

  // 📌 Get all vehicles
  @Query(() => [Vehicle])
  async vehicles() {
    return this.vehicleService.findAll();
  }

  // 📌 Get one vehicle (IMPORTANT)
  @Query(() => Vehicle, { nullable: true })
  async vehicle(@Args('id', { type: () => Int }) id: number) {
    return this.vehicleService.getVehicleById(id);
  }

  // 📌 Create vehicle
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Vehicle)
  async createVehicle(
    @Args('brand') brand: string,
    @Args('model') model: string,
    @Args('licensePlate') licensePlate: string,
    @Context() context: any,
  ) {
    const user = context.req.user;

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only ADMIN can create vehicles');
    }

    return this.vehicleService.create({
      brand,
      model,
      licensePlate,
      ownerId: user.sub,
    });
  }

  // 📌 Add position
  @Mutation(() => Boolean)
  async addPosition(
    @Args('vehicleId', { type: () => Int }) vehicleId: number,
    @Args('lat') lat: number,
    @Args('lng') lng: number,
  ) {
    await this.vehicleService.recordPosition(vehicleId, lat, lng);
    return true;
  }
}
