# Regras Gerais
 - Você está em um ambiente Windows
 - Você deve se comunicar em Português Brasil
 - Você deve sempre usar o git com mensagens em Português Brasil
 - Você deve sempre commitar as modificações feitas em baby-steps
 - Seus commits deverão ter a minha identidade , da minha conta (Felipe Rodrigues Michetti)[frmichetti@gmail.com]
 - Voce nunca deve realizar operações destrutivas no banco de dados sem avisar
 - Você deve notificar qualquer modificação de estrutura no banco de dados e pedir aprovação
 - Você deve explicar o porque das consultas e modificações feitas no banco
 - Você não deve permitir que o usuário salve senhas ou certificado digital no código (gerar alerta)
 - Você deve gerar um relatório com as Migrações e Modificações a serem incluidas no banco antes de concluir as tasks ou issues
 - Você deve manter as documentações sempre atualizadas, toda manutenção deve ser documentada
 - O agent AGENTS.md deve ser mantido atualizado, sempre que criar um novo agent ou modificar um existente deve atualizar este arquivo
 - Esse é o projeto PAI, ele é o maestro dos outros projetos, o maestro deve garantir que todas as regras sejam seguidas e que os outros projetos estejam atualizados
 - Você deve garantir que as regras de negocio sejam sempre seguidas e que os outros projetos estejam atualizados
 - Você deve registrar ISSUES em um Arquivo KNOW_ISSUES.md e registrar todo o contexto para ser reproduzido e corrigido posteriormente.
 - Você vai trabalhar com TDD, sempre crie os testes antes de criar o código.
 - Você vai commitar passo a passo e descrever cada passo para atingir o objetivo

# Contexto Geral do Projeto

Este produto está separado em 4 projetos diferentes sendo eles:
- este projeto `graphql` que o pai dos projetos, o novo backend localizado em `C:\Packsys\NetBeansProjects\java-graphql`;
- o backend `java-stack` o backend legado localizado em `C:\Packsys\NetBeansProjects\java-stack`;
- o `workix-spring-boot` localizado em `C:\Packsys\NetBeansProjects\workix-spring-boot` a versão alternativa do java-stack, segunda-versão do backend;
- e o frontend `workix-frontend-vue` localizado em `C:\Packsys\NetBeansProjects\workix-frontend-vue`.

## Fonte da Verdade

Toda a documentação funcional, técnica e de regras de negócio do sistema legado está centralizada no arquivo:

`SPECIFICATION.md`

Este arquivo deve ser considerado a **única fonte oficial de especificação** (Single Source of Truth). Sempre que houver qualquer dúvida sobre comportamento, regras de negócio, fluxos, permissões ou funcionamento do sistema, consulte este documento antes de tomar qualquer decisão.

Não faça suposições quando a especificação estiver disponível.

## Sua Responsabilidade

Você atuará como responsável pela evolução e correção, podendo executar dois tipos de atividades:


### 1. Evolução do Sistema

você poderá receber solicitações para implementar novas funcionalidades, correções ou melhorias diretamente no projeto.

Nesses casos:

* mantenha a arquitetura existente;
* respeite os padrões já utilizados pelo projeto;
* preserve compatibilidade com funcionalidades existentes;
* atualize a implementação sem alterar regras de negócio não relacionadas à solicitação.

### 2. Correção do sistema

você deve registrar a issue em um arquivo KNOW_ISSUES.md e registrar todo o contexto do bug para futuramente criar sua correçao

## Diretrizes Gerais

* Sempre consulte `SPECIFICATION.md` antes de iniciar qualquer implementação.
* Nunca altere regras de negócio sem uma solicitação explícita.
* Caso exista conflito entre código e especificação, considere `SPECIFICATION.md` como a referência principal e informe qualquer inconsistência encontrada.
* Sempre procure manter equivalência funcional entre a implementação legada e a nova aplicação.
* Caso alguma informação necessária não esteja presente na especificação nem no código, solicite esclarecimentos antes de prosseguir.
* Priorize código limpo, modular, bem documentado e aderente às boas práticas da tecnologia utilizada em cada projeto.
