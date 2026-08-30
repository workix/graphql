# PROMPT — IMPLEMENTAÇÃO COMPLETA DOS FRONTENDS

Você está trabalhando neste repositório como **engenheiro de software responsável pela implementação dos frontends da aplicação**.

O projeto atual é predominantemente um **backend**, porém existe uma pasta `frontend` na raiz do projeto contendo artefatos, exemplos e referências visuais que deverão ser utilizados para construir as interfaces da aplicação.

Sua responsabilidade é analisar o projeto inteiro e implementar **DOIS FRONTENDS COMPLETOS E FUNCIONAIS**:

1. **Frontend do Cliente**
2. **Frontend Administrativo**

Não trate este trabalho como criação de protótipos. As interfaces deverão estar efetivamente integradas ao backend existente.

---

# 1. REGRA PRINCIPAL

**NÃO COMECE A IMPLEMENTAR TELAS IMEDIATAMENTE.**

Antes de escrever código de frontend, você deverá:

1. Inspecionar a estrutura completa do projeto.
2. Entender a arquitetura do backend.
3. Identificar APIs, controllers, services, DTOs, entidades, autenticação, autorização e regras de negócio.
4. Analisar TODOS os artefatos existentes na pasta `frontend`.
5. Entender completamente o Design Spec fornecido.
6. Mapear todas as funcionalidades existentes.
7. Determinar quais funcionalidades pertencem ao módulo do cliente.
8. Determinar quais funcionalidades pertencem ao módulo administrativo.
9. Criar um plano de implementação.
10. Somente depois iniciar o desenvolvimento.

**Não faça suposições sobre funcionalidades existentes.**

Sempre que uma funcionalidade puder ser identificada diretamente no código do backend, utilize o backend como fonte de verdade.

---

# 2. FASE 1 — ANÁLISE DO PROJETO

Primeiramente faça uma análise completa do repositório.

Investigue, entre outros:

- Estrutura de diretórios;
- Framework utilizado no backend;
- Arquitetura;
- Controllers;
- REST APIs;
- GraphQL;
- Services;
- DTOs;
- Entidades;
- Repositories;
- Segurança;
- Autenticação;
- Autorização;
- Roles;
- Permissões;
- Configurações;
- Variáveis de ambiente;
- Tratamento de erros;
- Paginação;
- Filtros;
- Uploads/downloads;
- Relatórios;
- Jobs;
- Webhooks;
- Integrações externas;
- Funcionalidades administrativas;
- Funcionalidades destinadas ao cliente.

Procure também documentação existente:

- README;
- `.md`;
- especificações;
- OpenAPI/Swagger;
- arquivos de configuração;
- documentação de APIs;
- exemplos;
- testes.

Não altere o backend nesta primeira fase.

---

# 3. FASE 2 — ANÁLISE DOS ARTEFATOS FRONTEND

Analise profundamente a pasta:

`frontend`

Não considere esses arquivos apenas como exemplos superficiais.

Eles representam o **Design Spec de referência do módulo do cliente**.

Identifique:

- Layout;
- Header;
- Sidebar;
- Menu;
- Navegação;
- Cards;
- Tabelas;
- Formulários;
- Inputs;
- Selects;
- Comboboxes;
- Modais;
- Dialogs;
- Toasts;
- Alertas;
- Botões;
- Ícones;
- Tipografia;
- Cores;
- Espaçamentos;
- Bordas;
- Sombras;
- Responsividade;
- Estados de loading;
- Estados vazios;
- Estados de erro;
- Paginação;
- Interações;
- Animações;
- Padrões de UX.

Determine quais componentes podem ser reutilizados ou precisam ser recriados.

**Não substitua o Design Spec por um design genérico de sua preferência.**

---

# 4. FASE 3 — MAPEAMENTO FUNCIONAL

Antes da implementação, crie um inventário completo das funcionalidades.

Utilize uma estrutura semelhante a:

| Módulo | Funcionalidade | API | Método | View | Permissão | Status |
|---|---|---|---|---|---|---|
| Cliente | ... | ... | GET | ... | ... | Pendente |
| Cliente | ... | ... | POST | ... | ... | Pendente |
| Admin | ... | ... | GET | ... | ... | Pendente |

O objetivo é garantir que nenhuma funcionalidade relevante do backend fique sem interface.

Classifique as funcionalidades em:

### Cliente

Funcionalidades utilizadas pelos usuários/clientes finais.

