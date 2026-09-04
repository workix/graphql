## Purpose

Fornece mecanismos de detecção de concorrência e bloqueio otimista de versão para evitar sobreescrita concorrente de dados em operações simultâneas.

## ADDED Requirements

### Requirement: Detecção de Conflitos por Bloqueio Otimista (Optimistic Lock)
O sistema SHALL verificar se a versão atual do registro em banco corresponde à versão recebida pelo cliente antes de persistir alterações, rejeitando operações desatualizadas com erro de conflito de concorrência.

#### Scenario: Detecção de Modificação Concorrente Conflitante
- **WHEN** dois usuários tentam atualizar simultaneamente o mesmo registro e o segundo usuário envia uma versão desatualizada
- **THEN** o sistema rejeita a alteração do segundo usuário com erro `CONCURRENCY_CONFLICT`
