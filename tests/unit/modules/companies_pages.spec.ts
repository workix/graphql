import companyPagesRepository from '../../../src/modules/companies/repository/company_pages.repo';
import companyPagesResolvers from '../../../src/modules/companies/graphql/company_pages.resolvers';
import CompanyPageDTO from '../../../src/dtos/CompanyPageDTO';
import { CompanyPage, CompanyAdmin, CompanyFollower } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  CompanyPage: {
    create: jest.fn(),
    findByPk: jest.fn()
  },
  CompanyAdmin: {
    create: jest.fn()
  },
  CompanyFollower: {
    create: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn()
  }
}));

describe('Company Pages Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = { orm: {} };
  });

  describe('companyPagesRepository', () => {
    it('should create company page and set creator as ADMIN', async () => {
      const mockPage = { id: 1, name: 'TechCorp', industry: 'Software' };
      (CompanyPage.create as jest.Mock).mockResolvedValue(mockPage);
      (CompanyAdmin.create as jest.Mock).mockResolvedValue({ id: 1 });

      const repo = companyPagesRepository(mockCtx.orm);
      const res = await repo.createCompanyPage(10, { name: 'TechCorp', industry: 'Software' });

      expect(res).toEqual(mockPage);
      expect(CompanyAdmin.create).toHaveBeenCalledWith({ company_id: 1, user_id: 10, role: 'ADMIN' });
    });

    it('should get company page by id', async () => {
      const mockPage = { id: 1, name: 'TechCorp' };
      (CompanyPage.findByPk as jest.Mock).mockResolvedValue(mockPage);

      const repo = companyPagesRepository(mockCtx.orm);
      const res = await repo.getCompanyPageById(1);

      expect(res).toEqual(mockPage);
    });

    it('should follow company or return existing follow', async () => {
      const mockFollow = { id: 1, company_id: 1, user_id: 10 };
      (CompanyFollower.findOne as jest.Mock).mockResolvedValue(mockFollow);

      const repo = companyPagesRepository(mockCtx.orm);
      const existingRes = await repo.followCompany(1, 10);
      expect(existingRes).toEqual(mockFollow);

      (CompanyFollower.findOne as jest.Mock).mockResolvedValue(null);
      (CompanyFollower.create as jest.Mock).mockResolvedValue(mockFollow);

      const newRes = await repo.followCompany(1, 10);
      expect(newRes).toEqual(mockFollow);
    });

    it('should unfollow company', async () => {
      const mockDestroy = jest.fn().mockResolvedValue(true);
      (CompanyFollower.findOne as jest.Mock).mockResolvedValue({ destroy: mockDestroy });

      const repo = companyPagesRepository(mockCtx.orm);
      expect(await repo.unfollowCompany(1, 10)).toBe(true);

      (CompanyFollower.findOne as jest.Mock).mockResolvedValue(null);
      expect(await repo.unfollowCompany(1, 10)).toBe(false);
    });

    it('should get company followers count', async () => {
      (CompanyFollower.count as jest.Mock).mockResolvedValue(42);

      const repo = companyPagesRepository(mockCtx.orm);
      const count = await repo.getCompanyFollowersCount(1);

      expect(count).toBe(42);
    });
  });

  describe('companyPagesResolvers', () => {
    it('should resolve queries and mutations for company pages', async () => {
      const mockPage = { id: 1, name: 'TechCorp' };
      (CompanyPage.findByPk as jest.Mock).mockResolvedValue(mockPage);
      (CompanyFollower.count as jest.Mock).mockResolvedValue(5);
      (CompanyPage.create as jest.Mock).mockResolvedValue(mockPage);
      (CompanyFollower.findOne as jest.Mock).mockResolvedValue({ destroy: jest.fn().mockResolvedValue(true) });

      const q = companyPagesResolvers.Query;
      const m = companyPagesResolvers.Mutation;

      const pageDto = await q.companyPage(null, { id: 1 }, mockCtx, {});
      expect(pageDto).toBeInstanceOf(CompanyPageDTO);

      const count = await q.companyFollowersCount(null, { companyId: 1 }, mockCtx, {});
      expect(count).toBe(5);

      const createdDto = await m.createCompanyPage(null, { creatorUserId: 10, input: { name: 'TechCorp' } }, mockCtx, {});
      expect(createdDto).toBeInstanceOf(CompanyPageDTO);

      const followRes = await m.followCompany(null, { companyId: 1, userId: 10 }, mockCtx, {});
      expect(followRes).toBe(true);

      const unfollowRes = await m.unfollowCompany(null, { companyId: 1, userId: 10 }, mockCtx, {});
      expect(unfollowRes).toBe(true);
    });

    it('should return null for companyPage query when page does not exist', async () => {
      (CompanyPage.findByPk as jest.Mock).mockResolvedValue(null);
      const q = companyPagesResolvers.Query;

      const res = await q.companyPage(null, { id: 99 }, mockCtx, {});
      expect(res).toBeNull();
    });
  });

  describe('CompanyPageDTO null check', () => {
    it('should handle null input gracefully', () => {
      const dto = new CompanyPageDTO(null);
      expect(dto.id).toBeUndefined();
    });
  });
});
