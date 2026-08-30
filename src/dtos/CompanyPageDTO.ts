export default class CompanyPageDTO {
  id?: number;
  name?: string;
  industry?: string;
  size?: string;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(company: any) {
    if (company) {
      this.id = company.id;
      this.name = company.name;
      this.industry = company.industry;
      this.size = company.size;
      this.logoUrl = company.logo_url || company.logoUrl;
      this.bannerUrl = company.banner_url || company.bannerUrl;
      this.description = company.description;
      this.createdAt = company.created_at || company.createdAt;
      this.updatedAt = company.updated_at || company.updatedAt;
    }
  }
}
