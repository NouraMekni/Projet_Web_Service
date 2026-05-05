import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { TraficService } from './trafic.service';
import { Trafic } from './entities/trafic.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Resolver(() => Trafic)
export class TraficResolver {
  constructor(private traficService: TraficService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trafic)
  async createZone(
    @Args('name') name: string,
    @Args('lat', { type: () => Float, nullable: true }) lat?: number,
    @Args('lng', { type: () => Float, nullable: true }) lng?: number,
  ) {
    return this.traficService.create(name, lat, lng);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Trafic], { name: 'trafficZones' })
  async zones() {
    return this.traficService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trafic)
  async updateDensity(
    @Args('id', { type: () => Int }) id: number,
    @Args('density', { type: () => Int }) density: number,
  ) {
    return this.traficService.updateDensity(id, density);
  }
}
