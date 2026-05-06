import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IncidentStatus } from '@prisma/client';

@Injectable()
export class IncidentService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    type: any;
    latitude?: number;
    longitude?: number;
    description?: string;
    reportedById: number;
    vehicleId?: number;
  }) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: data.reportedById },
    });

    if (!userExists) {
      throw new Error(`User with ID ${data.reportedById} does not exist`);
    }

    if (data.vehicleId) {
      const vehicleExists = await this.prisma.vehicle.findUnique({
        where: { id: data.vehicleId },
      });

      if (!vehicleExists) {
        throw new Error(`Vehicle with ID ${data.vehicleId} does not exist`);
      }
    }

    return this.prisma.incident.create({
      data: {
        title: data.title,
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        status: 'REPORTED',
        reportedBy: {
          connect: { id: data.reportedById },
        },
        vehicle: data.vehicleId
          ? { connect: { id: data.vehicleId } }
          : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.incident.findMany({
      include: {
        reportedBy: true,
        vehicle: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: number, status: IncidentStatus) {
    return this.prisma.incident.update({
      where: { id: Number(id) },
      data: { status },
    });
  }
}
