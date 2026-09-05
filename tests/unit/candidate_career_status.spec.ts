import CandidateDTO from '../../src/dtos/CandidateDTO';
import { CreateCandidateDTO, UpdateCandidateDTO } from '../../src/dtos/CandidateMutationDTO';

describe('Candidate Career Status & Privacy DTOs', () => {
  it('deve mapear corretamente os atributos de status de carreira no CandidateDTO', () => {
    const rawCandidate = {
      id: 1,
      name: 'João Desenvolvedor',
      birth_date: '1990-01-01',
      cpf: 12345678900,
      user_id: 10,
      looking_for_job: true,
      in_career_transition: true,
      career_transition_target: 'Engenharia de Dados',
      accepts_entry_level: true
    };

    const dto = new CandidateDTO(rawCandidate);
    expect(dto.id).toBe(1);
    expect(dto.name).toBe('João Desenvolvedor');
    expect(dto.lookingForJob).toBe(true);
    expect(dto.inCareerTransition).toBe(true);
    expect(dto.careerTransitionTarget).toBe('Engenharia de Dados');
    expect(dto.acceptsEntryLevel).toBe(true);
  });

  it('deve utilizar defaults seguros (false/null) no CandidateDTO para registros legados', () => {
    const legacyCandidate = {
      id: 2,
      name: 'Candidato Legado',
      birth_date: '1985-10-10',
      cpf: 98765432100,
      user_id: 20
    };

    const dto = new CandidateDTO(legacyCandidate);
    expect(dto.lookingForJob).toBe(false);
    expect(dto.inCareerTransition).toBe(false);
    expect(dto.careerTransitionTarget).toBeNull();
    expect(dto.acceptsEntryLevel).toBe(false);
  });

  it('deve processar os atributos de carreira em CreateCandidateDTO e UpdateCandidateDTO', () => {
    const createInput = {
      name: 'Ana Dev',
      birthDate: '1998-04-12',
      userId: 30,
      mobilePhone: 11999998888,
      city: 'Curitiba',
      state: 'PR',
      neighborhood: 'Batel',
      number: '200',
      street: 'Rua das Flores',
      zipCode: 80000000,
      lookingForJob: true,
      inCareerTransition: true,
      careerTransitionTarget: 'UX/UI Design',
      acceptsEntryLevel: true
    };

    const createDTO = new CreateCandidateDTO(createInput);
    expect(createDTO.looking_for_job).toBe(true);
    expect(createDTO.in_career_transition).toBe(true);
    expect(createDTO.career_transition_target).toBe('UX/UI Design');
    expect(createDTO.accepts_entry_level).toBe(true);

    const updateDTO = new UpdateCandidateDTO({
      lookingForJob: false,
      inCareerTransition: false,
      careerTransitionTarget: null
    });
    expect(updateDTO.looking_for_job).toBe(false);
    expect(updateDTO.in_career_transition).toBe(false);
    expect(updateDTO.career_transition_target).toBeNull();
  });
});
