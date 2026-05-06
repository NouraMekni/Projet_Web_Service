import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, VehicleStatus, Vehicle } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return this.prisma.vehicle.create({ data });
  }

  async findAll(): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany();
  }

  async getVehicleById(id: number): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({
      where: { id },
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
    // First delete all positions
    await this.prisma.position.deleteMany({
      where: { vehicleId: id },
    });

    // Then delete the vehicle
    return this.prisma.vehicle.delete({
      where: { id },
    });
  }

  async getVehiclesByOwner(ownerId: number): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: { ownerId },
      include: {
        positions: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    });
  }
}
