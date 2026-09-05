export default class UserProfileDTO {
  id?: number;
  userId?: number;
  headline?: string;
  about?: string;
  bannerUrl?: string;
  avatarUrl?: string;
  location?: string;
  industry?: string;
  openToWork?: boolean;
  lookingForJob?: boolean;
  inCareerTransition?: boolean;
  careerTransitionTarget?: string;
  acceptsEntryLevel?: boolean;
  normalizedResume?: string;
  resumeScore?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(profile: any) {
    this.openToWork = false;
    this.lookingForJob = false;
    this.inCareerTransition = false;
    this.careerTransitionTarget = '';
    this.acceptsEntryLevel = false;
    this.normalizedResume = '';
    this.resumeScore = 0;

    if (profile) {
      this.id = profile.id;
      this.userId = profile.user_id || profile.userId;
      this.headline = profile.headline || '';
      this.about = profile.about || '';
      this.bannerUrl = profile.banner_url || profile.bannerUrl || '';
      this.avatarUrl = profile.avatar_url || profile.avatarUrl || '';
      this.location = profile.location || '';
      this.industry = profile.industry || '';
      this.openToWork = profile.open_to_work !== undefined ? !!profile.open_to_work : (!!profile.openToWork);
      this.lookingForJob = profile.looking_for_job !== undefined ? !!profile.looking_for_job : (!!profile.lookingForJob);
      this.inCareerTransition = profile.in_career_transition !== undefined ? !!profile.in_career_transition : (!!profile.inCareerTransition);
      this.careerTransitionTarget = profile.career_transition_target || profile.careerTransitionTarget || '';
      this.acceptsEntryLevel = profile.accepts_entry_level !== undefined ? !!profile.accepts_entry_level : (!!profile.acceptsEntryLevel);
      this.normalizedResume = profile.normalized_resume || profile.normalizedResume || '';
      this.resumeScore = profile.resume_score !== undefined ? Number(profile.resume_score) : (Number(profile.resumeScore || 0));
      this.createdAt = profile.created_at || profile.createdAt;
      this.updatedAt = profile.updated_at || profile.updatedAt;
    }
  }
}
