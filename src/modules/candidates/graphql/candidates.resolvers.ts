import candidatesRepository from "../repository/candidates.repo";
import CandidateDTO from '../../../dtos/CandidateDTO'
import UserDTO from '../../../dtos/UserDTO'
import ResumeDTO from '../../../dtos/ResumeDTO'
import { setRedis, redisClient } from '../../../factory/redis_server'

const candidatesResolvers = {
  Query: {
    allCandidates: async (parent, args, ctx, info) => {
      let candidates = await candidatesRepository(ctx.orm).findAll(info, args)
      candidates = candidates.map(c => new CandidateDTO(c))      
      return candidates;
    },
    allCandidatesRedis: async (parent, args, ctx, info) => {

      const keys = await redisClient.keys('candidate*');

      let parsedValues;

      if (keys) {
        const values = await redisClient.mget(keys);
        parsedValues = values.map(v => JSON.parse(v))
      }

      let candidates = parsedValues || [];
      candidates = candidates.map(c => new CandidateDTO(c))
      return candidates;
    },
    getCandidateById: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).findById(info, args)
      return new CandidateDTO(candidate);
    },
    findCandidateByUserId: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).findByUserId(info, args)
      return new CandidateDTO(candidate);
    },
    allCandidatesPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await candidatesRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },
    myVisibilitySettings: async (parent, args, ctx, info) => {
      const { visibilityService } = require('../services/visibility.service');
      const settings = await visibilityService.getSettings(args.candidateId);
      return {
        id: settings.id,
        candidateId: settings.candidate_id,
        searchableByRecruiters: settings.searchable_by_recruiters,
        openToWorkVisible: settings.open_to_work_visible,
        showAsViewed: settings.show_as_viewed
      };
    }
  },
  Mutation: {
    createCandidate: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).create(args)
      // candidate-${idCandidate}
      await setRedis(`candidate-${candidate.id}`, JSON.stringify(candidate));
      return new CandidateDTO(candidate);
    },
    deleteCandidate: async (parent, args, ctx, info) => {
      const deleted = await candidatesRepository(ctx.orm).destroy(args)
      // candidate-${idCandidate}
      await setRedis(`candidate-${args.id}`, null);
      return deleted;
    },
    updateCandidate: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).update(args)
      // candidate-${idCandidate}
      await setRedis(`candidate-${candidate.id}`, JSON.stringify(candidate));
      return new CandidateDTO(candidate);
    },
    updateVisibilitySettings: async (parent, args, ctx, info) => {
      const { visibilityService } = require('../services/visibility.service');
      const settings = await visibilityService.updateSettings(args.candidateId, {
        searchable_by_recruiters: args.input.searchableByRecruiters,
        open_to_work_visible: args.input.openToWorkVisible,
        show_as_viewed: args.input.showAsViewed
      });
      return {
        id: settings.id,
        candidateId: settings.candidate_id,
        searchableByRecruiters: settings.searchable_by_recruiters,
        openToWorkVisible: settings.open_to_work_visible,
        showAsViewed: settings.show_as_viewed
      };
    },
    notifyCandidate: async (parent, args, ctx, info) => {
      const candidate = await candidatesRepository(ctx.orm).findByUserId(info, args)

      const message = { action: "contact", type: args.input.type, candidate }

      await ctx.mqserver.publishInQueue('notifications', JSON.stringify(message));

      return true
    }
  },
  Candidate: {
    locale: async (parent, args, ctx, info) => {
      const { city, state, neighborhood, number, street, zipCode } = parent
      return {
        city, state, neighborhood, number, street, zipCode
      }
    },
    contact: async (parent, args, ctx, info) => {
      const { mobilePhone } = parent
      return {
        mobilePhone
      }
    },
    user: async (parent, args, ctx, info) => {
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.userId, info })
      return new UserDTO(users[0]);
    },
    resume: async (parent, args, ctx, info) => {
      const resumes = await ctx.dataloaders.resumesLoader.load({ key: parent.id, info })
      return new ResumeDTO(resumes[0]);
    },
    visibilitySettings: async (parent, args, ctx, info) => {
      const { visibilityService } = require('../services/visibility.service');
      const settings = await visibilityService.getSettings(parent.id);
      return {
        id: settings.id,
        candidateId: settings.candidate_id,
        searchableByRecruiters: settings.searchable_by_recruiters,
        openToWorkVisible: settings.open_to_work_visible,
        showAsViewed: settings.show_as_viewed
      };
    }
  }
}

export default candidatesResolvers;
