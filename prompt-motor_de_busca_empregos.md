# Arquitetura e Estratégia de Motor de Busca de Empregos

Construir um motor de busca de vagas exige resolver dois problemas centrais: **como estruturar e indexar os dados** (para buscas rápidas e precisas) e **como ranquear os resultados** (relevância).

---

## 1. Arquitetura Básica

Um motor de busca de vagas divide-se em três etapas operacionais:

1. **Ingestão e Normalização:** Coleta e limpeza dos dados brutos (título, empresa, descrição, senioridade, localização, modalidade, salário).
2. **Indexação:** Tokenização, remoção de *stop words*, *stemming* (ex: "programador" e "programação" apontando para a mesma raiz) e criação de índice invertido.
3. **Consulta e Ranking:** Combinação de filtros exatos (facetas como cidade, senioridade ou regime PJ/CLT) com pontuação por texto (*score* de relevância).

---

## 2. Escolha da Abordagem Técnica

| Abordagem | Tecnologias Típicas | Quando Escolher | Vantagens / Desvantagens |
| :--- | :--- | :--- | :--- |
| **Banco Relacional (Full-Text)** | PostgreSQL (`tsvector`, `tsquery`), MySQL FTS | Menos de 100k vagas, MVP rápido | **Pró:** Sem infraestrutura extra.<br>**Contra:** Menos flexível para ranqueamento complexo. |
| **Engine Dedicada (Lexical/BM25)** | Elasticsearch, OpenSearch, Meilisearch | Alto volume, busca com tolerância a erros e facetas | **Pró:** Rápido, escalável, filtros facetados nativos.<br>**Contra:** Custo de servidor e manutenção. |
| **Busca Híbrida (Lexical + Vetorial)** | PGVector, Qdrant + BM25 | Busca semântica contextual ("vaga com microsserviços em nuvem") | **Pró:** Encontra sinônimos e contexto semântico.<br>**Contra:** Exige geração de embeddings e maior latência/custo. |

> **Recomendação inicial:** Para a maioria dos projetos de vagas, começar com PostgreSQL (`tsvector`) para MVP ou Meilisearch/OpenSearch para produção com tolerância a typos (*fuzzy search*) entrega excelente precisão sem a complexidade desnecessária de modelos vetoriais no primeiro momento.

---

## 3. Modelo de Dados e Índices

Separe campos textuais livres de campos estruturados (usados para filtros facetados):

```json
{
  "id": "vaga-1234",
  "title": "Desenvolvedor Backend Java Pleno",
  "company": "Tech Corp",
  "description": "Atuação com Spring Boot, microservices e Docker...",
  "skills": ["java", "spring-boot", "docker", "sql"],
  "level": "pleno",
  "workplace_type": "remote",
  "location": {
    "city": "São Paulo",
    "state": "SP",
    "country": "BR"
  },
  "salary_min": 8000,
  "salary_max": 11000,
  "created_at": "2026-09-04T10:00:00Z",
  "status": "active"
}
```

* **Texto aberto (BM25 / Full-Text):** `title` (peso alto) e `description`.
* **Filtros exatos (Keywords/Bools):** `skills`, `level`, `workplace_type`, `location.state`.
* **Intervalos numéricos/datas:** `salary_min`, `salary_max`, `created_at`.

---

## 4. Fórmula de Relevância e Ranking

O erro mais comum em motores de vagas é buscar apenas no corpo da descrição. O cálculo de relevância deve aplicar pesos diferenciados (*boosting*):

* **Título (Peso 3x a 5x - Peso 'A'):** Correspondência no cargo deve sobrepor o restante.
* **Tags/Skills (Peso 2x - Peso 'B'):** Tecnologias e requisitos centrais informados como tags.
* **Descrição (Peso 1x - Peso 'C'):** Menções no texto descritivo geral.
* **Decaimento Temporal (*Time Decay*):** Vagas recentes (últimos 7 a 14 dias) recebem bônus na pontuação final para evitar acúmulo de vagas antigas no topo.

---

## 5. Implementação de Referência (PostgreSQL Full-Text Search)

Implementação pronta para uso utilizando recursos nativos do PostgreSQL:

```sql
-- 1. Criar coluna tsvector calculada automaticamente com pesos (A, B, C)
ALTER TABLE jobs ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('portuguese', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('portuguese', coalesce(array_to_string(skills, ' '), '')), 'B') ||
  setweight(to_tsvector('portuguese', coalesce(description, '')), 'C')
) STORED;

-- 2. Criar índice GIN para consultas instantâneas
CREATE INDEX idx_jobs_search ON jobs USING GIN(search_vector);

-- 3. Exemplo de consulta com ranking e filtros facetados
SELECT 
    id,
    title,
    company,
    workplace_type,
    created_at,
    ts_rank(search_vector, query) AS relevance
FROM jobs, 
     to_tsquery('portuguese', 'java & spring') query
WHERE search_vector @@ query
  AND workplace_type = 'remote'
  AND status = 'active'
ORDER BY relevance DESC, created_at DESC
LIMIT 20;
```
