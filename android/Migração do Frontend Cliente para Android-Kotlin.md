# Migração do Frontend Cliente para Android/Kotlin

Adicionei na raiz do projeto uma pasta `android`, contendo um projeto Android que deverá evoluir para o aplicativo mobile da nossa aplicação.

## Objetivo

O projeto Android deverá consumir o **mesmo backend da aplicação** e deverá reproduzir **100% das telas e funcionalidades existentes no frontend cliente**, sem remover, simplificar ou omitir funcionalidades.

A implementação deve seguir rigorosamente o frontend existente como referência funcional e visual.

> **Regra principal:** tudo que existe no frontend cliente deverá existir também no Android. Não adicionar funcionalidades que não existam no frontend e não remover funcionalidades existentes.

---

## 1. Primeiro objetivo: fazer o projeto Android buildar

Antes de começar a implementar as telas:

1. Analise completamente o projeto existente dentro de `android/`.
2. Analise a estrutura atual do backend.
3. Analise o frontend cliente existente.
4. Identifique:
   - versão do Android/Gradle;
   - versão do Kotlin;
   - dependências;
   - configurações incompatíveis ou quebradas;
   - package/applicationId;
   - configurações de build;
   - recursos existentes;
   - arquitetura atual.
5. Faça as alterações necessárias para que o projeto Android consiga executar um **build limpo e reproduzível**.

O primeiro commit deve representar o estado em que o projeto Android está corretamente configurado e consegue realizar o build.

Não comece a implementar dezenas de telas antes de garantir que a fundação do projeto está funcionando.

---

# 2. Evolução gradual — Baby Steps

A implementação deverá ser feita **tela por tela**, em pequenos incrementos.

Não tente converter todo o frontend de uma única vez.

Para cada tela:

1. Analise a implementação correspondente no frontend.
2. Identifique todos os componentes visuais.
3. Identifique todos os fluxos de navegação.
4. Identifique todas as chamadas ao backend.
5. Identifique validações e regras de negócio.
6. Identifique estados de loading, erro e sucesso.
7. Identifique permissões/roles necessárias.
8. Identifique modais, dialogs, menus, filtros e componentes auxiliares.
9. Implemente a tela no Android.
10. Integre com o backend real.
11. Compile o projeto.
12. Corrija eventuais problemas.
13. Teste a navegação e o comportamento.
14. Somente depois faça o commit.

Cada commit deve representar um incremento funcional pequeno e bem definido.

Exemplo:

```text
chore(android): configure project and make initial build work
feat(android): implement login screen
feat(android): implement client dashboard
feat(android): implement certificates screen
feat(android): implement DUIMP search screen
...
```

---

# 3. Fidelidade ao frontend

O frontend cliente existente deve ser considerado a **fonte de verdade da aplicação**.

A implementação Android deve manter, tanto quanto possível:

- mesma estrutura de telas;
- mesmos fluxos;
- mesmos textos;
- mesmos campos;
- mesmas validações;
- mesmos filtros;
- mesmas ações;
- mesmas regras de negócio;
- mesmas permissões;
- mesmos estados;
- mesmos feedbacks ao usuário;
- mesma hierarquia de navegação;
- mesma identidade visual.

Adapte apenas o que for tecnicamente necessário para o ambiente mobile.

Não faça uma interpretação simplificada do frontend.

Se uma tela possui 15 funcionalidades, a versão Android deve possuir as mesmas 15 funcionalidades.

---

# 4. Backend

O Android deverá consumir o **backend existente**, utilizando suas APIs reais.

Não crie mocks ou dados fictícios para mascarar funcionalidades que deveriam estar integradas ao backend.

Antes de implementar cada tela:

- descubra quais endpoints são utilizados pelo frontend;
- analise os DTOs;
- analise autenticação/autorização;
- analise headers;
- analise tratamento de erros;
- analise paginação;
- analise upload/download;
- analise GraphQL, quando aplicável;
- analise WebSocket/SSE ou mecanismos equivalentes, quando utilizados.

Reutilize os contratos existentes do backend sempre que possível.

Caso seja necessário alterar o backend para viabilizar corretamente o Android, faça a alteração de forma compatível com o frontend existente e documente o motivo.

---

# 5. Arquitetura Android

Durante a evolução do projeto, conduza a aplicação para uma arquitetura Android moderna utilizando **Kotlin**.

O estado final desejado é um projeto predominantemente Kotlin.

Priorize, conforme fizer sentido para o projeto:

