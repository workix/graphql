import { describe, it, expect, beforeEach, vi } from 'vitest';
import eventsService from '../events.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('eventsService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getEvent retorna informacoes do evento', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      event: { id: '1', title: 'Workshop de Carreira Tech', eventType: 'ONLINE' }
    });

    const event = await eventsService.getEvent('1');
    expect(event?.title).toBe('Workshop de Carreira Tech');
  });

  it('getEventAttendees retorna lista de participantes', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      eventAttendees: [{ id: '1', eventId: '1', userId: '5', status: 'ATTENDING' }]
    });

    const attendees = await eventsService.getEventAttendees('1');
    expect(attendees).toHaveLength(1);
    expect(attendees[0].status).toBe('ATTENDING');
  });

  it('createEvent cria evento online com datas formatadas', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createEvent: { id: '10', title: 'Tech Meetup 2026', eventType: 'ONLINE', organizerId: '2' }
    });

    const event = await eventsService.createEvent('2', 'Tech Meetup 2026', 'Descrição', 'ONLINE', '2026-10-01T10:00:00Z');
    expect(event?.id).toBe('10');
    expect(graphqlClient.request).toHaveBeenCalledTimes(1);
  });

  it('attendEvent confirma presenca do usuario', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      attendEvent: { id: 'att-1', eventId: '10', userId: '33', status: 'ATTENDING' }
    });

    const att = await eventsService.attendEvent('10', '33', 'ATTENDING');
    expect(att?.status).toBe('ATTENDING');
  });
});
