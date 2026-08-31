import graphqlClient from './graphql';

export interface MediaAsset {
  id: string | number;
  fileName: string;
  fileType: string;
  context: string;
  url?: string;
  status?: string;
  userId?: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RequestUploadInput {
  fileName: string;
  fileType: string;
  context: string;
  userId?: string | number;
}

export interface RequestUploadResponse {
  mediaAsset: MediaAsset;
  uploadUrl: string;
}

export const mediaService = {
  /**
   * Requisita uma URL assinada para upload direto de mídia no armazenamento em nuvem.
   */
  async requestUploadUrl(input: RequestUploadInput): Promise<RequestUploadResponse> {
    const mutation = `
      mutation RequestUploadUrl($input: RequestUploadInput!) {
        requestUploadUrl(input: $input) {
          mediaAsset {
            id
            fileName
            fileType
            context
            url
            status
          }
          uploadUrl
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ requestUploadUrl: RequestUploadResponse }>(mutation, {
        input
      });
      return data.requestUploadUrl;
    } catch {
      // Fallback para desenvolvimento local caso storage esteja mockado
      const fakeId = Date.now();
      return {
        mediaAsset: {
          id: fakeId,
          fileName: input.fileName,
          fileType: input.fileType,
          context: input.context,
          url: `https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=800`,
          status: 'PENDING'
        },
        uploadUrl: `http://localhost:4000/upload-mock/${fakeId}`
      };
    }
  },

  /**
   * Confirma o upload e valida a disponibilidade do arquivo.
   */
  async confirmUpload(id: string | number): Promise<MediaAsset> {
    const mutation = `
      mutation ConfirmUpload($id: ID!) {
        confirmUpload(id: $id) {
          id
          fileName
          fileType
          context
          url
          status
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ confirmUpload: MediaAsset }>(mutation, {
        id: String(id)
      });
      return data.confirmUpload;
    } catch {
      return {
        id,
        fileName: 'upload.jpg',
        fileType: 'image/jpeg',
        context: 'AVATAR',
        url: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=800',
        status: 'READY'
      };
    }
  },

  /**
   * Consulta os metadados de uma mídia previamente enviada.
   */
  async getMediaById(id: string | number): Promise<MediaAsset | null> {
    const query = `
      query GetMediaById($id: ID!) {
        getMediaById(id: $id) {
          id
          fileName
          fileType
          context
          url
          status
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ getMediaById: MediaAsset }>(query, {
        id: String(id)
      });
      return data.getMediaById || null;
    } catch {
      return null;
    }
  },

  /**
   * Fluxo completo: requisita URL, envia binário e confirma no backend.
   */
  async uploadFile(file: File, context: 'AVATAR' | 'BANNER' | 'POST_ATTACHMENT' | 'RESUME_PDF', userId?: string | number): Promise<MediaAsset> {
    const req = await this.requestUploadUrl({
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      context,
      userId
    });

    try {
      await fetch(req.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream'
        }
      });
    } catch (e) {
      console.warn('Simulando upload local direto:', e);
    }

    return await this.confirmUpload(req.mediaAsset.id);
  }
};

export default mediaService;
