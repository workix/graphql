# Prompt de Ações — Diagnóstico e Gestão de Memória/CPU em Projetos TypeScript / Node.js

> **v2** — estrutura completa de diagnóstico com fase dedicada (25-B) detalhando, para cada categoria de causa, a **medida de gerenciamento concreta a aplicar**, o **padrão de código de referência**, a **configuração recomendada**, os **trade-offs** e a **forma de validar**. Isso fecha o ciclo: diagnóstico → causa → correção padronizada → validação.

## Objetivo

Analisar um projeto TypeScript / Node.js de forma profunda e estruturada para identificar causas de:

* Vazamento de memória (Memory Leak) e crescimento contínuo de RSS / Heap V8;
* Garbage Collection (V8 GC) excessivo, pausas de Mark-Sweep-Compact e degradação de throughput;
* Event Loop bloqueado (Event Loop Lag) e alto consumo de CPU por operações síncronas;
* Closures, EventEmitters e callbacks retendo escopos e contextos na memória;
* Timers (`setInterval`, `setTimeout`) e schedulers (`node-cron`, `BullMQ`) sem cancelamento ou sobrepostos;
* Filas assíncronas crescendo indefinidamente (backlog e esgotamento de promessas com `Promise.all` irrestrito);
* Conexões HTTP/DB, sockets WebSocket, streams e descritores de arquivos não liberados;
* Caches, `Map`s, `Set`s e objetos em escopo global/módulo sem limite (eviction/TTL);
* Retries agressivos e tempestades de reconexão (thundering herd);
* Processamento síncrono em background ou parsing de JSON/arquivos gigantescos em memória.

E, uma vez identificadas as causas, **propor e aplicar a medida de gerenciamento correta**, com evidência, risco e forma de validação — nunca uma alteração especulativa.

---

# REGRA PRINCIPAL

**Não altere o código antes de ter evidência.**

Sequência obrigatória:

```text
1. Levantar evidência (estática + runtime, quando possível)
2. Formular hipótese de causa
3. Confirmar causa com profiling/heap snapshot/event loop metrics
4. Selecionar a medida de gerenciamento adequada (Fase 25-B)
5. Aplicar a menor mudança possível
6. Validar com métrica objetiva (antes/depois)
```

Não faça alterações do tipo "vamos aumentar `--max-old-space-size`", "vamos colocar `setImmediate` em tudo", "vamos aumentar o pool de conexões" sem evidência e sem métrica de validação associada.

---

# FASE 1 — IDENTIFICAÇÃO DO PROJETO

Identifique: runtime (Node.js, Bun, Deno), versão do Node (`node -v`), versão do TypeScript (`tsconfig.json`), framework backend (NestJS, Express, Fastify, Koa, Apollo Server, Hono, Next.js API), ORM/Query Builder (Prisma, TypeORM, Sequelize, Kysely, Mongoose, Drizzle), cliente HTTP (Axios, Fetch/Undici, Got, Superagent), mensageria/filas (BullMQ, KafkaJS, amqplib, SQS), caches (Redis, `node-cache`, `lru-cache`), WebSocket (ws, socket.io), gerenciador de processos (PM2, Docker, Kubernetes, Cluster Module).

Arquivos-alvo: `package.json`, `tsconfig.json`, `nest-cli.json`, `Dockerfile`, `docker-compose.yml`, `pm2.config.js`, scripts de inicialização (`start`, `build`), middlewares e inicializadores de banco/servidor.

---

# FASE 2 — MAPA DE COMPONENTES

```text
HTTP / WS Requests → Middleware / Guards → Controllers / Resolvers → Services → ORM / Repositories → Database
Event Loop Tick → Microtasks (Promises) → Macrotasks (Timers / I-O) → Check (setImmediate)
Schedulers / Cron → Background Workers → Queues (BullMQ/Redis) → Worker Threads
HTTP Client / SDKs → External APIs → Retry / Backoff → Webhooks
File Processing → Streams / Buffers → Temp Files / Cloud Storage
```

---

# FASE 3 — COLLECTIONS E ESTRUTURAS DE DADOS

Localize `Map`, `Set`, `Array`, `WeakMap`, `WeakSet`, `Record<string, any>`, e objetos literais usados como dicionários.

