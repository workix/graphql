import { defineStore } from 'pinia';
import messagingService, { DirectMessageModel, ConversationSummary } from '../services/messaging.service';
import connectionsService from '../services/connections.service';
import { useAuthStore } from './auth';

export const useMessagingStore = defineStore('messaging', {
  state: () => ({
    activeContactId: null as string | number | null,
    messages: [] as DirectMessageModel[],
    recentConversations: [] as ConversationSummary[],
    isLoading: false,
    isSending: false,
    error: null as string | null,
    pollingIntervalId: null as any
  }),

  getters: {
    totalUnreadMessages: (state) => {
      return state.recentConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
    },
    activeContact: (state) => {
      return state.recentConversations.find(c => String(c.contactId) === String(state.activeContactId)) || null;
    }
  },

  actions: {
    startLivePolling(intervalMs = 4000) {
      if (this.pollingIntervalId) return;
      this.pollingIntervalId = setInterval(async () => {
        if (this.activeContactId) {
          const authStore = useAuthStore();
          const currentUserId = authStore.user?.id || 1;
          const freshMsgs = await messagingService.getDirectMessages(currentUserId, this.activeContactId);
          if (freshMsgs.length !== this.messages.length) {
            this.messages = freshMsgs;
          }
        }
      }, intervalMs);
    },

    stopLivePolling() {
      if (this.pollingIntervalId) {
        clearInterval(this.pollingIntervalId);
        this.pollingIntervalId = null;
      }
    },

    async fetchConversations() {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      this.isLoading = true;
      this.error = null;

      try {
        // Busca conexões ativas para listar conversas disponíveis
        const myConns = await connectionsService.getMyConnections(currentUserId);
        const summaries: ConversationSummary[] = [];

        for (const conn of myConns) {
          const otherUserId = String(conn.userId1) === String(currentUserId) ? conn.userId2 : conn.userId1;
          const directMsgs = await messagingService.getDirectMessages(currentUserId, otherUserId, 1, 0);
          const lastMsg = directMsgs.length > 0 ? directMsgs[directMsgs.length - 1] : null;

          summaries.push({
            contactId: otherUserId,
            contactName: conn.connectedUser?.name || `Profissional #${otherUserId}`,
            lastMessage: lastMsg?.content || 'Nenhuma mensagem recente',
            lastMessageDate: lastMsg?.createdAt ? new Date(lastMsg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Recente',
            unreadCount: lastMsg && !lastMsg.read && String(lastMsg.recipientId) === String(currentUserId) ? 1 : 0
          });
        }

        this.recentConversations = summaries;
      } catch (err: any) {
        console.warn('Falha ao sincronizar conversas:', err);
      } finally {
        this.isLoading = false;
      }
    },

    async selectContact(contactId: string | number) {
      this.activeContactId = contactId;
      await this.fetchMessages(contactId);

      // Marca mensagens da conversa como lidas localmente
      const conv = this.recentConversations.find(c => String(c.contactId) === String(contactId));
      if (conv) {
        conv.unreadCount = 0;
      }
    },

    async fetchMessages(contactId: string | number) {
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      this.isLoading = true;
      this.error = null;

      try {
        const msgs = await messagingService.getDirectMessages(currentUserId, contactId);
        this.messages = msgs;
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar mensagens.';
      } finally {
        this.isLoading = false;
      }
    },

    async sendMessage(content: string) {
      if (!this.activeContactId || !content.trim()) return null;

      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id || 1;

      this.isSending = true;
      this.error = null;

      try {
        const sent = await messagingService.sendDirectMessage(currentUserId, this.activeContactId, content.trim());
        if (sent) {
          this.messages.push(sent);

          // Atualiza resumo da conversa
          const conv = this.recentConversations.find(c => String(c.contactId) === String(this.activeContactId));
          if (conv) {
            conv.lastMessage = content.trim();
            conv.lastMessageDate = 'Agora';
          }
        }
        return sent;
      } catch (err: any) {
        this.error = err.message || 'Erro ao enviar mensagem.';
        return null;
      } finally {
        this.isSending = false;
      }
    },

    receiveIncomingMessage(msg: DirectMessageModel) {
      if (String(msg.senderId) === String(this.activeContactId)) {
        this.messages.push(msg);
      } else {
        const conv = this.recentConversations.find(c => String(c.contactId) === String(msg.senderId));
        if (conv) {
          conv.lastMessage = msg.content;
          conv.lastMessageDate = 'Agora';
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
      }
    }
  }
});

export default useMessagingStore;
