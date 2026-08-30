# Implementação Completa dos Frontends a partir do Backend GraphQL

Temos um backend GraphQL disponível em:

`http://localhost:4000/graphql`

O objetivo desta etapa é **implementar o máximo possível das funcionalidades do sistema nos três projetos existentes**, utilizando o backend GraphQL como fonte principal de dados e regras de negócio.

## Projetos envolvidos

Você deverá trabalhar simultaneamente nos três projetos:

1. **Android**
2. **Frontend Cliente**
3. **Frontend Admin**

Não trate nenhum dos três projetos como protótipo. Todos devem evoluir para aplicações funcionais, consumindo efetivamente o backend.

---

# 1. Antes de implementar: faça uma análise completa

Primeiramente, analise o projeto inteiro.

Identifique:

- Todas as queries GraphQL disponíveis.
- Todas as mutations GraphQL disponíveis.
- Todos os tipos, inputs, enums e relacionamentos.
- Parâmetros obrigatórios e opcionais.
- Paginação.
- Filtros.
- Ordenação.
- Operações CRUD.
- Uploads/downloads, caso existam.
- Operações assíncronas.
- Status e estados das entidades.
- Tratamento de erros.
- Funcionalidades já implementadas parcialmente nos frontends.
- Componentes reutilizáveis existentes.
- Rotas existentes.
- Telas existentes.
- Modelos/interfaces já definidos.
- Serviços de comunicação com o backend.
- Qualquer funcionalidade existente no backend que ainda não possua interface.

Não faça implementações baseadas em suposições.

**A implementação deve ser guiada pelo código e pelas APIs realmente disponíveis no backend.**

---

# 2. Mapear Backend → Frontends

Crie mentalmente e, se fizer sentido para o projeto, documente um mapa semelhante a:

```text
GraphQL Query/Mutation
        │
        ├── Frontend Cliente
        │      └── Tela / Componente
        │
        ├── Frontend Admin
        │      └── Tela / Componente
        │
        └── Android
               └── Tela / Componente
```

Para cada funcionalidade encontrada no backend, determine:

- Em qual frontend ela deve existir.
- Qual tela será responsável por ela.
- Quais operações GraphQL serão utilizadas.
- Quais dados serão exibidos.
- Quais ações o usuário poderá executar.

O objetivo é evitar que existam funcionalidades disponíveis no backend sem uma interface correspondente quando fizer sentido disponibilizá-las.

---

# 3. Implementar todas as telas possíveis

Quero que você **implemente todas as telas e funcionalidades que possam ser derivadas das APIs existentes**.

Isso inclui, quando aplicável:

- Listagens.
- Detalhes.
- Consultas.
- Pesquisas.
- Filtros.
- Ordenação.
- Paginação.
- CRUD completo.
- Criação.
- Edição.
- Exclusão.
- Visualização.
- Ações específicas de cada entidade.
- Status.
- Relacionamentos.
- Histórico.
- Dashboards.
- Indicadores.
- Operações administrativas.
- Formulários.
- Seleções.
- Modais.
- Confirmações.
- Mensagens de sucesso/erro.
- Estados de loading.
- Estados vazios.
- Tratamento de erros.
- Operações assíncronas.
- Refresh/reconsulta dos dados.

Sempre que existir uma operação no backend que possa ser utilizada por uma interface, avalie e implemente essa interface.

---

# 4. Frontend Cliente

No **frontend cliente**, implemente todas as funcionalidades destinadas ao usuário final.

Reutilize o padrão visual e arquitetural já existente no projeto.

Não crie telas isoladas ou desconectadas.

Cada tela deve:

- Possuir rota.
- Estar integrada à navegação.
- Consumir o GraphQL real.
- Possuir estados de loading.
- Possuir tratamento de erro.
- Possuir estados vazios.
- Atualizar os dados após mutations.
- Utilizar componentes reutilizáveis quando possível.

Não utilize mocks quando existir uma API real disponível.

---

# 5. Frontend Admin

No **frontend admin**, implemente todas as funcionalidades administrativas encontradas no backend.

Priorize:

- CRUDs.
- Gerenciamento de entidades.
- Configurações.
- Consultas administrativas.
- Relatórios/indicadores, quando suportados.
- Gerenciamento de usuários/recursos, caso exista API para isso.
- Operações de manutenção.
- Visualização detalhada das entidades.
- Ações administrativas disponíveis através das mutations.

O Admin deve ser uma interface funcional sobre o backend, e não apenas uma representação visual.

---

# 6. Android

No projeto **Android**, implemente as mesmas funcionalidades disponíveis para o cliente sempre que fizer sentido para a plataforma.

O Android deverá:

- Consumir diretamente o backend GraphQL.
- Possuir telas equivalentes às funcionalidades do frontend cliente.
- Possuir navegação funcional.
- Possuir estados de loading.
- Possuir tratamento de erros.
- Possuir formulários.
- Possuir listagens.
- Possuir detalhes.
- Possuir filtros e pesquisas quando aplicáveis.
- Executar mutations reais.
- Atualizar os dados após operações.

