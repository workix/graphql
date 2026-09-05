import db from '../../../models';
import { visibilityService } from './visibility.service';
import { entitlementsService } from '../../premium/services/entitlements.service';
import CandidateActiveProcessDTO from '../../../dtos/CandidateActiveProcessDTO';
import CandidateActiveProcessesSummaryDTO from '../../../dtos/CandidateActiveProcessesSummaryDTO';

export class CandidateActiveProcessesService {
  /**
   * Verifica se a empresa tem permissão de plano Premium para visualizar processos ativos
   */
  async checkViewerEntitlement(viewerCompanyId?: number, isCandidateSelf: boolean = false): Promise<{ allowed: boolean; reason?: string }> {
    if (isCandidateSelf) {
      return { allowed: true };
    }

    if (!viewerCompanyId) {
      return {
        allowed: false,
        reason: 'Recurso exclusivo para empresas assinantes do plano Premium.'
      };
    }

    // 1. Valida can() centralizado para VIEW_CANDIDATE_ACTIVE_PROCESSES
    const canResult1 = await entitlementsService.can(viewerCompanyId, 'VIEW_CANDIDATE_ACTIVE_PROCESSES');
    if (canResult1 && canResult1.allow) {
      return { allowed: true };
    }

    const canResult2 = await entitlementsService.can(viewerCompanyId, 'candidate_active_processes');
    if (canResult2 && canResult2.allow) {
      return { allowed: true };
    }

    // 2. Fallback de plano ativo premium (caso a empresa possua subscription ativa)
    const { plan, subscription } = await entitlementsService.getEffectivePlan(viewerCompanyId);
    if (plan && plan.code && !plan.code.toLowerCase().includes('free')) {
      return { allowed: true };
    }
    if (subscription && subscription.status === 'active') {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: 'Disponível exclusivamente para empresas assinantes do plano Premium.'
    };
  }

