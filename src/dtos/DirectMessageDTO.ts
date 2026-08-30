export default class DirectMessageDTO {
  id?: number;
  senderId?: number;
  recipientId?: number;
  content?: string;
  read?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(msg: any) {
    this.read = false;
    if (msg) {
      this.id = msg.id;
      this.senderId = msg.sender_id || msg.senderId;
      this.recipientId = msg.recipient_id || msg.recipientId;
      this.content = msg.content;
      this.read = msg.read !== undefined ? msg.read : false;
      this.createdAt = msg.created_at || msg.createdAt;
      this.updatedAt = msg.updated_at || msg.updatedAt;
    }
  }
}
