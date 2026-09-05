## 1. Levantamento por área

- [x] 1.1 Levantar capabilities do backend (GraphQL/REST) cruzando `openspec/specs/*/spec.md` com `src/`
- [x] 1.2 Levantar capabilities do frontend admin (`frontend/admin`) cruzando specs com rotas/telas reais
- [x] 1.3 Levantar capabilities do frontend client (`frontend/client`) cruzando specs com rotas/telas reais
- [x] 1.4 Levantar capabilities do app Android (`android/app`) cruzando specs com navegação/telas reais
- [x] 1.5 Avaliar `workix-frontend-vue` e justificar inclusão/exclusão do escopo de E2E

## 2. Consolidação

- [x] 2.1 Sintetizar os 5 levantamentos em um único `CAPABILITIES.md` na raiz do projeto
- [x] 2.2 Registrar explicitamente a divergência entre os projetos-irmãos citados no `CLAUDE.md` e o que existe fisicamente na máquina
- [x] 2.3 Destacar gaps críticos encontrados (auth guard desligado, gating de role inócuo, mensageria sem tempo real, telas Android órfãs, ausência de testes instrumentados)
- [x] 2.4 Propor estrutura de backlog de testes E2E por app (seção 6 do CAPABILITIES.md)

## 3. Artefatos do change

- [x] 3.1 Criar proposal.md explicando por que o levantamento foi feito e por que não altera comportamento (`skip_specs: true`)
- [x] 3.2 Criar design.md documentando a abordagem de pesquisa (specs como fonte primária, paralelização por área, critérios de exclusão do workix-vue)
- [x] 3.3 Criar tasks.md (este arquivo)

## 4. Próximos passos (fora deste change)

- [x] 4.1 Registrar cada gap crítico do CAPABILITIES.md como entrada em `KNOW_ISSUES.md` com contexto suficiente para reprodução futura
- [x] 4.2 Decidir com o usuário a ordem de prioridade dos apps para a primeira suíte de E2E
- [x] 4.3 Abrir um novo change OpenSpec por app/suíte de E2E (ex.: `e2e-suite-frontend-admin`, `e2e-suite-frontend-client`, `e2e-suite-android`) usando o CAPABILITIES.md como insumo de requirements
- [x] 4.4 Validar pontos de baixa confiança sinalizados no CAPABILITIES.md (ex.: entry points não confirmados no Android) antes de escrever o teste correspondente
