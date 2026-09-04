import JobDTO from '../../src/dtos/JobDTO';
import { CreateJobDTO, UpdateJobDTO } from '../../src/dtos/JobMutationDTO';

describe('Job Model & DTOs for PCD and Remote Support', () => {
  it('should correctly map explicit PCD and Remote fields in JobDTO', () => {
    const rawJob = {
      id: 1,
      title: 'Desenvolvedor Frontend Sênior',
      is_pcd: true,
      is_remote: true,
      pcd_details: 'Vaga com suporte a leitor de tela e jornada flexível',
      accessibility_features: '["screen_reader", "flexible_hours"]',
      workplace_type: 'REMOTE',
      activated: true
    };

    const dto = new JobDTO(rawJob);

    expect(dto.isPcd).toBe(true);
    expect(dto.isRemote).toBe(true);
    expect(dto.pcdDetails).toBe('Vaga com suporte a leitor de tela e jornada flexível');
    expect(dto.accessibilityFeatures).toEqual(['screen_reader', 'flexible_hours']);
    expect(dto.workplaceType).toBe('REMOTE');
  });

  it('should maintain backward compatibility for legacy jobs without explicit PCD or Remote flags', () => {
    const legacyJob = {
      id: 2,
      title: 'Analista de Sistemas',
      workplace_type: 'REMOTE',
      activated: true
      // is_pcd, is_remote, pcd_details ausentes
    };

    const dto = new JobDTO(legacyJob);

    expect(dto.isPcd).toBe(false);
    expect(dto.isRemote).toBe(true); // derivado de workplace_type === 'REMOTE'
    expect(dto.pcdDetails).toBeNull();
    expect(dto.accessibilityFeatures).toEqual([]);
  });

  it('should populate PCD and Remote fields in CreateJobDTO and UpdateJobDTO', () => {
    const createInput = {
      title: 'Engenheiro de Software',
      activated: true,
      benefits: 'VR',
      description: 'Desc',
      featured: false,
      jobCategory: 'OPERATOR',
      jobType: 'FULLTIME',
      maxPayment: 10000,
      minPayment: 8000,
      requirement: 'Req',
      companyId: 1,
      isPcd: true,
      isRemote: true,
      pcdDetails: 'Acessibilidade física no escritório',
      accessibilityFeatures: ['wheelchair_ramp', 'accessible_restroom']
    };

    const createDto = new CreateJobDTO(createInput);
    expect(createDto.is_pcd).toBe(true);
    expect(createDto.is_remote).toBe(true);
    expect(createDto.workplace_type).toBe('REMOTE');
    expect(createDto.pcd_details).toBe('Acessibilidade física no escritório');
    expect(createDto.accessibility_features).toBe(JSON.stringify(['wheelchair_ramp', 'accessible_restroom']));

    const updateInput = {
      isPcd: false,
      isRemote: false,
      workplaceType: 'ON_SITE'
    };
    const updateDto = new UpdateJobDTO(updateInput);
    expect(updateDto.is_pcd).toBe(false);
    expect(updateDto.is_remote).toBe(false);
    expect(updateDto.workplace_type).toBe('ON_SITE');
  });
});
