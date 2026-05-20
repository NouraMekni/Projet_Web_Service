import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifService } from '../../services/notif.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./admin-notifications.component.css'],
  templateUrl: './admin-notifications.component.html',
})
export class AdminNotificationsComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  private userId!: number;

  constructor(private notifService: NotifService) {}

  ngOnInit(): void {
    this.userId = this.resolveUserId();

    if (!this.userId) {
      console.error('Could not resolve userId. User may not be logged in.');
      return;
    }

    this.notifService.joinRoom(this.userId);

    this.loadNotifications(this.userId);

    const socket = this.notifService.listenNotifications();

    socket.on('notification', (notif: any) => {
      console.log('📬 New notification received:', notif);
      this.notifications.unshift(notif);
    });

    socket.on('connect', () => {
      this.notifService.joinRoom(this.userId);
      this.loadNotifications(this.userId);
    });
  }

  loadNotifications(userId: number) {
    this.notifService.getNotifications(userId).subscribe({
      next: (res: any) => {
        this.notifications = res.data.notifs;
      },
      error: (err: any) => {
        console.error('Failed to load notifications:', err);
      },
    });
  }

  markAsRead(id: number) {
    this.notifService.markAsRead(id).subscribe({
      next: () => {
        const notif = this.notifications.find((n) => n.id === id);
        if (notif) notif.isRead = true;
      },
      error: (err: any) => {
        console.error('Failed to mark as read:', err);
      },
    });
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  ngOnDestroy(): void {
    const socket = this.notifService.listenNotifications();
    socket.off('notification');
    socket.off('connect');
  }

  private resolveUserId(): number {
    const stored = localStorage.getItem('userId');
    if (stored) {
      return Number(stored);
    }

    const token = localStorage.getItem('token');
    if (!token) return 0;

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
      );
      const id = payload.sub;
      if (id) {
        localStorage.setItem('userId', String(id));
        console.log('userId recovered from token and saved:', id);
      }
      return Number(id) || 0;
    } catch {
      console.error('Failed to decode token');
      return 0;
    }
  }
}
