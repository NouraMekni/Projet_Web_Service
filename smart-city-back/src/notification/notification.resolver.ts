import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from '../notification/entities/notification.entity';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @Mutation(() => Notification)
  async sendNotification(
    @Args('message') message: string,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.notificationService.create(message, userId);
  }

  @Query(() => [Notification])
  async notifications(
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
  ) {
    return this.notificationService.findAll(userId);
  }

  // 📌 Mark as read
  @Mutation(() => Notification)
  async markNotificationAsRead(@Args('id', { type: () => Int }) id: number) {
    return this.notificationService.markAsRead(id);
  }
}
