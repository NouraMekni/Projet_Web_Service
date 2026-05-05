import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotifGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Disconnected: ${client.id}`);
  }

  // 📌 Broadcast notification to ALL users
  sendNotification(notification: any) {
    this.server.emit('notification', notification);
  }

  // 📌 Future: per-user notifications
  sendToUser(userId: number, notification: any) {
    this.server.to(`user_${userId}`).emit('notification', notification);
  }
}