  /**
   * Consulta os processos seletivos ativos do candidato
   */
  async getActiveProcesses(candidateId: number, viewerCompanyId?: number, isCandidateSelf: boolean = false) {
    const entitlementCheck = await this.checkViewerEntitlement(viewerCompanyId, isCandidateSelf);
    if (!entitlementCheck.allowed) {
      return {
        candidateId,
        hasActiveProcesses: false,
        totalCount: 0,
        isRestricted: true,
        restrictionReason: entitlementCheck.reason,
        processes: []
      };
    }

    // Verifica privacidade do candidato
    const revealResult = await visibilityService.reveal(candidateId, viewerCompanyId || null, 'active_processes', isCandidateSelf);
    if (!revealResult.allow) {
      return {
        candidateId,
        hasActiveProcesses: false,
        totalCount: 0,
        isRestricted: true,
        restrictionReason: revealResult.reason,
        processes: []
      };
    }

    const processesMap = new Map<number, any>();

    // 1. Consulta em JobApplication
    if (db.JobApplication) {
      const applications = await db.JobApplication.findAll({
        where: { candidate_id: candidateId }
      });

      for (const app of applications) {
        if (app.status !== 'REJECTED' && app.status !== 'CANCELLED') {
          let job: any = null;
          let company: any = null;
          if (db.Job && app.job_id) {
            job = await db.Job.findByPk(app.job_id);
            if (job && job.company_id && db.Company) {
              company = await db.Company.findByPk(job.company_id);
            }
          }

          processesMap.set(app.job_id, {
            id: `app-${app.id}`,
            jobId: app.job_id,
            jobTitle: job ? job.title : 'Oportunidade Profissional',
            companyId: company ? company.id : null,
            companyName: company ? company.name : 'Empresa Parceira',
            companyLogo: company ? company.logo : null,
            isConfidential: job ? Boolean(job.is_confidential) : false,
            status: app.status || 'EM_ANDAMENTO',
            currentStage: this.mapStatusToStage(app.status),
            subscribedAt: app.created_at || new Date(),
            updatedAt: app.updated_at || new Date()
          });
        }
      }
    }

    // 2. Consulta em SelectiveProcessCandidate
    if (db.SelectiveProcessCandidate && db.SelectiveProcess) {
      const spCandidates = await db.SelectiveProcessCandidate.findAll({
        where: { candidate_id: candidateId }
      });

      for (const spc of spCandidates) {
        const sp = await db.SelectiveProcess.findByPk(spc.sp_id);
        if (sp && sp.activated !== false) {
          const jobId = sp.job_id || sp.id;
          if (!processesMap.has(jobId)) {
            let job: any = null;
            let company: any = null;
            if (db.Job && sp.job_id) {
              job = await db.Job.findByPk(sp.job_id);
              if (job && job.company_id && db.Company) {
                company = await db.Company.findByPk(job.company_id);
              }
            }

            processesMap.set(jobId, {
              id: `sp-${sp.id}`,
              selectiveProcessId: sp.id,
              jobId: sp.job_id,
              jobTitle: job ? job.title : 'Processo Seletivo Aberto',
              companyId: company ? company.id : null,
              companyName: company ? company.name : 'Empresa Parceira',
              companyLogo: company ? company.logo : null,
              isConfidential: job ? Boolean(job.is_confidential) : false,
              status: 'EM_ANDAMENTO',
              currentStage: 'Processo Seletivo em Aberto',
              subscribedAt: sp.starts_in || sp.created_at || new Date(),
              updatedAt: sp.updated_at || new Date()
            });
          }
        }
      }
    }

    // 3. Consulta em KanbanCard
    if (db.KanbanCard) {
      const cards = await db.KanbanCard.findAll({
        where: { candidate_id: candidateId }
      });

      for (const card of cards) {
        let stageName = 'Em Análise';
        if (db.KanbanStage && card.stage_id) {
          const stage = await db.KanbanStage.findByPk(card.stage_id);
          if (stage) stageName = stage.name;
        }

        if (processesMap.has(card.job_id)) {
          const existing = processesMap.get(card.job_id);
          existing.currentStage = stageName;
          existing.updatedAt = card.updated_at || existing.updatedAt;
        } else {
          let job: any = null;
          let company: any = null;
          if (db.Job && card.job_id) {
            job = await db.Job.findByPk(card.job_id);
            if (job && job.company_id && db.Company) {
              company = await db.Company.findByPk(job.company_id);
            }
          }

          processesMap.set(card.job_id, {
            id: `kanban-${card.id}`,
            jobId: card.job_id,
            jobTitle: job ? job.title : 'Vaga em Recrutamento',
            companyId: company ? company.id : null,
            companyName: company ? company.name : 'Empresa Parceira',
            companyLogo: company ? company.logo : null,
            isConfidential: job ? Boolean(job.is_confidential) : false,
            status: 'EM_ANDAMENTO',
            currentStage: stageName,
            subscribedAt: card.created_at || new Date(),
            updatedAt: card.updated_at || new Date()
          });
        }
      }
    }

    // 4. Consulta em JobCandidate
    if (db.JobCandidate) {
      const directCandidates = await db.JobCandidate.findAll({
        where: { candidate_id: candidateId }
      });

      for (const dc of directCandidates) {
        if (!processesMap.has(dc.job_id)) {
          let job: any = null;
          let company: any = null;
          if (db.Job && dc.job_id) {
            job = await db.Job.findByPk(dc.job_id);
            if (job && job.company_id && db.Company) {
              company = await db.Company.findByPk(job.company_id);
            }
          }

          processesMap.set(dc.job_id, {
            id: `jc-${dc.job_id}-${candidateId}`,
            jobId: dc.job_id,
            jobTitle: job ? job.title : 'Candidatura Direta',
            companyId: company ? company.id : null,
            companyName: company ? company.name : 'Empresa Parceira',
            companyLogo: company ? company.logo : null,
            isConfidential: job ? Boolean(job.is_confidential) : false,
            status: 'INSCRITO',
            currentStage: 'Inscrito na Vaga',
            subscribedAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    const processes = Array.from(processesMap.values()).map(p => new CandidateActiveProcessDTO(p));

    return {
      candidateId,
      hasActiveProcesses: processes.length > 0,
      totalCount: processes.length,
      isRestricted: false,
      processes
    };
  }

  /**
   * Resumo de processos seletivos ativos
   */
  async getActiveProcessesSummary(candidateId: number, viewerCompanyId?: number, isCandidateSelf: boolean = false) {
    const result = await this.getActiveProcesses(candidateId, viewerCompanyId, isCandidateSelf);
    return new CandidateActiveProcessesSummaryDTO({
      hasActiveProcesses: result.hasActiveProcesses,
      totalCount: result.totalCount,
      isRestricted: result.isRestricted,
      restrictionReason: result.restrictionReason
    });
  }

  private mapStatusToStage(status?: string): string {
    switch (status) {
      case 'SUBMITTED':
      case 'APPLIED':
        return 'Inscrição Realizada';
      case 'IN_REVIEW':
      case 'SCREENING':
        return 'Triagem / Em Análise';
      case 'INTERVIEW':
      case 'INTERVIEWING':
        return 'Entrevista com Recrutador';
      case 'TECHNICAL_TEST':
        return 'Teste Técnico';
      case 'OFFER':
      case 'PROPOSAL':
        return 'Proposta Enviada';
      default:
        return status ? status.replace(/_/g, ' ') : 'Em Andamento';
    }
  }
}

export const candidateActiveProcessesService = new CandidateActiveProcessesService();
export default candidateActiveProcessesService;
