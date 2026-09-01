import connectionsRepository from '../repository/connections.repo';
import ConnectionDTO from '../../../dtos/ConnectionDTO';
import ConnectionRequestDTO from '../../../dtos/ConnectionRequestDTO';
import UserDTO from '../../../dtos/UserDTO';

const connectionsResolvers = {
  Query: {
    myConnections: async (parent: any, args: any, ctx: any, info: any) => {
      const list = await connectionsRepository(ctx.orm).getConnections(args.userId);
      return list.map((c: any) => new ConnectionDTO(c));
    },
    pendingConnectionRequests: async (parent: any, args: any, ctx: any, info: any) => {
      const list = await connectionsRepository(ctx.orm).getPendingRequests(args.userId);
      return list.map((r: any) => new ConnectionRequestDTO(r));
    },
    socialDistanceDegree: async (parent: any, args: any, ctx: any, info: any) => {
      const degree = await connectionsRepository(ctx.orm).getSocialDistanceDegree(args.userId1, args.userId2);
      return degree;
    }
  },
  Mutation: {
    sendConnectionRequest: async (parent: any, args: any, ctx: any, info: any) => {
      const req = await connectionsRepository(ctx.orm).sendConnectionRequest(args.requesterId, args.recipientId);
      return new ConnectionRequestDTO(req);
    },
    acceptConnectionRequest: async (parent: any, args: any, ctx: any, info: any) => {
      const result = await connectionsRepository(ctx.orm).acceptConnectionRequest(args.requestId, args.recipientId);
      return new ConnectionDTO(result.connection);
    },
    rejectConnectionRequest: async (parent: any, args: any, ctx: any, info: any) => {
      const req = await connectionsRepository(ctx.orm).rejectConnectionRequest(args.requestId, args.recipientId);
      return new ConnectionRequestDTO(req);
    },
    followUser: async (parent: any, args: any, ctx: any, info: any) => {
      const follow = await connectionsRepository(ctx.orm).followUser(args.followerId, args.followingId);
      return !!follow;
    },
    unfollowUser: async (parent: any, args: any, ctx: any, info: any) => {
      const deleted = await connectionsRepository(ctx.orm).unfollowUser(args.followerId, args.followingId);
      return deleted;
    }
  },
  Connection: {
    user1: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.userId1) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.userId1, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    },
    user2: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.userId2) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.userId2, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    }
  },
  ConnectionRequest: {
    requester: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.requesterId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.requesterId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    },
    recipient: async (parent: any, args: any, ctx: any, info: any) => {
      if (!parent.recipientId) return null;
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.recipientId, info });
      return users && users[0] ? new UserDTO(users[0]) : null;
    }
  }
};

export default connectionsResolvers;