### Administrativo

Funcionalidades utilizadas por administradores, operadores ou usuários com permissões especiais.

Se houver dúvida sobre a classificação de uma funcionalidade, analise:

- Roles;
- Permissões;
- Controllers;
- Regras de negócio;
- Menus existentes;
- Documentação.

---

# 5. FASE 4 — ARQUITETURA DOS FRONTENDS

Defina uma arquitetura clara antes de implementar.

Deverão existir dois frontends independentes.

## Frontend 1 — Cliente

Tecnologia:

- Vue.js;
- Utilize a versão moderna e compatível com o projeto;
- Componentização;
- Router;
- Gerenciamento de estado quando necessário;
- Camada de serviços para comunicação com backend.

Utilize os artefatos da pasta `frontend` como Design Spec.

## Frontend 2 — Administrativo

Tecnologia:

- Vue.js;
- Vuetify 3;
- Vue Router;
- Gerenciamento de estado quando necessário;
- Camada de serviços para comunicação com backend.

O frontend administrativo deverá utilizar os componentes e padrões de UI do Vuetify 3.

---

# 6. ESTRUTURA DOS PROJETOS

Crie uma estrutura profissional.

Evite colocar toda a aplicação em poucos arquivos.

Separe adequadamente:

```text
src/
├── assets/
├── components/
├── layouts/
├── views/
├── router/
├── stores/
├── services/
├── composables/
├── utils/
├── types/
├── plugins/
└── ...
```

A estrutura pode ser adaptada conforme a arquitetura escolhida, desde que mantenha separação clara de responsabilidades.

---

# 7. INTEGRAÇÃO COM O BACKEND

As telas devem utilizar as APIs reais existentes.

**Não crie mocks permanentes para substituir APIs reais.**

Não invente endpoints.

Antes de implementar uma chamada:

1. Localize o endpoint no backend.
2. Verifique método HTTP.
3. Verifique parâmetros.
4. Verifique payload.
5. Verifique resposta.
6. Verifique erros possíveis.
7. Verifique autenticação.
8. Verifique permissões.

Depois implemente o client correspondente no frontend.

Centralize as chamadas em uma camada de serviços.

Evite chamadas HTTP diretamente espalhadas pelas views.

---

# 8. AUTENTICAÇÃO E AUTORIZAÇÃO

Analise como o backend implementa:

- Login;
- Token;
- JWT;
- Sessão;
- Refresh token;
- Roles;
- Permissions;
- Expiração;
- Logout.

Implemente o frontend de acordo com o mecanismo real utilizado pelo backend.

Não invente um mecanismo de autenticação paralelo.

As rotas deverão possuir proteção adequada.

Exemplo conceitual:

```text
Usuário não autenticado
        ↓
      Login
        ↓
    Dashboard
        ↓
Validação de permissões
        ↓
Acesso às funcionalidades
```

Usuários sem permissão não devem conseguir acessar funcionalidades apenas digitando a URL diretamente.

---

# 9. FRONTEND DO CLIENTE — DESIGN SPEC

O frontend do cliente deverá seguir **100% do padrão visual identificado nos artefatos fornecidos**, sempre que tecnicamente possível.

Não substitua automaticamente os componentes por:

- Bootstrap;
- Material Design genérico;
- Tailwind genérico;
- templates prontos;
- outro Design System.

O objetivo é reproduzir a identidade visual dos exemplos.

Quando for necessário criar uma tela que não possui equivalente visual nos exemplos, derive o design dos padrões existentes.

### Regra de consistência

Se uma tabela possui determinado padrão visual nos exemplos, todas as tabelas semelhantes deverão seguir o mesmo padrão.

O mesmo vale para:

- Formulários;
- Botões;
- Modais;
- Headers;
- Menus;
- Cards;
- Alertas;
- Paginação;
- Estados de loading;
- Estados vazios.

---

# 10. FRONTEND ADMINISTRATIVO — VUETIFY 3

O módulo administrativo deverá ser construído utilizando **Vuetify 3**.

Priorize:

- `v-app`;
- `v-navigation-drawer`;
- `v-app-bar`;
- `v-main`;
- `v-container`;
- `v-card`;
- `v-data-table`;
- `v-form`;
- `v-text-field`;
- `v-select`;
- `v-autocomplete`;
- `v-dialog`;
- `v-snackbar`;
- `v-alert`;
- `v-pagination`;
- componentes adequados do Vuetify.