Mantenha a arquitetura preparada para a evolução do projeto para **Kotlin**, conforme o planejamento anterior.

Não simplifique funcionalidades apenas porque estão sendo implementadas no Android.

---

# 7. Firebase Authentication

**NÃO implementar autenticação Firebase nesta etapa.**

Temos uma camada de autenticação baseada em Firebase planejada para uma etapa futura, porém ela **não faz parte deste trabalho agora**.

Por enquanto:

- Desabilite a obrigatoriedade do Firebase Authentication.
- Remova/bypasse guards de autenticação que impeçam a execução das telas.
- Não implemente login Firebase.
- Não crie dependência das telas em tokens Firebase.
- Não bloqueie as funcionalidades por ausência de autenticação.
- Caso existam interceptors/middlewares relacionados exclusivamente ao Firebase, deixe-os desabilitados de maneira organizada.

Porém, **não destrua a arquitetura de segurança**.

Estruture o código de maneira que futuramente seja possível adicionar:

```text
Firebase Authentication
        ↓
Token
        ↓
GraphQL
        ↓
Autorização
```

sem precisar reescrever todas as telas.

Se houver código de autenticação existente, prefira criar uma configuração/feature flag ou abstração que permita desabilitá-lo temporariamente.

---

# 8. Não inventar APIs

Uma regra fundamental:

**Não invente endpoints, queries ou mutations.**

O backend GraphQL em:

`http://localhost:4000/graphql`

é a fonte da verdade.

Se uma funcionalidade não possui suporte no backend:

1. Não invente uma implementação fake.
2. Não crie dados mockados para mascarar a ausência da API.
3. Registre a funcionalidade como dependência futura.
4. Continue implementando tudo que já possui suporte no backend.

---

# 9. Consumo real do GraphQL

Todos os dados das telas devem ser obtidos através do GraphQL real.

Evite:

```text
mockData
fakeData
dummyData
hardcoded entities
```

quando existir uma operação GraphQL correspondente.

Crie uma camada organizada para o consumo da API, respeitando a arquitetura de cada projeto.

Centralize, quando apropriado:

- Queries.
- Mutations.
- Fragments.
- Types.
- Cliente GraphQL.
- Tratamento de erros.
- Configuração da URL.

A URL atual deve ser:

`http://localhost:4000/graphql`

mas mantenha-a configurável através de configuração/environment, para que posteriormente possamos alterar o endereço sem modificar o código das telas.

---

# 10. Baby Steps

Não tente implementar tudo de uma única vez.

Trabalhe incrementalmente.

A ordem esperada é:

### Etapa 1 — Análise

Mapear completamente:

- Backend GraphQL.
- Frontend Cliente.
- Frontend Admin.
- Android.

### Etapa 2 — Infraestrutura

Garantir que os três projetos conseguem:

- Buildar.
- Executar.
- Conectar ao GraphQL.
- Fazer uma primeira query real.

### Etapa 3 — Primeira funcionalidade

Escolher uma funcionalidade representativa e implementá-la completamente nos projetos aplicáveis.

### Etapa 4 — Expansão

Continuar funcionalidade por funcionalidade.

Após cada implementação:

1. Build.
2. Corrigir erros.
3. Validar integração com GraphQL.
4. Validar navegação.
5. Validar estados de erro/loading.
6. Fazer commit.

---

# 11. Commits incrementais

Faça commits pequenos e coerentes.

Exemplos:

```text
feat(client): implement customer dashboard
feat(admin): implement users CRUD
feat(android): implement customer list
feat(graphql): add shared client configuration
fix(client): handle graphql mutation errors
fix(android): refresh list after mutation
```

Não acumule dezenas de funcionalidades em um único commit.

Cada commit deve representar uma unidade funcional compreensível.

---

# 12. Critério de conclusão

O trabalho desta etapa somente será considerado concluído quando você tiver:

- Auditado as APIs GraphQL disponíveis.
- Mapeado as funcionalidades.
- Implementado todas as telas possíveis nos três projetos.
- Conectado as telas às APIs reais.
- Eliminado mocks onde houver APIs disponíveis.
- Implementado CRUDs suportados pelo backend.
- Implementado consultas, filtros e paginações suportados pelo backend.
- Implementado os estados de loading/erro/vazio.
- Garantido que os projetos buildam.
- Garantido que os projetos conseguem consumir o GraphQL.
- Mantido a autenticação Firebase desabilitada.
- Mantido a arquitetura preparada para adicionar Firebase posteriormente.
- Criado commits incrementais durante o desenvolvimento.

---

# 13. Regra principal

**Não pare após criar algumas telas.**

Explore o backend GraphQL de forma sistemática e continue implementando até que todas as funcionalidades que possuem suporte no backend estejam representadas nos frontends aplicáveis.

Sempre que encontrar uma nova query ou mutation, pergunte:

> "Existe uma funcionalidade de usuário que pode ser construída a partir disso?"

Se a resposta for sim, implemente-a.

O objetivo final é transformar os três projetos em clientes funcionais e completos do backend GraphQL, e não apenas criar uma demonstração visual das telas.