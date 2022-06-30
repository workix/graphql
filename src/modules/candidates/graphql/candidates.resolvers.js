import candidatesRepository from "../repository/candidates.repo";
import notification from "../services/notification.service";

const candidatesResolvers = {
  Query: {
    allCandidates: async (parent, args, ctx, info) => {
      const candidates = await candidatesRepository(ctx.orm).findAll(info, args)
      return candidates;
    },
    getCandidateById: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).findById(info, args)
      return candidate;
    },
    allCandidatesPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await candidatesRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    }

  },
  Mutation: {
    createCandidate: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).create(args)
      return candidate;
    },
    deleteCandidate: async (parent, args, ctx, info) => {
      const deleted = await candidatesRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateCandidate: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).update(args)
      return candidate;
    },
    notifyCandidate: async (parent, args, ctx, info) => {
      await notification(ctx.orm)
    }
  },
  Candidate: {
    user: async (parent, args, ctx, info) => {
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.user_id, info })
      return users[0];
    },
    resume: async (parent, args, ctx, info) => {
      const resumes = await ctx.dataloaders.resumesLoader.load({ key: parent.id, info })
      return resumes[0];
    }
  }
}

export default candidatesResolvers;