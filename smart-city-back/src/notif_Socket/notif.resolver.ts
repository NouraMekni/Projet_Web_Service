import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotifService } from './notif.service';
import { Notif } from './entities/notif.entity';

@Resolver(() => Notif)
export class NotifResolver {
  constructor(private notifService: NotifService) {}

  @Mutation(() => Notif)
  async sendNotif(
    @Args('message') message: string,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    return this.notifService.create(message, userId);
  }

  @Query(() => [Notif])
  async notifs(
    @Args('userId', { type: () => Int, nullable: true })
    userId?: number,
  ) {
    return this.notifService.findAll(userId);
  }

  @Mutation(() => Notif)
  async readNotif(@Args('id', { type: () => Int }) id: number) {
    return this.notifService.markAsRead(id);
  }
}
