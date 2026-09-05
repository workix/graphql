import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { Interview, Company, Candidate, Job } from '../../../models';
import { entitlementsService } from '../../premium/services/entitlements.service';

export interface CreateInterviewInput {
  companyId: number;
  candidateId: number;
  jobId?: number | null;
  title: string;
  description?: string | null;
  scheduledAt: string | Date;
  durationMinutes?: number;
  format: 'ONLINE' | 'IN_PERSON' | 'PHONE';
  meetingLink?: string | null;
  locationAddress?: string | null;
}

export interface UpdateInterviewInput {
  title?: string;
  description?: string | null;
  scheduledAt?: string | Date;
  durationMinutes?: number;
  format?: 'ONLINE' | 'IN_PERSON' | 'PHONE';
  meetingLink?: string | null;
  locationAddress?: string | null;
  feedbackNotes?: string | null;
}

export interface RespondInterviewInput {
  status: 'CONFIRMED' | 'REJECTED' | 'RESCHEDULE_REQUESTED';
  rescheduleReason?: string | null;
  candidateFeedback?: string | null;
}

export interface InterviewFilterInput {
  status?: string;
  jobId?: number;
  from?: string | Date;
  to?: string | Date;
}

export class InterviewService {
  /**
   * Cria um novo agendamento de entrevista validando entitlements do plano Premium
   */
  async createInterview(input: CreateInterviewInput, user?: any) {
    if (!input.companyId || !input.candidateId || !input.scheduledAt) {
      throw new Error('Empresa, candidato e data da entrevista são obrigatórios.');
    }

    // 1. Validação de Plano Corporativo
    const entitlement = await entitlementsService.can(input.companyId, 'SCHEDULE_INTERVIEWS');
    if (!entitlement.allow) {
      const altEntitlement = await entitlementsService.can(input.companyId, 'interview_scheduler');
      if (!altEntitlement.allow) {
        throw new Error(entitlement.reason || 'O agendamento de entrevistas é exclusivo para empresas com plano Premium.');
      }
    }

    const scheduledDate = new Date(input.scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      throw new Error('Data de agendamento inválida.');
    }

    // 2. Persistência
    const interview = await Interview.create({
      uuid: uuidv4(),
      company_id: input.companyId,
      candidate_id: input.candidateId,
      job_id: input.jobId || null,
      title: input.title || 'Entrevista Técnica / Cultural',
      description: input.description || null,
      scheduled_at: scheduledDate,
      duration_minutes: input.durationMinutes || 45,
      format: input.format || 'ONLINE',
      meeting_link: input.meetingLink || null,
      location_address: input.locationAddress || null,
      status: 'SCHEDULED',
      reschedule_reason: null,
      feedback_notes: null,
      candidate_feedback: null,
    });

    return interview;
  }

  /**
   * Atualiza dados de uma entrevista existente
   */
  async updateInterview(id: number, input: UpdateInterviewInput, user?: any) {
    const interview = await Interview.findByPk(id);
    if (!interview) {
      throw new Error(`Entrevista #${id} não encontrada.`);
    }

    const updateData: any = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.scheduledAt !== undefined) updateData.scheduled_at = new Date(input.scheduledAt);
    if (input.durationMinutes !== undefined) updateData.duration_minutes = input.durationMinutes;
    if (input.format !== undefined) updateData.format = input.format;
    if (input.meetingLink !== undefined) updateData.meeting_link = input.meetingLink;
    if (input.locationAddress !== undefined) updateData.location_address = input.locationAddress;
    if (input.feedbackNotes !== undefined) updateData.feedback_notes = input.feedbackNotes;

    await interview.update(updateData);
    return interview;
  }

  /**
   * Candidato responde ao convite (confirmação, recusa ou pedido de remarcação)
   */
  async respondInterview(id: number, input: RespondInterviewInput, user?: any) {
    const interview = await Interview.findByPk(id);
    if (!interview) {
      throw new Error(`Entrevista #${id} não encontrada.`);
    }

    const validStatuses = ['CONFIRMED', 'REJECTED', 'RESCHEDULE_REQUESTED'];
    if (!validStatuses.includes(input.status)) {
      throw new Error(`Status de resposta inválido: ${input.status}`);
    }

    await interview.update({
      status: input.status,
      reschedule_reason: input.rescheduleReason || null,
      candidate_feedback: input.candidateFeedback || null,
    });

    return interview;
  }

  /**
   * Cancela uma entrevista
   */
  async cancelInterview(id: number, reason?: string, user?: any) {
    const interview = await Interview.findByPk(id);
    if (!interview) {
      throw new Error(`Entrevista #${id} não encontrada.`);
    }

    await interview.update({
      status: 'CANCELLED',
      reschedule_reason: reason || interview.reschedule_reason,
    });

    return interview;
  }

  /**
   * Busca detalhes por ID
   */
  async getInterviewById(id: number) {
    return await Interview.findByPk(id, {
      include: [
        { model: Company, as: 'company' },
        { model: Candidate, as: 'candidate' },
        { model: Job, as: 'job' },
      ],
    });
  }

  /**
   * Lista entrevistas de uma empresa com filtros
   */
  async listInterviewsByCompany(companyId: number, filters?: InterviewFilterInput) {
    const where: any = { company_id: companyId };
    if (filters?.status) where.status = filters.status;
    if (filters?.jobId) where.job_id = filters.jobId;
    if (filters?.from || filters?.to) {
      where.scheduled_at = {};
      if (filters.from) where.scheduled_at[Op.gte] = new Date(filters.from);
      if (filters.to) where.scheduled_at[Op.lte] = new Date(filters.to);
    }

    return await Interview.findAll({
      where,
      order: [['scheduled_at', 'ASC']],
      include: [
        { model: Candidate, as: 'candidate' },
        { model: Job, as: 'job' },
      ],
    });
  }

  /**
   * Lista entrevistas recebidas por um candidato
   */
  async listInterviewsByCandidate(candidateId: number, filters?: InterviewFilterInput) {
    const where: any = { candidate_id: candidateId };
    if (filters?.status) where.status = filters.status;
    if (filters?.from || filters?.to) {
      where.scheduled_at = {};
      if (filters.from) where.scheduled_at[Op.gte] = new Date(filters.from);
      if (filters.to) where.scheduled_at[Op.lte] = new Date(filters.to);
    }

    return await Interview.findAll({
      where,
      order: [['scheduled_at', 'ASC']],
      include: [
        { model: Company, as: 'company' },
        { model: Job, as: 'job' },
      ],
    });
  }
}

export const interviewService = new InterviewService();
