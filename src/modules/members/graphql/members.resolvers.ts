import MemberDTO from "../../../dtos/MemberDTO";
import membersRepository from "../repository/members.repo";
// import { Member } from '../../../models';
import MediaDTO from '../../../dtos/MediaDTO'

const membersResolvers = {
  Query: {
    allMembers: async (parent, args, ctx, info) => {
      let members = await membersRepository(ctx.orm).findAll(info, args)
      members = members.map(m => new MemberDTO(m))
      return members;
    },
    getMemberById: async (parent, args, ctx, info) => {
      const member = await membersRepository(ctx.orm).findById(info, args)
      return new MemberDTO(member);
    },
    allMembersPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await membersRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },
  },
  Mutation: {
    createMember: async (parent, args, ctx, info) => {
      const member = await membersRepository(ctx.orm).create(args)
      return new MemberDTO(member);
    },
    deleteMember: async (parent, args, ctx, info) => {
      const deleted = await membersRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateMember: async (parent, args, ctx, info) => {
      const member = await membersRepository(ctx.orm).update(args)
      return new MemberDTO(member);
    }
  },
  Member: {
    medias: async (parent, args, ctx, info) => {
      let medias = await ctx.dataloaders.memberMediaLoader.load({ key: parent.id, info })
      medias = medias.map(m => new MediaDTO(m))
      return medias;
    }
  },
  MemberMedia: {
    owner: async (parent, args, ctx, info) => {
      const members = await ctx.dataloaders.membersLoader.load({ key: parent.id, info })
      return new MemberDTO(members[0]);
    }
  }
}

export default membersResolvers;
