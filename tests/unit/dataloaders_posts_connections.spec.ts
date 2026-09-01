import postsResolvers from '../../src/modules/posts/graphql/posts.resolvers';
import connectionsResolvers from '../../src/modules/connections/graphql/connections.resolvers';

describe('DataLoaders for Posts and Connections (TDD)', () => {
  describe('Post, PostReaction and PostComment Field Resolvers', () => {
    it('should resolve post author using usersLoader in batch', async () => {
      const mockLoad = jest.fn().mockResolvedValue([{ id: 10, email: 'author@test.com' }]);
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockLoad }
        }
      };

      const parentPost = { id: 1, authorId: 10, content: 'Hello World' };
      const author = await (postsResolvers as any).Post.author(parentPost, {}, ctx, {});

      expect(mockLoad).toHaveBeenCalledWith({ key: 10, info: {} });
      expect(author).toBeDefined();
      expect(author.id).toBe(10);
      expect(author.email).toBe('author@test.com');
    });

    it('should resolve post reaction user using usersLoader', async () => {
      const mockLoad = jest.fn().mockResolvedValue([{ id: 20, email: 'reactor@test.com' }]);
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockLoad }
        }
      };

      const parentReaction = { id: 2, postId: 1, userId: 20, type: 'like' };
      const user = await (postsResolvers as any).PostReaction.user(parentReaction, {}, ctx, {});

      expect(mockLoad).toHaveBeenCalledWith({ key: 20, info: {} });
      expect(user).toBeDefined();
      expect(user.id).toBe(20);
    });

    it('should resolve post comment author using usersLoader', async () => {
      const mockLoad = jest.fn().mockResolvedValue([{ id: 30, email: 'commenter@test.com' }]);
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockLoad }
        }
      };

      const parentComment = { id: 3, postId: 1, authorId: 30, content: 'Great post!' };
      const author = await (postsResolvers as any).PostComment.author(parentComment, {}, ctx, {});

      expect(mockLoad).toHaveBeenCalledWith({ key: 30, info: {} });
      expect(author).toBeDefined();
      expect(author.id).toBe(30);
    });

    it('should return null when foreign key is missing or user not found', async () => {
      const mockLoad = jest.fn().mockResolvedValue([]);
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockLoad }
        }
      };

      const nullAuthor = await (postsResolvers as any).Post.author({ id: 1 }, {}, ctx, {});
      expect(nullAuthor).toBeNull();

      const notFoundAuthor = await (postsResolvers as any).Post.author({ id: 1, authorId: 999 }, {}, ctx, {});
      expect(notFoundAuthor).toBeNull();
    });
  });

  describe('Connection and ConnectionRequest Field Resolvers', () => {
    it('should resolve user1 and user2 for Connection using usersLoader', async () => {
      const mockLoad = jest.fn().mockImplementation(({ key }: { key: number }) => {
        return Promise.resolve([{ id: key, email: `user${key}@test.com` }]);
      });
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockLoad }
        }
      };

      const parentConnection = { id: 5, userId1: 101, userId2: 102 };
      const user1 = await (connectionsResolvers as any).Connection.user1(parentConnection, {}, ctx, {});
      const user2 = await (connectionsResolvers as any).Connection.user2(parentConnection, {}, ctx, {});

      expect(mockLoad).toHaveBeenCalledWith({ key: 101, info: {} });
      expect(mockLoad).toHaveBeenCalledWith({ key: 102, info: {} });
      expect(user1.id).toBe(101);
      expect(user2.id).toBe(102);
    });

    it('should resolve requester and recipient for ConnectionRequest using usersLoader', async () => {
      const mockLoad = jest.fn().mockImplementation(({ key }: { key: number }) => {
        return Promise.resolve([{ id: key, email: `user${key}@test.com` }]);
      });
      const ctx = {
        dataloaders: {
          usersLoader: { load: mockLoad }
        }
      };

      const parentReq = { id: 6, requesterId: 201, recipientId: 202, status: 'pending' };
      const requester = await (connectionsResolvers as any).ConnectionRequest.requester(parentReq, {}, ctx, {});
      const recipient = await (connectionsResolvers as any).ConnectionRequest.recipient(parentReq, {}, ctx, {});

      expect(mockLoad).toHaveBeenCalledWith({ key: 201, info: {} });
      expect(mockLoad).toHaveBeenCalledWith({ key: 202, info: {} });
      expect(requester.id).toBe(201);
      expect(recipient.id).toBe(202);
    });
  });
});
