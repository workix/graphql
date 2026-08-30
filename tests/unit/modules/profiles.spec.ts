import profilesRepository from '../../../src/modules/profiles/repository/profiles.repo';
import profilesResolvers from '../../../src/modules/profiles/graphql/profiles.resolvers';
import UserProfileDTO from '../../../src/dtos/UserProfileDTO';
import { UserProfile } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  UserProfile: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

describe('Profiles Module Unit Tests (TDD)', () => {
  let mockCtx: any;
  let mockRabbitMQ: any;

  beforeEach(() => {
    mockRabbitMQ = {
      publishInQueue: jest.fn().mockResolvedValue(true)
    };
    mockCtx = {
      orm: {},
      rabbitmq: mockRabbitMQ
    };
  });

  describe('profilesRepository', () => {
    it('should find profile by user id', async () => {
      const mockProfile = { id: 1, user_id: 10, headline: 'Software Engineer' };
      (UserProfile.findOne as jest.Mock).mockResolvedValue(mockProfile);

      const repo = profilesRepository(mockCtx.orm);
      const result = await repo.findByUserId(10);

      expect(result).toEqual(mockProfile);
    });

    it('should update existing profile and publish to search-index-sync queue', async () => {
      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });
      const mockExisting = {
        id: 1,
        user_id: 10,
        headline: 'Developer',
        about: 'Bio',
        banner_url: 'banner.png',
        location: 'SP',
        industry: 'Tech',
        open_to_work: false,
        update: mockUpdate
      };
      (UserProfile.findOne as jest.Mock).mockResolvedValue(mockExisting);

      const repo = profilesRepository(mockCtx.orm, mockRabbitMQ);
      const updated = await repo.upsertProfile(10, { headline: 'Senior Lead', openToWork: true });

      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        headline: 'Senior Lead',
        open_to_work: true
      }));
      expect(mockRabbitMQ.publishInQueue).toHaveBeenCalledWith('search-index-sync', expect.stringContaining('Senior Lead'));
    });

    it('should create new profile and publish to search-index-sync queue', async () => {
      (UserProfile.findOne as jest.Mock).mockResolvedValue(null);
      const mockCreated = {
        id: 2,
        user_id: 15,
        headline: 'CTO',
        about: 'About CTO',
        banner_url: 'cto-banner.png',
        location: 'RJ',
        industry: 'Fintech',
        open_to_work: false
      };
      (UserProfile.create as jest.Mock).mockResolvedValue(mockCreated);

      const repo = profilesRepository(mockCtx.orm, mockRabbitMQ);
      const created = await repo.upsertProfile(15, { headline: 'CTO', location: 'RJ' });

      expect(UserProfile.create).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 15,
        headline: 'CTO'
      }));
      expect(mockRabbitMQ.publishInQueue).toHaveBeenCalledWith('search-index-sync', expect.stringContaining('CTO'));
    });
  });

  describe('profilesResolvers', () => {
    it('should resolve getProfileByUserId and updateMyProfile', async () => {
      const mockProfile = { id: 1, user_id: 10, headline: 'Dev', update: jest.fn().mockResolvedValue(true) };
      (UserProfile.findOne as jest.Mock).mockResolvedValue(mockProfile);

      const q = profilesResolvers.Query;
      const m = profilesResolvers.Mutation;

      const profileDto = await q.getProfileByUserId(null, { userId: 10 }, mockCtx, {});
      expect(profileDto).toBeInstanceOf(UserProfileDTO);

      const updateDto = await m.updateMyProfile(null, { userId: 10, input: { headline: 'Architect' } }, mockCtx, {});
      expect(updateDto).toBeInstanceOf(UserProfileDTO);
    });

    it('should return null for getProfileByUserId when profile does not exist', async () => {
      (UserProfile.findOne as jest.Mock).mockResolvedValue(null);
      const q = profilesResolvers.Query;

      const result = await q.getProfileByUserId(null, { userId: 99 }, mockCtx, {});
      expect(result).toBeNull();
    });
  });

  describe('UserProfileDTO', () => {
    it('should handle null input gracefully', () => {
      const dto = new UserProfileDTO(null);
      expect(dto.id).toBeUndefined();
      expect(dto.openToWork).toBe(false);
    });
  });
});
