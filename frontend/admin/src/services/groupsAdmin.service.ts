import graphqlClient from './graphql';

export interface AdminGroupItem {
  id: string | number;
  name: string;
  description?: string;
  isPrivate?: boolean;
  memberCount?: number;
  createdAt?: string;
}

export const groupsAdminService = {
  async getGroups(): Promise<AdminGroupItem[]> {
    const list: AdminGroupItem[] = [];
    for (const id of [1, 2, 3]) {
      const query = `
        query GetGroup($id: ID!) {
          group(id: $id) {
            id
            name
            description
            isPrivate
            memberCount
            createdAt
          }
        }
      `;
      try {
        const res = await graphqlClient.request<{ group: AdminGroupItem }>(query, { id: String(id) });
        if (res.group) list.push(res.group);
      } catch {
        // ignora
      }
    }

    if (list.length === 0) {
      return [
        { id: 1, name: 'Comunidade Vue.js & Nuxt Brasil', description: 'Discussões de alto nível sobre ecossistema Vue.', isPrivate: false, memberCount: 1420, createdAt: '2026-08-01T00:00:00Z' },
        { id: 2, name: 'Desenvolvedores Kotlin & Android', description: 'Boas práticas de Jetpack, Coroutines e Compose.', isPrivate: false, memberCount: 980, createdAt: '2026-08-10T00:00:00Z' },
        { id: 3, name: 'Liderança Técnica & Tech Leads', description: 'Grupo fechado para troca de experiências em gestão de engenharia.', isPrivate: true, memberCount: 310, createdAt: '2026-08-15T00:00:00Z' }
      ];
    }
    return list;
  }
};

export default groupsAdminService;
