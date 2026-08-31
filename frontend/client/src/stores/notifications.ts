import { defineStore } from 'pinia';
import notificationsService, { NotificationModel } from '../services/notifications.service';
import { useAuthStore } from './auth';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as NotificationModel[],
    unreadCount: 0,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    unreadNotifications: (state) => state.notifications.filter(n => !n.read),
    hasUnread: (state) => state.unreadCount > 0
  },

  actions: {
    async fetchNotifications() {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      this.isLoading = true;
      this.error = null;

      try {
        const [list, count] = await Promise.all([
          notificationsService.getMyNotifications(currentUserId),
          notificationsService.getUnreadCount(currentUserId)
        ]);

        this.notifications = list;
        this.unreadCount = count;
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar notificações.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUnreadCount() {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      try {
        this.unreadCount = await notificationsService.getUnreadCount(currentUserId);
      } catch (err) {
        console.warn('Erro ao atualizar contagem de notificações:', err);
      }
    },

    async markRead(id: string | number) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      const notif = this.notifications.find(n => String(n.id) === String(id));
      if (notif && !notif.read) {
        notif.read = true;
        if (this.unreadCount > 0) this.unreadCount--;
      }

      await notificationsService.markAsRead(id, currentUserId);
    },

    async markAllRead() {
      const unreadList = this.notifications.filter(n => !n.read);
      for (const n of unreadList) {
        await this.markRead(n.id);
      }
    },

    receiveNotification(notif: NotificationModel) {
      this.notifications.unshift(notif);
      this.unreadCount++;
    }
  }
});

export default useNotificationsStore;
