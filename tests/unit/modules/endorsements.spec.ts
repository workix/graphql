import endorsementsRepository from '../../../src/modules/endorsements/repository/endorsements.repo';
import endorsementsResolvers from '../../../src/modules/endorsements/graphql/endorsements.resolvers';
import SkillEndorsementDTO from '../../../src/dtos/SkillEndorsementDTO';
import RecommendationDTO from '../../../src/dtos/RecommendationDTO';
import { SkillEndorsement, Recommendation } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  SkillEndorsement: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  Recommendation: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  }
}));

describe('Endorsements Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = { orm: {} };
  });

  describe('endorsementsRepository', () => {
    it('should endorse skill or return existing endorsement', async () => {
      const mockEndorsement = { id: 1, skill_id: 10, endorser_id: 5 };
      (SkillEndorsement.findOne as jest.Mock).mockResolvedValue(mockEndorsement);

      const repo = endorsementsRepository(mockCtx.orm);
      expect(await repo.endorseSkill(10, 5)).toEqual(mockEndorsement);

      (SkillEndorsement.findOne as jest.Mock).mockResolvedValue(null);
      (SkillEndorsement.create as jest.Mock).mockResolvedValue(mockEndorsement);
      expect(await repo.endorseSkill(10, 5)).toEqual(mockEndorsement);
    });

    it('should unendorse skill', async () => {
      const mockDestroy = jest.fn().mockResolvedValue(true);
      (SkillEndorsement.findOne as jest.Mock).mockResolvedValue({ destroy: mockDestroy });

      const repo = endorsementsRepository(mockCtx.orm);
      expect(await repo.unendorseSkill(10, 5)).toBe(true);

      (SkillEndorsement.findOne as jest.Mock).mockResolvedValue(null);
      expect(await repo.unendorseSkill(10, 5)).toBe(false);
    });

    it('should get skill endorsements', async () => {
      const mockEndorsements = [{ id: 1, skill_id: 10, endorser_id: 5 }];
      (SkillEndorsement.findAll as jest.Mock).mockResolvedValue(mockEndorsements);

      const repo = endorsementsRepository(mockCtx.orm);
      expect(await repo.getSkillEndorsements(10)).toEqual(mockEndorsements);
    });

    it('should throw error when recommending oneself', async () => {
      const repo = endorsementsRepository(mockCtx.orm);
      await expect(repo.createRecommendation(5, 5, 'Great!')).rejects.toThrow('Cannot recommend yourself');
    });

    it('should create recommendation with status PENDING', async () => {
      const mockRec = { id: 1, recommender_id: 5, recipient_id: 10, content: 'Great!', status: 'PENDING' };
      (Recommendation.create as jest.Mock).mockResolvedValue(mockRec);

      const repo = endorsementsRepository(mockCtx.orm);
      const res = await repo.createRecommendation(5, 10, 'Great!');

      expect(res).toEqual(mockRec);
    });

    it('should respond to recommendation (accept or decline)', async () => {
      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });
      const mockRec = { id: 1, recommender_id: 5, recipient_id: 10, status: 'PENDING', update: mockUpdate };
      (Recommendation.findOne as jest.Mock).mockResolvedValue(mockRec);

      const repo = endorsementsRepository(mockCtx.orm);
      const accepted = await repo.respondToRecommendation(1, 10, true);
      expect(accepted.status).toBe('ACCEPTED');

      const declined = await repo.respondToRecommendation(1, 10, false);
      expect(declined.status).toBe('DECLINED');
    });

    it('should throw error when responding to missing recommendation', async () => {
      (Recommendation.findOne as jest.Mock).mockResolvedValue(null);
      const repo = endorsementsRepository(mockCtx.orm);

      await expect(repo.respondToRecommendation(99, 10, true)).rejects.toThrow('Recommendation 99 not found');
    });

    it('should get accepted recommendations for user', async () => {
      const mockRecs = [{ id: 1, recipient_id: 10, status: 'ACCEPTED' }];
      (Recommendation.findAll as jest.Mock).mockResolvedValue(mockRecs);

      const repo = endorsementsRepository(mockCtx.orm);
      expect(await repo.getRecommendations(10)).toEqual(mockRecs);
    });
  });

  describe('endorsementsResolvers', () => {
    it('should resolve queries and mutations for endorsements and recommendations', async () => {
      const mockEndorsement = { id: 1, skill_id: 10, endorser_id: 5 };
      const mockRec = { id: 1, recommender_id: 5, recipient_id: 10, status: 'ACCEPTED' };

      (SkillEndorsement.findAll as jest.Mock).mockResolvedValue([mockEndorsement]);
      (Recommendation.findAll as jest.Mock).mockResolvedValue([mockRec]);
      (SkillEndorsement.findOne as jest.Mock).mockResolvedValue(null);
      (SkillEndorsement.create as jest.Mock).mockResolvedValue(mockEndorsement);
      (Recommendation.create as jest.Mock).mockResolvedValue(mockRec);
      (Recommendation.findOne as jest.Mock).mockResolvedValue({ ...mockRec, update: jest.fn().mockResolvedValue(true) });

      const q = endorsementsResolvers.Query;
      const m = endorsementsResolvers.Mutation;

      const endDto = await q.skillEndorsements(null, { skillId: 10 }, mockCtx, {});
      expect(endDto[0]).toBeInstanceOf(SkillEndorsementDTO);

      const recDto = await q.userRecommendations(null, { userId: 10 }, mockCtx, {});
      expect(recDto[0]).toBeInstanceOf(RecommendationDTO);

      const endRes = await m.endorseSkill(null, { skillId: 10, endorserId: 5 }, mockCtx, {});
      expect(endRes).toBe(true);

      (SkillEndorsement.findOne as jest.Mock).mockResolvedValue({ destroy: jest.fn().mockResolvedValue(true) });
      const unendRes = await m.unendorseSkill(null, { skillId: 10, endorserId: 5 }, mockCtx, {});
      expect(unendRes).toBe(true);

      const createRecRes = await m.createRecommendation(null, { recommenderId: 5, recipientId: 10, content: 'Nice' }, mockCtx, {});
      expect(createRecRes).toBeInstanceOf(RecommendationDTO);

      const respondRecRes = await m.respondToRecommendation(null, { recommendationId: 1, recipientId: 10, accept: true }, mockCtx, {});
      expect(respondRecRes).toBeInstanceOf(RecommendationDTO);
    });
  });

  describe('DTOs null check', () => {
    it('should handle null input gracefully', () => {
      const eNull = new SkillEndorsementDTO(null);
      expect(eNull.id).toBeUndefined();

      const rNull = new RecommendationDTO(null);
      expect(rNull.id).toBeUndefined();
    });
  });
});
