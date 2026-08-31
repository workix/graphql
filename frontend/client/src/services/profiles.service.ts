import graphqlClient from './graphql';

export interface UserProfileModel {
  id?: string | number;
  userId: string | number;
  headline?: string;
  about?: string;
  bannerUrl?: string;
  location?: string;
  industry?: string;
  openToWork?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileInput {
  headline?: string;
  about?: string;
  bannerUrl?: string;
  location?: string;
  industry?: string;
  openToWork?: boolean;
}

export interface FeaturedItemModel {
  id: string | number;
  userId: string | number;
  type: string;
  title: string;
  url?: string;
  mediaId?: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export const profilesService = {
  async getProfileByUserId(userId: string | number): Promise<UserProfileModel | null> {
    const query = `
      query GetProfileByUserId($userId: ID!) {
        getProfileByUserId(userId: $userId) {
          id
          userId
          headline
          about
          bannerUrl
          location
          industry
          openToWork
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ getProfileByUserId: UserProfileModel }>(query, {
        userId: String(userId)
      });
      return data.getProfileByUserId || null;
    } catch (err) {
      console.warn('Erro ao carregar perfil:', err);
      return null;
    }
  },

  async updateMyProfile(userId: string | number, input: ProfileInput): Promise<UserProfileModel | null> {
    const mutation = `
      mutation UpdateMyProfile($userId: ID!, $input: ProfileInput!) {
        updateMyProfile(userId: $userId, input: $input) {
          id
          userId
          headline
          about
          bannerUrl
          location
          industry
          openToWork
          updatedAt
        }
      }
    `;

    const data = await graphqlClient.request<{ updateMyProfile: UserProfileModel }>(mutation, {
      userId: String(userId),
      input
    });
    return data.updateMyProfile || null;
  },

  async getUserFeaturedItems(userId: string | number): Promise<FeaturedItemModel[]> {
    const query = `
      query UserFeaturedItems($userId: ID!) {
        userFeaturedItems(userId: $userId) {
          id
          userId
          type
          title
          url
          mediaId
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ userFeaturedItems: FeaturedItemModel[] }>(query, {
        userId: String(userId)
      });
      return data.userFeaturedItems || [];
    } catch (err) {
      console.warn('Erro ao carregar itens em destaque:', err);
      return [];
    }
  },

  async addFeaturedItem(
    userId: string | number,
    type: string,
    title: string,
    url?: string,
    mediaId?: string | number
  ): Promise<FeaturedItemModel | null> {
    const mutation = `
      mutation AddFeaturedItem($userId: ID!, $type: String!, $title: String!, $url: String, $mediaId: ID) {
        addFeaturedItem(userId: $userId, type: $type, title: $title, url: $url, mediaId: $mediaId) {
          id
          userId
          type
          title
          url
          mediaId
          createdAt
        }
      }
    `;

    const data = await graphqlClient.request<{ addFeaturedItem: FeaturedItemModel }>(mutation, {
      userId: String(userId),
      type,
      title,
      url,
      mediaId: mediaId ? String(mediaId) : undefined
    });
    return data.addFeaturedItem || null;
  },

  async removeFeaturedItem(id: string | number, userId: string | number): Promise<boolean> {
    const mutation = `
      mutation RemoveFeaturedItem($id: ID!, $userId: ID!) {
        removeFeaturedItem(id: $id, userId: $userId)
      }
    `;

    try {
      const data = await graphqlClient.request<{ removeFeaturedItem: boolean }>(mutation, {
        id: String(id),
        userId: String(userId)
      });
      return !!data.removeFeaturedItem;
    } catch {
      return false;
    }
  }
};

export default profilesService;
