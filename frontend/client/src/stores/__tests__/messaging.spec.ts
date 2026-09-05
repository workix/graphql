import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMessagingStore } from '../messaging';
import messagingService from '../../services/messaging.service';
import connectionsService from '../../services/connections.service';

vi.mock('../../services/messaging.service', () => ({
  default: {
    getDirectMessages: vi.fn(),
    sendDirectMessage: vi.fn(),
    markAsRead: vi.fn()
  }
}));

vi.mock('../../services/connections.service', () => ({
  default: {
    getMyConnections: vi.fn()
  }
}));

describe('useMessagingStore (Client)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('inicializa com lista de conversas e mensagens vazias', () => {
    const store = useMessagingStore();
    expect(store.recentConversations).toEqual([]);
    expect(store.messages).toEqual([]);
    expect(store.activeContactId).toBeNull();
    expect(store.totalUnreadMessages).toBe(0);
  });

  it('fetchConversations busca conexoes e mensagens recentes dinamicamente', async () => {
    const store = useMessagingStore();
    (connectionsService.getMyConnections as any).mockResolvedValueOnce([
      {
        id: 'conn-1',
        userId1: '1',
        userId2: '2',
        connectedUser: { id: '2', name: 'Ana Dev' }
      }
    ]);

    (messagingService.getDirectMessages as any).mockResolvedValueOnce([
      { id: 'msg-1', senderId: '2', recipientId: '1', content: 'Olá!', read: false, createdAt: '2026-09-05T12:00:00Z' }
    ]);

    await store.fetchConversations();

    expect(store.recentConversations).toHaveLength(1);
    expect(store.recentConversations[0].contactName).toBe('Ana Dev');
    expect(store.recentConversations[0].lastMessage).toBe('Olá!');
    expect(store.recentConversations[0].unreadCount).toBe(1);
    expect(store.totalUnreadMessages).toBe(1);
  });

  it('selectContact define contato ativo e busca historico de mensagens', async () => {
    const store = useMessagingStore();
    const mockMessages = [
      { id: 'msg-1', senderId: '1', recipientId: '2', content: 'Olá', read: true }
    ];
    (messagingService.getDirectMessages as any).mockResolvedValueOnce(mockMessages);

    await store.selectContact('2');

    expect(store.activeContactId).toBe('2');
    expect(store.messages).toEqual(mockMessages);
  });

  it('sendMessage envia mensagem e atualiza historico local', async () => {
    const store = useMessagingStore();
    store.activeContactId = '2';
    store.recentConversations = [
      { contactId: '2', contactName: 'Ana Dev', lastMessage: 'Olá', unreadCount: 0 }
    ];

    const sentMessage = { id: 'msg-2', senderId: '1', recipientId: '2', content: 'Tudo bem?', read: false };
    (messagingService.sendDirectMessage as any).mockResolvedValueOnce(sentMessage);

    const result = await store.sendMessage('Tudo bem?');

    expect(result).toEqual(sentMessage);
    expect(store.messages).toContainEqual(sentMessage);
    expect(store.recentConversations[0].lastMessage).toBe('Tudo bem?');
  });
});
