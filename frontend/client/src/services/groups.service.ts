import graphqlClient from './graphql';

export interface GroupModel {
  id: string | number;
  name: string;
  description?: string;
  privacy?: string;
  ownerId: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupMembershipModel {
  id: string | number;
  groupId: string | number;
  userId: string | number;
  role?: string;
  status?: string;
  createdAt?: string;
}

export interface GroupPostModel {
  id: string | number;
  groupId: string | number;
  authorId: string | number;
  content: string;
  createdAt?: string;
}

export const groupsService = {
  async getGroup(id: string | number): Promise<GroupModel | null> {
    const query = `
      query GetGroup($id: ID!) {
        group(id: $id) {
          id
          name
          description
          privacy
          ownerId
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ group: GroupModel }>(query, {
        id: String(id)
      });
      return data.group || null;
    } catch (err) {
      console.warn('Erro ao carregar grupo:', err);
      return null;
    }
  },

  async getGroupPosts(
    groupId: string | number,
    limit = 20,
    offset = 0
  ): Promise<GroupPostModel[]> {
    const query = `
      query GetGroupPosts($groupId: ID!, $limit: Int, $offset: Int) {
        groupPosts(groupId: $groupId, limit: $limit, offset: $offset) {
          id
          groupId
          authorId
          content
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ groupPosts: GroupPostModel[] }>(query, {
        groupId: String(groupId),
        limit,
        offset
      });
      return data.groupPosts || [];
    } catch (err) {
      console.warn('Erro ao carregar postagens do grupo:', err);
      return [];
    }
  },

  async createGroup(
    ownerId: string | number,
    name: string,
    description?: string,
    privacy = 'PUBLIC'
  ): Promise<GroupModel | null> {
    const mutation = `
      mutation CreateGroup($ownerId: ID!, $name: String!, $description: String, $privacy: String) {
        createGroup(ownerId: $ownerId, name: $name, description: $description, privacy: $privacy) {
          id
          name
          description
          privacy
          ownerId
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ createGroup: GroupModel }>(mutation, {
      ownerId: String(ownerId),
      name,
      description,
      privacy
    });
    return data.createGroup || null;
  },

  async joinGroup(groupId: string | number, userId: string | number): Promise<GroupMembershipModel | null> {
    const mutation = `
      mutation JoinGroup($groupId: ID!, $userId: ID!) {
        joinGroup(groupId: $groupId, userId: $userId) {
          id
          groupId
          userId
          role
          status
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ joinGroup: GroupMembershipModel }>(mutation, {
      groupId: String(groupId),
      userId: String(userId)
    });
    return data.joinGroup || null;
  },

  async approveGroupMembership(
    membershipId: string | number,
    adminUserId: string | number
  ): Promise<GroupMembershipModel | null> {
    const mutation = `
      mutation ApproveGroupMembership($membershipId: ID!, $adminUserId: ID!) {
        approveGroupMembership(membershipId: $membershipId, adminUserId: $adminUserId) {
          id
          groupId
          userId
          role
          status
        }
      }
    `;

    const data = await graphqlClient.request<{ approveGroupMembership: GroupMembershipModel }>(mutation, {
      membershipId: String(membershipId),
      adminUserId: String(adminUserId)
    });
    return data.approveGroupMembership || null;
  },

  async createGroupPost(
    groupId: string | number,
    authorId: string | number,
    content: string
  ): Promise<GroupPostModel | null> {
    const mutation = `
      mutation CreateGroupPost($groupId: ID!, $authorId: ID!, $content: String!) {
        createGroupPost(groupId: $groupId, authorId: $authorId, content: $content) {
          id
          groupId
          authorId
          content
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ createGroupPost: GroupPostModel }>(mutation, {
      groupId: String(groupId),
      authorId: String(authorId),
      content
    });
    return data.createGroupPost || null;
  }
};

export default groupsService;
