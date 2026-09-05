import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from '../Pagination.vue';

describe('Pagination.vue', () => {
  it('renderiza paginacao quando totalPages > 1', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 2,
        totalPages: 5
      }
    });

    expect(wrapper.find('nav').exists()).toBe(true);
    const pages = wrapper.findAll('li');
    expect(pages.length).toBe(7); // Anterior + 5 paginas + Proximo
    expect(wrapper.find('li.active').text()).toBe('2');
  });

  it('emite page-change ao clicar em uma nova pagina', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 4
      }
    });

    const page3 = wrapper.findAll('li')[3].find('a');
    await page3.trigger('click');

    expect(wrapper.emitted('page-change')).toBeTruthy();
    expect(wrapper.emitted('page-change')![0]).toEqual([3]);
  });

  it('nao renderiza quando totalPages <= 1', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 1
      }
    });

    expect(wrapper.find('nav').exists()).toBe(false);
  });
});