Verifique:
* `Map` ou `Set` instanciados no escopo do módulo (top-level) acumulando chaves sem exclusão;
* Arrays acumulando itens a cada requisição ou evento sem `splice`/limpeza;
* Objetos usados como cache de sessão ou de requisições por IP/token;
* Uso de `Map` forte onde `WeakMap` ou `WeakSet` deveria ser utilizado para evitar impedir a coleta de lixo de objetos;
* Collections atreladas a Singletons (ex.: serviços NestJS com escopo padrão `DEFAULT`).

---

# FASE 4 — CACHES EM MEMÓRIA

Localize `lru-cache`, `node-cache`, `memory-cache`, `Redis`, `Map` manual, cache de Apollo/DataLoader.

Para cada cache em memória:
* Existe limite máximo de itens (`max`) ou de tamanho (`maxSize`)?
* Existe TTL (`time-to-live`) explícito para expiração?
* Há política de descarte (LRU/LFU)?
* O cache limpa chaves expiradas ativamente ou apenas na leitura?
* Todo `const cache = new Map()` em escopo de arquivo é **suspeito de vazamento por padrão** até comprovação de limpeza.

---

# FASE 5 — ESCOPO GLOBAL, MÓDULOS E CLOSURES

Investigue:
* Variáveis declaradas fora de funções/classes em arquivos `.ts` (estado compartilhado no processo);
* Closures aninhadas que capturam acidentalmente variáveis volumosas de escopos superiores (`req`, buffers, arrays grandes) e permanecem ativas em callbacks assíncronos de longa duração;
* Singletons retendo referências a objetos transientes;
* Armazenamento de estado de requisição em atributos de classes singleton (especialmente no NestJS com `@Injectable()`).

---

# FASE 6 — WORKERS, THREADS E CONCORRÊNCIA

Localize:
* `worker_threads` (`Worker`, `isMainThread`, `parentPort`, `MessageChannel`);
* Módulo `cluster` (`cluster.fork()`);
* `Promise.all()` e `Promise.allSettled()` executados sobre coleções de tamanho indefinido sem limitação de concorrência (`p-limit`, `p-queue`);
* Processamento paralelo gerando explosão de contexto e esgotamento de memória no Node.js;
* Threads de workers sem encerramento (`worker.terminate()`) ou com filas de mensagens (`postMessage`) acumulando objetos no heap da thread principal.

---

# FASE 7 — TIMERS E SCHEDULERS

Localize `setInterval`, `setTimeout`, `setImmediate`, `node-cron`, `cron`, `Agenda`, `BullMQ Repeatable Jobs`.

Verifique:
* Chamadas a `setInterval` onde o callback é assíncrono (`async`) e a execução dura mais que o intervalo configurado (sobreposição de jobs);
* Falta de `clearInterval` / `clearTimeout` quando componentes/conexões são destruídos (ex.: no disconnect do WebSocket);
* Timers criados dinamicamente dentro de handlers de requisição HTTP sem controle de cancelamento.

---

# FASE 8 — EVENT LOOP BLOCKING E LOOPS SÍNCRONOS

Procure:
* Loops síncronos pesados (`while`, `for`, `Array.prototype.forEach/map/reduce/filter`) iterando sobre centenas de milhares de elementos no thread principal;
* Operações síncronas pesadas: `fs.readFileSync`, `crypto.pbkdf2Sync`, `bcrypt.hashSync`, `zlib.gzipSync`;
* Regex vulneráveis a ReDoS (Catastrophic Backtracking) travando o Event Loop;
* `while(true)` sem `await` ou sem yield via `setImmediate()`, causando 100% de uso de CPU em um único core e travando todo o tráfego HTTP.

---

# FASE 9 — RETRIES E RECONEXÕES

Localize `axios-retry`, `p-retry`, `async-retry`, `retry-ts`, loops de reconexão de sockets/Redis/Banco.

Verifique:
* Número máximo de tentativas (`retries`);
* Estratégia de backoff: se é fixo ou exponencial com jitter;
* Condição de parada (evitar retry em erros HTTP 4xx que não são temporários);
* Tempestades de reconexão em caso de queda de serviços dependentes.

---

# FASE 10 — CLIENTES HTTP, WEBSOCKETS E EVENTEMITTERS

