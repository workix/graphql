import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import CandidateActiveProcessesBadge from '../CandidateActiveProcessesBadge.vue';
import CandidateActiveProcessesModal from '../CandidateActiveProcessesModal.vue';
import { selectiveProcessesService } from '../../services/selectiveProcesses.service';

describe('CandidateActiveProcesses Components', () => {
  describe('CandidateActiveProcessesBadge.vue', () => {
    it('renderiza contagem e status ativo quando o candidato participa de processos', () => {
      const wrapper = mount(CandidateActiveProcessesBadge, {
        props: {
          candidateId: '1',
          initialSummary: {
            hasActiveProcesses: true,
            totalCount: 3,
            isRestricted: false
          }
        },
        global: {
          stubs: {
            CandidateActiveProcessesModal: true,
            'router-link': { template: '<a><slot /></a>' }
          }
        }
      });

      expect(wrapper.text()).toContain('3');
      expect(wrapper.text()).toContain('Processos Ativos');
      expect(wrapper.find('.active-processes-badge').classes()).toContain('is-active');
    });

    it('renderiza badge de Recurso Premium quando o acesso é restrito', () => {
      const wrapper = mount(CandidateActiveProcessesBadge, {
        props: {
          candidateId: '1',
          initialSummary: {
            hasActiveProcesses: false,
            totalCount: 0,
            isRestricted: true
          }
        },
        global: {
          stubs: {
            CandidateActiveProcessesModal: true,
            'router-link': { template: '<a><slot /></a>' }
          }
        }
      });

      expect(wrapper.text()).toContain('Recurso Premium');
      expect(wrapper.find('.active-processes-badge').classes()).toContain('is-restricted');
    });

    it('abre modal de detalhes ao clicar no badge', async () => {
      const wrapper = mount(CandidateActiveProcessesBadge, {
        props: {
          candidateId: '1',
          initialSummary: {
            hasActiveProcesses: true,
            totalCount: 2,
            isRestricted: false
          }
        },
        global: {
          stubs: {
            'router-link': { template: '<a><slot /></a>' }
          }
        }
      });

      await wrapper.find('.active-processes-badge').trigger('click');
      expect(wrapper.findComponent(CandidateActiveProcessesModal).props('isOpen')).toBe(true);
    });
  });

  describe('CandidateActiveProcessesModal.vue', () => {
    it('renderiza estado de bloqueio e convite premium quando isRestricted é true', async () => {
      vi.spyOn(selectiveProcessesService, 'getCandidateActiveProcesses').mockResolvedValueOnce({
        candidateId: '1',
        hasActiveProcesses: false,
        totalCount: 0,
        isRestricted: true,
        restrictionReason: 'Disponível exclusivamente para empresas assinantes do plano Premium.',
        processes: []
      });

      const wrapper = mount(CandidateActiveProcessesModal, {
        props: {
          isOpen: true,
          candidateId: '1'
        },
        global: {
          stubs: {
            'router-link': { template: '<a><slot /></a>' }
          }
        }
      });

      await flushPromises();

      expect(wrapper.text()).toContain('Informação Exclusiva do Plano Premium');
      expect(wrapper.text()).toContain('Conhecer Planos Premium');
    });

    it('renderiza lista de processos ativos com suporte a empresas confidenciais', async () => {
      vi.spyOn(selectiveProcessesService, 'getCandidateActiveProcesses').mockResolvedValueOnce({
        candidateId: '1',
        hasActiveProcesses: true,
        totalCount: 2,
        isRestricted: false,
        processes: [
          {
            id: 'proc-1',
            jobId: '1',
            jobTitle: 'Desenvolvedor Vue 3 Sênior',
            companyId: '10',
            companyName: 'Tech Brasil Corp',
            companyLogo: 'https://example.com/logo.png',
            isConfidential: false,
            status: 'INTERVIEW',
            currentStage: 'Entrevista Técnica'
          },
          {
            id: 'proc-2',
            jobId: '2',
            jobTitle: 'Tech Lead Secreto',
            companyId: null,
            companyName: 'Empresa Confidencial',
            companyLogo: null,
            isConfidential: true,
            status: 'SCREENING',
            currentStage: 'Triagem'
          }
        ]
      });

      const wrapper = mount(CandidateActiveProcessesModal, {
        props: {
          isOpen: true,
          candidateId: '1'
        },
        global: {
          stubs: {
            'router-link': { template: '<a><slot /></a>' }
          }
        }
      });

      await flushPromises();

      expect(wrapper.text()).toContain('2 processos seletivos ativos');
      expect(wrapper.text()).toContain('Desenvolvedor Vue 3 Sênior');
      expect(wrapper.text()).toContain('Tech Brasil Corp');
      expect(wrapper.text()).toContain('Tech Lead Secreto');
      expect(wrapper.text()).toContain('Empresa Confidencial');
    });
  });
});
