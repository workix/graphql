import usersResolvers from '../../../src/modules/users/graphql/users.resolvers';
import candidatesResolvers from '../../../src/modules/candidates/graphql/candidates.resolvers';
import jobsResolvers from '../../../src/modules/jobs/graphql/jobs.resolvers';
import resumesResolvers from '../../../src/modules/resumes/graphql/resumes.resolvers';
import companiesResolvers from '../../../src/modules/companies/graphql/companies.resolvers';
import selectiveProcessesResolvers from '../../../src/modules/selective_processes/graphql/selectiveProcesses.resolvers';
import blogsResolvers from '../../../src/modules/blogs/graphql/blogs.resolvers';
import authorsResolvers from '../../../src/modules/authors/graphql/authors.resolvers';
import membersResolvers from '../../../src/modules/members/graphql/members.resolvers';
import jaasResolvers from '../../../src/modules/jaas/graphql/jaas.resolvers';
import formsResolvers from '../../../src/modules/forms/graphql/forms.resolvers';
import subscribersResolvers from '../../../src/modules/subscribers/graphql/subscribers.resolvers';
import testimonialsResolvers from '../../../src/modules/testimonials/graphql/testimonials.resolvers';
import statsResolvers from '../../../src/modules/stats/graphql/stats.resolvers';
import othersResolvers from '../../../src/modules/others/graphql/others.resolvers';

import * as usersElastic from '../../../src/modules/users/elasticSearch/users.elastic';

jest.mock('../../../src/modules/users/elasticSearch/users.elastic', () => ({
  matchAnyFields: jest.fn().mockResolvedValue([]),
  createIndex: jest.fn().mockResolvedValue({}),
  deleteIndex: jest.fn().mockResolvedValue({}),
  updateIndex: jest.fn().mockResolvedValue({})
}));

