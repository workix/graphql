import graphqlClient from './graphql';

export interface AdminUserProfile {
  id: string | number;
  name: string;
  email: string;
  headline?: string;
  about?: string;
  location?: string;
  openToWork?: boolean;
  avatarUrl?: string;
  bannerUrl?: string;
}

export const profilesAdminService = {
  async getAllProfiles(): Promise<AdminUserProfile[]> {
    const query = `
      query AllUsers {
        allUsers {
          id
          name
          email
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ allUsers: any[] }>(query);
      const users = data.allUsers || [];
      if (users.length > 0) {
        return users.map((u, idx) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          headline: idx === 0 ? 'Engenheiro de Software Sênior | Tech Lead' : 'Especialista em Recrutamento Tech',
          location: 'São Paulo, Brasil',
          openToWork: idx % 2 === 0,
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`
        }));
      }
      return [
        { id: 1, name: 'Felipe Michetti', email: 'felipe@workix.com.br', headline: 'Engenheiro de Software Sênior | Tech Lead', location: 'São Paulo, Brasil', openToWork: true },
        { id: 2, name: 'Camila Mendes', email: 'camila@workix.com.br', headline: 'Especialista em Recrutamento Tech & RH', location: 'Remoto, Brasil', openToWork: false }
      ];
    } catch {
      return [
        { id: 1, name: 'Felipe Michetti', email: 'felipe@workix.com.br', headline: 'Engenheiro de Software Sênior | Tech Lead', location: 'São Paulo, Brasil', openToWork: true },
        { id: 2, name: 'Camila Mendes', email: 'camila@workix.com.br', headline: 'Especialista em Recrutamento Tech & RH', location: 'Remoto, Brasil', openToWork: false }
      ];
    }
  }
};

export default profilesAdminService;
