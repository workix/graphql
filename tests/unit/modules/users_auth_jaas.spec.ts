import usersRepository from '../../../src/modules/users/repository/users.repo';
import authRepository from '../../../src/modules/auth/repository/auth.repo';
import jaasUsersRepository from '../../../src/modules/jaas/repository/jaas_users.repo';
import jaasRolesRepository from '../../../src/modules/jaas/repository/jaas_roles.repo';
import { User, JAASUser, JAASRole } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  User: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  JAASUser: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  JAASRole: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  }
}));

describe('Modules - Users, Auth & JAAS Repositories', () => {
  let mockDb: any;
  let mockInfo: any;

  beforeEach(() => {
    mockDb = {
      sequelize: {
        transaction: jest.fn().mockImplementation(async (cb: any) => cb({}))
      }
    };
    mockInfo = {
      fieldNodes: [
        {
          kind: 'Field',
          name: { value: 'users' },
          selectionSet: { selections: [{ kind: 'Field', name: { value: 'id' } }] }
        },
        {
          kind: 'Field',
          name: { value: 'jaasUsers' },
          selectionSet: { selections: [{ kind: 'Field', name: { value: 'id' } }] }
        },
        {
          kind: 'Field',
          name: { value: 'jaasRoles' },
          selectionSet: { selections: [{ kind: 'Field', name: { value: 'name' } }] }
        }
      ]
    };
  });

  describe('authRepository', () => {
    it('should initialize correctly', () => {
      const repo = authRepository(mockDb);
      expect(repo).toBeDefined();
    });
  });

  describe('usersRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = usersRepository(mockDb);
    });

    it('should findAll users with options and pagination limits', async () => {
      (User.findAll as jest.Mock).mockResolvedValue([{ id: 1, name: 'Alice' }]);
      const result = await repo.findAll(mockInfo, { start: 0, max: 10 });
      expect(User.findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 10, offset: 0 }));
      expect(result).toEqual([{ id: 1, name: 'Alice' }]);
    });

    it('should findById user correctly', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Alice' });
      const result = await repo.findById(mockInfo, { id: 1 });
      expect(User.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
      expect(result).toEqual({ id: 1, name: 'Alice' });
    });

    it('should create user', async () => {
      const mockUser = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      const result = await repo.create({ input: { name: 'Bob', email: 'bob@workix.com' } });
      expect(User.create).toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });

    it('should destroy user correctly', async () => {
      (User.destroy as jest.Mock).mockResolvedValue(1);
      const deleted = await repo.destroy({ id: 1 });
      expect(deleted).toBe(true);
    });

    it('should update user if found or throw error if not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: { name: 'New' } })).rejects.toThrow('User with id: 99 not found');

      (User.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (User.update as jest.Mock).mockResolvedValue([[1], []]);
      (User.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Updated' });
      const updated = await repo.update({ id: 1, input: { name: 'Updated' } });
      expect(updated).toEqual({ id: 1, name: 'Updated' });
    });

    it('should findAllPaginated users', async () => {
      (User.count as jest.Mock).mockResolvedValue(15);
      (User.findAll as jest.Mock).mockResolvedValue([{ id: 1, name: 'Alice' }]);
      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(2);
    });
  });

  describe('jaasRolesRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = jaasRolesRepository(mockDb);
    });

    it('should findAll jaasRoles', async () => {
      (JAASRole.findAll as jest.Mock).mockResolvedValue([{ name: 'ADMIN' }]);
      const result = await repo.findAll(mockInfo, { start: 0, max: 10 });
      expect(result).toEqual([{ name: 'ADMIN' }]);
    });

    it('should findByName jaasRole', async () => {
      (JAASRole.findOne as jest.Mock).mockResolvedValue({ name: 'ADMIN' });
      const result = await repo.findByName(mockInfo, { name: 'ADMIN' });
      expect(result).toEqual({ name: 'ADMIN' });
    });

    it('should create jaasRole', async () => {
      const mockRole = { name: 'RECRUITER', reload: jest.fn().mockResolvedValue({}) };
      (JAASRole.create as jest.Mock).mockResolvedValue(mockRole);
      const result = await repo.create({ input: { name: 'RECRUITER' } });
      expect(result).toBe(mockRole);
    });

    it('should destroy jaasRole', async () => {
      (JAASRole.destroy as jest.Mock).mockResolvedValue(1);
      expect(await repo.destroy({ name: 'ADMIN' })).toBe(true);
    });

    it('should update jaasRole or throw if missing', async () => {
      (JAASRole.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ name: 'MISSING', input: { name: 'MISSING' } })).rejects.toThrow('JAASRole with name: MISSING not found');

      (JAASRole.findByPk as jest.Mock).mockResolvedValue({ name: 'ADMIN' });
      (JAASRole.update as jest.Mock).mockResolvedValue([[1], []]);
      (JAASRole.findOne as jest.Mock).mockResolvedValue({ name: 'SUPER_ADMIN' });
      const updated = await repo.update({ name: 'ADMIN', input: { name: 'SUPER_ADMIN' } });
      expect(updated).toEqual({ name: 'SUPER_ADMIN' });
    });

    it('should findAllPaginated jaasRoles', async () => {
      (JAASRole.count as jest.Mock).mockResolvedValue(5);
      (JAASRole.findAll as jest.Mock).mockResolvedValue([{ name: 'ADMIN' }]);
      const result = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(result.totalPages).toBe(1);
    });
  });

  describe('jaasUsersRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = jaasUsersRepository(mockDb);
    });

    it('should findAll and findById jaasUsers', async () => {
      (JAASUser.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      (JAASUser.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([{ id: 1 }]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual({ id: 1 });
    });

    it('should create jaasUser with roles in transaction', async () => {
      const mockJaasUser = {
        id: 1,
        addRole: jest.fn().mockResolvedValue({}),
        reload: jest.fn().mockResolvedValue({})
      };
      (JAASUser.create as jest.Mock).mockResolvedValue(mockJaasUser);
      (JAASRole.findByPk as jest.Mock).mockResolvedValue({ name: 'ADMIN' });

      const result = await repo.create({ input: { username: 'admin', roles: [{ name: 'ADMIN' }] } });
      expect(result).toBe(mockJaasUser);
      expect(mockJaasUser.addRole).toHaveBeenCalled();
    });

    it('should handle errors in create jaasUser', async () => {
      (JAASUser.create as jest.Mock).mockRejectedValue({ errors: [{ message: 'Duplicate username' }] });
      await expect(repo.create({ input: { username: 'admin' } })).rejects.toThrow('Duplicate username');

      (JAASUser.create as jest.Mock).mockRejectedValue(new Error('DB Error'));
      await expect(repo.create({ input: { username: 'admin' } })).rejects.toThrow('DB Error');
    });

    it('should destroy jaasUser', async () => {
      (JAASUser.destroy as jest.Mock).mockResolvedValue(1);
      expect(await repo.destroy({ id: 1 })).toBe(true);
    });

    it('should update jaasUser or throw if missing', async () => {
      (JAASUser.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('JAASUser with id: 99 not found');

      const mockJaasUser = {
        id: 1,
        roles: [{ name: 'OLD_ROLE' }],
        removeRole: jest.fn().mockResolvedValue({}),
        addRole: jest.fn().mockResolvedValue({})
      };
      (JAASUser.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (JAASUser.update as jest.Mock).mockResolvedValue([[1], []]);
      (JAASUser.findOne as jest.Mock).mockResolvedValue(mockJaasUser);
      (JAASRole.findByPk as jest.Mock).mockResolvedValue({ name: 'NEW_ROLE' });

      const updated = await repo.update({ id: 1, input: { roles: [{ name: 'NEW_ROLE' }] } });
      expect(updated).toBe(mockJaasUser);
      expect(mockJaasUser.removeRole).toHaveBeenCalled();
      expect(mockJaasUser.addRole).toHaveBeenCalled();
    });

    it('should findAllPaginated jaasUsers', async () => {
      (JAASUser.count as jest.Mock).mockResolvedValue(10);
      (JAASUser.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const result = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(result.totalPages).toBe(1);
    });
  });
});
