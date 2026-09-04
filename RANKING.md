# Algoritmo de Ranqueamento Orgânico e Regras de Visibilidade (RANKING.md)

Este documento descreve a fórmula oficial e auditável de ranqueamento orgânico da plataforma **Workix**, em cumprimento ao **Pacto #2 e Pacto #3 de Transparência e Integridade**:
1. Toda visibilidade paga é identificada explicitamente.
2. Ninguém desaparece nem é rebaixado do resultado orgânico por não pagar.

---

## 1. Fórmula de Ranqueamento Orgânico de Vagas

O resultado orgânico de busca e listagem de vagas é ordenado pelo cálculo do índice de relevância composto ($S_{\text{orgânico}}$):

$$S_{\text{vaga}} = (W_{\text{match}} \cdot S_{\text{match}}) + (W_{\text{recência}} \cdot S_{\text{recência}}) + (W_{\text{resposta}} \cdot S_{\text{resposta}})$$

### Componentes da Pontuação:

1. **$S_{\text{match}}$ (Correspondência de Termos e Filtros — Peso 50%)**:
   - Pontuação de 0 a 100 avaliando compatibilidade entre a busca do candidato (cargo, habilidades, cidade, nível de experiência e tipo de contratação) e os requisitos da vaga.
2. **$S_{\text{recência}}$ (Recência da Publicação — Peso 30%)**:
   - Pontuação que decai proporcionalmente à idade da vaga desde a publicação:
     $$S_{\text{recência}} = \max\left(0, 100 - \frac{\text{dias\_desde\_publicação}}{30} \times 100\right)$$
3. **$S_{\text{resposta}}$ (Taxa de Resposta da Empresa — Peso 20%)**:
   - Pontuação proporcional à taxa pública de resposta da organização nos últimos 90 dias ($R_{90d} \in [0, 100]$):
     $$S_{\text{resposta}} = R_{90d}$$
   - *Finalidade*: incentivar empresas a responderem candidatos e eliminarem o silêncio em processos seletivos.

---

## 2. Fórmula de Ranqueamento Orgânico de Perfis Profissionais

Para recrutadores pesquisando profissionais:

$$S_{\text{candidato}} = (0.6 \cdot S_{\text{skills\_match}}) + (0.25 \cdot S_{\text{completude\_perfil}}) + (0.15 \cdot S_{\text{atividade\_recente}})$$

- **$S_{\text{skills\_match}}$**: Correspondência entre as competências e histórico do currículo com os filtros da busca.
- **$S_{\text{completude\_perfil}}$**: Nível de preenchimento estruturado do currículo (formação, experiências e competências).
- **$S_{\text{atividade\_recente}}$**: Recência de login ou atualização de perfil.

---

## 3. Regras Inegociáveis de Vagas Patrocinadas (Sponsored Jobs)

1. **Slots Adicionais**: Vagas patrocinadas ocupam exclusivamente slots adicionais destacados no topo da listagem (limitadas a no máximo 3 posições simultâneas por página de resultado).
2. **Não Supressão do Orgânico**: A lista orgânica é calculada e renderizada integralmente abaixo dos slots patrocinados. Uma vaga gratuita relevante continua na primeira posição orgânica.
3. **Rotulagem Mandatória**: Toda vaga impulsionada retorna obrigatoriamente `is_sponsored = true` e o rótulo imutável `sponsor_label = 'Patrocinada'`. O contrato da API proíbe a supressão desse rótulo.
4. **Sem Vaga Fantasma em Destaque**: O patrocínio compra alcance, nunca isenção de validade (`expires_at`) ou de desfecho obrigatório.
