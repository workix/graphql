import groupsRepository from '../../../src/modules/groups/repository/groups.repo';
import groupsResolvers from '../../../src/modules/groups/graphql/groups.resolvers';
import GroupDTO from '../../../src/dtos/GroupDTO';
import GroupMembershipDTO from '../../../src/dtos/GroupMembershipDTO';
import GroupPostDTO from '../../../src/dtos/GroupPostDTO';
import { Group, GroupMembership, GroupPost } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Group: {
    create: jest.fn(),
    findByPk: jest.fn()
  },
  GroupMembership: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn()
  },
  GroupPost: {
    create: jest.fn(),
    findAll: jest.fn()
  }
}));

describe('Groups Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = { orm: {} };
  });

  describe('groupsRepository', () => {
    it('should create group and assign owner as ADMIN', async () => {
      const mockGroup = { id: 1, name: 'Tech Leads', privacy: 'PUBLIC' };
      (Group.create as jest.Mock).mockResolvedValue(mockGroup);
      (GroupMembership.create as jest.Mock).mockResolvedValue({ id: 1 });

      const repo = groupsRepository(mockCtx.orm);
      const res = await repo.createGroup(10, 'Tech Leads', 'Desc', 'PUBLIC');

      expect(res).toEqual(mockGroup);
      expect(GroupMembership.create).toHaveBeenCalledWith({
        group_id: 1,
        user_id: 10,
        role: 'ADMIN',
        status: 'APPROVED'
      });
    });

    it('should get group by id', async () => {
      const mockGroup = { id: 1, name: 'Tech Leads' };
      (Group.findByPk as jest.Mock).mockResolvedValue(mockGroup);

      const repo = groupsRepository(mockCtx.orm);
      expect(await repo.getGroupById(1)).toEqual(mockGroup);
    });

    it('should throw error when joining non-existing group', async () => {
      (Group.findByPk as jest.Mock).mockResolvedValue(null);
      const repo = groupsRepository(mockCtx.orm);

      await expect(repo.joinGroup(99, 10)).rejects.toThrow('Group 99 not found');
    });

    it('should join public group with status APPROVED and private group with status PENDING', async () => {
      const mockPublicGroup = { id: 1, privacy: 'PUBLIC' };
      const mockPrivateGroup = { id: 2, privacy: 'PRIVATE' };
      const mockMem = { id: 10, group_id: 1, user_id: 5, status: 'APPROVED' };

      (GroupMembership.findOne as jest.Mock).mockResolvedValue(null);
      (GroupMembership.create as jest.Mock).mockResolvedValue(mockMem);

      const repo = groupsRepository(mockCtx.orm);

      (Group.findByPk as jest.Mock).mockResolvedValueOnce(mockPublicGroup);
      await repo.joinGroup(1, 5);
      expect(GroupMembership.create).toHaveBeenCalledWith(expect.objectContaining({ status: 'APPROVED' }));

      (Group.findByPk as jest.Mock).mockResolvedValueOnce(mockPrivateGroup);
      await repo.joinGroup(2, 5);
      expect(GroupMembership.create).toHaveBeenCalledWith(expect.objectContaining({ status: 'PENDING' }));

      // Existing membership check
      (Group.findByPk as jest.Mock).mockResolvedValueOnce(mockPublicGroup);
      (GroupMembership.findOne as jest.Mock).mockResolvedValueOnce(mockMem);
      expect(await repo.joinGroup(1, 5)).toEqual(mockMem);
    });

    it('should approve membership by admin', async () => {
      const mockUpdate = jest.fn().mockImplementation(function (this: any, fields: any) {
        Object.assign(this, fields);
        return Promise.resolve(this);
      });
      const mockMembership = { id: 1, group_id: 10, user_id: 5, status: 'PENDING', update: mockUpdate };
      (GroupMembership.findByPk as jest.Mock).mockResolvedValue(mockMembership);
      (GroupMembership.findOne as jest.Mock).mockResolvedValue({ id: 99, role: 'ADMIN' });

      const repo = groupsRepository(mockCtx.orm);
      const res = await repo.approveMembership(1, 100);

      expect(mockUpdate).toHaveBeenCalledWith({ status: 'APPROVED' });
      expect(res.status).toBe('APPROVED');
    });

    it('should throw error when approving missing membership or non-admin user', async () => {
      const repo = groupsRepository(mockCtx.orm);

      (GroupMembership.findByPk as jest.Mock).mockResolvedValueOnce(null);
      await expect(repo.approveMembership(99, 100)).rejects.toThrow('Group membership 99 not found');

      (GroupMembership.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, group_id: 10 });
      (GroupMembership.findOne as jest.Mock).mockResolvedValueOnce(null);
      await expect(repo.approveMembership(1, 100)).rejects.toThrow('Only group admins can approve memberships');
    });

    it('should create group post only for approved members', async () => {
      const mockPost = { id: 1, group_id: 10, author_id: 5, content: 'Hi' };
      (GroupPost.create as jest.Mock).mockResolvedValue(mockPost);
      (GroupPost.findAll as jest.Mock).mockResolvedValue([mockPost]);

      const repo = groupsRepository(mockCtx.orm);

      // Non-member
      (GroupMembership.findOne as jest.Mock).mockResolvedValueOnce(null);
      await expect(repo.createGroupPost(10, 5, 'Hi')).rejects.toThrow('Must be an approved member to post in this group');

      // Approved member
      (GroupMembership.findOne as jest.Mock).mockResolvedValueOnce({ id: 1, status: 'APPROVED' });
      const created = await repo.createGroupPost(10, 5, 'Hi');
      expect(created).toEqual(mockPost);

      const posts = await repo.getGroupPosts(10);
      expect(posts).toEqual([mockPost]);
    });
  });

  describe('groupsResolvers', () => {
    it('should resolve queries and mutations for groups', async () => {
      const mockGroup = { id: 1, name: 'Group' };
      const mockMem = { id: 1, group_id: 1, user_id: 5, role: 'MEMBER', status: 'APPROVED', update: jest.fn().mockResolvedValue(true) };
      const mockPost = { id: 1, group_id: 1, author_id: 5, content: 'Hi' };

      (Group.findByPk as jest.Mock).mockResolvedValue(mockGroup);
      (GroupPost.findAll as jest.Mock).mockResolvedValue([mockPost]);
      (Group.create as jest.Mock).mockResolvedValue(mockGroup);
      (GroupMembership.create as jest.Mock).mockResolvedValue(mockMem);
      (GroupMembership.findByPk as jest.Mock).mockResolvedValue(mockMem);
      (GroupMembership.findOne as jest.Mock).mockResolvedValue({ id: 99, role: 'ADMIN', update: jest.fn().mockResolvedValue(true) });
      (GroupPost.create as jest.Mock).mockResolvedValue(mockPost);

      const q = groupsResolvers.Query;
      const m = groupsResolvers.Mutation;

      const groupDto = await q.group(null, { id: 1 }, mockCtx, {});
      expect(groupDto).toBeInstanceOf(GroupDTO);

      const posts = await q.groupPosts(null, { groupId: 1 }, mockCtx, {});
      expect(posts[0]).toBeInstanceOf(GroupPostDTO);

      const createdG = await m.createGroup(null, { ownerId: 10, name: 'Group' }, mockCtx, {});
      expect(createdG).toBeInstanceOf(GroupDTO);

      const joined = await m.joinGroup(null, { groupId: 1, userId: 5 }, mockCtx, {});
      expect(joined).toBeInstanceOf(GroupMembershipDTO);

      const approved = await m.approveGroupMembership(null, { membershipId: 1, adminUserId: 10 }, mockCtx, {});
      expect(approved).toBeInstanceOf(GroupMembershipDTO);

      const posted = await m.createGroupPost(null, { groupId: 1, authorId: 5, content: 'Hi' }, mockCtx, {});
      expect(posted).toBeInstanceOf(GroupPostDTO);
    });

    it('should return null for group query when group does not exist', async () => {
      (Group.findByPk as jest.Mock).mockResolvedValue(null);
      const q = groupsResolvers.Query;

      const res = await q.group(null, { id: 99 }, mockCtx, {});
      expect(res).toBeNull();
    });
  });

  describe('DTOs null check', () => {
    it('should handle null input gracefully', () => {
      const gNull = new GroupDTO(null);
      expect(gNull.id).toBeUndefined();

      const mNull = new GroupMembershipDTO(null);
      expect(mNull.id).toBeUndefined();

      const pNull = new GroupPostDTO(null);
      expect(pNull.id).toBeUndefined();
    });

    it('should map camelCase fields when snake_case is absent', () => {
      const now = new Date();
      const p = new GroupPostDTO({ id: 2, groupId: 20, authorId: 8, content: 'x', createdAt: now });
      expect(p.groupId).toBe(20);
      expect(p.authorId).toBe(8);
      expect(p.createdAt).toBe(now);
    });
  });
});
