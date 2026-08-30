import { Group, GroupMembership, GroupPost } from '../../../models';

const groupsRepository = (db: any) => {
  const createGroup = async (ownerId: number, name: string, description?: string, privacy = 'PUBLIC') => {
    const group = await Group.create({
      name,
      description,
      privacy,
      owner_id: ownerId
    });

    await GroupMembership.create({
      group_id: group.id,
      user_id: ownerId,
      role: 'ADMIN',
      status: 'APPROVED'
    });

    return group;
  };

  const getGroupById = async (id: number) => {
    return await Group.findByPk(id);
  };

  const joinGroup = async (groupId: number, userId: number) => {
    const group = await Group.findByPk(groupId);
    if (!group) {
      throw new Error(`Group ${groupId} not found`);
    }

    const existing = await GroupMembership.findOne({
      where: { group_id: groupId, user_id: userId }
    });

    if (existing) return existing;

    const status = group.privacy === 'PRIVATE' ? 'PENDING' : 'APPROVED';
    return await GroupMembership.create({
      group_id: groupId,
      user_id: userId,
      role: 'MEMBER',
      status
    });
  };

  const approveMembership = async (membershipId: number, adminUserId: number) => {
    const membership = await GroupMembership.findByPk(membershipId);
    if (!membership) {
      throw new Error(`Group membership ${membershipId} not found`);
    }

    const adminMem = await GroupMembership.findOne({
      where: { group_id: membership.group_id, user_id: adminUserId, role: 'ADMIN', status: 'APPROVED' }
    });

    if (!adminMem) {
      throw new Error('Only group admins can approve memberships');
    }

    await membership.update({ status: 'APPROVED' });
    return membership;
  };

  const createGroupPost = async (groupId: number, authorId: number, content: string) => {
    const membership = await GroupMembership.findOne({
      where: { group_id: groupId, user_id: authorId, status: 'APPROVED' }
    });

    if (!membership) {
      throw new Error('Must be an approved member to post in this group');
    }

    return await GroupPost.create({
      group_id: groupId,
      author_id: authorId,
      content
    });
  };

  const getGroupPosts = async (groupId: number, limit = 20, offset = 0) => {
    return await GroupPost.findAll({
      where: { group_id: groupId },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
  };

  return {
    createGroup,
    getGroupById,
    joinGroup,
    approveMembership,
    createGroupPost,
    getGroupPosts
  };
};

export default groupsRepository;
