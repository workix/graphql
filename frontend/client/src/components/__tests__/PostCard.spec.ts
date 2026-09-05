import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import PostCard from '../PostCard.vue';

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

describe('PostCard.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockPost = {
    id: '100',
    authorId: '5',
    authorName: 'Ana Silva',
    authorRole: 'Software Engineer',
    content: 'Muito feliz em iniciar na #Workix com a equipe @time!',
    createdAt: '2026-09-05T12:00:00Z',
    reactionsCount: 12,
    commentsCount: 3
  };

  it('renderiza o autor, cargo e conteudo formatado com hashtags e mencoes', () => {
    const wrapper = mount(PostCard, {
      props: { post: mockPost },
      global: {
        stubs: ['PostReactionsBar', 'PostCommentsSection']
      }
    });

    expect(wrapper.text()).toContain('Ana Silva');
    expect(wrapper.text()).toContain('Software Engineer');
    expect(wrapper.html()).toContain('class="post-hashtag">#Workix</a>');
    expect(wrapper.html()).toContain('class="post-mention">@time</span>');
  });

  it('renderiza imagens de midia anexadas quando disponiveis', () => {
    const postWithMedia = {
      ...mockPost,
      mediaUrls: ['http://localhost:4000/uploads/media/post1.png']
    };

    const wrapper = mount(PostCard, {
      props: { post: postWithMedia },
      global: {
        stubs: ['PostReactionsBar', 'PostCommentsSection']
      }
    });

    const img = wrapper.find('.post-media-image');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('http://localhost:4000/uploads/media/post1.png');
  });
});
