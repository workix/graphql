import { v4 as uuidv4 } from 'uuid';

export class CreateResumeDTO {
  [key: string]: any;
    constructor(input) {
        this.created_at = new Date();
        this.updated_at = new Date();
        this.uuid = uuidv4();
        this.carrer_level = input.carrerLevel || 'SENIOR';
        this.content = input.content || '';
        this.objective = input.objective || '';
        this.presence = input.presence || 'REMOTE';
        this.candidate_id = Number(input.candidateId || 1);
    }
}

export class UpdateResumeDTO {
  [key: string]: any;
    constructor(input) {
        this.updated_at = new Date();
        if (input.carrerLevel) this.carrer_level = input.carrerLevel;
        if (input.content !== undefined) this.content = input.content;
        if (input.objective !== undefined) this.objective = input.objective;
        if (input.presence) this.presence = input.presence;
        if (input.candidateId) this.candidate_id = Number(input.candidateId);
    }
}
