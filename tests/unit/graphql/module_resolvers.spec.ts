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
import { User, Candidate, Job, Resume, Company, SelectiveProcess, Blog, Comment, Author, Member, JAASUser, JAASRole, Form, Subscriber, Testimonial } from '../../../src/models';

jest.mock('../../../src/factory/redis_server', () => ({
  setRedis: jest.fn().mockResolvedValue('OK'),
  redisClient: {
    keys: jest.fn().mockResolvedValue([]),
    mget: jest.fn().mockResolvedValue([]),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    quit: jest.fn()
  }
}));

jest.mock('ioredis', () => jest.fn().mockImplementation(() => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  quit: jest.fn()
})));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn((token: string, secret: string, cb: Function) => cb(null, { id: 1 }))
}));

jest.mock('../../../src/modules/users/elasticSearch/users.elastic', () => ({
  matchAnyFields: jest.fn().mockResolvedValue([]),
  createIndex: jest.fn().mockResolvedValue({}),
  deleteIndex: jest.fn().mockResolvedValue({}),
  updateIndex: jest.fn().mockResolvedValue({})
}));

jest.mock('../../../src/models', () => {
  const mockModelObj = { reload: jest.fn().mockResolvedValue({}), destroy: jest.fn().mockResolvedValue(1), addComment: jest.fn().mockResolvedValue({}), removeComment: jest.fn().mockResolvedValue({}), addCandidate: jest.fn().mockResolvedValue({}), addJob: jest.fn().mockResolvedValue({}), addSelectiveProcess: jest.fn().mockResolvedValue({}), getCandidates: jest.fn().mockResolvedValue([]), getCompany: jest.fn().mockResolvedValue({}), getMedias: jest.fn().mockResolvedValue([]), getComments: jest.fn().mockResolvedValue([]), getPictures: jest.fn().mockResolvedValue([]), getTags: jest.fn().mockResolvedValue([]), getCategories: jest.fn().mockResolvedValue([]) };
  return {
    User: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    Candidate: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    Job: { findAll: jest.fn().mockResolvedValue([mockModelObj]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    Resume: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    Company: { rawAttributes: { id: {}, name: {}, logo: {} }, findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    SelectiveProcess: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    Blog: { findAll: jest.fn().mockResolvedValue([mockModelObj]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    Comment: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    Author: { findAll: jest.fn().mockResolvedValue([mockModelObj]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    AuthorMedia: { create: jest.fn().mockResolvedValue(mockModelObj), destroy: jest.fn() },
    Member: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    JAASUser: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    JAASRole: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    Form: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    Subscriber: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    Testimonial: { findAll: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(mockModelObj), findByPk: jest.fn().mockResolvedValue(mockModelObj), create: jest.fn().mockResolvedValue(mockModelObj), update: jest.fn().mockResolvedValue([[1], []]), destroy: jest.fn().mockResolvedValue(1), count: jest.fn().mockResolvedValue(1) },
    BlogCategory: { findAll: jest.fn().mockResolvedValue([]) },
    BlogPicture: { create: jest.fn().mockResolvedValue(mockModelObj) },
    BlogTag: { create: jest.fn().mockResolvedValue(mockModelObj) },
    MemberMedia: { create: jest.fn().mockResolvedValue(mockModelObj) },
    CompanyMedia: { create: jest.fn().mockResolvedValue(mockModelObj) },
    JobCandidate: { create: jest.fn().mockResolvedValue(mockModelObj), findOrCreate: jest.fn().mockResolvedValue([mockModelObj, true]) },
    SelectiveProcessCandidate: { create: jest.fn().mockResolvedValue(mockModelObj), findOrCreate: jest.fn().mockResolvedValue([mockModelObj, true]) }
  };
});

describe('GraphQL Module Resolvers Unit Tests', () => {
  jest.setTimeout(30000);
  let mockCtx: any;
  let mockInfo: any;

  beforeEach(() => {
    mockInfo = {
      fieldNodes: [
        {
          kind: 'Field',
          name: { value: 'item' },
          selectionSet: { selections: [{ kind: 'Field', name: { value: 'id' } }] }
        }
      ]
    };

    mockCtx = {
      orm: {
        sequelize: {
          transaction: jest.fn().mockImplementation(async (cb: any) => cb({})),
          query: jest.fn().mockResolvedValue([])
        }
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
    it('should execute Query and Mutation for users', async () => {
      const q = usersResolvers.Query;
      const m = usersResolvers.Mutation;

      await q.allUsers(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getUserById(null, { id: 1 }, mockCtx, mockInfo);
      await q.allUsersPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);
      await q.deepSearchUser(null, { term: 'test' }, mockCtx, mockInfo);

      await m.createUser(null, { input: { email: 'a@b.com' } }, mockCtx, mockInfo);
      await m.updateUser(null, { id: 1, input: { email: 'a@b.com' } }, mockCtx, mockInfo);
      await m.deleteUser(null, { id: 1 }, mockCtx, mockInfo);
    });
  });

  describe('candidatesResolvers', () => {
    it('should execute Query, Mutation and Candidate field resolvers', async () => {
      const q = candidatesResolvers.Query;
      const m = candidatesResolvers.Mutation;
      const c = candidatesResolvers.Candidate;

      await q.allCandidates(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getCandidateById(null, { id: 2 }, mockCtx, mockInfo);
      await q.findCandidateByUserId(null, { userId: 1 }, mockCtx, mockInfo);
      await q.allCandidatesPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);

      await m.createCandidate(null, { input: { name: 'John' } }, mockCtx, mockInfo);
      await m.updateCandidate(null, { id: 2, input: { name: 'John' } }, mockCtx, mockInfo);
      await m.deleteCandidate(null, { id: 2 }, mockCtx, mockInfo);

      await c.user({ user_id: 1 }, {}, mockCtx, mockInfo);
      await c.resume({ id: 2 }, {}, mockCtx, mockInfo);
      await c.locale({ address: 'Main St' }, {}, mockCtx, mockInfo);
      await c.contact({ phone: '123456' }, {}, mockCtx, mockInfo);
    });
  });

  describe('jobsResolvers', () => {
    it('should execute Query, Mutation and Job field resolvers', async () => {
      const q = jobsResolvers.Query;
      const m = jobsResolvers.Mutation;
      const j = jobsResolvers.Job;

      await q.allJobs(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getJobById(null, { id: 4 }, mockCtx, mockInfo);
      await q.getJobByCompanyId(null, { companyId: 3 }, mockCtx, mockInfo);
      await q.listJobRandomFeatured(null, {}, mockCtx, mockInfo);
      await q.allJobsFeatured(null, { featured: true }, mockCtx, mockInfo);
      await q.getJobByIdAndCompanyId(null, { id: 4, companyId: 3 }, mockCtx, mockInfo);
      await q.myJobs(null, {}, { ...mockCtx, authorization: 'Bearer tok', user: { firebase_uuid: 'fb1' } }, mockInfo);
      await q.allJobsPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);

      await m.createJob(null, { input: { title: 'Dev' } }, mockCtx, mockInfo);
      await m.updateJob(null, { id: 4, input: { title: 'Dev' } }, mockCtx, mockInfo);
      await m.deleteJob(null, { id: 4 }, mockCtx, mockInfo);
      await m.subscribeInJob(null, { input: { jobId: 4, candidateId: 2 } }, mockCtx, mockInfo);

      await j.company({ company_id: 3 }, {}, mockCtx, mockInfo);
    });
  });

  describe('resumesResolvers', () => {
    it('should execute Query, Mutation and Resume field resolvers', async () => {
      const q = resumesResolvers.Query;
      const m = resumesResolvers.Mutation;
      const r = resumesResolvers.Resume;

      await q.allResumes(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getResumeById(null, { id: 5 }, mockCtx, mockInfo);
      await q.allResumesPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);

      await m.createResume(null, { input: { candidateId: 2 } }, mockCtx, mockInfo);
      await m.updateResume(null, { id: 5, input: { candidateId: 2 } }, mockCtx, mockInfo);
      await m.deleteResume(null, { id: 5 }, mockCtx, mockInfo);

      await r.candidate({ candidate_id: 2 }, {}, mockCtx, mockInfo);
      await r.educations({ id: 5 }, {}, mockCtx, mockInfo);
      await r.experiences({ id: 5 }, {}, mockCtx, mockInfo);
      await r.skills({ id: 5 }, {}, mockCtx, mockInfo);
    });
  });

  describe('companiesResolvers', () => {
    it('should execute Query, Mutation and Company field resolvers', async () => {
      const q = companiesResolvers.Query;
      const m = companiesResolvers.Mutation;
      const c = companiesResolvers.Company;

      await q.allCompanies(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getCompanyById(null, { id: 3 }, mockCtx, mockInfo);
      await q.listCompanyRandomLogos(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.allCompaniesPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);

      await m.createCompany(null, { input: { name: 'Corp' } }, mockCtx, mockInfo);
      await m.updateCompany(null, { id: 3, input: { name: 'Corp' } }, mockCtx, mockInfo);
      await m.deleteCompany(null, { id: 3 }, mockCtx, mockInfo);

      await c.user({ user_id: 1 }, {}, mockCtx, mockInfo);
      await c.medias({ id: 3 }, {}, mockCtx, mockInfo);
      await c.locale({ address: 'St' }, {}, mockCtx, mockInfo);
      await c.contact({ phone: '123' }, {}, mockCtx, mockInfo);
    });
  });

  describe('selectiveProcessesResolvers', () => {
    it('should execute Query, Mutation and SelectiveProcess field resolvers', async () => {
      const q = selectiveProcessesResolvers.Query;
      const m = selectiveProcessesResolvers.Mutation;
      const sp = selectiveProcessesResolvers.SelectiveProcess;

      await q.allSelectiveProcesses(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getSelectiveProcessById(null, { id: 7 }, mockCtx, mockInfo);
      await q.mySelectiveProcessesSubscribed(null, {}, { ...mockCtx, authorization: 'Bearer tok', user: { firebase_uuid: 'fb1' } }, mockInfo);
      await q.mySelectiveProcesses(null, {}, { ...mockCtx, authorization: 'Bearer tok', user: { firebase_uuid: 'fb1' } }, mockInfo);
      await q.allSelectiveProcessesPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);

      await m.createSelectiveProcess(null, { input: { title: 'SP' } }, mockCtx, mockInfo);
      await m.updateSelectiveProcess(null, { id: 7, input: { title: 'SP' } }, mockCtx, mockInfo);
      await m.deleteSelectiveProcess(null, { id: 7 }, mockCtx, mockInfo);
      await m.subscribeInSelectiveProcess(null, { input: { spId: 7, candidateId: 2 } }, mockCtx, mockInfo);

      await sp.job({ job_id: 4 }, {}, mockCtx, mockInfo);
    });
  });

  describe('blogsResolvers', () => {
    it('should execute Query, Mutation, Blog and Comment field resolvers', async () => {
      const q = blogsResolvers.Query;
      const m = blogsResolvers.Mutation;
      const b = blogsResolvers.Blog;
      const c = blogsResolvers.Comment;
      const tag = blogsResolvers.Tag;
      const pic = blogsResolvers.Picture;
      const cat = blogsResolvers.Category;

      await q.allBlogs(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getBlogById(null, { id: 8 }, mockCtx, mockInfo);
      await q.allBlogsPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);
      await q.debugBlog(null, {}, mockCtx, mockInfo);
      await q.allComments(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getCommentById(null, { id: 9 }, mockCtx, mockInfo);
      await q.allCommentsPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);
      await q.allBlogsCategories(null, {}, mockCtx, mockInfo);
      await q.allBlogsTimePeriods(null, {}, mockCtx, mockInfo);
      await q.allBlogsRecents(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.allCommentsRecents(null, { start: 0, max: 5 }, mockCtx, mockInfo);

      await m.createBlog(null, { input: { title: 'Blog' } }, mockCtx, mockInfo);
      await m.updateBlog(null, { id: 8, input: { title: 'Blog' } }, mockCtx, mockInfo);
      await m.deleteBlog(null, { id: 8 }, mockCtx, mockInfo);
      await m.createComment(null, { input: { blogId: 8, content: 'C' } }, mockCtx, mockInfo);
      await m.updateComment(null, { id: 9, input: { content: 'C' } }, mockCtx, mockInfo);
      await m.deleteComment(null, { id: 9 }, mockCtx, mockInfo);

      await b.author({ author_id: 6 }, {}, mockCtx, mockInfo);
      await b.comments({ id: 8 }, {}, mockCtx, mockInfo);
      await b.pictures({ id: 8 }, {}, mockCtx, mockInfo);
      await b.tags({ id: 8 }, {}, mockCtx, mockInfo);
      await b.categories({ id: 8 }, {}, mockCtx, mockInfo);
      await tag.blog({ id: 8 }, {}, mockCtx, mockInfo);
      await pic.blog({ id: 8 }, {}, mockCtx, mockInfo);
      await cat.blog({ id: 8 }, {}, mockCtx, mockInfo);
      await c.blog({ id: 9 }, {}, mockCtx, mockInfo);
      await c.parentComment({ parentId: 9 }, {}, mockCtx, mockInfo);
    });
  });

  describe('authorsResolvers', () => {
    it('should execute Query, Mutation, Author and AuthorMedia field resolvers', async () => {
      const q = authorsResolvers.Query;
      const m = authorsResolvers.Mutation;
      const a = authorsResolvers.Author;
      const am = authorsResolvers.AuthorMedia;

      await q.allAuthors(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getAuthorById(null, { id: 6 }, mockCtx, mockInfo);
      await q.allAuthorsPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);
      await q.debugAuthor(null, {}, mockCtx, mockInfo);

      await m.createAuthor(null, { input: { name: 'A' } }, mockCtx, mockInfo);
      await m.updateAuthor(null, { id: 6, input: { name: 'A' } }, mockCtx, mockInfo);
      await m.deleteAuthor(null, { id: 6 }, mockCtx, mockInfo);

      await a.medias({ id: 6 }, {}, mockCtx, mockInfo);
      await am.author({ id: 6 }, {}, mockCtx, mockInfo);
    });
  });

  describe('membersResolvers', () => {
    it('should execute Query, Mutation, Member and MemberMedia field resolvers', async () => {
      const q = membersResolvers.Query;
      const m = membersResolvers.Mutation;
      const mem = membersResolvers.Member;
      const mm = membersResolvers.MemberMedia;

      await q.allMembers(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getMemberById(null, { id: 10 }, mockCtx, mockInfo);
      await q.allMembersPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);

      await m.createMember(null, { input: { name: 'M' } }, mockCtx, mockInfo);
      await m.updateMember(null, { id: 10, input: { name: 'M' } }, mockCtx, mockInfo);
      await m.deleteMember(null, { id: 10 }, mockCtx, mockInfo);

      await mem.medias({ id: 10 }, {}, mockCtx, mockInfo);
      await mm.owner({ id: 10 }, {}, mockCtx, mockInfo);
    });
  });

  describe('jaasResolvers', () => {
    it('should execute Query, Mutation and JAASUser field resolvers', async () => {
      const q = jaasResolvers.Query;
      const m = jaasResolvers.Mutation;
      const ju = jaasResolvers.JAASUser;

      await q.allJAASUsers(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getJAASUserById(null, { id: 11 }, mockCtx, mockInfo);
      await q.allJAASUsersPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);
      await q.allJAASRoles(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getJAASRoleByName(null, { name: 'ADMIN' }, mockCtx, mockInfo);
      await q.allJAASRolesPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);

      await m.createJAASUser(null, { input: { username: 'j' } }, mockCtx, mockInfo);
      await m.updateJAASUser(null, { id: 11, input: { username: 'j' } }, mockCtx, mockInfo);
      await m.deleteJAASUser(null, { id: 11 }, mockCtx, mockInfo);
      await m.createJAASRole(null, { input: { roleName: 'R' } }, mockCtx, mockInfo);
      await m.updateJAASRole(null, { id: 12, input: { roleName: 'R' } }, mockCtx, mockInfo);
      await m.deleteJAASRole(null, { id: 12 }, mockCtx, mockInfo);

      await ju.roles({ id: 11 }, {}, mockCtx, mockInfo);
    });
  });

  describe('formsResolvers', () => {
    it('should execute Query and Mutation for Forms', async () => {
      const q = formsResolvers.Query;
      const m = formsResolvers.Mutation;

      await q.allForms(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getFormById(null, { id: 13 }, mockCtx, mockInfo);
      await q.allFormsPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);

      await m.createForm(null, { input: { message: 'F' } }, mockCtx, mockInfo);
      await m.updateForm(null, { id: 13, input: { message: 'F' } }, mockCtx, mockInfo);
      await m.deleteForm(null, { id: 13 }, mockCtx, mockInfo);
    });
  });

  describe('subscribersResolvers', () => {
    it('should execute Query and Mutation for Subscribers', async () => {
      const q = subscribersResolvers.Query;
      const m = subscribersResolvers.Mutation;

      await q.allSubscribers(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getSubscriberById(null, { id: 14 }, mockCtx, mockInfo);
      await q.allSubscribersPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);

      await m.createSubscriber(null, { input: { email: 's@w.com' } }, mockCtx, mockInfo);
      await m.updateSubscriber(null, { id: 14, input: { email: 's@w.com' } }, mockCtx, mockInfo);
      await m.deleteSubscriber(null, { id: 14 }, mockCtx, mockInfo);
      await m.subscribeMail(null, { input: { email: 's@w.com' } }, mockCtx, mockInfo);
    });
  });

  describe('testimonialsResolvers', () => {
    it('should execute Query, Mutation and Testimonial field resolvers', async () => {
      const q = testimonialsResolvers.Query;
      const m = testimonialsResolvers.Mutation;
      const t = testimonialsResolvers.Testimonial;

      await q.allTestimonials(null, { start: 0, max: 5 }, mockCtx, mockInfo);
      await q.getTestimonialById(null, { id: 15 }, mockCtx, mockInfo);
      await q.allTestimonialsPaginated(null, { limit: 10, page: 1 }, mockCtx, mockInfo);

      await m.createTestimonial(null, { input: { content: 'T' } }, mockCtx, mockInfo);
      await m.updateTestimonial(null, { id: 15, input: { content: 'T' } }, mockCtx, mockInfo);
      await m.deleteTestimonial(null, { id: 15 }, mockCtx, mockInfo);

      await t.author({ authorId: 6 }, {}, mockCtx, mockInfo);
    });
  });

  describe('statsResolvers', () => {
    it('should execute Query for stats', async () => {
      const q = statsResolvers.Query;
      await q.statisticsCount(null, {}, mockCtx, mockInfo);
    });
  });

  describe('othersResolvers', () => {
    it('should validate CPF in Query', async () => {
      const q = othersResolvers.Query;
      expect(q.validateCPF(null, { cpf: '52998224725' }, mockCtx, mockInfo)).toBe(true);
    });
  });
});
