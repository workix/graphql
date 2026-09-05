import { describe, it, expect, beforeEach, vi } from 'vitest';
import messagingService from '../messaging.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('messagingService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getDirectMessages retorna lista de mensagens entre dois usuarios', async () => {
    const mockMessages = [
      { id: '1', senderId: '10', recipientId: '20', content: 'Olá, tudo bem?', read: false }
    ];
    (graphqlClient.request as any).mockResolvedValueOnce({ directMessages: mockMessages });

    const messages = await messagingService.getDirectMessages('10', '20');
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe('Olá, tudo bem?');
  });

  it('sendDirectMessage envia mensagem via mutation GraphQL', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      sendDirectMessage: { id: '2', senderId: '10', recipientId: '20', content: 'Gostaria de agendar uma entrevista', read: false }
    });

    const sent = await messagingService.sendDirectMessage('10', '20', 'Gostaria de agendar uma entrevista');
    expect(sent?.id).toBe('2');
    expect(sent?.content).toBe('Gostaria de agendar uma entrevista');
  });

  it('markAsRead marca mensagem como lida', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      markDirectMessageAsRead: { id: '2', read: true }
    });

    const result = await messagingService.markAsRead('2', '20');
    expect(result?.read).toBe(true);
  });
});
