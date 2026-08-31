import { defineStore } from 'pinia';
import messagingService, { DirectMessageModel, ConversationSummary } from '../services/messaging.service';
import { useAuthStore } from './auth';

export const useMessagingStore = defineStore('messaging', {
  state: () => ({
    activeContactId: null as string | number | null,
    messages: [] as DirectMessageModel[],
    recentConversations: [
      { contactId: 2, contactName: 'Lucas Andrade (Engenheiro Sênior)', lastMessage: 'Olá! Vi seu perfil no Workix...', lastMessageDate: '10:45', unreadCount: 1 },
      { contactId: 3, contactName: 'Juliana Costa (Tech Recruiter)', lastMessage: 'Temos uma vaga que combina com você.', lastMessageDate: 'Ontem', unreadCount: 0 },
      { contactId: 4, contactName: 'Mariana Lima (Product Manager)', lastMessage: 'Obrigado por conectar!', lastMessageDate: '28/08', unreadCount: 0 }
    ] as ConversationSummary[],
    isLoading: false,
    isSending: false,
    error: null as string | null
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
