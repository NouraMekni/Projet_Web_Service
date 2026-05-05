import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrafficLevel } from '@prisma/client';

@Injectable()
export class TraficService {
  constructor(private prisma: PrismaService) {}

  // Task: Créer des zones de circulation
  async create(name: string, lat?: number, lng?: number) {
    return this.prisma.trafficZone.create({
      data: {
        name,
        latitude: lat,
        longitude: lng,
      },
    });
  }

  // Task: Consulter les zones
  async findAll() {
    return this.prisma.trafficZone.findMany();
  }

  // Task: Mesurer la densité & Classer les zones
  async updateDensity(id: number, density: number) {
    let status: TrafficLevel = TrafficLevel.LOW;

    // Logic to detect congestion
    if (density >= 75) {
      status = TrafficLevel.HIGH;
    } else if (density >= 40) {
      status = TrafficLevel.MEDIUM;
    }

    return this.prisma.trafficZone.update({
      where: { id },
      data: { density, status },
    });
  }
}