- Kotlin;
- Jetpack;
- Jetpack Compose, caso seja compatível com a estratégia definida para o projeto;
- Navigation;
- ViewModel;
- Repository;
- Coroutines;
- StateFlow/Flow;
- injeção de dependência;
- cliente HTTP adequado;
- serialização tipada;
- tratamento centralizado de erros.

Evite introduzir código Java novo.

Caso o projeto inicial contenha Java, faça a migração gradualmente para Kotlin durante a implementação, sem tentar converter tudo de uma vez.

---

# 6. Não reescrever tudo de uma vez

É expressamente proibido:

- apagar o projeto Android existente e recriá-lo sem necessidade;
- implementar todas as telas em um único passo;
- criar telas genéricas apenas para "cumprir" os requisitos;
- utilizar dados mockados onde existe API real;
- remover funcionalidades complexas;
- ignorar telas secundárias;
- substituir funcionalidades por placeholders;
- considerar uma tela concluída apenas porque sua aparência inicial foi criada.

Cada tela só deve ser considerada concluída quando estiver funcional e integrada.

---

# 7. Controle de progresso

Mantenha um arquivo:

```text
android/ANDROID_MIGRATION_PROGRESS.md
```

Esse arquivo deverá registrar:

- telas identificadas;
- telas implementadas;
- telas pendentes;
- funcionalidades de cada tela;
- integrações realizadas;
- problemas encontrados;
- decisões arquiteturais;
- limitações;
- próximos passos.

Utilize uma checklist, por exemplo:

```markdown
## Telas

- [x] Login
- [x] Dashboard
- [ ] Consulta de DUIMP
- [ ] Detalhes da DUIMP
- [ ] Certificados
- [ ] ...
```

Não marque uma tela como concluída enquanto todas as suas funcionalidades não estiverem implementadas.

---

# 8. Commits

Faça commits frequentes e pequenos.

Cada commit deve:

- possuir uma única finalidade;
- manter o projeto compilável sempre que possível;
- ter mensagem clara;
- não misturar mudanças não relacionadas.

Evite commits como:

```text
implement everything
android changes
fixes
updates
```

Prefira:

```text
feat(android): implement certificate list
feat(android): integrate certificate creation API
feat(android): add certificate deletion flow
fix(android): handle expired authentication token
```

---

# 9. Ordem de execução

Siga esta ordem:

### Fase 1 — Análise

Analise:

```text
frontend/
android/
backend/
```

Mapeie todas as telas e funcionalidades do frontend cliente.

### Fase 2 — Build

Corrija o projeto Android até conseguir:

```text
clean build
```

sem erros.

Faça o commit.

### Fase 3 — Fundação

Configure a arquitetura Android/Kotlin necessária para suportar a aplicação.

Faça o commit.

### Fase 4 — Migração incremental

Implemente as telas **uma por vez**, seguindo a ordem lógica de navegação do frontend.

Para cada tela:

```text
analisar frontend
        ↓
mapear funcionalidades
        ↓
implementar UI
        ↓
implementar navegação
        ↓
implementar integração backend
        ↓
implementar estados/erros
        ↓
build
        ↓
testar
        ↓
commit
```

### Fase 5 — Migração Kotlin

À medida que as funcionalidades forem implementadas, o projeto deverá evoluir para Kotlin.

No final, o código Android deverá estar predominantemente em Kotlin e a arquitetura deverá ser consistente.

---

# 10. Critério de conclusão

O trabalho somente será considerado concluído quando:

- o projeto Android realizar build corretamente;
- todas as telas do frontend cliente tiverem equivalente no Android;
- todas as funcionalidades existentes no frontend estiverem disponíveis no Android;
- todas as integrações necessárias com o backend estiverem funcionando;
- autenticação estiver funcionando;
- autorização/roles estiver funcionando;
- navegação estiver completa;
- estados de loading/erro/sucesso estiverem implementados;
- formulários e validações estiverem implementados;
- uploads/downloads, quando existentes, estiverem implementados;
- filtros e pesquisas estiverem implementados;
- o projeto estiver evoluído para Kotlin;
- não existirem placeholders utilizados para esconder funcionalidades pendentes;
- o histórico Git demonstrar a evolução incremental do projeto.

---

## Regra final

**Trabalhe em Baby Steps.**

Não tente antecipar dezenas de etapas.

A cada etapa, primeiro analise, depois implemente, compile, valide e faça o commit.

Sempre preserve o funcionamento existente do backend e do frontend.

O objetivo final não é criar uma "versão parecida" do frontend no Android.

O objetivo é criar uma **versão Android funcionalmente equivalente ao frontend cliente**, consumindo o backend real, com uma implementação moderna e progressivamente migrada para **Kotlin**.