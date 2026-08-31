import { defineStore } from 'pinia';
import connectionsService, { ConnectionModel, ConnectionRequestModel } from '../services/connections.service';
import { useAuthStore } from './auth';

export const useConnectionsStore = defineStore('connections', {
  state: () => ({
    connections: [] as ConnectionModel[],
    pendingRequests: [] as ConnectionRequestModel[],
    sentRequestUserIds: [] as (string | number)[],
    followingUserIds: [] as (string | number)[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    connectionsCount: (state) => state.connections.length,
    pendingRequestsCount: (state) => state.pendingRequests.length,
    isConnection: (state) => (userId: string | number) => {
      return state.connections.some(
        c => String(c.userId1) === String(userId) || String(c.userId2) === String(userId)
      );
    },
    isRequestSent: (state) => (userId: string | number) => {
      return state.sentRequestUserIds.some(id => String(id) === String(userId));
    },
    isFollowing: (state) => (userId: string | number) => {
      return state.followingUserIds.some(id => String(id) === String(userId));
    }
  },

  actions: {
    async fetchNetworkData() {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      this.isLoading = true;
      this.error = null;

      try {
        const [connList, reqList] = await Promise.all([
          connectionsService.getMyConnections(currentUserId),
          connectionsService.getPendingRequests(currentUserId)
        ]);

        this.connections = connList;
        this.pendingRequests = reqList;
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar dados da rede de contatos.';
      } finally {
        this.isLoading = false;
      }
    },

    async sendRequest(recipientId: string | number) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      try {
        const request = await connectionsService.sendConnectionRequest(currentUserId, recipientId);
        if (request) {
          this.sentRequestUserIds.push(recipientId);
        }
        return request;
      } catch (err: any) {
        this.error = err.message || 'Erro ao enviar convite de conexão.';
        return null;
      }
    },

    async acceptRequest(requestId: string | number) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      try {
        const newConn = await connectionsService.acceptConnectionRequest(requestId, currentUserId);
        if (newConn) {
          // Remove da lista de pendentes
          this.pendingRequests = this.pendingRequests.filter(r => String(r.id) !== String(requestId));
          // Adiciona à lista de conexões
          this.connections.unshift(newConn);
        }
        return newConn;
      } catch (err: any) {
        this.error = err.message || 'Erro ao aceitar solicitação.';
        return null;
      }
    },

    async rejectRequest(requestId: string | number) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      try {
        await connectionsService.rejectConnectionRequest(requestId, currentUserId);
        this.pendingRequests = this.pendingRequests.filter(r => String(r.id) !== String(requestId));
      } catch (err: any) {
        this.error = err.message || 'Erro ao recusar solicitação.';
      }
    },

    async toggleFollow(targetUserId: string | number) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      const currentlyFollowing = this.isFollowing(targetUserId);

      if (currentlyFollowing) {
        const ok = await connectionsService.unfollowUser(currentUserId, targetUserId);
        if (ok) {
          this.followingUserIds = this.followingUserIds.filter(id => String(id) !== String(targetUserId));
        }
      } else {
        const ok = await connectionsService.followUser(currentUserId, targetUserId);
        if (ok) {
          this.followingUserIds.push(targetUserId);
        }
      }
    }
  }
});

export default useConnectionsStore;
