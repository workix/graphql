export default class GroupMembershipDTO {
  id?: number;
  groupId?: number;
  userId?: number;
  role?: string;
  status?: string;
  createdAt?: Date;

  constructor(mem: any) {
    if (mem) {
      this.id = mem.id;
      this.groupId = mem.group_id || mem.groupId;
      this.userId = mem.user_id || mem.userId;
      this.role = mem.role;
      this.status = mem.status;
      this.createdAt = mem.created_at || mem.createdAt;
    }
  }
}
