import { defineStore } from 'pinia';
import groupsService, {
  GroupModel,
  GroupPostModel
} from '../services/groups.service';
import { useAuthStore } from './auth';

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groupsList: [] as GroupModel[],
    activeGroup: null as GroupModel | null,
    activeGroupPosts: [] as GroupPostModel[],
    isMember: false,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async fetchGroups() {
      this.isLoading = true;
      this.error = null;

      try {
        // Obter grupos conhecidos / sugeridos
        const defaultGroupIds = [1, 2, 3, 4];
        const loaded: GroupModel[] = [];

        for (const id of defaultGroupIds) {
          const g = await groupsService.getGroup(id);
          if (g) loaded.push(g);
        }

        if (loaded.length === 0) {
          this.groupsList = [
            {
              id: 1,
              name: 'Desenvolvedores TypeScript & Vue.js Brasil',
              description: 'Comunidade focada em discussões, dúvidas, arquitetura e vagas no ecossistema Vue 3, TypeScript e Vite.',
              privacy: 'PUBLIC',
              ownerId: 1
            },
            {
              id: 2,
              name: 'Engenharia de Software & Arquitetura GraphQL',
              description: 'Boas práticas, microsserviços, federation e performance em APIs GraphQL escaláveis.',
              privacy: 'PUBLIC',
              ownerId: 2
            },
            {
              id: 3,
              name: 'Mobile Kotlin & Android Moderno',
              description: 'Grupo dedicado a desenvolvimento Android nativo com Jetpack Compose, Coroutines e Apollo GraphQL.',
              privacy: 'PUBLIC',
              ownerId: 1
            }
          ];
        } else {
          this.groupsList = loaded;
        }
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar grupos.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchGroupDetails(id: string | number) {
      this.isLoading = true;
      this.error = null;

      try {
        const group = await groupsService.getGroup(id);
        if (group) {
          this.activeGroup = group;
        } else {
          // Fallback se não existir no banco
          this.activeGroup = this.groupsList.find((g) => String(g.id) === String(id)) || {
            id,
            name: `Comunidade #${id}`,
            description: 'Espaço profissional de discussões e colaboração no Workix.',
            privacy: 'PUBLIC',
            ownerId: 1
          };
        }

        await this.fetchGroupPosts(id);
      } catch (err: any) {
        this.error = err.message || 'Erro ao carregar detalhes do grupo.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchGroupPosts(groupId: string | number) {
      try {
        const posts = await groupsService.getGroupPosts(groupId);
        this.activeGroupPosts = posts;
      } catch (err: any) {
        console.warn('Erro ao buscar posts do grupo:', err);
      }
    },

    async createGroup(name: string, description: string, privacy = 'PUBLIC') {
      const authStore = useAuthStore();
      const ownerId = authStore.user?.id || 1;

      this.isLoading = true;
      this.error = null;

      try {
        const newGroup = await groupsService.createGroup(ownerId, name, description, privacy);
        if (newGroup) {
          this.groupsList.unshift(newGroup);
          return newGroup;
        }
      } catch (err: any) {
        this.error = err.message || 'Erro ao criar grupo.';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async joinGroup(groupId: string | number) {
      const authStore = useAuthStore();
      const userId = authStore.user?.id || 1;

      try {
        const membership = await groupsService.joinGroup(groupId, userId);
        this.isMember = true;
        return membership;
      } catch (err: any) {
        this.error = err.message || 'Erro ao entrar no grupo.';
        throw err;
      }
    },

    async postToGroup(groupId: string | number, content: string) {
      const authStore = useAuthStore();
      const authorId = authStore.user?.id || 1;

      try {
        const newPost = await groupsService.createGroupPost(groupId, authorId, content);
        if (newPost) {
          this.activeGroupPosts.unshift(newPost);
        }
        return newPost;
      } catch (err: any) {
        this.error = err.message || 'Erro ao publicar no grupo.';
        throw err;
      }
    }
  }
});

export default useGroupsStore;
