import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleStatus, Prisma } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.VehicleCreateInput) {
    return this.prisma.vehicle.create({ data });
  }

  findAll() {
    return this.prisma.vehicle.findMany();
  }

  async updateStatus(id: number, status: VehicleStatus) {
    return this.prisma.vehicle.update({
      where: { id },
      data: { status },
    });
  }
}
