export default class EventDTO {
  id?: number;
  title?: string;
  description?: string;
  eventType?: string;
  startTime?: Date;
  endTime?: Date;
  locationOrUrl?: string;
  organizerId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(event: any) {
    if (event) {
      this.id = event.id;
      this.title = event.title;
      this.description = event.description;
      this.eventType = event.event_type || event.eventType;
      this.startTime = event.start_time || event.startTime;
      this.endTime = event.end_time || event.endTime;
      this.locationOrUrl = event.location_or_url || event.locationOrUrl;
      this.organizerId = event.organizer_id || event.organizerId;
      this.createdAt = event.created_at || event.createdAt;
      this.updatedAt = event.updated_at || event.updatedAt;
    }
  }
}
