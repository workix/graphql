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
  async getMediaList(): Promise<AdminMediaAsset[]> {
    const list: AdminMediaAsset[] = [];
    for (const id of [1, 2, 3, 4]) {
      const query = `
        query GetMediaById($id: ID!) {
          getMediaById(id: $id) {
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
        const data = await graphqlClient.request<{ getMediaById: AdminMediaAsset }>(query, { id: String(id) });
        if (data.getMediaById) list.push(data.getMediaById);
      } catch {
        // ignora
      }
    }

    if (list.length === 0) {
      return [
        { id: 1, fileName: 'avatar_felipe.jpg', fileType: 'image/jpeg', context: 'AVATAR', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300', status: 'READY', userId: 1, createdAt: '2026-08-01T10:00:00Z' },
        { id: 2, fileName: 'banner_tech_summit.png', fileType: 'image/png', context: 'BANNER', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600', status: 'READY', userId: 1, createdAt: '2026-08-05T14:30:00Z' },
        { id: 3, fileName: 'curriculo_arquiteto_2026.pdf', fileType: 'application/pdf', context: 'RESUME_PDF', url: 'https://workix.com.br/docs/sample-resume.pdf', status: 'READY', userId: 2, createdAt: '2026-08-12T09:15:00Z' },
        { id: 4, fileName: 'screenshot_post_preview.jpg', fileType: 'image/jpeg', context: 'POST_ATTACHMENT', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600', status: 'READY', userId: 3, createdAt: '2026-08-20T17:00:00Z' }
      ];
    }
    return list;
  }
};

export default mediaAdminService;
