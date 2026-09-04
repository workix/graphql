import { Job } from '../../../models';
import { Op } from 'sequelize';

export class JobExpirationService {
  /**
   * Executa a expiração automática de vagas com validade vencida (combate a vagas fantasmas)
   */
  async autoExpireJobs() {
    const now = new Date();

    const expiredJobs = await Job.findAll({
      where: {
        activated: true,
        outcome_status: 'OPEN',
        expires_at: {
          [Op.ne]: null,
          [Op.lt]: now
        }
      }
    });

    const expiredIds: number[] = [];

    for (const job of expiredJobs) {
      await job.update({
        activated: false,
        outcome_status: 'EXPIRED',
        updated_at: new Date()
      });
      expiredIds.push(job.id);
    }

    return {
      totalExpired: expiredIds.length,
      expiredJobIds: expiredIds
    };
  }

  /**
   * Encerra uma vaga com registro de desfecho obrigatório
   */
  async closeJobWithOutcome(jobId: number, outcomeStatus: 'HIRED' | 'CANCELLED' | 'CLOSED') {
    const job = await Job.findByPk(jobId);
    if (!job) {
      throw new Error(`Vaga com id ${jobId} não encontrada`);
    }

    await job.update({
      activated: false,
      outcome_status: outcomeStatus,
      updated_at: new Date()
    });

    return job;
  }
}

export const jobExpirationService = new JobExpirationService();