O layout deverá ser profissional e consistente.

Crie um padrão visual único para todo o painel administrativo.

---

# 11. REGRAS PARA VIEWS

Cada view deve possuir:

### Estado de carregamento

Enquanto a API estiver sendo processada:

- Mostrar loading;
- Evitar múltiplos submits;
- Evitar estados inconsistentes.

### Estado de sucesso

Após operações:

- Informar sucesso;
- Atualizar os dados quando necessário.

### Estado de erro

Em caso de erro:

- Mostrar mensagem compreensível;
- Não expor stack trace ao usuário;
- Preservar informações úteis para diagnóstico quando apropriado.

### Estado vazio

Quando não existirem registros:

- Mostrar mensagem adequada;
- Explicar o que aconteceu;
- Disponibilizar ação quando fizer sentido.

---

# 12. FORMULÁRIOS

Todos os formulários devem possuir:

- Validação;
- Mensagens de erro;
- Campos obrigatórios;
- Estados disabled;
- Loading durante envio;
- Tratamento de erros do backend;
- Feedback de sucesso;
- Prevenção de submissões duplicadas.

Não confiar apenas na validação do frontend.

A validação do backend continua sendo a autoridade final.

---

# 13. LISTAGENS E TABELAS

Para todas as listagens, avalie se o backend oferece:

- Paginação;
- Ordenação;
- Filtros;
- Pesquisa;
- Ordenação por coluna;
- Busca por texto;
- Filtros combinados.

Sempre que essas funcionalidades existirem no backend, disponibilize-as na interface.

Evite carregar milhares de registros desnecessariamente no frontend.

Prefira paginação server-side quando suportada pelo backend.

---

# 14. RESPONSIVIDADE

Os dois frontends devem funcionar adequadamente em:

- Desktop;
- Notebook;
- Tablet;
- Mobile.

Não implemente apenas para resolução 1920x1080.

Verifique especialmente:

- Menus;
- Tabelas;
- Formulários;
- Dialogs;
- Cards;
- Navegação;
- Botões.

---

# 15. NÃO DUPLICAR CÓDIGO

Crie componentes reutilizáveis.

Se três telas possuem o mesmo comportamento, não copie e cole a implementação.

Exemplos:

```text
UserForm
DataTable
ConfirmDialog
LoadingOverlay
ErrorAlert
Pagination
SearchField
CertificateSelector
```

Os nomes acima são apenas exemplos. Analise o projeto e crie os componentes que realmente forem necessários.

---

# 16. CONFIGURAÇÃO DE AMBIENTES

Não deixe URLs do backend espalhadas pelo código.

Utilize configuração por ambiente.

Exemplo conceitual:

```text
.env
.env.development
.env.production
```

O frontend deverá conseguir alterar a URL do backend sem necessidade de modificar dezenas de arquivos.

---

# 17. PROIBIÇÕES

Durante a implementação:

### NÃO

- Inventar endpoints;
- Inventar regras de negócio;
- Criar funcionalidades inexistentes sem justificativa;
- Remover funcionalidades existentes;
- Substituir APIs reais por mocks permanentes;
- Duplicar código sem necessidade;
- Ignorar erros do backend;
- Ignorar permissões;
- Criar telas sem integração;
- Fazer alterações destrutivas no backend sem necessidade;
- Alterar contratos de API apenas para facilitar o frontend;
- Ignorar o Design Spec;
- Criar apenas um conjunto de telas estáticas.

### SEMPRE

- Investigue primeiro;
- Planeje;
- Implemente;
- Teste;
- Corrija;
- Valide;
- Documente.

---

# 18. MELHORIAS

Você possui liberdade para melhorar a implementação quando identificar:

- Problemas de UX;
- Inconsistências;
- Fluxos desnecessariamente complexos;
- Falta de feedback;
- Problemas de responsividade;
- Problemas de acessibilidade;
- Componentes duplicados;
- Problemas de performance.

Porém:

**Não descaracterize o Design Spec do módulo do cliente.**

Melhorias devem ser incrementais e justificáveis.

---

# 19. TESTES E VALIDAÇÃO

Após implementar cada módulo:

1. Execute o build.
2. Verifique erros de TypeScript/JavaScript.
3. Verifique erros de lint.
4. Verifique rotas.
5. Verifique chamadas ao backend.
6. Verifique autenticação.
7. Verifique permissões.
8. Verifique estados de loading.
9. Verifique estados de erro.
10. Verifique formulários.
11. Verifique responsividade.

