import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { Prisma, Vehicle, VehicleStatus } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return this.prisma.vehicle.create({
      data: {
        ...data,
        status: VehicleStatus.PARKED,
      },
    });
  }

  async findAll(): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      include: {
        positions: true,
      },
    });
  }

  async getVehicleById(id: number): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        positions: true,
      },
    });
  }

  async recordPosition(vehicleId: number, lat: number, lng: number) {
    return this.prisma.position.create({
      data: {
        latitude: lat,
        longitude: lng,
        vehicleId,
      },
    });
  }

  async update(
    id: number,
    data: Partial<Prisma.VehicleUpdateInput>,
  ): Promise<Vehicle> {
    return this.prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Vehicle> {
    await this.prisma.position.deleteMany({
      where: {
        vehicleId: id,
      },
    });

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }

  async getVehiclesByOwner(ownerId: number): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: {
        ownerId,
      },
      include: {
        positions: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 10,
        },
      },
    });
  }
}