Analise:
* `axios`, `fetch` (nativo ou `undici`), `got`, `superagent`, `ws`, `socket.io`, `EventEmitter`.
* **HTTP Agents:** `http.Agent({ keepAlive: true, maxSockets: ... })` configurado adequadamente?
* **Leaks de EventEmitter:** uso repetido de `emitter.on(...)` dentro de requests/loops sem `emitter.off(...)` / `emitter.removeListener(...)`;
* Aviso do Node: `MaxListenersExceededWarning: Possible EventEmitter memory leak detected`;
* WebSocket sockets não limpos após desconexão do cliente.

---

# FASE 11 — BANCO DE DADOS E CONNECTION POOLS

Analise drivers e ORMs: `pg`, `mysql2`, `ioredis`, `sequelize`, `prisma`, `typeorm`, `mongoose`, `knex`.

Verifique:
* Configuração do pool de conexões: `max`, `min`, `idleTimeoutMillis`, `acquireTimeoutMillis`;
* Queries `SELECT` sem `LIMIT` ou sem paginação carregando milhões de linhas para o heap do Node;
* Conexões manuais de banco não devolvidas ao pool (`client.release()` / `connection.close()` em bloco `finally`);
* Transações abertas e nunca concluídas (`commit`/`rollback`).

---

# FASE 12 — ORMS E MAPEO DE OBJETOS (PRISMA, TYPEORM, SEQUELIZE)

Investigue:
* **Prisma:** `$queryRaw` sem sanitização, queries com `include` profundo trazendo grafos gigantescos de relacionamentos;
* **TypeORM / Sequelize:** Hydration de dezenas de milhares de instâncias de classes de entidades em memória em vez de usar `getRawMany()` ou queries paginadas;
* **Mongoose:** Queries sem `.lean()` instanciando documentos Mongoose completos (com overhead de getters, setters e proxy) desnecessariamente.

---

# FASE 13 — ARQUIVOS, STREAMS E BUFFERS

Procure `fs.readFile`, `fs.readFileSync`, `fs.createReadStream`, `Buffer.alloc`, `Buffer.concat`, `stream.pipe`.

Verifique:
* Carregamento de arquivos inteiros em `Buffer` ou string em vez de processamento por streaming;
* Tratamento de **Backpressure** em streams: usar `stream.pipeline` ou `stream.finished` em vez de `pipe` cru para garantir tratamento correto de erros e liberação de descritores;
* `Buffer.concat()` repetido em laços gerando alocações massivas no heap externo do V8.

---

# FASE 14 — JSON E SERIALIZAÇÃO

Investigue:
* `JSON.parse` e `JSON.stringify` executados sobre strings gigantes (> 10MB) de forma síncrona, bloqueando o Event Loop;
* Uso de streaming JSON (`stream-json`, `bfj`) para cargas massivas de dados;
* Serializadores otimizados (`fast-json-stringify`) em endpoints de alto throughput.

---

# FASE 15 — GARBAGE COLLECTION E V8 HEAP ARCHITECTURE

Identifique a arquitetura do V8:
* Espaços de Memória: New Space (Nursery/Intermediate), Old Space (Old Pointer/Old Data), Large Object Space, Code Space, Map Space;
* Parâmetros do Node: `--max-old-space-size=<MB>`, `--max-semi-space-size=<MB>`, `--trace-gc`, `--expose-gc`;
* Sintomas de GC:
  * RSS cresce enquanto o HeapUsed se mantém estável (fragmentação de memória ou buffers nativos);
  * HeapUsed cresce continuamente após coletas de GC (vazamento real de memória);
  * Pausas de GC (Major GC) frequentes durando > 50ms (impacto direto no p99 do Event Loop).

---

# FASE 16 — SERVIDORES HTTP (EXPRESS, FASTIFY, NESTJS)

Analise:
* `keepAliveTimeout`, `headersTimeout`, `requestTimeout`;
* Middlewares globais acumulando metadados de requisição em arrays/objetos sem limpeza;
* Compressão síncrona de respostas (`compression` middleware mal configurado com buffer alto);
* Limite de tamanho de payload (`body-parser`, `express.json({ limit: '10mb' })`).

---

# FASE 17 — INJEÇÃO DE DEPENDÊNCIA E FRAMEWORKS (NESTJS)

