import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // 📌 Send notification
  async create(message: string, userId: number) {
    return this.prisma.notification.create({
      data: {
        message,
        userId,
      },
    });
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
