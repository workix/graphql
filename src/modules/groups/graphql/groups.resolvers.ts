import groupsRepository from '../repository/groups.repo';
import GroupDTO from '../../../dtos/GroupDTO';
import GroupMembershipDTO from '../../../dtos/GroupMembershipDTO';
import GroupPostDTO from '../../../dtos/GroupPostDTO';

const groupsResolvers = {
  Query: {
    group: async (parent: any, args: any, ctx: any, info: any) => {
      const g = await groupsRepository(ctx.orm).getGroupById(args.id);
      return g ? new GroupDTO(g) : null;
    },
    groupPosts: async (parent: any, args: any, ctx: any, info: any) => {
      const posts = await groupsRepository(ctx.orm).getGroupPosts(args.groupId, args.limit, args.offset);
      return posts.map((p: any) => new GroupPostDTO(p));
    }
  },
  Mutation: {
    createGroup: async (parent: any, args: any, ctx: any, info: any) => {
      const group = await groupsRepository(ctx.orm).createGroup(
        args.ownerId,
        args.name,
        args.description,
        args.privacy
      );
      return new GroupDTO(group);
    },
    joinGroup: async (parent: any, args: any, ctx: any, info: any) => {
      const mem = await groupsRepository(ctx.orm).joinGroup(args.groupId, args.userId);
      return new GroupMembershipDTO(mem);
    },
    approveGroupMembership: async (parent: any, args: any, ctx: any, info: any) => {
      const mem = await groupsRepository(ctx.orm).approveMembership(args.membershipId, args.adminUserId);
      return new GroupMembershipDTO(mem);
    },
    createGroupPost: async (parent: any, args: any, ctx: any, info: any) => {
      const post = await groupsRepository(ctx.orm).createGroupPost(args.groupId, args.authorId, args.content);
      return new GroupPostDTO(post);
    }
  }
};

export default groupsResolvers;
