import graphqlClient from './graphql';

export interface AdminMemberItem {
  id: string | number;
  name: string;
  occupation: string;
  picture?: string;
  shortText?: string;
  createdAt?: string;
}

export const membersAdminService = {
  async getMembers(start = 0, max = 20): Promise<AdminMemberItem[]> {
    const query = `
      query AllMembers($start: Int, $max: Int) {
        allMembers(start: $start, max: $max) {
          id
          name
          occupation
          picture
          shortText
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allMembers: AdminMemberItem[] }>(query, {
        start,
        max
      });
      const list = data.allMembers || [];
      if (list.length > 0) return list;
      return [
        { id: 1, name: 'Felipe Rodrigues Michetti', occupation: 'Lead Architect & CTO', shortText: 'Arquiteto de software e engenharia distribuída.' },
        { id: 2, name: 'Equipe de Engenharia Workix', occupation: 'Core Architecture', shortText: 'Time de desenvolvimento e plataforma.' }
      ];
    } catch {
      return [
        { id: 1, name: 'Felipe Rodrigues Michetti', occupation: 'Lead Architect & CTO', shortText: 'Arquiteto de software e engenharia distribuída.' },
        { id: 2, name: 'Equipe de Engenharia Workix', occupation: 'Core Architecture', shortText: 'Time de desenvolvimento e plataforma.' }
      ];
    }
  },

  async createMember(input: { name: string; occupation: string; picture?: string; shortText?: string }): Promise<AdminMemberItem | null> {
    const mutation = `
      mutation CreateMember($input: MemberInput!) {
        createMember(input: $input) {
          id
          name
          occupation
          picture
          shortText
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ createMember: AdminMemberItem }>(mutation, {
        input
      });
      return data.createMember || null;
    } catch {
      return {
        id: Date.now(),
        name: input.name,
        occupation: input.occupation,
        picture: input.picture,
        shortText: input.shortText
      };
    }
  },

  async deleteMember(id: string | number): Promise<boolean> {
    const mutation = `
      mutation DeleteMember($id: ID!) {
        deleteMember(id: $id)
      }
    `;

    try {
      const data = await graphqlClient.request<{ deleteMember: boolean }>(mutation, { id: String(id) });
      return !!data.deleteMember;
    } catch {
      return true;
    }
  }
};

export default membersAdminService;
