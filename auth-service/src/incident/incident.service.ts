import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IncidentStatus } from '@prisma/client';

@Injectable()
export class IncidentService {
  constructor(private prisma: PrismaService) {}

  // 📌 Declare incident
  async create(data: Prisma.IncidentCreateInput) {
    return this.prisma.incident.create({ data });
  }

  // 📌 Get all incidents
  async findAll() {
    return this.prisma.incident.findMany();
  }

  // 📌 Update status
  async updateStatus(id: number, status: IncidentStatus) {
    return this.prisma.incident.update({
      where: { id: Number(id) },
      data: { status },
    });
  }
}
