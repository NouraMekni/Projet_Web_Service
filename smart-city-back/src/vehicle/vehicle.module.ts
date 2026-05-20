import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleResolver } from './vehicle.resolver';
import { VehicleRelationResolver } from './VehicleRelationResolver ';
import { NotifGateway } from '../notif_Socket/notif.gateway';
import { NotifService } from '../notif_Socket/notif.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [
    VehicleResolver,
    VehicleService,
    PrismaService,
    NotifService,
    NotifGateway,
    VehicleRelationResolver,
  ],
})
export class VehicleModule {}
