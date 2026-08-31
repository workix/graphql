import graphqlClient from './graphql';

export interface EventModel {
  id: string | number;
  title: string;
  description?: string;
  eventType?: 'ONLINE' | 'IN_PERSON' | string;
  startTime: string;
  endTime?: string;
  locationOrUrl?: string;
  organizerId: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventAttendeeModel {
  id: string | number;
  eventId: string | number;
  userId: string | number;
  status?: string;
  createdAt?: string;
}

export const eventsService = {
  async getEvent(id: string | number): Promise<EventModel | null> {
    const query = `
      query GetEvent($id: ID!) {
        event(id: $id) {
          id
          title
          description
          eventType
          startTime
          endTime
          locationOrUrl
          organizerId
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ event: EventModel }>(query, {
        id: String(id)
      });
      return data.event || null;
    } catch (err) {
      console.warn('Erro ao carregar evento:', err);
      return null;
    }
  },

  async getEventAttendees(
    eventId: string | number,
    limit = 50,
    offset = 0
  ): Promise<EventAttendeeModel[]> {
    const query = `
      query GetEventAttendees($eventId: ID!, $limit: Int, $offset: Int) {
        eventAttendees(eventId: $eventId, limit: $limit, offset: $offset) {
          id
          eventId
          userId
          status
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ eventAttendees: EventAttendeeModel[] }>(query, {
        eventId: String(eventId),
        limit,
        offset
      });
      return data.eventAttendees || [];
    } catch (err) {
      console.warn('Erro ao carregar participantes do evento:', err);
      return [];
    }
  },

  async createEvent(
    organizerId: string | number,
    title: string,
    description?: string,
    eventType = 'ONLINE',
    startTime?: string,
    endTime?: string,
    locationOrUrl?: string
  ): Promise<EventModel | null> {
    const mutation = `
      mutation CreateEvent(
        $organizerId: ID!,
        $title: String!,
        $description: String,
        $eventType: String,
        $startTime: DateTime!,
        $endTime: DateTime,
        $locationOrUrl: String
      ) {
        createEvent(
          organizerId: $organizerId,
          title: $title,
          description: $description,
          eventType: $eventType,
          startTime: $startTime,
          endTime: $endTime,
          locationOrUrl: $locationOrUrl
        ) {
          id
          title
          description
          eventType
          startTime
          endTime
          locationOrUrl
          organizerId
        }
      }
    `;

    const isoStart = startTime ? new Date(startTime).toISOString() : new Date().toISOString();
    const isoEnd = endTime ? new Date(endTime).toISOString() : null;

    const data = await graphqlClient.request<{ createEvent: EventModel }>(mutation, {
      organizerId: String(organizerId),
      title,
      description,
      eventType,
      startTime: isoStart,
      endTime: isoEnd,
      locationOrUrl
    });
    return data.createEvent || null;
  },

  async attendEvent(
    eventId: string | number,
    userId: string | number,
    status = 'ATTENDING'
  ): Promise<EventAttendeeModel | null> {
    const mutation = `
      mutation AttendEvent($eventId: ID!, $userId: ID!, $status: String) {
        attendEvent(eventId: $eventId, userId: $userId, status: $status) {
          id
          eventId
          userId
          status
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ attendEvent: EventAttendeeModel }>(mutation, {
      eventId: String(eventId),
      userId: String(userId),
      status
    });
    return data.attendEvent || null;
  }
};

export default eventsService;
