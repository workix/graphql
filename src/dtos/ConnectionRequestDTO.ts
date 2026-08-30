export default class ConnectionRequestDTO {
  id?: number;
  requesterId?: number;
  recipientId?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(req: any) {
    if (req) {
      this.id = req.id;
      this.requesterId = req.requester_id || req.requesterId;
      this.recipientId = req.recipient_id || req.recipientId;
      this.status = req.status;
      this.createdAt = req.created_at || req.createdAt;
      this.updatedAt = req.updated_at || req.updatedAt;
    }
  }
}
