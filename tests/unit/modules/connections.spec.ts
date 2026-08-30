import connectionsRepository from '../../../src/modules/connections/repository/connections.repo';
import connectionsResolvers from '../../../src/modules/connections/graphql/connections.resolvers';
import ConnectionDTO from '../../../src/dtos/ConnectionDTO';
import ConnectionRequestDTO from '../../../src/dtos/ConnectionRequestDTO';
import { ConnectionRequest, Connection, Follow } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  ConnectionRequest: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  Connection: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  Follow: {
    create: jest.fn(),
    findOne: jest.fn()
  }
}));

describe('Connections Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      orm: {
        Sequelize: { Op: { or: Symbol('or') } }
      }
    };
  });

  describe('connectionsRepository', () => {
    it('should throw error when sending connection request to oneself', async () => {
      const repo = connectionsRepository(mockCtx.orm);
      await expect(repo.sendConnectionRequest(1, 1)).rejects.toThrow('Cannot send connection request to yourself');
    });

    it('should return existing pending connection request', async () => {
      const mockReq = { id: 1, requester_id: 1, recipient_id: 2, status: 'PENDING' };
      (ConnectionRequest.findOne as jest.Mock).mockResolvedValue(mockReq);

      const repo = connectionsRepository(mockCtx.orm);
      const result = await repo.sendConnectionRequest(1, 2);

      expect(result).toEqual(mockReq);
    });

    it('should create new connection request', async () => {
      (ConnectionRequest.findOne as jest.Mock).mockResolvedValue(null);
      const mockCreated = { id: 2, requester_id: 1, recipient_id: 2, status: 'PENDING' };
      (ConnectionRequest.create as jest.Mock).mockResolvedValue(mockCreated);

      const repo = connectionsRepository(mockCtx.orm);
      const result = await repo.sendConnectionRequest(1, 2);

      expect(result).toEqual(mockCreated);
    });

    it('should accept connection request and create connection', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(true);
      const mockReq = { id: 1, requester_id: 1, recipient_id: 2, status: 'PENDING', update: mockUpdate };
      (ConnectionRequest.findOne as jest.Mock).mockResolvedValue(mockReq);

      const mockConn = { id: 10, user_id_1: 1, user_id_2: 2 };
      (Connection.create as jest.Mock).mockResolvedValue(mockConn);

      const repo = connectionsRepository(mockCtx.orm);
      const result = await repo.acceptConnectionRequest(1, 2);

      expect(mockUpdate).toHaveBeenCalledWith({ status: 'ACCEPTED' });
      expect(result.connection).toEqual(mockConn);
    });

    it('should throw error when accepting missing connection request', async () => {
      (ConnectionRequest.findOne as jest.Mock).mockResolvedValue(null);

      const repo = connectionsRepository(mockCtx.orm);
      await expect(repo.acceptConnectionRequest(99, 2)).rejects.toThrow('Pending connection request with id 99 not found');
    });

    it('should reject connection request', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(true);
      const mockReq = { id: 1, requester_id: 1, recipient_id: 2, status: 'PENDING', update: mockUpdate };
      (ConnectionRequest.findOne as jest.Mock).mockResolvedValue(mockReq);

      const repo = connectionsRepository(mockCtx.orm);
      const result = await repo.rejectConnectionRequest(1, 2);

      expect(mockUpdate).toHaveBeenCalledWith({ status: 'REJECTED' });
      expect(result).toEqual(mockReq);
    });

    it('should throw error when rejecting missing connection request', async () => {
      (ConnectionRequest.findOne as jest.Mock).mockResolvedValue(null);

      const repo = connectionsRepository(mockCtx.orm);
      await expect(repo.rejectConnectionRequest(99, 2)).rejects.toThrow('Pending connection request with id 99 not found');
    });

    it('should follow user and return existing follow if already following', async () => {
      const repo = connectionsRepository(mockCtx.orm);
      await expect(repo.followUser(1, 1)).rejects.toThrow('Cannot follow yourself');

      const mockFollow = { id: 1, follower_id: 1, following_id: 2 };
      (Follow.findOne as jest.Mock).mockResolvedValue(mockFollow);
      const resExisting = await repo.followUser(1, 2);
      expect(resExisting).toEqual(mockFollow);

      (Follow.findOne as jest.Mock).mockResolvedValue(null);
      (Follow.create as jest.Mock).mockResolvedValue(mockFollow);
      const resNew = await repo.followUser(1, 2);
      expect(resNew).toEqual(mockFollow);
    });

    it('should unfollow user', async () => {
      const mockDestroy = jest.fn().mockResolvedValue(true);
      (Follow.findOne as jest.Mock).mockResolvedValue({ destroy: mockDestroy });

      const repo = connectionsRepository(mockCtx.orm);
      expect(await repo.unfollowUser(1, 2)).toBe(true);

      (Follow.findOne as jest.Mock).mockResolvedValue(null);
      expect(await repo.unfollowUser(1, 2)).toBe(false);
    });

    it('should calculate social distance degree (DEGREE_0, DEGREE_1, DEGREE_2, DEGREE_3)', async () => {
      const repo = connectionsRepository(mockCtx.orm);

      // DEGREE_0
      expect(await repo.getSocialDistanceDegree(1, 1)).toBe('DEGREE_0');

      // DEGREE_1
      (Connection.findOne as jest.Mock).mockResolvedValueOnce({ id: 1, user_id_1: 1, user_id_2: 2 });
      expect(await repo.getSocialDistanceDegree(1, 2)).toBe('DEGREE_1');

      // DEGREE_2 (mutual friend)
      (Connection.findOne as jest.Mock).mockResolvedValueOnce(null); // Direct connection check
      (Connection.findAll as jest.Mock).mockResolvedValueOnce([{ user_id_1: 1, user_id_2: 3 }]); // User 1's friends
      (Connection.findOne as jest.Mock).mockResolvedValueOnce({ id: 2, user_id_1: 2, user_id_2: 3 }); // Mutual connection check

      expect(await repo.getSocialDistanceDegree(1, 2)).toBe('DEGREE_2');

      // DEGREE_3 (no connection)
      (Connection.findOne as jest.Mock).mockResolvedValueOnce(null); // Direct connection check
      (Connection.findAll as jest.Mock).mockResolvedValueOnce([]); // No friends for user 1

      expect(await repo.getSocialDistanceDegree(1, 2)).toBe('DEGREE_3');
    });
  });

  describe('connectionsResolvers', () => {
    it('should resolve queries and mutations for connections', async () => {
      const mockConn = { id: 1, user_id_1: 1, user_id_2: 2 };
      const mockReq = { id: 1, requester_id: 1, recipient_id: 2, status: 'PENDING', update: jest.fn().mockResolvedValue(true) };

      (Connection.findAll as jest.Mock).mockResolvedValue([mockConn]);
      (ConnectionRequest.findAll as jest.Mock).mockResolvedValue([mockReq]);
      (ConnectionRequest.findOne as jest.Mock).mockResolvedValue(mockReq);
      (Connection.create as jest.Mock).mockResolvedValue(mockConn);
      (Follow.findOne as jest.Mock).mockResolvedValue(null);
      (Follow.create as jest.Mock).mockResolvedValue({ id: 1 });

      const q = connectionsResolvers.Query;
      const m = connectionsResolvers.Mutation;

      const conns = await q.myConnections(null, { userId: 1 }, mockCtx, {});
      expect(conns[0]).toBeInstanceOf(ConnectionDTO);

      const reqs = await q.pendingConnectionRequests(null, { userId: 2 }, mockCtx, {});
      expect(reqs[0]).toBeInstanceOf(ConnectionRequestDTO);

      (Connection.findOne as jest.Mock).mockResolvedValue(mockConn);
      const degree = await q.socialDistanceDegree(null, { userId1: 1, userId2: 2 }, mockCtx, {});
      expect(degree).toBe('DEGREE_1');

      (ConnectionRequest.findOne as jest.Mock).mockResolvedValue(null);
      (ConnectionRequest.create as jest.Mock).mockResolvedValue(mockReq);
      const sendRes = await m.sendConnectionRequest(null, { requesterId: 1, recipientId: 2 }, mockCtx, {});
      expect(sendRes).toBeInstanceOf(ConnectionRequestDTO);

      (ConnectionRequest.findOne as jest.Mock).mockResolvedValue(mockReq);
      const acceptRes = await m.acceptConnectionRequest(null, { requestId: 1, recipientId: 2 }, mockCtx, {});
      expect(acceptRes).toBeInstanceOf(ConnectionDTO);

      const rejectRes = await m.rejectConnectionRequest(null, { requestId: 1, recipientId: 2 }, mockCtx, {});
      expect(rejectRes).toBeInstanceOf(ConnectionRequestDTO);

      const followRes = await m.followUser(null, { followerId: 1, followingId: 2 }, mockCtx, {});
      expect(followRes).toBe(true);

      (Follow.findOne as jest.Mock).mockResolvedValue({ destroy: jest.fn().mockResolvedValue(true) });
      const unfollowRes = await m.unfollowUser(null, { followerId: 1, followingId: 2 }, mockCtx, {});
      expect(unfollowRes).toBe(true);
    });
  });

  describe('DTOs null check', () => {
    it('should handle null input in ConnectionDTO and ConnectionRequestDTO', () => {
      const connDto = new ConnectionDTO(null);
      expect(connDto.id).toBeUndefined();

      const reqDto = new ConnectionRequestDTO(null);
      expect(reqDto.id).toBeUndefined();
    });
  });
});
