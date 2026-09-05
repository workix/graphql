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
   * Requisita uma URL assinada para upload direto de mídia no armazenamento em nuvem ou backend local.
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

    const data = await graphqlClient.request<{ requestUploadUrl: RequestUploadResponse }>(mutation, {
      input
    });
    return data.requestUploadUrl;
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

    const data = await graphqlClient.request<{ confirmUpload: MediaAsset }>(mutation, {
      id: String(id)
    });
    return data.confirmUpload;
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
    try {
      const req = await this.requestUploadUrl({
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        context,
        userId
      });

      if (req.uploadUrl) {
        await fetch(req.uploadUrl, {
          method: 'POST',
          body: file,
          headers: {
            'Content-Type': file.type || 'application/octet-stream'
          }
        });
      }

      return await this.confirmUpload(req.mediaAsset.id);
    } catch (err) {
      // Direct upload fallback via REST endpoint
      const uploadEndpoint = '/api/v1/media/direct-upload';
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'x-file-name': encodeURIComponent(file.name),
          'x-file-context': context
        }
      });

      if (!response.ok) {
        throw new Error(`Falha no upload do arquivo: ${response.statusText}`);
      }

      const resData = await response.json();
      return resData.mediaAsset;
    }
  }
};

export default mediaService;
