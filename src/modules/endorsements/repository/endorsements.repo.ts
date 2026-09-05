import { SkillEndorsement, Recommendation, Candidate, Resume, ResumeSkill, NormalizedResume } from '../../../models';

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

  const getUserSkillsWithEndorsements = async (userId: number, currentUserId?: number) => {
    let candidate = await Candidate.findOne({ where: { user_id: userId } });
    if (!candidate) {
      candidate = await Candidate.findByPk(userId);
    }
    if (!candidate) {
      return [];
    }

    const skillsMap = new Map<string, { id: number | string; name: string }>();

    // 1. Check classical resume skills
    if (Resume && ResumeSkill) {
      const resume = await Resume.findOne({ where: { candidate_id: candidate.id } });
      if (resume) {
        const resumeSkills = await ResumeSkill.findAll({ where: { id: resume.id } });
        for (const rs of resumeSkills) {
          if (rs.skill_name && rs.skill_name.trim()) {
            const name = rs.skill_name.trim();
            skillsMap.set(name.toLowerCase(), { id: rs.id, name });
          }
        }
      }
    }

    // 2. Check normalized resume skills
    if (NormalizedResume) {
      const normalized = await NormalizedResume.findOne({ where: { candidate_id: candidate.id } });
      if (normalized && normalized.skills) {
        let arr: string[] = [];
        try {
          arr = Array.isArray(normalized.skills) ? normalized.skills : JSON.parse(normalized.skills);
        } catch {
          arr = typeof normalized.skills === 'string' ? normalized.skills.split(',').map((s: string) => s.trim()) : [];
        }
        for (let i = 0; i < arr.length; i++) {
          const name = arr[i]?.trim();
          if (name && !skillsMap.has(name.toLowerCase())) {
            let hash = 0;
            for (let j = 0; j < name.length; j++) {
              hash = ((hash << 5) - hash) + name.charCodeAt(j);
              hash |= 0;
            }
            skillsMap.set(name.toLowerCase(), { id: Math.abs(hash) + 10000, name });
          }
        }
      }
    }

    const result = [];
    for (const [, item] of skillsMap.entries()) {
      const endorsements = await SkillEndorsement.findAll({
        where: { skill_id: Number(item.id) }
      });
      const isEndorsedByMe = currentUserId
        ? endorsements.some((e: any) => String(e.endorser_id) === String(currentUserId))
        : false;

      result.push({
        id: item.id,
        name: item.name,
        endorsementsCount: endorsements.length,
        isEndorsedByMe
      });
    }

    return result;
  };

  const addUserSkill = async (userId: number, skillName: string) => {
    let candidate = await Candidate.findOne({ where: { user_id: userId } });
    if (!candidate) {
      candidate = await Candidate.findByPk(userId);
    }
    if (!candidate) {
      throw new Error(`Candidato não encontrado para o usuário ${userId}`);
    }

    let resume = await Resume.findOne({ where: { candidate_id: candidate.id } });
    if (!resume) {
      resume = await Resume.create({
        candidate_id: candidate.id,
        carrer_level: 'MID_LEVEL',
        content: '',
        objective: '',
        presence: 'REMOTE'
      });
    }

    const createdSkill = await ResumeSkill.create({
      id: resume.id,
      skill_name: skillName.trim(),
      months: 12
    });

    return {
      id: createdSkill.id,
      name: skillName.trim(),
      endorsementsCount: 0,
      isEndorsedByMe: false
    };
  };

  const removeUserSkill = async (userId: number, skillId: number) => {
    let candidate = await Candidate.findOne({ where: { user_id: userId } });
    if (!candidate) {
      candidate = await Candidate.findByPk(userId);
    }
    if (!candidate) return false;

    const resume = await Resume.findOne({ where: { candidate_id: candidate.id } });
    if (resume) {
      await ResumeSkill.destroy({
        where: { id: resume.id, skill_name: skillId }
      });
    }
    return true;
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
    getUserSkillsWithEndorsements,
    addUserSkill,
    removeUserSkill,
    createRecommendation,
    respondToRecommendation,
    getRecommendations
  };
};

export default endorsementsRepository;
