import { Injectable, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class NotifService implements OnDestroy {
  private socket: Socket;

  constructor(private apollo: Apollo) {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    // On reconnect (e.g. page refresh after login), re-join if userId already stored
    this.socket.on('connect', () => {
      console.log('🔌 Socket connected:', this.socket.id);
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.joinRoom(Number(userId));
      }
      // If no userId yet, login component will call joinRoom() explicitly after login
    });
  }

  /**
   * Call this AFTER storing userId in localStorage (right after login).
   * Also called automatically on reconnect if userId already exists.
   */
  joinRoom(userId: number) {
    console.log(`🚪 Joining room for user ${userId}`);
    this.socket.emit('join', { userId });
  }

  listenNotifications(): Socket {
    return this.socket;
  }

  getNotifications(userId: number) {
    return this.apollo.query({
      query: gql`
        query GetNotifs($userId: Int) {
          notifs(userId: $userId) {
            id
            message
            isRead
            createdAt
          }
        }
      `,
      variables: { userId },
      fetchPolicy: 'network-only',
    });
  }

  markAsRead(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ReadNotif($id: Int!) {
          readNotif(id: $id) {
            id
            isRead
          }
        }
      `,
      variables: { id },
    });
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
