import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentResolver } from './incident.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [IncidentService, IncidentResolver, PrismaService],
})
export class IncidentModule {}
