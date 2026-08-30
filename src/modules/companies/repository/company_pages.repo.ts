import { CompanyPage, CompanyAdmin, CompanyFollower } from '../../../models';

const companyPagesRepository = (db: any) => {
  const createCompanyPage = async (creatorUserId: number, input: any) => {
    const page = await CompanyPage.create({
      name: input.name,
      industry: input.industry,
      size: input.size,
      logo_url: input.logoUrl,
      banner_url: input.bannerUrl,
      description: input.description
    });

    await CompanyAdmin.create({
      company_id: page.id,
      user_id: creatorUserId,
      role: 'ADMIN'
    });

    return page;
  };

  const getCompanyPageById = async (id: number) => {
    return await CompanyPage.findByPk(id);
  };

  const followCompany = async (companyId: number, userId: number) => {
    const existing = await CompanyFollower.findOne({
      where: { company_id: companyId, user_id: userId }
    });

    if (existing) return existing;

    return await CompanyFollower.create({
      company_id: companyId,
      user_id: userId
    });
  };

  const unfollowCompany = async (companyId: number, userId: number) => {
    const existing = await CompanyFollower.findOne({
      where: { company_id: companyId, user_id: userId }
    });

    if (existing) {
      await existing.destroy();
      return true;
    }
    return false;
  };

  const getCompanyFollowersCount = async (companyId: number) => {
    return await CompanyFollower.count({ where: { company_id: companyId } });
  };

  return {
    createCompanyPage,
    getCompanyPageById,
    followCompany,
    unfollowCompany,
    getCompanyFollowersCount
  };
};

export default companyPagesRepository;
