import { Module } from '@nestjs/common';
import { NotifService } from './notif.service';
import { NotifResolver } from './notif.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { NotifGateway } from './notif.gateway';

@Module({
  providers: [NotifService, NotifResolver, PrismaService, NotifGateway],
})
export class NotifModule {}
