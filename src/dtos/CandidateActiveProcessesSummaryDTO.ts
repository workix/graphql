export interface ICandidateActiveProcessesSummary {
  hasActiveProcesses: boolean;
  totalCount: number;
  isRestricted: boolean;
  restrictionReason?: string | null;
}

export class CandidateActiveProcessesSummaryDTO implements ICandidateActiveProcessesSummary {
  hasActiveProcesses: boolean;
  totalCount: number;
  isRestricted: boolean;
  restrictionReason?: string | null;

  constructor(data: any = {}) {
    this.totalCount = typeof data.totalCount === 'number' ? data.totalCount : (data.total_count || 0);
    this.hasActiveProcesses = this.totalCount > 0 || Boolean(data.hasActiveProcesses || data.has_active_processes);
    this.isRestricted = Boolean(data.isRestricted || data.is_restricted);
    this.restrictionReason = data.restrictionReason || data.restriction_reason || null;
  }
}

export default CandidateActiveProcessesSummaryDTO;
