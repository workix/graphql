import eventsRepository from '../../../src/modules/events/repository/events.repo';
import eventsResolvers from '../../../src/modules/events/graphql/events.resolvers';
import EventDTO from '../../../src/dtos/EventDTO';
import EventAttendeeDTO from '../../../src/dtos/EventAttendeeDTO';
import { Event, EventAttendee } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Event: {
    create: jest.fn(),
    findByPk: jest.fn()
  },
  EventAttendee: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  }
}));

describe('Events Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = { orm: {} };
    jest.clearAllMocks();
  });

  describe('eventsRepository', () => {
    it('should create event and register organizer as attendee', async () => {
      const mockEvent = { id: 1, title: 'Tech Summit', event_type: 'ONLINE' };
      (Event.create as jest.Mock).mockResolvedValue(mockEvent);
      (EventAttendee.create as jest.Mock).mockResolvedValue({ id: 1 });

      const repo = eventsRepository(mockCtx.orm);
      const startTime = new Date();
      const res = await repo.createEvent(10, 'Tech Summit', 'Desc', 'ONLINE', startTime, undefined, 'https://meet.example.com');

      expect(res).toEqual(mockEvent);
      expect(EventAttendee.create).toHaveBeenCalledWith({
        event_id: 1,
        user_id: 10,
        status: 'ATTENDING'
      });
    });

    it('should get event by id', async () => {
      const mockEvent = { id: 1, title: 'Tech Summit' };
      (Event.findByPk as jest.Mock).mockResolvedValue(mockEvent);

      const repo = eventsRepository(mockCtx.orm);
      expect(await repo.getEventById(1)).toEqual(mockEvent);
    });

    it('should throw error when confirming attendance on non-existing event', async () => {
      (Event.findByPk as jest.Mock).mockResolvedValue(null);
      const repo = eventsRepository(mockCtx.orm);

      await expect(repo.attendEvent(99, 10)).rejects.toThrow('Event 99 not found');
    });

    it('should create attendance with default ATTENDING status when not already registered', async () => {
      const mockEvent = { id: 1 };
      const mockAttendee = { id: 5, event_id: 1, user_id: 10, status: 'ATTENDING' };
      (Event.findByPk as jest.Mock).mockResolvedValue(mockEvent);
      (EventAttendee.findOne as jest.Mock).mockResolvedValue(null);
      (EventAttendee.create as jest.Mock).mockResolvedValue(mockAttendee);

      const repo = eventsRepository(mockCtx.orm);
      const res = await repo.attendEvent(1, 10, 'ATTENDING');

      expect(EventAttendee.create).toHaveBeenCalledWith({
        event_id: 1,
        user_id: 10,
        status: 'ATTENDING'
      });
      expect(res).toEqual(mockAttendee);
    });

    it('should update status when attendee already registered', async () => {
      const mockEvent = { id: 1 };
      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });
      const mockAttendee = { id: 5, event_id: 1, user_id: 10, status: 'MAYBE', update: mockUpdate };
      (Event.findByPk as jest.Mock).mockResolvedValue(mockEvent);
      (EventAttendee.findOne as jest.Mock).mockResolvedValue(mockAttendee);

      const repo = eventsRepository(mockCtx.orm);
      const res = await repo.attendEvent(1, 10, 'MAYBE');

      expect(mockUpdate).toHaveBeenCalledWith({ status: 'MAYBE' });
      expect(res.status).toBe('MAYBE');
    });

    it('should list event attendees', async () => {
      const mockAttendees = [{ id: 1, event_id: 1, user_id: 10, status: 'ATTENDING' }];
      (EventAttendee.findAll as jest.Mock).mockResolvedValue(mockAttendees);

      const repo = eventsRepository(mockCtx.orm);
      const res = await repo.getEventAttendees(1);

      expect(res).toEqual(mockAttendees);
    });
  });

  describe('eventsResolvers', () => {
    it('should resolve queries and mutations for events', async () => {
      const mockEvent = { id: 1, title: 'Tech Summit', organizer_id: 10 };
      const mockAttendee = { id: 1, event_id: 1, user_id: 10, status: 'ATTENDING' };

      (Event.findByPk as jest.Mock).mockResolvedValue(mockEvent);
      (Event.create as jest.Mock).mockResolvedValue(mockEvent);
      (EventAttendee.create as jest.Mock).mockResolvedValue(mockAttendee);
      (EventAttendee.findOne as jest.Mock).mockResolvedValue(null);
      (EventAttendee.findAll as jest.Mock).mockResolvedValue([mockAttendee]);

      const q = eventsResolvers.Query;
      const m = eventsResolvers.Mutation;

      const eventDto = await q.event(null, { id: 1 }, mockCtx, {});
      expect(eventDto).toBeInstanceOf(EventDTO);

      const attendees = await q.eventAttendees(null, { eventId: 1 }, mockCtx, {});
      expect(attendees[0]).toBeInstanceOf(EventAttendeeDTO);

      const createdE = await m.createEvent(
        null,
        { organizerId: 10, title: 'Tech Summit', startTime: new Date() },
        mockCtx,
        {}
      );
      expect(createdE).toBeInstanceOf(EventDTO);

      const attended = await m.attendEvent(null, { eventId: 1, userId: 10 }, mockCtx, {});
      expect(attended).toBeInstanceOf(EventAttendeeDTO);
    });

    it('should return null for event query when event does not exist', async () => {
      (Event.findByPk as jest.Mock).mockResolvedValue(null);
      const q = eventsResolvers.Query;

      const res = await q.event(null, { id: 99 }, mockCtx, {});
      expect(res).toBeNull();
    });
  });

  describe('DTOs null check', () => {
    it('should handle null input gracefully', () => {
      const eNull = new EventDTO(null);
      expect(eNull.id).toBeUndefined();

      const aNull = new EventAttendeeDTO(null);
      expect(aNull.id).toBeUndefined();
    });

    it('should map camelCase fields when snake_case is absent', () => {
      const now = new Date();
      const e = new EventDTO({
        id: 2,
        title: 'Meetup',
        eventType: 'IN_PERSON',
        startTime: now,
        endTime: now,
        locationOrUrl: 'Room 1',
        organizerId: 7,
        createdAt: now,
        updatedAt: now
      });
      expect(e.eventType).toBe('IN_PERSON');
      expect(e.startTime).toBe(now);
      expect(e.endTime).toBe(now);
      expect(e.locationOrUrl).toBe('Room 1');
      expect(e.organizerId).toBe(7);
      expect(e.createdAt).toBe(now);
      expect(e.updatedAt).toBe(now);

      const a = new EventAttendeeDTO({ id: 3, eventId: 1, userId: 9, status: 'MAYBE', createdAt: now });
      expect(a.eventId).toBe(1);
      expect(a.userId).toBe(9);
      expect(a.createdAt).toBe(now);
    });
  });
});