Investigue:
* Escopo de Provedores: `@Injectable({ scope: Scope.REQUEST })` vs `Scope.DEFAULT`;
* **Cuidado crítico:** Provedores de escopo de requisição (`Scope.REQUEST`) forçam toda a cadeia de injeção a ser instanciada a cada request HTTP, gerando alto overhead de alocação e GC;
* Inscrições em Observables RxJS sem cancelamento (`takeUntil`, `unsubscribe`, `take(1)`).

---

# FASE 18 — PROCESSAMENTO ASSÍNCRONO E FILAS

Localize `BullMQ`, `Agenda`, `KafkaJS`, `amqplib`, `p-queue`.

Determine:
* Limite de concorrência por worker (`concurrency: 5`);
* Taxa de retenção de jobs concluídos/falhados no Redis/banco (`removeOnComplete: true`, `removeOnFail: { count: 1000 }`);
* Presença de Dead Letter Queue (DLQ) para evitar reprocessamento em loop infinito.

---

# FASE 19 — PROCESSAMENTO SEM USUÁRIO / DAEMONS

Verifique o que roda sem tráfego de usuários:
* Schedulers, workers consumidores de filas, listeners de webhooks, polling de APIs externas, tarefas de sincronização, healthchecks frequentes;
* Para cada um: frequência, concorrência, tempo de execução, alocação de memória e impacto no Event Loop.

---

# FASE 20 — DIAGNÓSTICO EM RUNTIME

Utilize ferramentas nativas do Node.js:

```bash
# Iniciar aplicação com inspetor ativado
node --inspect=0.0.0.0:9229 dist/main.js

# Iniciar com log de Garbage Collection
node --trace-gc --trace-gc-ignore-scavenger dist/main.js

# Diagnóstico de Event Loop Lag e profiling com Clinic.js
npx clinic doctor -- onoff -- node dist/main.js
npx clinic flame -- node dist/main.js
npx clinic heapprofiler -- node dist/main.js
```

Coleta programática via API nativa `v8`:
```typescript
import v8 from 'node:v8';
console.log(v8.getHeapStatistics());
console.log(process.memoryUsage());
```

---

# FASE 21 — EVENT LOOP DUMP & ASYNC HANDLES

Quando o processo não encerra ou consome CPU inesperada, investigue handles e timers abertos:

```typescript
// wtfnode ou inspeção nativa de handles ativos
console.log((process as any)._getActiveHandles());
console.log((process as any)._getActiveRequests());
```

Utilize `clinic doctor` para verificar a correlação entre Event Loop Delay, uso de CPU e I/O.

---

# FASE 22 — HEAP SNAPSHOTS E ANÁLISE DE MEMÓRIA

Capture snapshots em momentos diferentes para comparação (T0: Inicial, T1: Sob carga, T2: Após repouso):

```typescript
import v8 from 'node:v8';
import fs from 'node:fs';

export function takeHeapSnapshot(fileName: string) {
  const snapshotStream = v8.getHeapSnapshot();
  const fileStream = fs.createWriteStream(fileName);
  snapshotStream.pipe(fileStream);
}
```

Analise via **Chrome DevTools (Memory tab)**:
* **Comparison View:** Compare T2 com T0;
* **Constructor List:** Procure por `(closure)`, `Object`, `Array`, `EventEmitter`, `Buffer`;
* **Retained Size vs Shallow Size:** Identifique o objeto raiz no Dominator Tree que retém as maiores referências;
* **Distance:** Distância da GC Root (Global Object / Module Scope).

---

# FASE 23 — CPU PROFILING

Gere perfis de CPU para identificar hot functions:

```bash
# Profiling nativo do V8
node --prof dist/main.js
# Processar log de profiling
node --prof-process isolate-*.log > processed.txt

# Ou visualização em Flamegraph com 0x
npx 0x dist/main.js
```

Analise: Funções bloqueantes de Event Loop, serialização JSON repetitiva, compilação de expressões regulares, hashing ou loops síncronos.

---

# FASE 24 — CLASSIFICAÇÃO DE SEVERIDADE

* **CRÍTICO**: Event Loop completamente travado (lag > 1000ms), `JavaScript heap out of memory` (OOM Crash), 100% de CPU constante em core de execução.
* **ALTO**: Memory leak progressivo (RSS/Heap crescendo continuamente sem estabilização), Event Loop lag entre 100ms e 500ms, GC pausando requisições com frequência.
* **MÉDIO**: Falta de backpressure em streams, `Promise.all` não limitado sob picos de carga, caches em memória sem TTL mas com tamanho moderado.
* **BAIXO**: Pequenas melhorias preventivas, remoção de referências residuais, otimização de DTOs e serialização.

