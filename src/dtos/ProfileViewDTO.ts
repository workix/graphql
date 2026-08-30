export default class ProfileViewDTO {
  id?: number;
  viewedId?: number;
  viewerId?: number;
  viewedAt?: Date;

  constructor(view: any) {
    if (view) {
      this.id = view.id;
      this.viewedId = view.viewed_id || view.viewedId;
      this.viewerId = view.viewer_id || view.viewerId;
      this.viewedAt = view.viewed_at || view.viewedAt;
    }
  }
}
