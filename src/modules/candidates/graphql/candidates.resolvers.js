import candidatesRepository from "../repository/candidates.repo";
import notification from "../services/notification.service";
import CandidateDTO from '../../../dtos/CandidateDTO'
import UserDTO from '../../../dtos/UserDTO'
import ResumeDTO from '../../../dtos/ResumeDTO'

const candidatesResolvers = {
  Query: {
    allCandidates: async (parent, args, ctx, info) => {
      let candidates = await candidatesRepository(ctx.orm).findAll(info, args)
      candidates = candidates.map(c => new CandidateDTO(c))
      return candidates;
    },
    getCandidateById: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).findById(info, args)
      return new CandidateDTO(candidate);
    },
    allCandidatesPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await candidatesRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    }

  },
  Mutation: {
    createCandidate: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).create(args)
      return new CandidateDTO(candidate);
    },
    deleteCandidate: async (parent, args, ctx, info) => {
      const deleted = await candidatesRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateCandidate: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).update(args)
      return new CandidateDTO(candidate);
    },
    notifyCandidate: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).findByUserId(info, args)

      const message = { action: "contact", type: args.input.type, candidate }

      await ctx.mqserver.publishInQueue('notifications', JSON.stringify(message));

      return true
    }
  },
  Candidate: {
    user: async (parent, args, ctx, info) => {
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.userId, info })
      return new UserDTO(users[0]);
    },
    resume: async (parent, args, ctx, info) => {
      const resumes = await ctx.dataloaders.resumesLoader.load({ key: parent.id, info })
      return new ResumeDTO(resumes[0]);
    }
  }
}

export default candidatesResolvers;