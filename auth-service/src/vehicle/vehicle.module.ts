import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleResolver } from './vehicle.resolver';
import { VehicleRelationResolver } from './VehicleRelationResolver ';

@Module({
  providers: [VehicleService, VehicleResolver, VehicleRelationResolver],
})
export class VehicleModule {}
