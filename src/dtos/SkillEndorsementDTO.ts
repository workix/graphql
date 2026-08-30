export default class SkillEndorsementDTO {
  id?: number;
  skillId?: number;
  endorserId?: number;
  createdAt?: Date;

  constructor(endorsement: any) {
    if (endorsement) {
      this.id = endorsement.id;
      this.skillId = endorsement.skill_id || endorsement.skillId;
      this.endorserId = endorsement.endorser_id || endorsement.endorserId;
      this.createdAt = endorsement.created_at || endorsement.createdAt;
    }
  }
}
