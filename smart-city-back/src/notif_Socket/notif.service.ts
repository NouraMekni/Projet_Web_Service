import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotifGateway } from './notif.gateway';

@Injectable()
export class NotifService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotifGateway,
  ) {}

  async create(message: string, userId: number) {
    const notif = await this.prisma.notification.create({
      data: {
        message,
        userId,
      },
    });

    this.gateway.sendToUser(userId, notif);

    return notif;
  }

  async findAll(userId?: number) {
    return this.prisma.notification.findMany({
      where: userId ? { userId } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
    });
  }

  async notifyAdmins(message: string) {
    const admins = await this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
    });

    await Promise.all(admins.map((admin) => this.create(message, admin.id)));
  }
}
