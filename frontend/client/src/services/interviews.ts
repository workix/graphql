import graphqlClient from './graphql';

export interface InterviewModel {
  id: string | number;
  uuid: string;
  companyId: string | number;
  candidateId: string | number;
  jobId?: string | number | null;
  title: string;
  description?: string | null;
  scheduledAt: string;
  durationMinutes: number;
  format: 'ONLINE' | 'IN_PERSON' | 'PHONE';
  meetingLink?: string | null;
  locationAddress?: string | null;
  status: 'SCHEDULED' | 'CONFIRMED' | 'REJECTED' | 'RESCHEDULE_REQUESTED' | 'COMPLETED' | 'CANCELLED';
  rescheduleReason?: string | null;
  feedbackNotes?: string | null;
  candidateFeedback?: string | null;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string | number;
    name: string;
  };
  candidate?: {
    id: string | number;
    name: string;
  };
  job?: {
    id: string | number;
    title: string;
  };
}

export const interviewsService = {
  async getById(id: string | number): Promise<{ data: InterviewModel }> {
    const query = `
      query GetInterviewById($id: ID!) {
        getInterviewById(id: $id) {
          id
          uuid
          companyId
          candidateId
          jobId
          title
          description
          scheduledAt
          durationMinutes
          format
          meetingLink
          locationAddress
          status
          rescheduleReason
          feedbackNotes
          candidateFeedback
          createdAt
          company { id name }
          candidate { id name }
          job { id title }
        }
      }
    `;
    const res = await graphqlClient.request(query, { id: String(id) });
    return { data: res.getInterviewById };
  },

  async listByCompany(companyId: string | number, filter?: any): Promise<{ data: InterviewModel[] }> {
    const query = `
      query ListInterviewsByCompany($companyId: ID!, $filter: InterviewFilterInput) {
        listInterviewsByCompany(companyId: $companyId, filter: $filter) {
          id
          uuid
          companyId
          candidateId
          jobId
          title
          description
          scheduledAt
          durationMinutes
          format
          meetingLink
          locationAddress
          status
          rescheduleReason
          feedbackNotes
          candidateFeedback
          createdAt
          candidate { id name }
          job { id title }
        }
      }
    `;
    const res = await graphqlClient.request(query, { companyId: String(companyId), filter });
    return { data: res.listInterviewsByCompany || [] };
  },

  async listByCandidate(candidateId: string | number, filter?: any): Promise<{ data: InterviewModel[] }> {
    const query = `
      query ListInterviewsByCandidate($candidateId: ID!, $filter: InterviewFilterInput) {
        listInterviewsByCandidate(candidateId: $candidateId, filter: $filter) {
          id
          uuid
          companyId
          candidateId
          jobId
          title
          description
          scheduledAt
          durationMinutes
          format
          meetingLink
          locationAddress
          status
          rescheduleReason
          feedbackNotes
          candidateFeedback
          createdAt
          company { id name }
          job { id title }
        }
      }
    `;
    const res = await graphqlClient.request(query, { candidateId: String(candidateId), filter });
    return { data: res.listInterviewsByCandidate || [] };
  },

  async create(input: any): Promise<{ data: InterviewModel }> {
    const mutation = `
      mutation CreateInterview($input: CreateInterviewInput!) {
        createInterview(input: $input) {
          id
          uuid
          companyId
          candidateId
          jobId
          title
          scheduledAt
          format
          meetingLink
          status
        }
      }
    `;
    const res = await graphqlClient.request(mutation, { input });
    return { data: res.createInterview };
  },

  async respond(id: string | number, input: { status: string; rescheduleReason?: string; candidateFeedback?: string }): Promise<{ data: InterviewModel }> {
    const mutation = `
      mutation RespondInterview($id: ID!, $input: RespondInterviewInput!) {
        respondInterview(id: $id, input: $input) {
          id
          status
          rescheduleReason
          candidateFeedback
        }
      }
    `;
    const res = await graphqlClient.request(mutation, { id: String(id), input });
    return { data: res.respondInterview };
  },

  async cancel(id: string | number, reason?: string): Promise<{ data: InterviewModel }> {
    const mutation = `
      mutation CancelInterview($id: ID!, $reason: String) {
        cancelInterview(id: $id, reason: $reason) {
          id
          status
          rescheduleReason
        }
      }
    `;
    const res = await graphqlClient.request(mutation, { id: String(id), reason });
    return { data: res.cancelInterview };
  }
};
