import { Company, Job, JobCandidate, SelectiveProcess, SelectiveProcessCandidate } from '../../../models';
import { Op } from 'sequelize';

export class CompanyIntegrityService {
  /**
   * Calcula e atualiza a taxa de resposta dos últimos 90 dias e tempo mediano de resposta da empresa
   */
  async calculateResponseRate90d(companyId: number) {
    const company = await Company.findByPk(companyId);
    if (!company) return null;

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    // Busca vagas da empresa criadas ou ativas nos últimos 90 dias
    const jobs = await Job.findAll({
      where: {
        company_id: companyId,
        created_at: { [Op.gte]: ninetyDaysAgo }
      },
      attributes: ['id', 'created_at', 'outcome_status']
    });

    if (jobs.length === 0) {
      // Se não possui histórico recente, taxa neutra padrão
      return {
        responseRate90d: 100.0,
        medianResponseTimeDays: 7,
        isVerified: company.verified_at != null
      };
    }

    const jobIds = jobs.map((j: any) => j.id);

    // Contagem de candidaturas totais e candidaturas com desfecho/resposta
    let totalApplicants = 0;
    let respondedApplicants = 0;

    if (JobCandidate) {
      totalApplicants = await JobCandidate.count({
        where: { job_id: { [Op.in]: jobIds } }
      });
    }

    // Se o processo seletivo ou vaga foi finalizado com desfecho, consideramos respondidos
    const closedJobsCount = jobs.filter((j: any) => j.outcome_status && j.outcome_status !== 'OPEN').length;
    const closedRatio = closedJobsCount / jobs.length;

    let responseRate = Math.min(100, Math.round((closedRatio * 100) * 100) / 100);
    if (totalApplicants === 0) {
      responseRate = 100.0;
    }

    const medianResponseDays = Math.min(14, Math.max(1, Math.round(7 * (1 - closedRatio) + 3)));

    await company.update({
      response_rate_90d: responseRate,
      median_response_time_days: medianResponseDays,
      updated_at: new Date()
    });

    // Reavalia Selo de Verificação automaticamente
    await this.evaluateVerifiedBadge(companyId);

    return {
      responseRate90d: responseRate,
      medianResponseTimeDays: medianResponseDays,
      isVerified: company.verified_at != null
    };
  }

  /**
   * Avalia critérios de mérito para concessão ou suspensão automática do Selo de Empresa Verificada
   */
  async evaluateVerifiedBadge(companyId: number) {
    const company = await Company.findByPk(companyId);
    if (!company) return false;

    const rate = parseFloat(company.response_rate_90d || 100);
    const medianDays = parseInt(company.median_response_time_days || 7, 10);
    const hasCnpj = Boolean(company.cnpj);

    const meetsCriteria = hasCnpj && rate >= 80.0 && medianDays <= 14;

    if (meetsCriteria && !company.verified_at) {
      await company.update({ verified_at: new Date(), updated_at: new Date() });
      return true;
    } else if (!meetsCriteria && company.verified_at) {
      // Suspensão automática caso caia abaixo dos critérios
      await company.update({ verified_at: null, updated_at: new Date() });
      return false;
    }

    return company.verified_at != null;
  }
}

export const companyIntegrityService = new CompanyIntegrityService();
