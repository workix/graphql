export default class ConnectionDTO {
  id?: number;
  userId1?: number;
  userId2?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(conn: any) {
    if (conn) {
      this.id = conn.id;
      this.userId1 = conn.user_id_1 || conn.userId1;
      this.userId2 = conn.user_id_2 || conn.userId2;
      this.createdAt = conn.created_at || conn.createdAt;
      this.updatedAt = conn.updated_at || conn.updatedAt;
    }
  }
}
