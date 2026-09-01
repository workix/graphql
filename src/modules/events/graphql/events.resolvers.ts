import eventsRepository from '../repository/events.repo';
import EventDTO from '../../../dtos/EventDTO';
import EventAttendeeDTO from '../../../dtos/EventAttendeeDTO';
import UserDTO from '../../../dtos/UserDTO';

const eventsResolvers = {
  Query: {
    event: async (parent: any, args: any, ctx: any, info: any) => {
      const e = await eventsRepository(ctx.orm).getEventById(args.id);
      return e ? new EventDTO(e) : null;
    },
    eventAttendees: async (parent: any, args: any, ctx: any, info: any) => {
      const attendees = await eventsRepository(ctx.orm).getEventAttendees(args.eventId, args.limit, args.offset);
      return attendees.map((a: any) => new EventAttendeeDTO(a));
    }
  },
  Mutation: {
    createEvent: async (parent: any, args: any, ctx: any, info: any) => {
      const event = await eventsRepository(ctx.orm).createEvent(
        args.organizerId,
        args.title,
        args.description,
        args.eventType,
        args.startTime,
        args.endTime,
        args.locationOrUrl
      );
      return new EventDTO(event);
    },
    attendEvent: async (parent: any, args: any, ctx: any, info: any) => {
      const attendee = await eventsRepository(ctx.orm).attendEvent(args.eventId, args.userId, args.status);
      return new EventAttendeeDTO(attendee);
    }
  },
  Event: {
    organizer: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.organizerId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.organizerId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    }
  },
  EventAttendee: {
    user: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.userId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.userId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    },
    event: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.eventId) return null;
      const events = await ctx.dataloaders.eventsLoader.load({ key: parent.eventId, info });
      return events && events[0] ? new EventDTO(events[0]) : null;
    }
  }
};

export default eventsResolvers;

