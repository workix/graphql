import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LoadingOverlay from '../LoadingOverlay.vue';

describe('LoadingOverlay.vue', () => {
  it('renderiza o overlay quando loading e true', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: true,
        message: 'Buscando dados...'
      }
    });

    expect(wrapper.find('.loading-overlay').exists()).toBe(true);
    expect(wrapper.text()).toContain('Buscando dados...');
  });

  it('nao renderiza quando loading e false', () => {
    const wrapper = mount(LoadingOverlay, {
      props: {
        loading: false
      }
    });

    expect(wrapper.find('.loading-overlay').exists()).toBe(false);
  });
});
