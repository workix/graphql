export default class GroupDTO {
  id?: number;
  name?: string;
  description?: string;
  privacy?: string;
  ownerId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(group: any) {
    if (group) {
      this.id = group.id;
      this.name = group.name;
      this.description = group.description;
      this.privacy = group.privacy;
      this.ownerId = group.owner_id || group.ownerId;
      this.createdAt = group.created_at || group.createdAt;
      this.updatedAt = group.updated_at || group.updatedAt;
    }
  }
}
