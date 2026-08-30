export default class UserProfileDTO {
  id?: number;
  userId?: number;
  headline?: string;
  about?: string;
  bannerUrl?: string;
  location?: string;
  industry?: string;
  openToWork?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(profile: any) {
    this.openToWork = false;
    if (profile) {
      this.id = profile.id;
      this.userId = profile.user_id || profile.userId;
      this.headline = profile.headline;
      this.about = profile.about;
      this.bannerUrl = profile.banner_url || profile.bannerUrl;
      this.location = profile.location;
      this.industry = profile.industry;
      this.openToWork = profile.open_to_work !== undefined ? profile.open_to_work : false;
      this.createdAt = profile.created_at || profile.createdAt;
      this.updatedAt = profile.updated_at || profile.updatedAt;
    }
  }
}
