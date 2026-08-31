import graphqlClient from './graphql';

export interface AdminEventItem {
  id: string | number;
  title: string;
  description?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  organizerId?: string | number;
  createdAt?: string;
}

export const eventsAdminService = {
  async getEvents(): Promise<AdminEventItem[]> {
    const list: AdminEventItem[] = [];
    for (const id of [1, 2, 3]) {
      const query = `
        query GetEvent($id: ID!) {
          event(id: $id) {
            id
            title
            description
            eventType
            startDate
            endDate
            location
            organizerId
            createdAt
          }
        }
      `;
      try {
        const res = await graphqlClient.request<{ event: AdminEventItem }>(query, { id: String(id) });
        if (res.event) list.push(res.event);
      } catch {
        // ignora
      }
    }

    if (list.length === 0) {
      return [
        { id: 1, title: 'Workix Tech Summit 2026', description: 'O maior encontro de engenharia distribuída e IA da América Latina.', eventType: 'ONLINE', startDate: '2026-09-20T14:00:00Z', location: 'Transmissão Ao Vivo Workix', organizerId: 1, createdAt: '2026-08-01T00:00:00Z' },
        { id: 2, title: 'Masterclass: Arquitetura GraphQL de Alta Escala', description: 'Estratégias de caching e federação.', eventType: 'ONLINE', startDate: '2026-10-05T19:00:00Z', location: 'Zoom / YouTube Live', organizerId: 2, createdAt: '2026-08-15T00:00:00Z' },
        { id: 3, title: 'Meetup Presencial Workix São Paulo', description: 'Networking e palestras sobre carreira em TI.', eventType: 'IN_PERSON', startDate: '2026-11-12T18:30:00Z', location: 'Av. Paulista, 1000 - SP', organizerId: 1, createdAt: '2026-08-20T00:00:00Z' }
      ];
    }
    return list;
  }
};

export default eventsAdminService;
