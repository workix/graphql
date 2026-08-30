import { SkillEndorsement, Recommendation } from '../../../models';

const endorsementsRepository = (db: any) => {
  const endorseSkill = async (skillId: number, endorserId: number) => {
    const existing = await SkillEndorsement.findOne({
      where: { skill_id: skillId, endorser_id: endorserId }
    });

    if (existing) return existing;

    return await SkillEndorsement.create({
      skill_id: skillId,
      endorser_id: endorserId
    });
  };

  const unendorseSkill = async (skillId: number, endorserId: number) => {
    const existing = await SkillEndorsement.findOne({
      where: { skill_id: skillId, endorser_id: endorserId }
    });

    if (existing) {
      await existing.destroy();
      return true;
    }
    return false;
  };

  const getSkillEndorsements = async (skillId: number) => {
    return await SkillEndorsement.findAll({
      where: { skill_id: skillId }
    });
  };

  const createRecommendation = async (recommenderId: number, recipientId: number, content: string) => {
    if (recommenderId === recipientId) {
      throw new Error('Cannot recommend yourself');
    }

    return await Recommendation.create({
      recommender_id: recommenderId,
      recipient_id: recipientId,
      content,
      status: 'PENDING'
    });
  };

  const respondToRecommendation = async (recommendationId: number, recipientId: number, accept: boolean) => {
    const rec = await Recommendation.findOne({
      where: { id: recommendationId, recipient_id: recipientId }
    });

    if (!rec) {
      throw new Error(`Recommendation ${recommendationId} not found`);
    }

    await rec.update({ status: accept ? 'ACCEPTED' : 'DECLINED' });
    return rec;
  };

  const getRecommendations = async (userId: number) => {
    return await Recommendation.findAll({
      where: { recipient_id: userId, status: 'ACCEPTED' },
      order: [['created_at', 'DESC']]
    });
  };

  return {
    endorseSkill,
    unendorseSkill,
    getSkillEndorsements,
    createRecommendation,
    respondToRecommendation,
    getRecommendations
  };
};

export default endorsementsRepository;
