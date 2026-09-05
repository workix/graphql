import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import JobCard from '../JobCard.vue';

describe('JobCard.vue', () => {
  const mockJob = {
    id: '1',
    title: 'Desenvolvedor Full Stack',
    employmentType: 'CLT',
    categories: ['MEIO_PERIODO', 'TEMPORARIO'],
    minPayment: 8000,
    maxPayment: 12000,
    featured: true,
    company: {
      name: 'Tech Solutions'
    }
  };

  it('renderiza titulo da vaga e nome da empresa', () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: {
        stubs: {
          'router-link': { template: '<a><slot /></a>' }
        }
      }
    });

    expect(wrapper.text()).toContain('Desenvolvedor Full Stack');
    expect(wrapper.text()).toContain('Tech Solutions');
    expect(wrapper.text()).toContain('DESTAQUE');
  });

  it('renderiza badges de categorias formatadas e faixa salarial', () => {
    const wrapper = mount(JobCard, {
      props: { job: mockJob },
      global: { stubs: ['router-link'] }
    });

    expect(wrapper.text()).toContain('Meio Período');
    expect(wrapper.text()).toContain('Temporário');
    expect(wrapper.text()).toContain('CLT');
  });

  it('renderiza modo confidencial quando isConfidential e true', () => {
    const confidentialJob = {
      ...mockJob,
      isConfidential: true
    };

    const wrapper = mount(JobCard, {
      props: { job: confidentialJob },
      global: { stubs: ['router-link'] }
    });

    expect(wrapper.text()).toContain('CONFIDENCIAL');
    expect(wrapper.text()).toContain('Empresa Confidencial');
  });
});
