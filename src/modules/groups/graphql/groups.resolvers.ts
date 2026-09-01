import groupsRepository from '../repository/groups.repo';
import GroupDTO from '../../../dtos/GroupDTO';
import GroupMembershipDTO from '../../../dtos/GroupMembershipDTO';
import GroupPostDTO from '../../../dtos/GroupPostDTO';
import UserDTO from '../../../dtos/UserDTO';

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
  },
  Group: {
    owner: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.ownerId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.ownerId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    }
  },
  GroupMembership: {
    user: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.userId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.userId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    },
    group: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.groupId) return null;
      const groups = await ctx.dataloaders.groupsLoader.load({ key: parent.groupId, info });
      return groups && groups[0] ? new GroupDTO(groups[0]) : null;
    }
  },
  GroupPost: {
    author: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.authorId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.authorId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    },
    group: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.groupId) return null;
      const groups = await ctx.dataloaders.groupsLoader.load({ key: parent.groupId, info });
      return groups && groups[0] ? new GroupDTO(groups[0]) : null;
    }
  }
};

export default groupsResolvers;

