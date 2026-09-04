# Política de Privacidade e Proteção de Dados (PRIVACY.md)

Este documento descreve como a plataforma **Workix** coleta, trata, armazena e protege os dados pessoais dos usuários em estrita conformidade com a **Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)**.

---

## 1. Princípios de Coleta e Minimização

1. **Sem CPF Obrigatório no Cadastro**: O identificador de unicidade para pessoas físicas é o endereço de **e-mail verificado**. O CPF não é exigido nem armazenado no cadastro inicial, sendo coletado exclusivamente na fase final de admissão/contratação direta pela empresa empregadora.
2. **Identificação de Empresas**: O CNPJ é utilizado para verificação de existência e idoneidade de pessoas jurídicas por se tratar de dado de cadastro público.
3. **Senhas**: As senhas nunca são armazenadas diretamente no banco da Workix, sendo gerenciadas de forma criptografada via provedor de autenticação (Firebase Authentication / JWT seguro).

---

## 2. Controle de Visibilidade do Candidato (3 Chaves Independentes)

Todo candidato possui controle soberano sobre sua privacidade através da entidade `visibility_settings`:

| Chave | Função | Padrão |
| :--- | :--- | :--- |
| `searchable_by_recruiters` | Define se o perfil pode ser localizado na busca ativa de recrutadores | `true` |
| `open_to_work_visible` | Indica status aberto a oportunidades (visível a recrutadores, nunca para o empregador atual identificado) | `false` |
| `show_as_viewed` | Define se a visita do candidato ao perfil de uma empresa/recrutador é registrada como visualização | `true` |

A função server-side `reveal()` valida estas chaves em tempo real antes de qualquer retorno de dados pessoais pela API GraphQL.

---

## 3. Dados de Visualização de Perfil (`profile_views`) e Retenção

O registro de que uma organização visualizou o perfil de um candidato é tratado com base no legítimo interesse e consentimento:
- **Retenção Limitada e Purga Automática**: Os logs de visualização são retidos por no máximo 12 meses (assinantes Premium) e 7 dias (plano gratuito), sendo purgados automaticamente por rotinas programadas.
- **Não Comercialização**: Dados de histórico de navegação e visualizações nunca são vendidos, alugados ou compartilhados com terceiros para fins de publicidade externa.

---

## 4. Desbloqueio de Contato e Consentimento

- O acesso a telefone, e-mail direto e currículo desanonimizado exige registro na entidade `contact_unlocks`.
- **Notificação Obrigatória**: O candidato titular é imediatamente notificado via e-mail e canal interno (`notified_candidate_at`) sobre qual empresa e recrutador desbloqueou seus dados de contato.

---

## 5. Direitos do Titular (Art. 18 da LGPD)

O titular de dados pode, a qualquer momento e de forma automatizada através do painel da plataforma:
1. Confirmar a existência de tratamento e acessar seus dados;
2. Corrigir dados incompletos, inexatos ou desatualizados;
3. Solicitar a anonimização, bloqueio ou eliminação de seus dados pessoais e histórico;
4. Desativar temporariamente ou excluir permanentemente seu currículo.

Contato do Encarregado de Proteção de Dados (DPO): `privacidade@workix.com.br` ou `frmichetti@gmail.com`.