---

# FASE 25-A — RELATÓRIO DE DIAGNÓSTICO

## 1. Resumo Executivo
Evidência de leak? Evidência de Event Loop bloqueado? Principal suspeita? Nível de confiança?

## 2. Problemas Encontrados
Para cada item: Problema / Arquivo / Função / Linha / Severidade / Evidência / Impacto.

## 3. Matriz de Vazamentos de Memória
| Problema | Localização | Evidência (Heap Snapshot / Objeto) | Severidade |
|---|---|---|---|

## 4. Matriz de Causas de Alto Consumo de CPU / Event Loop Lag
| Problema | Localização | Evidência (CPU Profile / Flamegraph) | Severidade |
|---|---|---|---|

## 5–10. Análise por Dimensão
* **Event Loop & Asincronismo**: Tempo de resposta do Event Loop e microtasks.
* **Collections & Caches**: Maps/Sets sem desalocação e caches manuais.
* **EventEmitters & Sockets**: Listeners não removidos e conexões abertas.
* **Banco & ORMs**: Pools, volume de queries e ausência de paginação.
* **Streams & Arquivos**: Alocação de buffers inteiros e vazamentos de descritores.
* **V8 Garbage Collection**: Frequência de scavenge/mark-sweep e tempo de pausa.

---

# FASE 25-B — MEDIDAS DE GERENCIAMENTO DE MEMÓRIA E PROCESSAMENTO

Esta fase traduz cada causa da Fase 25-A em uma **medida padronizada de correção**. Ao propor qualquer correção, preencha sempre os 5 campos: **Medida | Padrão de implementação | Configuração recomendada | Trade-off | Como validar**.

---

### 25-B.1 Collections e Caches sem limite em escopo de módulo

* **Medida:** Substituir `Map`/`Set` globais por instâncias de `LRUCache` com limite máximo de itens e TTL; utilizar `WeakMap`/`WeakSet` quando a retenção do ciclo de vida deve ser atrelada exclusivamente ao objeto chave.
* **Padrão de implementação:**
  ```typescript
  import { LRUCache } from 'lru-cache';

  const userCache = new LRUCache<string, UserProfile>({
    max: 10_000,
    ttl: 1000 * 60 * 15, // 15 minutos
    allowStale: false,
    updateAgeOnGet: true
  });
  ```
* **Configuração recomendada:** Definir `max` dimensionado pelo consumo médio por objeto observado no Heap Snapshot; sempre habilitar `ttl` para dados transientes.
* **Trade-off:** Possível perda de cache hit se `max` for subdimensionado; overhead mínimo de CPU para ordenação LRU.
* **Como validar:** Heap Snapshot em T0 e T+30min demonstra estabilização do número de instâncias de `UserProfile` no heap; métricas de memória (`process.memoryUsage().heapUsed`) estabilizadas em platô.

---

### 25-B.2 Closures e Callbacks retendo escopos acidentalmente

* **Medida:** Desacoplar referências a grandes objetos (`req`, buffers, grandes arrays) de callbacks de longa duração ou timers; extrair apenas os campos estritamente necessários (primitivos) antes de passar para a closure.
* **Padrão de implementação:**
  ```typescript
  // Incorreto: closure retém o objeto req inteiro
  // app.post('/upload', (req, res) => {
  //   heavyTask(() => log(req.body));
  // });

  // Correto: extrai apenas o dado primitivo
  app.post('/upload', (req, res) => {
    const traceId = req.headers['x-trace-id'];
    heavyTask(() => logger.info({ traceId }, 'Tarefa concluída'));
  });
  ```
* **Configuração recomendada:** Revisão de código e regras de linter (`eslint-plugin-sonarjs`, `no-shadow`) para prevenir closures que capturem contextos desnecessários.
* **Trade-off:** Exige refatoração da passagem de parâmetros.
* **Como validar:** No Chrome DevTools Memory Tab, pesquisar pelo construtor `(closure)` e verificar que o objeto retentor não referencia mais o contexto HTTP.

---

### 25-B.3 EventEmitters e Listeners acumulando sem desinscrição