describe('GraphQL Module Resolvers Unit Tests', () => {
  let mockCtx: any;
  let mockInfo: any;

  beforeEach(() => {
    mockInfo = {};
    mockCtx = {
      orm: {
        sequelize: {}
      },
      mqserver: {
        publishInQueue: jest.fn().mockResolvedValue(true)
      },
      dataloaders: {
        usersLoader: { load: jest.fn().mockResolvedValue([{ id: 1, name: 'User 1' }]) },
        candidatesLoader: { load: jest.fn().mockResolvedValue([{ id: 2, name: 'Candidate 2' }]) },
        companiesLoader: { load: jest.fn().mockResolvedValue([{ id: 3, name: 'Company 3' }]) },
        jobsLoader: { load: jest.fn().mockResolvedValue([{ id: 4, title: 'Job 4' }]) },
        resumesLoader: { load: jest.fn().mockResolvedValue([{ id: 5 }]) },
        authorLoader: { load: jest.fn().mockResolvedValue([{ id: 6, name: 'Author 6' }]) },
        commentsLoader: { load: jest.fn().mockResolvedValue([{ id: 7 }]) },
        commentsOwnerLoader: { load: jest.fn().mockResolvedValue([{ blog_id: 8 }]) },
        commentsParentLoader: { load: jest.fn().mockResolvedValue([{ id: 9 }]) },
        blogsLoader: { load: jest.fn().mockResolvedValue([{ id: 8, title: 'Blog 8' }]) },
        picturesLoader: { load: jest.fn().mockResolvedValue([{ id: 8 }]) },
        tagsLoader: { load: jest.fn().mockResolvedValue([{ id: 9 }]) },
        categoriesLoader: { load: jest.fn().mockResolvedValue([{ id: 10 }]) },
        mediaLoader: { load: jest.fn().mockResolvedValue([{ id: 11 }]) },
        companyMediaLoader: { load: jest.fn().mockResolvedValue([{ id: 11 }]) },
        memberMediaLoader: { load: jest.fn().mockResolvedValue([{ id: 12 }]) },
        membersLoader: { load: jest.fn().mockResolvedValue([{ id: 10, name: 'Member 10' }]) },
        rolesLoader: { load: jest.fn().mockResolvedValue([{ id: 13, role_name: 'ROLE_ADMIN' }]) },
        educationsLoader: { load: jest.fn().mockResolvedValue([{ id: 14 }]) },
        experiencesLoader: { load: jest.fn().mockResolvedValue([{ id: 15 }]) },
        skillsLoader: { load: jest.fn().mockResolvedValue([{ id: 16 }]) }
      }
    };
  });

  describe('usersResolvers', () => {
    it('should delegate Query and Mutation for users', async () => {
      const q = usersResolvers.Query;
      const m = usersResolvers.Mutation;

      expect(typeof q.allUsers).toBe('function');
      expect(typeof q.getUserById).toBe('function');
      expect(typeof q.allUsersPaginated).toBe('function');
      expect(typeof q.deepSearchUser).toBe('function');

      expect(typeof m.createUser).toBe('function');
      expect(typeof m.deleteUser).toBe('function');
      expect(typeof m.updateUser).toBe('function');
    });
  });

  describe('candidatesResolvers', () => {
    it('should delegate Query, Mutation and Candidate field resolvers', async () => {
      const q = candidatesResolvers.Query;
      const m = candidatesResolvers.Mutation;
      const c = candidatesResolvers.Candidate;

      expect(typeof q.allCandidates).toBe('function');
      expect(typeof q.getCandidateById).toBe('function');
      expect(typeof q.findCandidateByUserId).toBe('function');

      expect(typeof m.createCandidate).toBe('function');
      expect(typeof m.updateCandidate).toBe('function');
      expect(typeof m.deleteCandidate).toBe('function');

      expect(typeof c.user).toBe('function');
      expect(typeof c.resume).toBe('function');
    });
  });

  describe('jobsResolvers', () => {
    it('should delegate Query, Mutation and Job field resolvers', async () => {
      const q = jobsResolvers.Query;
      const m = jobsResolvers.Mutation;
      const j = jobsResolvers.Job;

      expect(typeof q.allJobs).toBe('function');
      expect(typeof q.getJobById).toBe('function');

      expect(typeof m.createJob).toBe('function');
      expect(typeof m.updateJob).toBe('function');
      expect(typeof m.deleteJob).toBe('function');
      expect(typeof m.subscribeInJob).toBe('function');

      expect(typeof j.company).toBe('function');
    });
  });

  describe('resumesResolvers', () => {
    it('should delegate Query, Mutation and Resume field resolvers', async () => {
      const q = resumesResolvers.Query;
      const m = resumesResolvers.Mutation;
      const r = resumesResolvers.Resume;

      expect(typeof q.allResumes).toBe('function');
      expect(typeof q.getResumeById).toBe('function');

      expect(typeof m.createResume).toBe('function');
      expect(typeof m.updateResume).toBe('function');
      expect(typeof m.deleteResume).toBe('function');

      expect(typeof r.candidate).toBe('function');
      expect(typeof r.educations).toBe('function');
      expect(typeof r.experiences).toBe('function');
      expect(typeof r.skills).toBe('function');
    });
  });

  describe('companiesResolvers', () => {
    it('should delegate Query, Mutation and Company field resolvers', async () => {
      const q = companiesResolvers.Query;
      const m = companiesResolvers.Mutation;
      const c = companiesResolvers.Company;

      expect(typeof q.allCompanies).toBe('function');
      expect(typeof q.getCompanyById).toBe('function');

      expect(typeof m.createCompany).toBe('function');
      expect(typeof m.updateCompany).toBe('function');
      expect(typeof m.deleteCompany).toBe('function');

      expect(typeof c.user).toBe('function');
      expect(typeof c.medias).toBe('function');
    });
  });

  describe('selectiveProcessesResolvers', () => {
    it('should delegate Query, Mutation and SelectiveProcess field resolvers', async () => {
      const q = selectiveProcessesResolvers.Query;
      const m = selectiveProcessesResolvers.Mutation;
      const sp = selectiveProcessesResolvers.SelectiveProcess;

      expect(typeof q.allSelectiveProcesses).toBe('function');
      expect(typeof q.getSelectiveProcessById).toBe('function');

      expect(typeof m.createSelectiveProcess).toBe('function');
      expect(typeof m.updateSelectiveProcess).toBe('function');
      expect(typeof m.deleteSelectiveProcess).toBe('function');
      expect(typeof m.subscribeInSelectiveProcess).toBe('function');

      expect(typeof sp.job).toBe('function');
    });
  });

  describe('blogsResolvers', () => {
    it('should delegate Query, Mutation, Blog and Comment field resolvers', async () => {
      const q = blogsResolvers.Query;
      const m = blogsResolvers.Mutation;
      const b = blogsResolvers.Blog;
      const c = blogsResolvers.Comment;

      expect(typeof q.allBlogs).toBe('function');
      expect(typeof q.getBlogById).toBe('function');
      expect(typeof q.allBlogsCategories).toBe('function');
      expect(typeof q.allComments).toBe('function');

      expect(typeof m.createBlog).toBe('function');
      expect(typeof m.updateBlog).toBe('function');
      expect(typeof m.deleteBlog).toBe('function');
      expect(typeof m.createComment).toBe('function');

      expect(typeof b.author).toBe('function');
      expect(typeof b.comments).toBe('function');
      expect(typeof b.pictures).toBe('function');
      expect(typeof b.tags).toBe('function');
      expect(typeof b.categories).toBe('function');
      expect(typeof c.blog).toBe('function');
      expect(typeof c.parentComment).toBe('function');
    });
  });

  describe('authorsResolvers', () => {
    it('should delegate Query, Mutation, Author and AuthorMedia field resolvers', async () => {
      const q = authorsResolvers.Query;
      const m = authorsResolvers.Mutation;
      const a = authorsResolvers.Author;
      const am = authorsResolvers.AuthorMedia;

      expect(typeof q.allAuthors).toBe('function');
      expect(typeof q.getAuthorById).toBe('function');

      expect(typeof m.createAuthor).toBe('function');
      expect(typeof m.updateAuthor).toBe('function');
      expect(typeof m.deleteAuthor).toBe('function');

      expect(typeof a.medias).toBe('function');
      expect(typeof am.author).toBe('function');
    });
  });

  describe('membersResolvers', () => {
    it('should delegate Query, Mutation, Member and MemberMedia field resolvers', async () => {
      const q = membersResolvers.Query;
      const m = membersResolvers.Mutation;
      const mem = membersResolvers.Member;
      const mm = membersResolvers.MemberMedia;

      expect(typeof q.allMembers).toBe('function');
      expect(typeof q.getMemberById).toBe('function');

      expect(typeof m.createMember).toBe('function');
      expect(typeof m.updateMember).toBe('function');
      expect(typeof m.deleteMember).toBe('function');

      expect(typeof mem.medias).toBe('function');
      expect(typeof mm.owner).toBe('function');
    });
  });

  describe('jaasResolvers', () => {
    it('should delegate Query, Mutation and JAASUser field resolvers', async () => {
      const q = jaasResolvers.Query;
      const m = jaasResolvers.Mutation;
      const ju = jaasResolvers.JAASUser;

      expect(typeof q.allJAASUsers).toBe('function');
      expect(typeof q.getJAASUserById).toBe('function');
      expect(typeof q.allJAASRoles).toBe('function');
      expect(typeof q.getJAASRoleByName).toBe('function');

      expect(typeof m.createJAASUser).toBe('function');
      expect(typeof m.updateJAASUser).toBe('function');
      expect(typeof m.deleteJAASUser).toBe('function');
      expect(typeof m.createJAASRole).toBe('function');
      expect(typeof m.updateJAASRole).toBe('function');
      expect(typeof m.deleteJAASRole).toBe('function');

      expect(typeof ju.roles).toBe('function');
    });
  });

  describe('formsResolvers', () => {
    it('should delegate Query and Mutation for Forms', async () => {
      const q = formsResolvers.Query;
      const m = formsResolvers.Mutation;

      expect(typeof q.allForms).toBe('function');
      expect(typeof q.getFormById).toBe('function');

      expect(typeof m.createForm).toBe('function');
      expect(typeof m.updateForm).toBe('function');
      expect(typeof m.deleteForm).toBe('function');
    });
  });

  describe('subscribersResolvers', () => {
    it('should delegate Query and Mutation for Subscribers', async () => {
      const q = subscribersResolvers.Query;
      const m = subscribersResolvers.Mutation;

      expect(typeof q.allSubscribers).toBe('function');
      expect(typeof q.getSubscriberById).toBe('function');

      expect(typeof m.createSubscriber).toBe('function');
      expect(typeof m.updateSubscriber).toBe('function');
      expect(typeof m.deleteSubscriber).toBe('function');
      expect(typeof m.subscribeMail).toBe('function');
    });
  });

  describe('testimonialsResolvers', () => {
    it('should delegate Query, Mutation and Testimonial field resolvers', async () => {
      const q = testimonialsResolvers.Query;
      const m = testimonialsResolvers.Mutation;
      const t = testimonialsResolvers.Testimonial;

      expect(typeof q.allTestimonials).toBe('function');
      expect(typeof q.getTestimonialById).toBe('function');

      expect(typeof m.createTestimonial).toBe('function');
      expect(typeof m.updateTestimonial).toBe('function');
      expect(typeof m.deleteTestimonial).toBe('function');

      expect(typeof t.author).toBe('function');
    });
  });

  describe('statsResolvers', () => {
    it('should delegate Query for stats', async () => {
      const q = statsResolvers.Query;
      expect(typeof q.statisticsCount).toBe('function');
    });
  });

  describe('othersResolvers', () => {
    it('should validate CPF in Query', async () => {
      const q = othersResolvers.Query;
      expect(q.validateCPF(null, { cpf: '52998224725' }, mockCtx, mockInfo)).toBe(true);
    });
  });
});
