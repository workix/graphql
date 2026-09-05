export interface ICandidateActiveProcess {
  id: string | number;
  selectiveProcessId?: string | number | null;
  jobId?: string | number | null;
  jobTitle?: string | null;
  companyId?: string | number | null;
  companyName?: string | null;
  companyLogo?: string | null;
  isConfidential?: boolean;
  status?: string | null;
  currentStage?: string | null;
  subscribedAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export class CandidateActiveProcessDTO implements ICandidateActiveProcess {
  id: string | number;
  selectiveProcessId?: string | number | null;
  jobId?: string | number | null;
  jobTitle?: string | null;
  companyId?: string | number | null;
  companyName?: string | null;
  companyLogo?: string | null;
  isConfidential?: boolean;
  status?: string | null;
  currentStage?: string | null;
  subscribedAt?: Date | string | null;
  updatedAt?: Date | string | null;

  constructor(data: any = {}) {
    this.id = data.id || `proc-${data.jobId || data.selectiveProcessId || Math.random().toString(36).substring(2, 8)}`;
    this.selectiveProcessId = data.selectiveProcessId || data.selective_process_id || null;
    this.jobId = data.jobId || data.job_id || null;
    this.jobTitle = data.jobTitle || data.job_title || 'Oportunidade Profissional';
    this.isConfidential = Boolean(data.isConfidential || data.is_confidential);

    if (this.isConfidential) {
      this.companyId = null;
      this.companyName = 'Empresa Confidencial';
      this.companyLogo = null;
    } else {
      this.companyId = data.companyId || data.company_id || null;
      this.companyName = data.companyName || data.company_name || 'Empresa Parceira';
      this.companyLogo = data.companyLogo || data.company_logo || null;
    }

    this.status = data.status || 'EM_ANDAMENTO';
    this.currentStage = data.currentStage || data.current_stage || 'Triagem / Em Análise';
    this.subscribedAt = data.subscribedAt || data.subscribed_at || data.createdAt || data.created_at || new Date();
    this.updatedAt = data.updatedAt || data.updated_at || new Date();
  }
}

export default CandidateActiveProcessDTO;
