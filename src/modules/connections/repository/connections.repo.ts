import { ConnectionRequest, Connection, Follow } from '../../../models';

const connectionsRepository = (db: any) => {
  const sendConnectionRequest = async (requesterId: number, recipientId: number) => {
    if (requesterId === recipientId) {
      throw new Error('Cannot send connection request to yourself');
    }

    const existing = await ConnectionRequest.findOne({
      where: { requester_id: requesterId, recipient_id: recipientId, status: 'PENDING' }
    });

    if (existing) {
      return existing;
    }

    return await ConnectionRequest.create({
      requester_id: requesterId,
      recipient_id: recipientId,
      status: 'PENDING'
    });
  };

  const acceptConnectionRequest = async (requestId: number, recipientId: number) => {
    const request = await ConnectionRequest.findOne({
      where: { id: requestId, recipient_id: recipientId, status: 'PENDING' }
    });

    if (!request) {
      throw new Error(`Pending connection request with id ${requestId} not found`);
    }

    await request.update({ status: 'ACCEPTED' });

    const connection = await Connection.create({
      user_id_1: Math.min(request.requester_id, recipientId),
      user_id_2: Math.max(request.requester_id, recipientId)
    });

    return { request, connection };
  };

  const rejectConnectionRequest = async (requestId: number, recipientId: number) => {
    const request = await ConnectionRequest.findOne({
      where: { id: requestId, recipient_id: recipientId, status: 'PENDING' }
    });

    if (!request) {
      throw new Error(`Pending connection request with id ${requestId} not found`);
    }

    await request.update({ status: 'REJECTED' });
    return request;
  };

  const followUser = async (followerId: number, followingId: number) => {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    const existing = await Follow.findOne({
      where: { follower_id: followerId, following_id: followingId }
    });

    if (existing) return existing;

    return await Follow.create({
      follower_id: followerId,
      following_id: followingId
    });
  };

  const unfollowUser = async (followerId: number, followingId: number) => {
    const existing = await Follow.findOne({
      where: { follower_id: followerId, following_id: followingId }
    });

    if (existing) {
      await existing.destroy();
      return true;
    }
    return false;
  };

  const getConnections = async (userId: number) => {
    const conns = await Connection.findAll({
      where: {
        [db.Sequelize.Op?.or || '$or']: [
          { user_id_1: userId },
          { user_id_2: userId }
        ]
      }
    });

    return conns;
  };

  const getPendingRequests = async (userId: number) => {
    return await ConnectionRequest.findAll({
      where: { recipient_id: userId, status: 'PENDING' }
    });
  };

  const getSocialDistanceDegree = async (userId1: number, userId2: number): Promise<string> => {
    if (userId1 === userId2) return 'DEGREE_0';

    // Check 1st degree
    const isDirect = await Connection.findOne({
      where: {
        user_id_1: Math.min(userId1, userId2),
        user_id_2: Math.max(userId1, userId2)
      }
    });

    if (isDirect) return 'DEGREE_1';

    // Check 2nd degree (mutual connections)
    const user1Connections = await getConnections(userId1);
    const user1FriendIds = user1Connections.map((c: any) => c.user_id_1 === userId1 ? c.user_id_2 : c.user_id_1);

    if (user1FriendIds.length > 0) {
      const isMutual = await Connection.findOne({
        where: {
          [db.Sequelize.Op?.or || '$or']: [
            { user_id_1: userId2, user_id_2: user1FriendIds },
            { user_id_2: userId2, user_id_1: user1FriendIds }
          ]
        }
      });

      if (isMutual) return 'DEGREE_2';
    }

    return 'DEGREE_3';
  };

  return {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    followUser,
    unfollowUser,
    getConnections,
    getPendingRequests,
    getSocialDistanceDegree
  };
};

export default connectionsRepository;
