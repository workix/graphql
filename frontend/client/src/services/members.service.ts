import graphqlClient from './graphql';

export interface MemberMediaModel {
  media: string;
  url: string;
}

export interface MemberModel {
  id: string | number;
  name: string;
  occupation: string;
  picture?: string;
  shortText?: string;
  medias?: MemberMediaModel[];
  createdAt?: string;
  updatedAt?: string;
}

export const membersService = {
  async allMembers(start = 0, max = 50): Promise<MemberModel[]> {
    const query = `
      query AllMembers($start: Int, $max: Int) {
        allMembers(start: $start, max: $max) {
          id
          name
          occupation
          picture
          shortText
          medias {
            media
            url
          }
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allMembers: MemberModel[] }>(query, {
        start,
        max
      });
      const members = data.allMembers || [];
      if (members.length > 0) return members;
      // Fallback team members if empty
      return [
        {
          id: 1,
          name: 'Felipe Rodrigues Michetti',
          occupation: 'Chief Technology Officer & Lead Architect',
          shortText: 'Arquiteto de software com foco em sistemas distribuídos, microsserviços e GraphQL.',
          picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
        },
        {
          id: 2,
          name: 'Equipe de Engenharia Workix',
          occupation: 'Core Development & Infrastructure',
          shortText: 'Engenheiros e especialistas dedicados à escalabilidade, experiência do usuário e alta disponibilidade da rede.',
          picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
        }
      ];
    } catch (err) {
      console.warn('Erro ao carregar membros da equipe:', err);
      return [];
    }
  },

  async getMemberById(id: string | number): Promise<MemberModel | null> {
    const query = `
      query GetMemberById($id: ID!) {
        getMemberById(id: $id) {
          id
          name
          occupation
          picture
          shortText
          medias {
            media
            url
          }
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ getMemberById: MemberModel }>(query, {
        id: String(id)
      });
      return data.getMemberById || null;
    } catch (err) {
      console.warn('Erro ao carregar membro da equipe:', err);
      return null;
    }
  }
};

export default membersService;
