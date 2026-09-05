import graphqlClient from './graphql';

export interface AdminMediaAsset {
  id: string | number;
  fileName: string;
  fileType: string;
  context: string;
  url?: string;
  status: string;
  userId?: string | number;
  createdAt?: string;
}

export const mediaAdminService = {
  async getMediaList(limit = 100, offset = 0): Promise<AdminMediaAsset[]> {
    const query = `
      query AllMediaAssets($limit: Int, $offset: Int) {
        allMediaAssets(limit: $limit, offset: $offset) {
          id
          fileName
          fileType
          context
          url
          status
          userId
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allMediaAssets: AdminMediaAsset[] }>(query, {
        limit,
        offset
      });
      return data.allMediaAssets || [];
    } catch (err) {
      console.error('Erro ao consultar lista de mídias:', err);
      return [];
    }
  }
};

export default mediaAdminService;
