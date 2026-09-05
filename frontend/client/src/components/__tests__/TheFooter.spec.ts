import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TheFooter from '../TheFooter.vue';

describe('TheFooter.vue', () => {
  it('renderiza os links institucionais e copyright', () => {
    const wrapper = mount(TheFooter, {
      global: {
        stubs: ['router-link']
      }
    });

    expect(wrapper.text()).toContain('Sobre o Workix');
    expect(wrapper.text()).toContain('Links Rápidos');
    expect(wrapper.text()).toContain('Workix. Todos os direitos reservados.');
  });

  it('permite submissao do boletim informativo exibindo feedback', async () => {
    const wrapper = mount(TheFooter, {
      global: {
        stubs: ['router-link']
      }
    });

    const input = wrapper.find('input[type="email"]');
    await input.setValue('newsletter@workix.com');

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(wrapper.text()).toContain('Inscrição realizada com sucesso!');
  });
});