* **Medida:** Garantir a remoção explícita de listeners via `.off()` / `.removeListener()`, ou utilizar `{ once: true }` / `AbortSignal` para desinscrição automática.
* **Padrão de implementação:**
  ```typescript
  // Usando AbortController para limpeza automática
  const ac = new AbortController();

  socket.on('data', onDataHandler, { signal: ac.signal });

  // Na desconexão:
  socket.on('close', () => {
    ac.abort(); // Remove todos os listeners vinculados ao signal automaticamente
  });
  ```
* **Configuração recomendada:** Nunca elevar `emitter.setMaxListeners(0)` arbitrariamente; tratar o aviso de `MaxListenersExceededWarning` como erro crítico no CI/CD.
* **Trade-off:** Nenhum; prevenção direta de vazamento de memória.
* **Como validar:** `emitter.listenerCount('data')` permanece constante ou retorna a zero após o ciclo de vida da conexão.

---

### 25-B.4 Timers assíncronos e Schedulers sobrepostos

* **Medida:** Substituir `setInterval` por recursão de `setTimeout` encadeada após o término da Promise, ou usar controle de execução exclusiva com semáforo/lock.
* **Padrão de implementação:**
  ```typescript
  let isRunning = false;

  async function scheduleJob() {
    if (isRunning) return;
    isRunning = true;
    try {
      await processBackgroundBatch();
    } finally {
      isRunning = false;
      setTimeout(scheduleJob, 60_000); // 60s após o FIM da execução anterior
    }
  }
  ```
* **Configuração recomendada:** Para aplicações distribuídas/clusters, utilizar controle de concorrência com Redlock ou jobs repetíveis com BullMQ.
* **Trade-off:** O intervalo entre execuções torna-se `duração + delay` em vez de frequência fixa.
* **Como validar:** Logs comprovam que nunca ocorrem duas execuções simultâneas do mesmo job; métricas de CPU não apresentam picos cumulativos.

---

### 25-B.5 Event Loop travado por tarefas síncronas / CPU-bound