Corrija os problemas encontrados antes de considerar a tarefa concluída.

---

# 20. AUDITORIA FINAL

Ao final, faça uma auditoria comparando:

### Backend

```text
Funcionalidade do backend
        ↓
Existe view?
        ↓
Existe rota?
        ↓
Existe integração API?
        ↓
Existe controle de permissão?
```

Nenhuma funcionalidade relevante deverá permanecer sem tratamento.

### Design

Compare todas as views do módulo cliente com os artefatos da pasta `frontend`.

Verifique:

- Layout;
- Tipografia;
- Espaçamento;
- Componentes;
- Cores;
- Navegação;
- Estados;
- Responsividade.

### Administração

Verifique se todas as funcionalidades administrativas identificadas foram implementadas utilizando Vuetify 3.

---

# 21. DOCUMENTAÇÃO FINAL

Crie uma documentação na raiz do projeto contendo:

```text
FRONTEND_IMPLEMENTATION.md
```

Documente:

- Arquitetura;
- Tecnologias;
- Estrutura dos dois frontends;
- Como executar;
- Como gerar build;
- Configuração de ambiente;
- URLs das APIs;
- Autenticação;
- Autorização;
- Rotas;
- Views;
- Componentes;
- Integrações;
- Decisões arquiteturais;
- Melhorias realizadas;
- Limitações encontradas;
- Funcionalidades não implementadas e justificativa, caso exista.

Inclua também uma tabela final:

| Funcionalidade | Módulo | View | API | Permissão | Implementado |
|---|---|---|---|---|---|
| ... | Cliente | ... | ... | ... | ✅ |
| ... | Admin | ... | ... | ... | ✅ |

---

# 22. CRITÉRIO DE CONCLUSÃO

A tarefa **NÃO estará concluída** simplesmente porque os projetos compilam.

Considere o trabalho concluído somente quando:

- [ ] Backend foi analisado;
- [ ] Artefatos da pasta `frontend` foram analisados;
- [ ] Design Spec foi identificado;
- [ ] Funcionalidades foram mapeadas;
- [ ] Frontend Cliente foi criado;
- [ ] Frontend Cliente está integrado ao backend;
- [ ] Frontend Cliente segue o Design Spec;
- [ ] Frontend Administrativo foi criado;
- [ ] Frontend Administrativo utiliza Vuetify 3;
- [ ] Autenticação foi implementada;
- [ ] Autorização foi implementada;
- [ ] Rotas estão protegidas;
- [ ] APIs estão integradas;
- [ ] Formulários possuem validação;
- [ ] Listagens possuem os filtros/paginação necessários;
- [ ] Estados de loading foram tratados;
- [ ] Estados de erro foram tratados;
- [ ] Estados vazios foram tratados;
- [ ] Responsividade foi verificada;
- [ ] Build dos dois projetos funciona;
- [ ] Não existem erros críticos;
- [ ] Funcionalidades foram auditadas contra o backend;
- [ ] Documentação foi criada.

---

# 23. ORDEM OBRIGATÓRIA DE EXECUÇÃO

Execute o trabalho seguindo exatamente esta ordem:

```text
FASE 1
↓
Explorar repositório

FASE 2
↓
Analisar backend

FASE 3
↓
Analisar pasta frontend e Design Spec

FASE 4
↓
Mapear funcionalidades

FASE 5
↓
Separar Cliente x Administrativo

FASE 6
↓
Definir arquitetura

FASE 7
↓
Criar estrutura dos projetos

FASE 8
↓
Implementar frontend Cliente

FASE 9
↓
Integrar frontend Cliente com backend

FASE 10
↓
Implementar frontend Administrativo com Vuetify 3

FASE 11
↓
Integrar frontend Administrativo com backend

FASE 12
↓
Testar e corrigir

FASE 13
↓
Auditar cobertura funcional

FASE 14
↓
Auditar Design Spec

FASE 15
↓
Criar documentação final

FASE 16
↓
Executar build final dos dois frontends
```

**Não pule fases.**

Se durante a análise você identificar uma dependência ou informação necessária para uma implementação correta, investigue o código existente antes de fazer suposições.

O objetivo final é entregar **dois frontends reais, completos, funcionais, integrados ao backend e prontos para evolução em produção**, e não apenas uma demonstração visual.