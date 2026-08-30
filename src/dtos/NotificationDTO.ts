export default class NotificationDTO {
  id?: number;
  userId?: number;
  type?: string;
  title?: string;
  body?: string;
  read?: boolean;
  data?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(notification: any) {
    this.read = false;
    if (notification) {
      this.id = notification.id;
      this.userId = notification.user_id || notification.userId;
      this.type = notification.type;
      this.title = notification.title;
      this.body = notification.body;
      this.read = notification.read !== undefined ? notification.read : false;
      this.data = notification.data;
      this.createdAt = notification.created_at || notification.createdAt;
      this.updatedAt = notification.updated_at || notification.updatedAt;
    }
  }
}