* **Medida:** Delegar tarefas intensivas de CPU para `worker_threads`, utilizar bibliotecas nativas assíncronas (ex.: `bcrypt` assíncrono em vez de `hashSync`), ou particionar loops com `setImmediate()`.
* **Padrão de implementação:**
  ```typescript
  import { Worker } from 'node:worker_threads';

  export function executeCpuIntensiveTask(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./dist/workers/compute.worker.js', {
        workerData: data
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker parou com código ${code}`));
      });
    });
  }
  ```
* **Configuração recomendada:** Manter um pool fixo de workers (`piscina` ou pool próprio) igual ao número de CPUs disponíveis para evitar sobrecarga de contexto.
* **Trade-off:** Custo de serialização de dados (`structuredClone`) na comunicação entre threads.
* **Como validar:** Monitoramento de `event_loop_lag_seconds` (Prometheus) abaixo de 10ms mesmo sob carga pesada de cálculo.

---

### 25-B.6 Retries agressivos e tempestade de requisições

* **Medida:** Implementar retry com backoff exponencial, jitter aleatório e Circuit Breaker.
* **Padrão de implementação:**
  ```typescript
  import pRetry from 'p-retry';

  export async function callExternalService(): Promise<ResponseData> {
    return pRetry(
      async () => {
        return await apiClient.get('/data');
      },
      {
        retries: 3,
        factor: 2,
        minTimeout: 500,
        randomize: true, // Adiciona Jitter
        onFailedAttempt: (err) => {
          logger.warn(`Tentativa ${err.attemptNumber} falhou. Restam ${err.retriesLeft}.`);
        }
      }
    );
  }
  ```
* **Configuração recomendada:** Configurar Circuit Breaker (ex.: `opossum`) para interromper chamadas a serviços que estejam fora do ar.
* **Trade-off:** Aumenta o tempo total até a falha final para erros persistentes.
* **Como validar:** Em simulação de falha do downstream, o número de chamadas por segundo reduz drasticamente e o consumo de CPU permanece baixo.

---

### 25-B.7 Clientes HTTP — Conexões, Keep-Alive e Pools

* **Medida:** Configurar `http.Agent` e `https.Agent` com `keepAlive: true`, limites de sockets e timeouts estritos em todos os clientes HTTP (`axios`, `undici`, `fetch`).
* **Padrão de implementação:**
  ```typescript
  import http from 'node:http';
  import https from 'node:https';
  import axios from 'axios';

  const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50, maxFreeSockets: 10, timeout: 30000 });
  const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50, maxFreeSockets: 10, timeout: 30000 });

  export const httpClient = axios.create({
    httpAgent,
    httpsAgent,
    timeout: 10000 // 10s de timeout de requisição
  });
  ```
* **Configuração recomendada:** Sempre definir `timeout` de requisição explícito; para Node.js >= 18 com fetch nativo, configurar `Dispatcher` do `undici`.
* **Trade-off:** Conexões mantidas em Keep-Alive ocupam sockets abertos no SO por um período controlado.
* **Como validar:** Comando `ss -s` ou `netstat` no servidor mostra redução de conexões em estado `TIME_WAIT` e ausência de sockets em `CLOSE_WAIT`.

---

### 25-B.8 Banco de Dados, Pools e Paginação de Consultas

* **Medida:** Ajustar o tamanho do pool de conexões do banco de dados, implementar paginação por cursor/offset em todas as listagens e usar streaming para relatórios massivos.
* **Padrão de implementação:**
  ```typescript
  // Paginação por cursor via Prisma / TypeORM
  const users = await prisma.user.findMany({
    take: 50,
    skip: 1,
    cursor: { id: lastId },
    select: { id: true, name: true, email: true } // Evitar SELECT *
  });
  ```
  ```typescript
  // Configuração do pool (exemplo pg / Sequelize)
  pool: {
    max: 20,
    min: 2,
    idle: 10000,
    acquire: 20000
  }
  ```
* **Configuração recomendada:** `max` conexões do pool dimensionado de acordo com a fórmula: `(núcleos da CPU do BD * 2) + contagem de discos`.
* **Trade-off:** Paginação exige que a API cliente forneça parâmetros de cursor/página.
* **Como validar:** O consumo de memória no Node.js durante consultas não varia em função do total de linhas no banco; pool de conexões sem timeouts de aquisição.

---

### 25-B.9 Processamento de Arquivos, Streams e Backpressure

* **Medida:** Processar uploads e leitura de arquivos via Node.js Streams utilizando `stream.promises.pipeline` em vez de carregar arquivos inteiros em memória via `fs.readFile` ou `Buffer.concat`.
* **Padrão de implementação:**
  ```typescript
  import { pipeline } from 'node:stream/promises';
  import fs from 'node:fs';
  import zlib from 'node:zlib';

  export async function compressFile(sourcePath: string, destPath: string) {
    await pipeline(
      fs.createReadStream(sourcePath),
      zlib.createGzip(),
      fs.createWriteStream(destPath)
    );
  }
  ```
* **Configuração recomendada:** Usar `pipeline` sempre para garantir o fechamento e descarte de todos os streams e listeners em caso de erro no fluxo.
* **Trade-off:** Operações em streaming exigem manipulação por chunks e não permitem acesso aleatório a posições do arquivo.
* **Como validar:** Memória RSS do processo permanece constante (< 100MB) mesmo durante a compressão/upload de arquivos de múltiplos gigabytes.

---

### 25-B.10 V8 Garbage Collector e Parâmetros de Inicialização

* **Medida:** Ajustar `--max-old-space-size` baseado na memória real do container/servidor (respeitando limites de cgroup), evitando que o Node.js atinja o limite padrão e sofra OOM Kill.
* **Padrão de configuração (Dockerfile / PM2):**
  ```dockerfile
  # Container com limite de 2GB de RAM: alocar ~75% para o Heap V8
  CMD ["node", "--max-old-space-size=1536", "dist/main.js"]
  ```
* **Configuração recomendada:** Deixar 25% a 30% da memória total do container para a memória não-heap (RSS, buffers nativos, threads C++, bibliotecas compartilhadas).
* **Trade-off:** Um heap excessivamente grande pode causar pausas mais longas de Full GC quando a coleta for acionada.
* **Como validar:** Gráfico de memória do container no Kubernetes/Docker mostra ausência de reinicializações com código 137 (OOMKilled).

---

### 25-B.11 Injeção de Dependência e Escopos de Provedores (NestJS)

* **Medida:** Manter serviços e controllers no escopo padrão `DEFAULT` (Singleton). Se dados por requisição forem necessários, passar como parâmetro do método em vez de alterar o provedor para `Scope.REQUEST`.
* **Padrão de implementação:**
  ```typescript
  // Evitar: @Injectable({ scope: Scope.REQUEST })
  @Injectable() // Singleton padrão
  export class OrderService {
    async processOrder(userContext: UserContext, orderDto: CreateOrderDto) {
      // Recebe o contexto via parâmetro, sem criar uma nova instância do serviço por request
    }
  }
  ```
* **Configuração recomendada:** Usar `Scope.REQUEST` estritamente apenas quando indispensável (ex.: multi-tenancy dinâmico com conexões segregadas por schema).
* **Trade-off:** Exige passagem de contexto nas assinaturas dos métodos.
* **Como validar:** Redução drástica nas taxas de alocação de objetos por segundo (Scavenger GC) e diminuição de até 40% no uso de CPU sob carga.

---

### 25-B.12 Concorrência de Promessas e Filas Assíncronas

* **Medida:** Substituir `Promise.all(items.map(...))` por processamento com controle de concorrência (`p-limit` / `p-queue`) para evitar sobrecarregar o Event Loop e o heap com milhares de Promises ativas simultaneamente.
* **Padrão de implementação:**
  ```typescript
  import pLimit from 'p-limit';

  export async function processBatchConcurrently<T, R>(
    items: T[],
    fn: (item: T) => Promise<R>,
    concurrency = 10
  ): Promise<R[]> {
    const limit = pLimit(concurrency);
    return Promise.all(items.map((item) => limit(() => fn(item))));
  }
  ```
* **Configuração recomendada:** Dimensionar a concorrência (`concurrency`) entre 5 e 20 dependendo da latência e da capacidade do serviço de destino.
* **Trade-off:** Aumento no tempo total de conclusão do lote em troca de estabilidade e consumo de memória previsível.
* **Como validar:** Quantidade de Promises e microtasks pendentes no Event Loop se mantém estável; o uso de memória não apresenta picos proporcionais ao tamanho do array.

---

# FASE 26 — NÃO MODIFICAR SEM EVIDÊNCIA

Antes de alterar qualquer código TypeScript, responda obrigatoriamente:
1. Qual o problema de memória ou CPU que estamos corrigindo?
2. Como sabemos que ele existe no runtime (qual métrica, log ou heap snapshot comprova)?
3. Qual é o impacto esperado da modificação na performance e no comportamento do sistema?
4. Como mediremos a melhora antes e depois da implementação?

---

# FASE 27 — PLANO DE MONITORAMENTO E TELEMETRIA

Métricas essenciais para exposição via **Prometheus / OpenTelemetry** (`prom-client`):
* `nodejs_heap_size_used_bytes` / `nodejs_heap_size_total_bytes` (Uso do Heap V8);
* `nodejs_external_memory_bytes` / `process_resident_memory_bytes` (Memória nativa e RSS total);
* `nodejs_eventloop_lag_seconds` / `nodejs_eventloop_lag_p99_seconds` (Atraso do Event Loop);
* `nodejs_gc_duration_seconds` (Duração e pausas por tipo de GC: scavenge, mark-sweep);
* `nodejs_active_handles_total` / `nodejs_active_requests_total` (Handles e I/O pendentes);
* Métricas de banco: Conexões ativas, ociosas e pendentes no pool;
* Métricas de HTTP: Latência p95/p99, taxa de requisições e taxa de erros 5xx.

Para cada medida aplicada na Fase 25-B, certifique-se de validar no dashboard de telemetria se a curva de memória/latência se estabilizou de forma sustentável.

---

# RESULTADO ESPERADO

1. O alto consumo é de Heap V8 ou de memória nativa (RSS/Buffers)?
2. Há vazamento de memória em Collections, Caches ou Closures?
3. O Event Loop está bloqueado por operações síncronas pesadas ou concorrência descontrolada?
4. Há vazamentos de EventEmitters, Sockets ou descritores de arquivos?
5. Há problemas no pool de conexões de banco de dados ou requisições HTTP externas?
6. **Para cada causa confirmada, qual medida da Fase 25-B foi aplicada, qual configuração foi adotada, e qual métrica comprova a resolução definitiva?**

## Regra final

```text
CAUSA → EVIDÊNCIA → IMPACTO → MEDIDA DE GERENCIAMENTO (Fase 25-B) → CONFIGURAÇÃO → VALIDAÇÃO
```
