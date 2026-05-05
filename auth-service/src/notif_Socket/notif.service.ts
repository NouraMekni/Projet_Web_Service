import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotifGateway } from './notif.gateway';

@Injectable()
export class NotifService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotifGateway,
  ) {}

  // 📌 Create + send real-time notification
  async create(message: string, userId: number) {
    const notif = await this.prisma.notification.create({
      data: {
        message,
        userId,
      },
    });

    // 🚀 REAL-TIME PUSH
    this.gateway.sendNotification(notif);

    return notif;
  }

  // 📌 Get all notifications
  async findAll(userId?: number) {
    return this.prisma.notification.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  // 📌 Mark as read
  async markAsRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
