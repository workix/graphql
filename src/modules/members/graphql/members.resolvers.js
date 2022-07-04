import membersRepository from "../repository/members.repo";
// import { Member } from '../../../models';

const membersResolvers = {
  Query: {
    allMembers: async (parent, args, ctx, info) => {
      const members = await membersRepository(ctx.orm).findAll(info, args)
      return members;
    },
    getMemberById: async (parent, args, ctx, info) => {
      const member = await membersRepository(ctx.orm).findById(info, args)
      return member;
    },
    allMembersPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await membersRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },
  },
  Mutation: {
    createMember: async (parent, args, ctx, info) => {
      const member = await membersRepository(ctx.orm).create(args)
      return member;
    },
    deleteMember: async (parent, args, ctx, info) => {
      const deleted = await membersRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateMember: async (parent, args, ctx, info) => {
      const member = await membersRepository(ctx.orm).update(args)
      return member;
    }
  },
  Member: {
    medias: async (parent, args, ctx, info) => {
      const medias = await ctx.dataloaders.memberMediaLoader.load({ key: parent.id, info })
      return medias;
    }
  },
  MemberMedia: {
    owner: async (parent, args, ctx, info) => {
      const members = await ctx.dataloaders.membersLoader.load({ key: parent.id, info })
      return members[0];
    }
  }
}

export default membersResolvers;