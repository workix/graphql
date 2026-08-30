import graphqlClient from './graphql';

export interface StatisticsCount {
  members: number;
  jobs: number;
  resumes: number;
  companies: number;
}

export const adminStatsService = {
  async getStatistics(): Promise<{ data: StatisticsCount }> {
    const query = `
      query StatisticsCount {
        statisticsCount {
          members
          jobs
          resumes
          companies
        }
      }
    `;

    const data = await graphqlClient.request<{ statisticsCount: StatisticsCount }>(query);
    return {
      data: data.statisticsCount || {
        members: 0,
        jobs: 0,
        resumes: 0,
        companies: 0
      }
    };
  }
};
