import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { Vehicle } from './vehicle.entity';
import { VehicleService } from './vehicle.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private vehicleService: VehicleService) {}

  @Query(() => [Vehicle])
  async vehicles() {
    return this.vehicleService.findAll();
  }

  @Query(() => Vehicle, { nullable: true })
  async vehicle(@Args('id', { type: () => Int }) id: number) {
    return this.vehicleService.getVehicleById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Vehicle)
  async createVehicle(
    @Args('brand') brand: string,
    @Args('model') model: string,
    @Args('licensePlate') licensePlate: string,
    @Context() context: any,
  ) {
    const user = context.req.user;

    return this.vehicleService.create({
      brand,
      model,
      licensePlate,
      ownerId: user.sub,
    });
  }

  @Mutation(() => Boolean)
  async addPosition(
    @Args('vehicleId', { type: () => Int }) vehicleId: number,
    @Args('lat') lat: number,
    @Args('lng') lng: number,
  ) {
    await this.vehicleService.recordPosition(vehicleId, lat, lng);
    return true;
  }

  // Add these to your VehicleResolver class

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Vehicle)
  async updateVehicle(
    @Args('id', { type: () => Int }) id: number,
    @Args('brand') brand: string,
    @Args('model') model: string,
    @Args('licensePlate') licensePlate: string,
    @Context() context: any,
  ) {
    const user = context.req.user;

    // Check if vehicle belongs to user
    const vehicle = await this.vehicleService.getVehicleById(id);
    if (!vehicle || vehicle.ownerId !== user.sub) {
      throw new ForbiddenException("You don't own this vehicle");
    }

    return this.vehicleService.update(id, { brand, model, licensePlate });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteVehicle(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: any,
  ) {
    const user = context.req.user;

    // Check if vehicle belongs to user
    const vehicle = await this.vehicleService.getVehicleById(id);
    if (!vehicle || vehicle.ownerId !== user.sub) {
      throw new ForbiddenException("You don't own this vehicle");
    }

    await this.vehicleService.delete(id);
    return true;
  }
}
