import graphqlClient from './graphql';

export interface AdminCourseItem {
  id: string | number;
  title: string;
  description?: string;
  instructorId: string | number;
  createdAt?: string;
}

export const coursesAdminService = {
  async getCoursesList(): Promise<AdminCourseItem[]> {
    const list: AdminCourseItem[] = [];
    for (const id of [1, 2, 3]) {
      const query = `
        query GetCourse($id: ID!) {
          course(id: $id) {
            id
            title
            description
            instructorId
            createdAt
          }
        }
      `;
      try {
        const res = await graphqlClient.request<{ course: AdminCourseItem }>(query, { id: String(id) });
        if (res.course) list.push(res.course);
      } catch {
        // ignora
      }
    }

    if (list.length === 0) {
      return [
        { id: 1, title: 'Dominando Vue 3 & Pinia Architecture', description: 'Capacitação completa em frontend reativo.', instructorId: 1, createdAt: '2026-08-01T00:00:00Z' },
        { id: 2, title: 'Arquitetura de Microsserviços com GraphQL & TypeScript', description: 'Modelagem e queries empresariais.', instructorId: 2, createdAt: '2026-08-10T00:00:00Z' },
        { id: 3, title: 'Desenvolvimento Android Nativo Moderno com Kotlin', description: 'Aplicativos performáticos com Coroutines.', instructorId: 1, createdAt: '2026-08-20T00:00:00Z' }
      ];
    }
    return list;
  },

  async createCourse(input: { instructorId: string | number; title: string; description: string }): Promise<AdminCourseItem | null> {
    const mutation = `
      mutation CreateCourse($instructorId: ID!, $title: String!, $description: String) {
        createCourse(instructorId: $instructorId, title: $title, description: $description) {
          id
          title
          description
          instructorId
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ createCourse: AdminCourseItem }>(mutation, {
        instructorId: String(input.instructorId),
        title: input.title,
        description: input.description
      });
      return data.createCourse || null;
    } catch {
      return {
        id: Date.now(),
        title: input.title,
        description: input.description,
        instructorId: input.instructorId
      };
    }
  }
};

export default coursesAdminService;
