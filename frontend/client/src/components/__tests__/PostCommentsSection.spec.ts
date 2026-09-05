import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PostCommentsSection from '../PostCommentsSection.vue';

describe('PostCommentsSection.vue', () => {
  const mockComments = [
    {
      id: '1',
      postId: '10',
      authorId: '1',
      authorName: 'Carlos Dev',
      content: 'Parabéns pela postagem!',
      createdAt: '2026-09-05T12:00:00Z',
      replies: [
        {
          id: '2',
          postId: '10',
          authorId: '2',
          authorName: 'Ana Silva',
          content: 'Muito obrigado, Carlos!',
          parentId: '1',
          createdAt: '2026-09-05T12:05:00Z'
        }
      ]
    }
  ];

  it('renderiza comentarios pais e comentarios filhos aninhados', () => {
    const wrapper = mount(PostCommentsSection, {
      props: {
        postId: '10',
        comments: mockComments
      }
    });

    expect(wrapper.text()).toContain('Carlos Dev');
    expect(wrapper.text()).toContain('Parabéns pela postagem!');
    expect(wrapper.text()).toContain('Ana Silva');
    expect(wrapper.text()).toContain('Muito obrigado, Carlos!');
    expect(wrapper.find('.replies-list').exists()).toBe(true);
  });

  it('permite iniciar resposta a um comentario e emitir add-comment com parentId', async () => {
    const wrapper = mount(PostCommentsSection, {
      props: {
        postId: '10',
        comments: mockComments
      }
    });

    const replyBtn = wrapper.find('.btn-action-reply');
    await replyBtn.trigger('click');

    expect(wrapper.text()).toContain('Respondendo a Carlos Dev');

    const textarea = wrapper.find('.comment-textarea');
    await textarea.setValue('Concordo plenamente!');

    const sendBtn = wrapper.find('.btn-send-comment');
    await sendBtn.trigger('click');

    expect(wrapper.emitted('add-comment')).toBeTruthy();
    expect(wrapper.emitted('add-comment')![0]).toEqual([
      {
        content: 'Concordo plenamente!',
        parentId: '1'
      }
    ]);
  });
});
