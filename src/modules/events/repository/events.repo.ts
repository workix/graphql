import { Event, EventAttendee } from '../../../models';

const eventsRepository = (db: any) => {
  const createEvent = async (
    organizerId: number,
    title: string,
    description?: string,
    eventType = 'ONLINE',
    startTime?: Date,
    endTime?: Date,
    locationOrUrl?: string
  ) => {
    const event = await Event.create({
      title,
      description,
      event_type: eventType,
      start_time: startTime,
      end_time: endTime,
      location_or_url: locationOrUrl,
      organizer_id: organizerId
    });

    await EventAttendee.create({
      event_id: event.id,
      user_id: organizerId,
      status: 'ATTENDING'
    });

    return event;
  };

  const getEventById = async (id: number) => {
    return await Event.findByPk(id);
  };

  const attendEvent = async (eventId: number, userId: number, status = 'ATTENDING') => {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error(`Event ${eventId} not found`);
    }

    const existing = await EventAttendee.findOne({
      where: { event_id: eventId, user_id: userId }
    });

    if (existing) {
      await existing.update({ status });
      return existing;
    }

    return await EventAttendee.create({
      event_id: eventId,
      user_id: userId,
      status
    });
  };

  const getEventAttendees = async (eventId: number, limit = 20, offset = 0) => {
    return await EventAttendee.findAll({
      where: { event_id: eventId },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  };

  return {
    createEvent,
    getEventById,
    attendEvent,
    getEventAttendees
  };
};

export default eventsRepository;
