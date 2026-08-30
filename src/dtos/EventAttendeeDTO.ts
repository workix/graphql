export default class EventAttendeeDTO {
  id?: number;
  eventId?: number;
  userId?: number;
  status?: string;
  createdAt?: Date;

  constructor(attendee: any) {
    if (attendee) {
      this.id = attendee.id;
      this.eventId = attendee.event_id || attendee.eventId;
      this.userId = attendee.user_id || attendee.userId;
      this.status = attendee.status;
      this.createdAt = attendee.created_at || attendee.createdAt;
    }
  }
}
