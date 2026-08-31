import { defineStore } from 'pinia';
import { ref } from 'vue';
import postsService, { PostModel, PostCommentModel, PostReactionModel } from '../services/posts.service';
import hashtagsService from '../services/hashtags.service';
import { useAuthStore } from './auth';

export const usePostsStore = defineStore('posts', () => {
  const feed = ref<PostModel[]>([]);
  const hashtagFeed = ref<PostModel[]>([]);
  const currentHashtag = ref<string>('');
  const commentsMap = ref<Record<string, PostCommentModel[]>>({});
  const reactionsMap = ref<Record<string, PostReactionModel[]>>({});
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const error = ref<string | null>(null);
  const offset = ref<number>(0);
  const hasMore = ref<boolean>(true);
  const PAGE_SIZE = 10;

  async function fetchFeed(reset = false, ranked = false) {
    const authStore = useAuthStore();
    const userId = authStore.user?.id || 1;

    if (reset) {
      offset.value = 0;
      feed.value = [];
      hasMore.value = true;
    }

    if (!hasMore.value && !reset) return;

    isLoading.value = true;
    error.value = null;

    try {
      const posts = ranked
        ? await postsService.getRankedSocialFeed(userId, PAGE_SIZE, offset.value)
        : await postsService.getSocialFeed(userId, PAGE_SIZE, offset.value);

      if (posts.length < PAGE_SIZE) {
        hasMore.value = false;
      }

      if (reset) {
        feed.value = posts;
      } else {
        feed.value = [...feed.value, ...posts];
      }

      offset.value += posts.length;
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar o feed social.';
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchHashtagFeed(tag: string, reset = false) {
    currentHashtag.value = tag;
    if (reset) {
      hashtagFeed.value = [];
    }

    isLoading.value = true;
    error.value = null;

    try {
      const posts = await hashtagsService.getPostsByHashtag(tag, 20, 0);
      hashtagFeed.value = posts;
    } catch (err: any) {
      error.value = err.message || `Erro ao carregar publicações com #${tag}`;
    } finally {
      isLoading.value = false;
    }
  }

  async function createNewPost(content: string, mediaIds: (string | number)[] = [], mentionedUserIds: (string | number)[] = []) {
    const authStore = useAuthStore();
    const authorId = authStore.user?.id || 1;

    isSubmitting.value = true;
    error.value = null;

    try {
      const newPost = await postsService.createPost(authorId, content, mediaIds, mentionedUserIds);
      if (newPost) {
        // Enriquecer com dados locais de autor
        newPost.authorName = authStore.user?.name || 'Você';
        newPost.reactionsCount = 0;
        newPost.commentsCount = 0;
        feed.value = [newPost, ...feed.value];
      }
      return newPost;
    } catch (err: any) {
      error.value = err.message || 'Não foi possível publicar a postagem.';
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  }

  async function reactToPost(postId: string | number, type: string) {
    const authStore = useAuthStore();
    const userId = authStore.user?.id || 1;
    const key = String(postId);

    // Atualização otimista
    const targetPost = feed.value.find((p) => String(p.id) === key);
    const prevReaction = targetPost?.userReaction;
    const prevCount = targetPost?.reactionsCount || 0;

    if (targetPost) {
      if (targetPost.userReaction === type) {
        targetPost.userReaction = null;
        targetPost.reactionsCount = Math.max(0, prevCount - 1);
      } else {
        targetPost.userReaction = type;
        if (!prevReaction) {
          targetPost.reactionsCount = prevCount + 1;
        }
      }
    }

    try {
      const result = await postsService.reactToPost(postId, userId, type);
      if (result) {
        await loadReactions(postId);
      }
      return result;
    } catch (err) {
      // Reverter em caso de falha
      if (targetPost) {
        targetPost.userReaction = prevReaction;
        targetPost.reactionsCount = prevCount;
      }
      console.warn('Erro ao reagir à postagem:', err);
    }
  }

  async function loadComments(postId: string | number) {
    const key = String(postId);
    try {
      const comments = await postsService.getPostComments(postId);
      commentsMap.value[key] = comments;
      const targetPost = feed.value.find((p) => String(p.id) === key);
      if (targetPost) {
        targetPost.commentsCount = comments.length;
      }
      return comments;
    } catch (err) {
      console.warn(`Erro ao carregar comentários para post ${postId}:`, err);
      return [];
    }
  }

  async function loadReactions(postId: string | number) {
    const key = String(postId);
    try {
      const reactions = await postsService.getPostReactions(postId);
      reactionsMap.value[key] = reactions;
      const targetPost = feed.value.find((p) => String(p.id) === key);
      if (targetPost) {
        targetPost.reactionsCount = reactions.length;
      }
      return reactions;
    } catch (err) {
      console.warn(`Erro ao carregar reações para post ${postId}:`, err);
      return [];
    }
  }

  async function addComment(postId: string | number, content: string) {
    const authStore = useAuthStore();
    const authorId = authStore.user?.id || 1;
    const key = String(postId);

    try {
      const comment = await postsService.commentOnPost(postId, authorId, content);
      if (comment) {
        comment.authorName = authStore.user?.name || 'Você';
        if (!commentsMap.value[key]) {
          commentsMap.value[key] = [];
        }
        commentsMap.value[key].push(comment);

        const targetPost = feed.value.find((p) => String(p.id) === key);
        if (targetPost) {
          targetPost.commentsCount = (targetPost.commentsCount || 0) + 1;
        }
      }
      return comment;
    } catch (err: any) {
      console.warn('Erro ao adicionar comentário:', err);
      throw err;
    }
  }

  return {
    feed,
    hashtagFeed,
    currentHashtag,
    commentsMap,
    reactionsMap,
    isLoading,
    isSubmitting,
    error,
    hasMore,
    fetchFeed,
    fetchHashtagFeed,
    createNewPost,
    reactToPost,
    loadComments,
    loadReactions,
    addComment
  };
});

export default usePostsStore;
