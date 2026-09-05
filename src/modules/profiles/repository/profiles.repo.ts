import { UserProfile, Candidate, NormalizedResume } from '../../../models';
import { resumeNormalizationService } from '../../../services/resume_normalization.service';

const profilesRepository = (db: any, rabbitmqClient?: any) => {
  const findByUserId = async (userId: number) => {
    const profile = await UserProfile.findOne({
      where: { user_id: userId }
    });

    const candidate = Candidate?.findOne ? await Candidate.findOne({
      where: { user_id: userId }
    }) : null;

    if (!profile && !candidate) {
      return null;
    }

    let normalizedResumeDoc: any = null;
    if (candidate && NormalizedResume?.findOne) {
      normalizedResumeDoc = await NormalizedResume.findOne({
        where: { candidate_id: candidate.id }
      });
    }

    const baseData = profile ? (typeof profile.toJSON === 'function' ? profile.toJSON() : profile) : { user_id: userId };

    return {
      ...baseData,
      looking_for_job: candidate ? !!candidate.looking_for_job : (baseData.looking_for_job || false),
      in_career_transition: candidate ? !!candidate.in_career_transition : (baseData.in_career_transition || false),
      career_transition_target: candidate ? (candidate.career_transition_target || '') : (baseData.career_transition_target || ''),
      accepts_entry_level: candidate ? !!candidate.accepts_entry_level : (baseData.accepts_entry_level || false),
      normalized_resume: normalizedResumeDoc ? (normalizedResumeDoc.raw_markdown || '') : (baseData.normalized_resume || ''),
      resume_score: normalizedResumeDoc ? (normalizedResumeDoc.completeness_score || 0) : (baseData.resume_score || 0),
      avatar_url: profile?.avatar_url || ''
    };
  };

  const upsertProfile = async (userId: number, input: any) => {
    let profile = await UserProfile.findOne({
      where: { user_id: userId }
    });

    if (profile) {
      if (typeof profile.update === 'function') {
        await profile.update({
          headline: input.headline !== undefined ? input.headline : profile.headline,
          about: input.about !== undefined ? input.about : profile.about,
          banner_url: input.bannerUrl !== undefined ? input.bannerUrl : profile.banner_url,
          location: input.location !== undefined ? input.location : profile.location,
          industry: input.industry !== undefined ? input.industry : profile.industry,
          open_to_work: input.openToWork !== undefined ? input.openToWork : profile.open_to_work
        });
      }
    } else {
      profile = await UserProfile.create({
        user_id: userId,
        headline: input.headline || '',
        about: input.about || '',
        banner_url: input.bannerUrl || '',
        location: input.location || '',
        industry: input.industry || '',
        open_to_work: input.openToWork || false
      });
    }

    let candidate: any = null;
    if (Candidate?.findOne) {
      candidate = await Candidate.findOne({
        where: { user_id: userId }
      });

      if (candidate) {
        const candidateUpdates: any = {};
        if (input.lookingForJob !== undefined) candidateUpdates.looking_for_job = input.lookingForJob;
        if (input.inCareerTransition !== undefined) candidateUpdates.in_career_transition = input.inCareerTransition;
        if (input.careerTransitionTarget !== undefined) candidateUpdates.career_transition_target = input.careerTransitionTarget;
        if (input.acceptsEntryLevel !== undefined) candidateUpdates.accepts_entry_level = input.acceptsEntryLevel;

        if (Object.keys(candidateUpdates).length > 0 && typeof candidate.update === 'function') {
          await candidate.update(candidateUpdates);
        }

        if (input.normalizedResume !== undefined && input.normalizedResume !== null && input.normalizedResume !== '' && resumeNormalizationService?.saveNormalizedResume) {
          await resumeNormalizationService.saveNormalizedResume(candidate.id, input.normalizedResume);
        }
      }
    }

    let normalizedResumeDoc: any = null;
    if (candidate && NormalizedResume?.findOne) {
      normalizedResumeDoc = await NormalizedResume.findOne({
        where: { candidate_id: candidate.id }
      });
    }

    if (rabbitmqClient) {
      const searchSyncPayload = JSON.stringify({
        action: 'INDEX',
        index: 'profiles',
        id: String(userId),
        document: {
          id: userId,
          headline: profile?.headline,
          about: profile?.about,
          location: profile?.location,
          industry: profile?.industry,
          openToWork: profile?.open_to_work
        }
      });
      await rabbitmqClient.publishInQueue('search-index-sync', searchSyncPayload);
    }

    const baseData = profile ? (typeof profile.toJSON === 'function' ? profile.toJSON() : profile) : { user_id: userId };

    return {
      ...baseData,
      looking_for_job: candidate ? !!candidate.looking_for_job : (baseData.looking_for_job || false),
      in_career_transition: candidate ? !!candidate.in_career_transition : (baseData.in_career_transition || false),
      career_transition_target: candidate ? (candidate.career_transition_target || '') : (baseData.career_transition_target || ''),
      accepts_entry_level: candidate ? !!candidate.accepts_entry_level : (baseData.accepts_entry_level || false),
      normalized_resume: normalizedResumeDoc ? (normalizedResumeDoc.raw_markdown || '') : (baseData.normalized_resume || ''),
      resume_score: normalizedResumeDoc ? (normalizedResumeDoc.completeness_score || 0) : (baseData.resume_score || 0),
      avatar_url: profile?.avatar_url || ''
    };
  };

  return {
    findByUserId,
    upsertProfile
  };
};

export default profilesRepository;
