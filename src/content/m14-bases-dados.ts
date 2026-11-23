import type { Module } from '../types';

export const m14: Module = {
  id: 'bases-dados',
  number: 14,
  title: 'Bases de dados, SQL e PostgreSQL',
  subtitle: 'Do modelo relacional ao JSONB: desenhar esquemas, escrever consultas e dominar a base de dados mais poderosa do mundo aberto',
  icon: '🐘',
  minutes: 120,
  goals: [
    'Perceber porque é que uma base de dados é diferente de um ficheiro',
    'Instalar PostgreSQL e ligar-te com `psql`',
    'Desenhar um esquema com tabelas, chaves primárias e estrangeiras',
    'Escrever consultas com SELECT, JOIN, GROUP BY, subqueries e CTEs',
    'Compreender índices, transações e ACID',
    'Usar funcionalidades únicas do PostgreSQL: JSONB, arrays, window functions',
    'Evitar os erros clássicos: N+1, SQL injection, índices em falta',
  ],
  sections: [
    {
      id: 'porque-bd',
      title: 'Porque precisamos de bases de dados',
      blocks: [
        { type: 'p', text: 'Guardar informação em ficheiros `.csv` ou `.json` resolve enquanto és só tu e os dados cabem num portátil. Quando chegas a milhares de utilizadores, dez colegas a alterar tudo ao mesmo tempo e cem gigabytes de dados, os ficheiros planos deixam de servir — e deixam-te com corrupção silenciosa, dados duplicados e consultas que duram a tarde toda.' },
        {
          type: 'compare',
          left: {
            title: 'Ficheiros planos resolvem quando…',
            items: [
              'São poucos registos (centenas, não milhões)',
              'Só uma pessoa escreve de cada vez',
              'As consultas são lineares e simples',
              'Não precisas de integridade transacional',
              'O backup é copiar o ficheiro',
            ],
          },
          right: {
            title: 'Precisas de uma base de dados quando…',
            items: [
              'Vários processos escrevem concorrentemente',
              'Precisas de impedir estados inconsistentes (ex.: duas transferências do mesmo saldo)',
              'As consultas combinam múltiplas "tabelas" com milhões de linhas',
              'Exiges durabilidade garantida (a máquina pode cair agora)',
              'Queres controlo fino de permissões por utilizador/tabela/coluna',
            ],
          },
        },
        {
          type: 'table',
          head: ['Tipo de BD', 'Modelo', 'Exemplos', 'Bom para'],
          rows: [
            ['**Relacional (SQL)**', 'Tabelas com linhas e colunas, ligadas por chaves', 'PostgreSQL, MySQL, SQLite, Oracle', 'A maior parte dos sistemas: encomendas, utilizadores, contabilidade, inventário'],
            ['**Chave-valor**', '`chave → valor` em memória', 'Redis, Memcached', 'Cache, sessões, contadores em tempo real'],
            ['**Documentos**', 'JSON aninhado sem esquema fixo', 'MongoDB, CouchDB', 'Dados heterogéneos onde o esquema varia muito'],
            ['**Grafo**', 'Nós e arestas', 'Neo4j, Amazon Neptune', 'Redes sociais, recomendações, deteção de fraude'],
            ['**Colunar / OLAP**', 'Agregações sobre milhares de milhões de linhas', 'ClickHouse, BigQuery, Snowflake', 'Analítica e BI em dados históricos'],
            ['**Séries temporais**', 'Otimizado para eventos por tempo', 'InfluxDB, TimescaleDB', 'Métricas, sensores, IoT'],
          ],
          caption: 'Começa com relacional. Em 95% dos casos é a resposta certa, e um PostgreSQL moderno cobre também JSON, séries temporais e pesquisa de texto.',
        },
        {
          type: 'callout', tone: 'key', title: 'Porquê PostgreSQL',
          text: 'PostgreSQL é software aberto, com 30 anos de maturidade, suporta tudo o que o Oracle suporta e algumas coisas que ele não suporta (JSONB nativo, extensões, tipos personalizados). É a escolha por omissão em startups, bancos, agências espaciais e laboratórios. "*Postgres até ter de ser outra coisa*" é um lema seguro.',
        },
      ],
    },
    {
      id: 'modelo-relacional',
      title: 'O modelo relacional em cinco minutos',
      blocks: [
        { type: 'p', text: 'Uma **base de dados relacional** organiza dados em **tabelas**. Cada tabela tem **colunas** (atributos, com tipo fixo) e **linhas** (registos). As tabelas ligam-se através de **chaves**.' },
        {
          type: 'code', lang: 'text', caption: 'tabela clientes',
          code: `┌────┬────────┬──────────────────┬───────────┐
│ id │ nome   │ email            │ criado_em │
├────┼────────┼──────────────────┼───────────┤
│  1 │ Ana    │ ana@example.com  │ 2025-01-15│
│  2 │ Bruno  │ bruno@example.com│ 2025-02-03│
│  3 │ Carla  │ carla@example.com│ 2025-03-10│
└────┴────────┴──────────────────┴───────────┘
  ↑
  chave primária`,
        },
        {
          type: 'code', lang: 'text', caption: 'tabela encomendas (liga-se a clientes via cliente_id)',
          code: `┌────┬─────────────┬───────┬────────────┐
│ id │ cliente_id  │ total │ data       │
├────┼─────────────┼───────┼────────────┤
│ 10 │     1  ◀────┼─ 250  │ 2025-04-01 │
│ 11 │     1  ◀────┼─  75  │ 2025-04-12 │
│ 12 │     2  ◀────┼─ 120  │ 2025-04-18 │
└────┴─────────────┴───────┴────────────┘
          ↑
          chave estrangeira → clientes.id`,
        },
        {
          type: 'terms', items: [
            { term: 'Tabela (relação)', def: 'Conjunto de linhas com a mesma estrutura — como uma folha de Excel, mas com tipo rigoroso e garantias de integridade.' },
            { term: 'Linha (tuplo)', def: 'Uma observação concreta: um cliente, uma encomenda, uma transação.' },
            { term: 'Coluna (atributo)', def: 'Uma propriedade com tipo fixo (inteiro, texto, data...).' },
            { term: 'Chave primária (PK)', def: 'Coluna(s) que identificam univocamente cada linha. Normalmente um `id`.' },
            { term: 'Chave estrangeira (FK)', def: 'Referência à chave primária de outra tabela. "O cliente 1 é dono desta encomenda".' },
            { term: 'Esquema', def: 'A estrutura completa: que tabelas existem, que colunas, que tipos, que restrições.' },
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'Dados normalizados: cada facto num único sítio',
          text: 'Em vez de repetires "Ana" em cada encomenda, guardas o nome **uma vez** na tabela clientes e **referencias** o `cliente_id`. Resultado: se a Ana mudar de nome, atualizas uma linha e todas as encomendas passam a ter o novo nome automaticamente.',
        },
      ],
    },
    {
      id: 'instalar',
      title: 'Instalar PostgreSQL e ligar-te',
      blocks: [
        {
          type: 'steps', items: [
            { title: 'Instalar', text: '**macOS:** `brew install postgresql@17`. **Ubuntu:** `sudo apt install postgresql postgresql-contrib`. **Windows:** instalador oficial em [postgresql.org/download](https://www.postgresql.org/download). **Docker (recomendado para aprender):** uma linha, sem poluir o sistema.' },
            { title: 'Iniciar o serviço', text: 'macOS: `brew services start postgresql@17`. Linux: `sudo systemctl start postgresql`. Docker: `docker run -d --name pg -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres:17`.' },
            { title: 'Criar utilizador e base de dados', text: '`createuser -s ana` cria o teu utilizador; `createdb loja` cria uma base de dados. Estes dois comandos vêm com o PostgreSQL.' },
            { title: 'Ligar com psql', text: '`psql loja` abre a consola interativa. Vais passar aqui muitas horas — é a tua ferramenta principal.' },
            { title: 'Interface gráfica (opcional)', text: '**pgAdmin**, **DBeaver** ou **TablePlus**. Úteis para explorar; mas aprende sempre o psql primeiro.' },
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'arranque rápido com Docker',
          code: `# subir um PostgreSQL 17 em segundos
docker run -d \\
    --name pg \\
    -e POSTGRES_PASSWORD=secret \\
    -e POSTGRES_DB=loja \\
    -p 5432:5432 \\
    -v pg-data:/var/lib/postgresql/data \\
    postgres:17

# entrar no psql
docker exec -it pg psql -U postgres loja

# parar / arrancar depois
docker stop pg
docker start pg`,
        },
        {
          type: 'code', lang: 'bash', caption: 'comandos essenciais do psql (começam com \\)',
          code: `\\l             -- lista todas as bases de dados
\\c loja        -- liga à base de dados "loja"
\\dt            -- lista as tabelas da base atual
\\d clientes    -- descreve a tabela (colunas, tipos, índices)
\\d+ clientes   -- versão detalhada
\\di            -- lista os índices
\\du            -- lista os utilizadores (roles)
\\x             -- liga/desliga formato expandido (uma linha por coluna — útil para linhas largas)
\\e             -- abre o editor para escrever a próxima consulta
\\i script.sql  -- executa um ficheiro .sql
\\timing on     -- mostra o tempo de cada consulta
\\q             -- sair`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Dica de ouro desde o primeiro dia',
          text: 'Mete `\\timing on` no teu `~/.psqlrc`. A partir desse momento vês o tempo de cada consulta — torna-se impossível não reparar quando algo demora de repente 500 ms em vez de 2 ms.',
        },
      ],
    },
    {
      id: 'tipos-dados',
      title: 'Tipos de dados do PostgreSQL',
      blocks: [
        {
          type: 'table',
          head: ['Categoria', 'Tipo', 'Quando usar', 'Exemplo'],
          rows: [
            ['**Inteiros**', '`smallint`, `integer`, `bigint`', 'Contagem, IDs, idades. `bigint` para IDs globais.', '`42`, `1_000_000`'],
            ['**Serial**', '`serial`, `bigserial`', 'IDs auto-incrementais. Atalho para `integer` + sequência.', '`id BIGSERIAL PRIMARY KEY`'],
            ['**Identity (preferido)**', '`GENERATED ALWAYS AS IDENTITY`', 'Alternativa SQL-padrão a `serial`. Recomendado em código novo.', '`id BIGINT GENERATED ALWAYS AS IDENTITY`'],
            ['**Decimais**', '`numeric(p, e)`', 'Dinheiro, medidas exatas. **Nunca uses `float` para dinheiro**.', '`numeric(12, 2)` (± 10^10 com 2 casas)'],
            ['**Reais**', '`real`, `double precision`', 'Grandezas físicas, probabilidades.', '`3.14159`'],
            ['**Texto**', '`text`, `varchar(n)`, `char(n)`', 'Em Postgres, `text` é o padrão. `varchar(n)` só se precisares de limite explícito.', `'olá mundo'`],
            ['**Boolean**', '`boolean`', '`true`/`false`.', '`activo BOOLEAN NOT NULL DEFAULT false`'],
            ['**Datas**', '`date`, `time`, `timestamp`, `timestamptz`', 'Datas, horas, momentos. **Usa sempre `timestamptz`** — guarda o fuso.', '`criado_em TIMESTAMPTZ DEFAULT now()`'],
            ['**Intervalo**', '`interval`', 'Duração: "3 dias", "2 horas 15 min".', `interval '3 days 4 hours'`],
            ['**UUID**', '`uuid`', 'Identificadores globais sem coordenação central.', '`gen_random_uuid()`'],
            ['**JSON**', '`json`, `jsonb`', 'Dados semi-estruturados. **Usa `jsonb`** — é binário, indexável, mais rápido.', `'{"tags": ["novo"]}'`],
            ['**Arrays**', '`integer[]`, `text[]`', 'Listas pequenas e fixas de valores do mesmo tipo.', `ARRAY['novo', 'promocao']`],
            ['**Enum**', '`CREATE TYPE ... AS ENUM (...)`', 'Valores de domínio fechado.', `estado estado_t NOT NULL`],
            ['**Geométricos / GIS**', '`point`, `geometry` (PostGIS)', 'Localização, mapas, geofencing.', '`POINT(-9.14 38.72)`'],
          ],
          caption: 'Para começar, 90% do que precisas: `bigint`, `text`, `boolean`, `timestamptz`, `numeric(12,2)`, `jsonb`.',
        },
        {
          type: 'callout', tone: 'trap', title: 'Três erros fatais com tipos',
          text: '**(1)** Usar `float`/`double` para dinheiro — a imprecisão acumula-se em cêntimos "fantasma". Usa `numeric(12, 2)`. **(2)** Usar `timestamp` (sem `tz`) em aplicações com utilizadores em vários fusos — perdes a informação de fuso. Usa sempre `timestamptz`. **(3)** Usar `varchar(255)` por hábito — em Postgres não há vantagem sobre `text`, a limitação é uma herança de MySQL.',
        },
      ],
    },
    {
      id: 'criar-tabelas',
      title: 'CREATE TABLE — DDL e restrições',
      blocks: [
        { type: 'p', text: 'DDL (*Data Definition Language*) é como declaras a estrutura. As restrições (`NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY`) são as **regras do negócio no esquema** — o que impede dados inválidos de sequer entrar na base de dados.' },
        {
          type: 'code', lang: 'sql', caption: 'esquema de uma loja simples',
          code: `-- Tabela de clientes
CREATE TABLE clientes (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        TEXT NOT NULL CHECK (char_length(nome) BETWEEN 1 AND 200),
    email       TEXT NOT NULL UNIQUE,
    telefone    TEXT,
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tipo enumerado para o estado da encomenda
CREATE TYPE estado_encomenda AS ENUM
    ('pendente', 'paga', 'enviada', 'entregue', 'cancelada');

-- Tabela de produtos
CREATE TABLE produtos (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        TEXT NOT NULL,
    preco_cents BIGINT NOT NULL CHECK (preco_cents > 0),
    stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    activo      BOOLEAN NOT NULL DEFAULT true
);

-- Encomendas: uma por cliente, muitas linhas
CREATE TABLE encomendas (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id  BIGINT NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    estado      estado_encomenda NOT NULL DEFAULT 'pendente',
    total_cents BIGINT NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Linhas de encomenda: ligação muitos-para-muitos entre produtos e encomendas
CREATE TABLE linhas_encomenda (
    encomenda_id   BIGINT NOT NULL REFERENCES encomendas(id) ON DELETE CASCADE,
    produto_id     BIGINT NOT NULL REFERENCES produtos(id),
    quantidade     INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unit_cents BIGINT NOT NULL,
    PRIMARY KEY (encomenda_id, produto_id)
);`,
        },
        {
          type: 'terms', items: [
            { term: 'NOT NULL', def: 'A coluna não pode ter `NULL`. **Sê generoso** — metade dos bugs das aplicações vêm de colunas que podiam ser NULL e não deviam.' },
            { term: 'UNIQUE', def: 'Garante que não há duplicados. Dois clientes com o mesmo email? Rejeitado em BD, não só na aplicação.' },
            { term: 'CHECK', def: 'Expressão booleana que cada linha tem de satisfazer. `CHECK (idade >= 0)` impede idades negativas em TODO o código.' },
            { term: 'REFERENCES', def: 'Cria uma chave estrangeira. O PostgreSQL garante que nunca ficas com encomendas a apontar para clientes que já não existem.' },
            { term: 'ON DELETE CASCADE', def: 'Se apagas o cliente, apagam-se as linhas que o referenciam. `RESTRICT` (por omissão) rejeita o DELETE se há dependências.' },
            { term: 'DEFAULT', def: 'Valor usado quando o INSERT omite a coluna. `DEFAULT now()` dá timestamps automáticos.' },
          ],
        },
        { type: 'h', text: 'Alterar tabelas (migrações)' },
        {
          type: 'code', lang: 'sql',
          code: `-- Adicionar coluna (com default não bloqueia a tabela em Postgres 11+)
ALTER TABLE clientes ADD COLUMN pais TEXT NOT NULL DEFAULT 'PT';

-- Renomear coluna
ALTER TABLE clientes RENAME COLUMN telefone TO telemovel;

-- Alterar tipo (pode bloquear se a tabela for grande)
ALTER TABLE produtos ALTER COLUMN stock TYPE BIGINT;

-- Acrescentar restrição
ALTER TABLE produtos ADD CONSTRAINT preco_positivo CHECK (preco_cents > 0);

-- Remover (perde dados — tem cuidado)
ALTER TABLE clientes DROP COLUMN telemovel;
DROP TABLE linhas_encomenda;         -- destrói a tabela
DROP TABLE encomendas CASCADE;        -- + tudo o que dependa dela`,
        },
        {
          type: 'callout', tone: 'warn', title: 'Em produção: migrações versionadas',
          text: 'Nunca alteres o esquema em produção com `psql` à mão. Usa uma ferramenta de migrações — Flyway, Liquibase, Alembic, Prisma Migrate, Knex — que versiona cada alteração num ficheiro, corre em ordem e sabe onde parou. O esquema passa a estar no git como qualquer outro código.',
        },
      ],
    },
    {
      id: 'select-basico',
      title: 'SELECT — a consulta fundamental',
      blocks: [
        { type: 'p', text: '`SELECT` é a consulta mais usada do SQL. Lê-se **da cláusula FROM para cima**: primeiro de onde vêm os dados, depois o filtro, depois as colunas de saída.' },
        {
          type: 'code', lang: 'sql', caption: 'anatomia de um SELECT',
          code: `SELECT nome, email              -- colunas que quero ver
FROM clientes                   -- de onde
WHERE pais = 'PT'               -- filtro de linhas
  AND criado_em >= '2025-01-01'
ORDER BY criado_em DESC         -- ordenação
LIMIT 10;                       -- só as 10 primeiras`,
        },
        { type: 'h', text: 'WHERE — todas as formas de filtrar' },
        {
          type: 'code', lang: 'sql',
          code: `-- Comparações básicas
WHERE preco_cents > 1000
WHERE estado = 'paga'
WHERE criado_em >= '2025-01-01'

-- Combinações
WHERE pais = 'PT' AND activo = true
WHERE pais IN ('PT', 'ES', 'FR')              -- múltiplos valores
WHERE preco_cents BETWEEN 500 AND 2000         -- intervalo
WHERE nome LIKE 'A%'                           -- começa por A
WHERE nome ILIKE '%silva%'                     -- contém "silva", case-insensitive
WHERE email ~ '^[a-z]+@gmail\\.com$'           -- regex POSIX

-- NULL
WHERE telefone IS NULL
WHERE telefone IS NOT NULL

-- Negação
WHERE NOT activo
WHERE estado <> 'cancelada'`,
        },
        {
          type: 'callout', tone: 'trap', title: 'NULL não é zero, não é vazio, e não é igual a nada',
          text: '`WHERE x = NULL` **nunca** devolve linhas, mesmo quando `x` é NULL. A lógica de três valores (true, false, unknown) do SQL faz com que qualquer comparação com NULL devolva "unknown", que é filtrado. Usa `IS NULL` e `IS NOT NULL`. Esquecer isto é a causa #1 de resultados vazios misteriosos.',
        },
        { type: 'h', text: 'ORDER BY, LIMIT, OFFSET' },
        {
          type: 'code', lang: 'sql',
          code: `-- Mais caros primeiro
SELECT nome, preco_cents
FROM produtos
ORDER BY preco_cents DESC;

-- Múltiplos critérios + NULL no fim
SELECT nome, criado_em
FROM clientes
ORDER BY criado_em DESC NULLS LAST, nome ASC;

-- Paginação (página 3 de 20 em 20)
SELECT * FROM produtos
ORDER BY id
LIMIT 20 OFFSET 40;`,
        },
        { type: 'h', text: 'DISTINCT, aliases e expressões' },
        {
          type: 'code', lang: 'sql',
          code: `-- Valores únicos
SELECT DISTINCT pais FROM clientes;

-- Aliases tornam a saída legível
SELECT
    nome                          AS cliente,
    criado_em                     AS desde,
    EXTRACT(YEAR FROM criado_em)  AS ano_registo
FROM clientes;

-- Expressões no SELECT
SELECT
    nome,
    preco_cents / 100.0           AS preco_euros,
    preco_cents * 1.23 / 100.0    AS com_iva
FROM produtos;`,
        },
      ],
    },
    {
      id: 'insert-update-delete',
      title: 'INSERT, UPDATE, DELETE — alterar dados',
      blocks: [
        { type: 'h', text: 'INSERT' },
        {
          type: 'code', lang: 'sql',
          code: `-- Uma linha
INSERT INTO clientes (nome, email)
VALUES ('Ana Silva', 'ana@example.com');

-- Múltiplas linhas numa só instrução (muito mais rápido que 1 a 1)
INSERT INTO produtos (nome, preco_cents, stock) VALUES
    ('Caneca', 1200, 50),
    ('T-shirt', 1900, 100),
    ('Caderno',  800, 200);

-- Devolver as linhas inseridas (RETURNING)
INSERT INTO clientes (nome, email)
VALUES ('Bruno Costa', 'bruno@example.com')
RETURNING id, nome, criado_em;

-- UPSERT: inserir ou atualizar (ON CONFLICT)
INSERT INTO clientes (email, nome)
VALUES ('ana@example.com', 'Ana Nova')
ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome;`,
        },
        { type: 'h', text: 'UPDATE' },
        {
          type: 'code', lang: 'sql',
          code: `-- Atualizar uma linha
UPDATE clientes
SET nome = 'Ana Silva Costa'
WHERE id = 1;

-- Atualizar várias colunas
UPDATE produtos
SET preco_cents = preco_cents * 110 / 100,   -- aumentar 10%
    stock = stock - 1
WHERE id = 42;

-- Atualizar em massa com condição
UPDATE encomendas
SET estado = 'cancelada'
WHERE criado_em < now() - interval '30 days'
  AND estado = 'pendente'
RETURNING id, cliente_id;`,
        },
        {
          type: 'callout', tone: 'trap', title: 'O erro mais caro do SQL',
          text: 'Escrever `UPDATE clientes SET ...` **sem WHERE**. Atualiza a tabela inteira. Antes de qualquer UPDATE/DELETE em produção: (1) escreve a WHERE primeiro; (2) corre como SELECT para ver quais linhas vai apanhar; (3) só depois troca por UPDATE/DELETE; (4) sempre dentro de uma transação, para poderes fazer ROLLBACK.',
        },
        { type: 'h', text: 'DELETE e TRUNCATE' },
        {
          type: 'code', lang: 'sql',
          code: `-- Apagar linhas filtradas
DELETE FROM clientes WHERE activo = false AND criado_em < '2020-01-01';

-- Apagar com RETURNING (útil para log de auditoria)
DELETE FROM linhas_encomenda
WHERE encomenda_id = 42
RETURNING *;

-- TRUNCATE: apaga tudo, instantâneo, não dispara triggers
TRUNCATE TABLE produtos_staging;
TRUNCATE encomendas, linhas_encomenda RESTART IDENTITY CASCADE;`,
        },
      ],
    },
    {
      id: 'joins',
      title: 'JOINs — combinar tabelas',
      blocks: [
        { type: 'p', text: 'Um `JOIN` combina linhas de duas ou mais tabelas segundo uma condição. É o que torna o modelo relacional poderoso: os dados vivem normalizados, mas tu consultas como se estivessem numa tabela só.' },
        {
          type: 'table',
          head: ['Tipo', 'O que devolve', 'Quando usar'],
          rows: [
            ['**`INNER JOIN`**', 'Apenas linhas com correspondência em **ambas** as tabelas', 'O caso mais comum — "encomendas com cliente conhecido"'],
            ['**`LEFT JOIN`**', 'Todas as linhas da esquerda + correspondências (ou NULL)', '"Todos os clientes, com ou sem encomendas"'],
            ['**`RIGHT JOIN`**', 'Simétrico do LEFT (raramente usado — vira as tabelas)', 'Praticamente nunca'],
            ['**`FULL OUTER JOIN`**', 'Tudo de ambos os lados, correspondendo onde for possível', 'Reconciliação, encontrar diferenças entre conjuntos'],
            ['**`CROSS JOIN`**', 'Produto cartesiano (todas as combinações)', 'Gerar séries, calendário × produtos'],
          ],
        },
        {
          type: 'code', lang: 'sql', caption: 'INNER JOIN — o caso base',
          code: `-- Encomendas com o nome do cliente
SELECT
    e.id                AS encomenda,
    c.nome              AS cliente,
    e.total_cents / 100.0 AS total_euros,
    e.estado
FROM encomendas e
INNER JOIN clientes c ON c.id = e.cliente_id
WHERE e.estado = 'paga'
ORDER BY e.criado_em DESC;`,
        },
        {
          type: 'code', lang: 'sql', caption: 'LEFT JOIN — incluir quem não tem correspondência',
          code: `-- Todos os clientes, com a última encomenda (ou NULL se nunca comprou)
SELECT
    c.nome,
    e.id        AS ultima_encomenda,
    e.criado_em
FROM clientes c
LEFT JOIN encomendas e ON e.cliente_id = c.id
                       AND e.criado_em = (
                           SELECT MAX(criado_em) FROM encomendas
                           WHERE cliente_id = c.id
                       );

-- Clientes SEM encomendas nenhumas (truque LEFT JOIN + IS NULL)
SELECT c.*
FROM clientes c
LEFT JOIN encomendas e ON e.cliente_id = c.id
WHERE e.id IS NULL;`,
        },
        {
          type: 'code', lang: 'sql', caption: 'JOIN de 3 tabelas — relação muitos-para-muitos',
          code: `-- Quantos de cada produto cada cliente comprou
SELECT
    c.nome          AS cliente,
    p.nome          AS produto,
    SUM(le.quantidade) AS unidades_compradas
FROM clientes c
JOIN encomendas e         ON e.cliente_id = c.id
JOIN linhas_encomenda le  ON le.encomenda_id = e.id
JOIN produtos p           ON p.id = le.produto_id
WHERE e.estado IN ('paga', 'enviada', 'entregue')
GROUP BY c.nome, p.nome
ORDER BY c.nome, unidades_compradas DESC;`,
        },
        {
          type: 'callout', tone: 'key', title: 'A regra de ouro dos JOINs',
          text: 'Para cada JOIN, pergunta: **"a linha da esquerda pode existir sem a da direita?"** Se a resposta é não, usa `INNER`. Se é sim e queres ver os "órfãos", `LEFT`. Nunca uses `INNER` por omissão sem pensar — é fonte constante de linhas desaparecidas.',
        },
      ],
    },
    {
      id: 'agregacao',
      title: 'GROUP BY — agregar, agrupar, contar',
      blocks: [
        { type: 'p', text: 'As funções de agregação (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) reduzem muitas linhas a um único valor por grupo. É onde o SQL começa a parecer com análise de dados.' },
        {
          type: 'code', lang: 'sql',
          code: `-- Total de todas as encomendas
SELECT SUM(total_cents) / 100.0 AS total_euros FROM encomendas;

-- Agrupar por estado
SELECT
    estado,
    COUNT(*)                         AS n_encomendas,
    SUM(total_cents) / 100.0         AS receita,
    AVG(total_cents) / 100.0         AS ticket_medio,
    MIN(criado_em)                   AS primeira,
    MAX(criado_em)                   AS ultima
FROM encomendas
GROUP BY estado
ORDER BY receita DESC;`,
        },
        {
          type: 'code', lang: 'sql', caption: 'Top-N por grupo — "o produto mais vendido de cada cliente"',
          code: `-- HAVING: filtra DEPOIS da agregação (o WHERE filtra antes)
SELECT
    c.nome,
    COUNT(e.id)             AS n_encomendas,
    SUM(e.total_cents)/100.0 AS gasto_total
FROM clientes c
LEFT JOIN encomendas e ON e.cliente_id = c.id
WHERE e.estado IN ('paga', 'entregue')
GROUP BY c.id, c.nome
HAVING COUNT(e.id) >= 3                       -- só clientes com 3+
   AND SUM(e.total_cents) > 10000              -- e mais de 100 €
ORDER BY gasto_total DESC
LIMIT 10;`,
        },
        {
          type: 'table',
          head: ['Função', 'O que faz', 'Nota'],
          rows: [
            ['`COUNT(*)`', 'Conta linhas', 'Inclui NULL'],
            ['`COUNT(col)`', 'Conta linhas onde `col` não é NULL', 'NULLs são ignorados'],
            ['`COUNT(DISTINCT col)`', 'Conta valores únicos', 'Pesado em tabelas grandes'],
            ['`SUM(col)`', 'Soma', 'Ignora NULL'],
            ['`AVG(col)`', 'Média aritmética', 'Ignora NULL — se precisas de tratar NULL como 0, usa `COALESCE`'],
            ['`MIN`, `MAX`', 'Mínimo/máximo', 'Também funcionam em texto e datas'],
            ['`STRING_AGG(col, sep)`', 'Concatena valores separados', `STRING_AGG(nome, ', ') → "Ana, Bruno, Carla"`],
            ['`ARRAY_AGG(col)`', 'Agrega valores num array', 'Útil para construir respostas aninhadas'],
            ['`JSONB_AGG(col)`', 'Agrega num array JSON', 'Combinação mortífera com `jsonb_build_object`'],
          ],
          caption: 'As duas últimas são específicas do PostgreSQL e evitam fazer o agrupamento na aplicação.',
        },
        {
          type: 'callout', tone: 'tip', title: 'Regra de ouro do GROUP BY',
          text: 'Cada coluna no `SELECT` tem de estar **ou no GROUP BY, ou dentro de uma função de agregação**. Caso contrário, o PostgreSQL rejeita a consulta — porque é ambíguo que valor mostrar.',
        },
      ],
    },
    {
      id: 'subqueries-ctes',
      title: 'Subqueries e CTEs — compor consultas',
      blocks: [
        { type: 'p', text: 'Quando uma consulta fica difícil de ler, divide-a em passos. CTEs (*Common Table Expressions*, `WITH`) são a forma moderna de fazer isso.' },
        { type: 'h', text: 'Subqueries' },
        {
          type: 'code', lang: 'sql',
          code: `-- Clientes que gastaram acima da média
SELECT nome, email
FROM clientes
WHERE id IN (
    SELECT cliente_id
    FROM encomendas
    GROUP BY cliente_id
    HAVING SUM(total_cents) > (
        SELECT AVG(total_cents) * 10 FROM encomendas
    )
);

-- Subquery correlacionada — avaliada para cada linha (cuidado: lento)
SELECT
    c.nome,
    (SELECT COUNT(*) FROM encomendas e WHERE e.cliente_id = c.id) AS n_encomendas
FROM clientes c;`,
        },
        { type: 'h', text: 'CTEs — WITH' },
        {
          type: 'code', lang: 'sql', caption: 'a mesma análise, legível',
          code: `WITH gasto_por_cliente AS (
    SELECT
        cliente_id,
        COUNT(*)             AS n_encomendas,
        SUM(total_cents)     AS gasto_total
    FROM encomendas
    WHERE estado IN ('paga', 'entregue')
    GROUP BY cliente_id
),
media AS (
    SELECT AVG(gasto_total) AS media_gasto FROM gasto_por_cliente
)
SELECT
    c.nome,
    g.n_encomendas,
    g.gasto_total / 100.0 AS gasto_euros
FROM gasto_por_cliente g
JOIN clientes c ON c.id = g.cliente_id
WHERE g.gasto_total > (SELECT media_gasto FROM media) * 2
ORDER BY g.gasto_total DESC;`,
        },
        {
          type: 'callout', tone: 'key', title: 'Porquê preferir CTEs',
          text: 'CTEs lêem-se de cima para baixo como passos nomeados — cada um faz uma coisa. Subqueries aninhadas lêem-se de dentro para fora, tornam-se difíceis de depurar e impossíveis de reutilizar. CTEs são a forma moderna.',
        },
        { type: 'h', text: 'CTE recursiva — hierarquias e grafos' },
        {
          type: 'code', lang: 'sql', caption: 'árvore de funcionários (chefe → subordinados)',
          code: `-- tabela funcionarios(id, nome, chefe_id)
WITH RECURSIVE arvore AS (
    -- Caso base: a raiz
    SELECT id, nome, chefe_id, 0 AS nivel
    FROM funcionarios
    WHERE chefe_id IS NULL

    UNION ALL

    -- Caso recursivo: quem tem como chefe alguém já na árvore
    SELECT f.id, f.nome, f.chefe_id, a.nivel + 1
    FROM funcionarios f
    JOIN arvore a ON a.id = f.chefe_id
)
SELECT repeat('  ', nivel) || nome AS hierarquia, nivel
FROM arvore
ORDER BY nivel, nome;`,
        },
      ],
    },
    {
      id: 'window-functions',
      title: 'Window Functions — agregação sem perder linhas',
      blocks: [
        { type: 'p', text: 'Window functions são o que separa SQL dos amadores. Calculam agregações **mantendo cada linha individual** — ranking, totais acumulados, diferença para o anterior, média móvel. Mudam o jogo.' },
        {
          type: 'code', lang: 'sql', caption: 'ROW_NUMBER, RANK, DENSE_RANK',
          code: `-- Para cada cliente, numerar as suas encomendas por ordem cronológica
SELECT
    cliente_id,
    id                                  AS encomenda_id,
    criado_em,
    total_cents,
    ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY criado_em) AS num_encomenda
FROM encomendas;

-- Top 3 produtos mais vendidos por categoria
SELECT * FROM (
    SELECT
        categoria,
        nome,
        unidades_vendidas,
        RANK() OVER (PARTITION BY categoria ORDER BY unidades_vendidas DESC) AS r
    FROM vista_vendas_produto
) t
WHERE r <= 3;`,
        },
        {
          type: 'code', lang: 'sql', caption: 'LAG/LEAD — comparar com o anterior',
          code: `-- Variação diária de vendas
SELECT
    data,
    total_dia,
    LAG(total_dia) OVER (ORDER BY data)                   AS ontem,
    total_dia - LAG(total_dia) OVER (ORDER BY data)       AS variacao,
    ROUND(100.0 * (total_dia - LAG(total_dia) OVER (ORDER BY data))
          / LAG(total_dia) OVER (ORDER BY data), 2)        AS variacao_pct
FROM vendas_diarias;`,
        },
        {
          type: 'code', lang: 'sql', caption: 'Total acumulado e média móvel',
          code: `-- Acumulado e média móvel de 7 dias
SELECT
    data,
    total_dia,
    SUM(total_dia) OVER (ORDER BY data
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS acumulado,
    AVG(total_dia) OVER (ORDER BY data
                         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS media_7d
FROM vendas_diarias
ORDER BY data;`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Uma aplicação que se repete em todo o lado',
          text: '**"Para cada X, o mais recente/caro/popular Y."** Clientes → última encomenda. Produtos → preço mais recente. Utilizadores → sessão ativa. A resposta é quase sempre `ROW_NUMBER() OVER (PARTITION BY x ORDER BY y DESC) = 1` numa subquery.',
        },
      ],
    },
    {
      id: 'indices',
      title: 'Índices e EXPLAIN — fazer o Postgres voar',
      blocks: [
        { type: 'p', text: 'Sem índices, uma consulta `WHERE email = ...` percorre **toda a tabela** à procura. Com índice, salta direta à linha. A diferença entre 1 ms e 10 segundos é um `CREATE INDEX`.' },
        {
          type: 'code', lang: 'sql',
          code: `-- Índice simples
CREATE INDEX idx_clientes_email ON clientes(email);

-- Índice composto — a ordem das colunas importa!
CREATE INDEX idx_encomendas_cliente_data
    ON encomendas(cliente_id, criado_em DESC);

-- Índice parcial — apenas linhas que importam (poupa espaço e torna mais rápido)
CREATE INDEX idx_encomendas_abertas
    ON encomendas(criado_em)
    WHERE estado IN ('pendente', 'paga');

-- Índice por expressão (útil para pesquisa case-insensitive)
CREATE INDEX idx_clientes_email_lower
    ON clientes(lower(email));
-- depois usa: WHERE lower(email) = lower('ANA@example.com')

-- Índice GIN — para JSONB, arrays, full-text
CREATE INDEX idx_produtos_tags ON produtos USING GIN (tags);
CREATE INDEX idx_produtos_dados ON produtos USING GIN (dados jsonb_path_ops);`,
        },
        { type: 'h', text: 'EXPLAIN — ver o que o Postgres vai fazer' },
        {
          type: 'code', lang: 'sql',
          code: `EXPLAIN SELECT * FROM encomendas WHERE cliente_id = 42;

                            QUERY PLAN
----------------------------------------------------------
 Index Scan using idx_encomendas_cliente_data on encomendas
   Index Cond: (cliente_id = 42)
   (cost=0.29..8.31 rows=1 width=40)

-- EXPLAIN ANALYZE corre MESMO a consulta e mede
EXPLAIN (ANALYZE, BUFFERS)
SELECT c.nome, COUNT(*)
FROM clientes c JOIN encomendas e ON e.cliente_id = c.id
GROUP BY c.nome;`,
        },
        {
          type: 'table',
          head: ['Aparece no plano', 'Significado', 'Bom/Mau'],
          rows: [
            ['`Seq Scan`', 'Varre a tabela toda', '**Mau** em tabelas grandes — falta um índice'],
            ['`Index Scan`', 'Usa um índice para encontrar linhas', '**Bom** — o que queres ver'],
            ['`Bitmap Index Scan` + `Bitmap Heap Scan`', 'Combina múltiplos índices', 'Bom para filtros compostos'],
            ['`Index Only Scan`', 'Nem toca na tabela — só no índice', '**Óptimo** — o índice tem todas as colunas de que precisas'],
            ['`Nested Loop`', 'Para cada linha da esquerda, procura na direita', 'Bom em tabelas pequenas; **mau** em grandes sem índice'],
            ['`Hash Join`', 'Constrói hash em memória', 'Excelente em tabelas médias'],
            ['`Merge Join`', 'Ambos os lados ordenados e depois juntados', 'Bom em grandes já ordenadas'],
          ],
        },
        {
          type: 'callout', tone: 'warn', title: 'Índices não são de graça',
          text: 'Cada índice ocupa espaço E abranda `INSERT`/`UPDATE`/`DELETE`, porque tem de ser mantido. Não criem índices "por via das dúvidas". Cria o índice quando o `EXPLAIN` mostra um `Seq Scan` numa consulta frequente sobre uma tabela que cresce.',
        },
      ],
    },
    {
      id: 'transacoes',
      title: 'Transações e ACID',
      blocks: [
        { type: 'p', text: 'Uma **transação** é um bloco de operações que acontecem **todas ou nenhuma**. É o que impede que uma transferência bancária deixe o dinheiro a sair de uma conta sem chegar à outra.' },
        {
          type: 'code', lang: 'sql',
          code: `BEGIN;

UPDATE contas SET saldo = saldo - 10000 WHERE id = 1;
UPDATE contas SET saldo = saldo + 10000 WHERE id = 2;

-- Se a luz for abaixo aqui, nenhum dos dois UPDATEs é aplicado.

COMMIT;    -- confirma ambos
-- ou:
ROLLBACK;  -- desfaz ambos`,
        },
        {
          type: 'terms', items: [
            { term: 'Atomicidade (A)', def: 'Tudo ou nada. Se qualquer passo falha, nenhum deles vale.' },
            { term: 'Consistência (C)', def: 'Depois da transação, todas as restrições (CHECK, FK) continuam válidas. Nunca ficas com uma encomenda a apontar para um cliente inexistente.' },
            { term: 'Isolamento (I)', def: 'Transações concorrentes não se veem umas às outras a meio. Como se corressem em fila.' },
            { term: 'Durabilidade (D)', def: 'Depois do COMMIT, o resultado está em disco. Mesmo que a máquina caia a seguir.' },
          ],
        },
        { type: 'h', text: 'Níveis de isolamento' },
        {
          type: 'table',
          head: ['Nível', 'O que evita', 'Nota'],
          rows: [
            ['**READ UNCOMMITTED**', 'Nada (em Postgres é igual a READ COMMITTED)', 'Nunca uses'],
            ['**READ COMMITTED** (default)', 'Dirty reads', 'Aceitável na maior parte dos casos'],
            ['**REPEATABLE READ**', '+ non-repeatable reads e phantom reads', 'Para relatórios consistentes'],
            ['**SERIALIZABLE**', 'Tudo — como se corresse uma de cada vez', 'Mais seguro, pode exigir *retries* quando há conflito'],
          ],
        },
        {
          type: 'code', lang: 'sql',
          code: `BEGIN ISOLATION LEVEL SERIALIZABLE;
-- ... operações críticas ...
COMMIT;

-- Trancar linhas explicitamente
BEGIN;
SELECT * FROM contas WHERE id = 1 FOR UPDATE;   -- trava até COMMIT
UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
COMMIT;`,
        },
        {
          type: 'callout', tone: 'key', title: 'Tudo o que importa é dentro de uma transação',
          text: 'Em Postgres **cada instrução é uma transação implícita**. Se não escreves `BEGIN`, cada `UPDATE` faz commit sozinho. Para sequências de alterações relacionadas, abre transação explícita. Em código de aplicação, bibliotecas como JDBC ou pg-node tratam isto automaticamente — só tens de a usar.',
        },
      ],
    },
    {
      id: 'modelacao',
      title: 'Modelar o esquema: normalização e armadilhas',
      blocks: [
        { type: 'p', text: 'Um bom esquema é como um bom edifício: muda tudo nos primeiros dez anos, mas se as fundações estão certas, dura. Más fundações obrigam a reescrever o código em redor delas para sempre.' },
        { type: 'h', text: 'As três formas normais, em Português' },
        {
          type: 'steps', items: [
            { title: '1FN — cada célula contém um valor atómico', text: 'Nada de "Pedro, João, Maria" num único campo. Divide em linhas ou numa tabela auxiliar.' },
            { title: '2FN — sem dependências parciais', text: 'Numa tabela com chave composta `(encomenda_id, produto_id)`, não deves ter `nome_produto` — que depende só de `produto_id`. Essa coluna vive na tabela produtos.' },
            { title: '3FN — sem dependências transitivas', text: 'Se tens `cliente_id → cliente_nome → cidade_pais`, "cidade_pais" não deve estar na tabela clientes — depende indiretamente, via cidade. Cria uma tabela cidades.' },
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'Na prática: normaliza, depois questiona',
          text: 'Chega à 3FN primeiro — garantirá que cada facto vive num único sítio. **Depois** podes desnormalizar casos específicos por desempenho (ex.: guardar o `total_cents` de uma encomenda, calculado a partir das linhas). Mas apenas com dados para provar que a versão normalizada é demasiado lenta.',
        },
        { type: 'h', text: 'Armadilhas clássicas' },
        {
          type: 'compare',
          left: {
            title: 'Faz',
            items: [
              'Chave primária `BIGINT` ou `UUID` — nunca "email" ou "cpf"',
              'Nomes de tabela no plural (clientes, encomendas), de coluna singular (nome, email)',
              'Chaves estrangeiras com `ON DELETE` explícito',
              '`NOT NULL` por omissão — torna o NULL deliberado',
              'Dinheiro em `BIGINT` cêntimos ou `numeric(12, 2)`',
              '`timestamptz` sempre — nunca `timestamp` à seca',
              'Índices para colunas de JOIN e WHERE frequentes',
            ],
          },
          right: {
            title: 'Evita',
            items: [
              'Reutilizar IDs (`id` deletado volta a ser atribuído)',
              'Guardar múltiplos valores numa coluna — "tag1,tag2,tag3" em vez de array ou tabela',
              'Colunas `estado_1`, `estado_2`, `estado_3` — isso são linhas numa tabela, não colunas',
              'Chaves de negócio (NIF, email) como PK — podem mudar',
              'Guardar preços calculados sem guardar os inputs ("total" sem as linhas)',
              'Esquemas sem chaves estrangeiras — o PostgreSQL deixa de poder proteger-te',
            ],
          },
        },
      ],
    },
    {
      id: 'postgres-features',
      title: 'PostgreSQL específico: JSONB, arrays e extensões',
      blocks: [
        { type: 'h', text: 'JSONB — relacional e semi-estruturado no mesmo sítio' },
        {
          type: 'code', lang: 'sql',
          code: `CREATE TABLE eventos (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo       TEXT NOT NULL,
    dados      JSONB NOT NULL,
    criado_em  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO eventos (tipo, dados) VALUES
    ('login',  '{"user": "ana", "ip": "10.0.0.1", "device": "mobile"}'),
    ('compra', '{"user": "ana", "produtos": ["p1", "p2"], "total": 48.5}');

-- Navegar: -> devolve JSON, ->> devolve texto
SELECT dados->>'user' AS utilizador,
       dados->'produtos' AS produtos
FROM eventos WHERE tipo = 'compra';

-- Filtrar
SELECT * FROM eventos WHERE dados->>'user' = 'ana';
SELECT * FROM eventos WHERE dados @> '{"device": "mobile"}';  -- contém
SELECT * FROM eventos WHERE dados ? 'ip';                      -- tem a chave
SELECT * FROM eventos WHERE dados->'produtos' @> '["p1"]';

-- Índice GIN torna tudo isto rápido
CREATE INDEX idx_eventos_dados ON eventos USING GIN (dados jsonb_path_ops);`,
        },
        {
          type: 'callout', tone: 'warn', title: 'JSONB não é desculpa para não modelar',
          text: 'Quando os dados têm estrutura clara e repetitiva (nome, email, data_nascimento), isso vai numa coluna, não num JSONB. JSONB é para aquilo que **genuinamente varia** entre linhas (metadados de evento, respostas de formulário dinâmico). Abusar disto dá-te um MongoDB disfarçado, mas lento.',
        },
        { type: 'h', text: 'Arrays' },
        {
          type: 'code', lang: 'sql',
          code: `ALTER TABLE produtos ADD COLUMN tags TEXT[];

UPDATE produtos SET tags = ARRAY['novo', 'promocao'] WHERE id = 1;

SELECT * FROM produtos WHERE 'novo' = ANY(tags);
SELECT * FROM produtos WHERE tags @> ARRAY['novo', 'barato'];  -- todas
SELECT * FROM produtos WHERE tags && ARRAY['novo', 'barato'];  -- alguma

-- Desdobrar em linhas
SELECT id, nome, unnest(tags) AS tag FROM produtos;`,
        },
        { type: 'h', text: 'Extensões — superpoderes opcionais' },
        {
          type: 'table',
          head: ['Extensão', 'O que acrescenta', 'Comando'],
          rows: [
            ['**`pgcrypto`**', 'Hashing, UUIDs aleatórios, encriptação', '`CREATE EXTENSION pgcrypto;` → `gen_random_uuid()`'],
            ['**`pg_trgm`**', 'Pesquisa por similaridade ("ana" ≈ "ane")', '`SELECT * FROM clientes WHERE nome % \'ane\''],
            ['**`unaccent`**', 'Remover acentos para pesquisa', 'útil em PT: "cafe" encontra "café"'],
            ['**`postgis`**', 'Dados geográficos (pontos, polígonos, distâncias)', 'base de Uber-likes, mapas, logística'],
            ['**`timescaledb`**', 'Séries temporais em escala — automatiza partições', 'IoT, métricas, logs'],
            ['**`pg_stat_statements`**', 'Regista as consultas mais lentas / frequentes', 'ferramenta #1 para otimização'],
          ],
        },
        { type: 'h', text: 'Full-text search nativo' },
        {
          type: 'code', lang: 'sql',
          code: `-- Coluna gerada automaticamente com o vetor de pesquisa
ALTER TABLE produtos ADD COLUMN pesquisa tsvector
    GENERATED ALWAYS AS (to_tsvector('portuguese', nome)) STORED;

CREATE INDEX idx_produtos_pesquisa ON produtos USING GIN (pesquisa);

-- Pesquisa: "camisola" encontra "camisolas", "camisolar" (stemming do PT)
SELECT nome
FROM produtos
WHERE pesquisa @@ plainto_tsquery('portuguese', 'camisola azul')
ORDER BY ts_rank(pesquisa, plainto_tsquery('portuguese', 'camisola azul')) DESC
LIMIT 10;`,
        },
      ],
    },
    {
      id: 'seguranca-praticas',
      title: 'Segurança, backups e boas práticas',
      blocks: [
        { type: 'h', text: 'SQL Injection — ainda a #1' },
        {
          type: 'code', lang: 'python', caption: '❌ nunca faças isto',
          code: `email = request.args['email']
cur.execute(f"SELECT * FROM clientes WHERE email = '{email}'")
# Entrada maliciosa:  x' OR '1'='1
# Resultado: devolve TODOS os clientes.`,
        },
        {
          type: 'code', lang: 'python', caption: '✅ sempre parametrizado',
          code: `cur.execute(
    "SELECT * FROM clientes WHERE email = %s",
    (email,)
)
# O driver escapa o valor. É impossível um atacante "sair" do parâmetro.`,
        },
        { type: 'h', text: 'Utilizadores e permissões' },
        {
          type: 'code', lang: 'sql',
          code: `-- O teu backend NUNCA deve ligar-se como superuser
CREATE ROLE app_loja WITH LOGIN PASSWORD 'secret-forte';

GRANT CONNECT ON DATABASE loja TO app_loja;
GRANT USAGE ON SCHEMA public TO app_loja;
GRANT SELECT, INSERT, UPDATE, DELETE
    ON ALL TABLES IN SCHEMA public TO app_loja;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_loja;

-- Role apenas de leitura para relatórios/BI
CREATE ROLE leitor_bi WITH LOGIN PASSWORD 'readonly';
GRANT CONNECT ON DATABASE loja TO leitor_bi;
GRANT USAGE ON SCHEMA public TO leitor_bi;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO leitor_bi;`,
        },
        { type: 'h', text: 'Backups' },
        {
          type: 'code', lang: 'bash',
          code: `# Backup lógico (portátil, lento em bases grandes)
pg_dump -Fc loja > loja-$(date +%Y%m%d).dump

# Restaurar
pg_restore -d loja_nova loja-20251118.dump

# Backup incremental & point-in-time: pg_basebackup + WAL archiving
# em produção, usa um serviço (RDS, Cloud SQL, Crunchy) ou configura WAL-G / pgBackRest`,
        },
        {
          type: 'callout', tone: 'warn', title: 'Um backup que nunca foi restaurado não é um backup',
          text: 'Pelo menos uma vez por mês, restaura o backup num ambiente de teste. Se nunca o fizeste, não sabes se funciona — e esse é o único momento em que descobrir não funciona é catastrófico.',
        },
        { type: 'h', text: 'Boas práticas que separam amadores de profissionais' },
        {
          type: 'list', items: [
            '**Usa EXPLAIN ANALYZE antes de culpar a BD.** 90% das consultas lentas são falta de índice ou junção mal-posta.',
            '**Nunca faças N+1.** "Para cada cliente, outra query" → junta tudo num JOIN. Ferramentas ORM escondem isto; vigia o log de SQL.',
            '**Guarda IDs, não valores.** Em vez de guardar `pais = "Portugal"` em cada linha, guarda `pais_id` com FK para uma tabela de países.',
            '**Migrações versionadas** (Flyway, Liquibase, Alembic, Prisma Migrate). O esquema é código.',
            '**Observabilidade:** `pg_stat_statements` + um dashboard (Grafana + prometheus-postgres-exporter) mostra as 10 consultas que te matam.',
            '**Vacuum automático** vem ligado — mas em tabelas com muita rotação pode precisar de tuning. Monitoriza `pg_stat_user_tables.n_dead_tup`.',
            '**Timeouts:** `statement_timeout = 30s` evita que uma consulta mal-feita bloqueie tudo. Põe no `postgresql.conf` ou por sessão.',
          ],
        },
        { type: 'h', text: 'Onde ir a seguir' },
        {
          type: 'list', ordered: true, items: [
            '**[Documentação do PostgreSQL](https://www.postgresql.org/docs/current/)** — a melhor documentação técnica aberta que existe. Lê sem medo: é precisa e tem exemplos.',
            '**[PostgreSQL Tutorial](https://www.postgresqltutorial.com/)** — bom para consolidar os fundamentos.',
            '**Livro:** *The Art of PostgreSQL* (Dimitri Fontaine) — SQL avançado contado por um dos maiores especialistas.',
            '**Livro:** *SQL Antipatterns* (Bill Karwin) — todos os erros que vais querer evitar.',
            '**Livro:** *Designing Data-Intensive Applications* (Martin Kleppmann) — quando chegas a replicação, sharding e sistemas distribuídos.',
            '**Prática:** [pgexercises.com](https://pgexercises.com/) e [sqlzoo.net](https://sqlzoo.net/) — consultas reais sobre esquemas reais.',
          ],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'db1',
      prompt: 'Para guardar dinheiro numa coluna, o tipo mais indicado é…',
      options: ['`real`', '`float`', '`numeric(12, 2)` ou cêntimos em `bigint`', '`text`'],
      answer: 2,
      explain: '`float` e `real` acumulam erros de arredondamento. Guarda em cêntimos como inteiro, ou usa `numeric(p, e)` — exato por definição.',
    },
    {
      id: 'db2',
      prompt: '`WHERE x = NULL` devolve…',
      options: ['Linhas onde x é NULL', 'Linhas onde x não é NULL', 'Nenhuma linha', 'Todas as linhas'],
      answer: 2,
      explain: 'Comparação com NULL devolve "unknown", que é filtrado. Usa `IS NULL` em vez de `= NULL`.',
    },
    {
      id: 'db3',
      prompt: 'A diferença entre `WHERE` e `HAVING` é…',
      options: [
        'São sinónimos',
        '`WHERE` filtra linhas antes da agregação; `HAVING` filtra grupos depois',
        '`WHERE` é para tabelas, `HAVING` para vistas',
        '`HAVING` é mais rápido',
      ],
      answer: 1,
      explain: '`WHERE` filtra as linhas que entram no GROUP BY; `HAVING` filtra os resultados agregados (ex.: `HAVING COUNT(*) > 3`).',
    },
    {
      id: 'db4',
      prompt: 'Para obter "todos os clientes e, se tiverem, as suas encomendas", o JOIN é…',
      options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'FULL JOIN'],
      answer: 1,
      explain: 'LEFT JOIN mantém as linhas da esquerda (clientes) mesmo sem correspondência à direita (sem encomendas), com NULL nos campos.',
    },
    {
      id: 'db5',
      prompt: 'Um `Seq Scan` numa tabela grande no EXPLAIN significa…',
      options: [
        'O Postgres está a usar índice',
        'A consulta é rápida',
        'Está a varrer a tabela toda — provável falta de índice',
        'Erro de sintaxe',
      ],
      answer: 2,
      explain: 'Seq Scan percorre todas as linhas sem usar índice. Em tabelas pequenas é aceitável; em grandes, sugere criar o índice certo.',
    },
    {
      id: 'db6',
      prompt: 'Qual destes **não** é uma propriedade ACID?',
      options: ['Atomicidade', 'Consistência', 'Interoperabilidade', 'Durabilidade'],
      answer: 2,
      explain: 'ACID = Atomicidade, Consistência, Isolamento, Durabilidade.',
    },
    {
      id: 'db7',
      prompt: 'Para prevenir SQL injection, a solução é…',
      options: [
        'Validar com expressões regulares',
        'Usar queries parametrizadas (placeholders)',
        'Fazer escape manual de aspas',
        'Encriptar os parâmetros',
      ],
      answer: 1,
      explain: 'Queries parametrizadas separam estrutura de dados: o driver garante que o valor nunca é interpretado como SQL. Qualquer outra abordagem é frágil.',
    },
    {
      id: 'db8',
      prompt: 'Uma chave primária deve ser…',
      options: [
        'A coluna mais importante',
        'Um valor imutável e único (ex.: BIGINT ou UUID gerado)',
        'Preferencialmente um email',
        'Opcional',
      ],
      answer: 1,
      explain: 'PKs devem ser imutáveis — emails e NIFs podem mudar e seriam um pesadelo. Prefere `BIGINT GENERATED ALWAYS AS IDENTITY` ou UUIDs.',
    },
    {
      id: 'db9',
      prompt: 'A principal razão para usar `jsonb` em vez de `json` é…',
      options: [
        'Ocupa menos espaço',
        'Guarda indentação',
        'É binário, indexável com GIN e muito mais rápido a filtrar',
        'Aceita comentários',
      ],
      answer: 2,
      explain: '`jsonb` normaliza e armazena em formato binário, permite índices GIN e operadores como `@>`, `?`, etc. Em 99% dos casos é o certo.',
    },
    {
      id: 'db10',
      prompt: 'Uma Window Function distingue-se de GROUP BY por…',
      options: [
        'Ser mais lenta',
        'Preservar cada linha individual enquanto calcula a agregação',
        'Só funcionar em PostgreSQL',
        'Apenas somar valores',
      ],
      answer: 1,
      explain: 'GROUP BY colapsa linhas por grupo; window functions (`SUM() OVER(...)`, `ROW_NUMBER() OVER(...)`) calculam por grupo **mantendo** cada linha.',
    },
    {
      id: 'db11',
      prompt: 'Uma CTE (`WITH ...`) serve para…',
      options: [
        'Acelerar sempre a consulta',
        'Organizar uma consulta em passos nomeados, legíveis de cima para baixo',
        'Substituir índices',
        'Criar uma tabela temporária em disco',
      ],
      answer: 1,
      explain: 'CTEs dão nomes a sub-resultados, tornando a consulta modular e fácil de depurar. Também suportam recursão (`WITH RECURSIVE`).',
    },
    {
      id: 'db12',
      prompt: 'Se uma transação `BEGIN` falha a meio e não chamas `COMMIT` nem `ROLLBACK`, o que acontece?',
      options: [
        'As alterações ficam parcialmente gravadas',
        'A transação é mantida aberta, bloqueando potencialmente outras; a sessão tem de ser terminada',
        'O Postgres aplica `COMMIT` automaticamente',
        'As alterações desaparecem imediatamente',
      ],
      answer: 1,
      explain: 'A transação fica em estado aborted/aberto, segurando locks até ser explicitamente fechada ou a ligação cair. É por isso que se usa `statement_timeout` e `idle_in_transaction_session_timeout`.',
    },
  ],
  exercises: [
    {
      id: 'e14-1',
      difficulty: 1,
      kind: 'open',
      title: 'Primeiras consultas',
      statement: 'Dada a tabela `clientes(id, nome, email, pais, criado_em)`: (a) todos os clientes portugueses; (b) os 5 mais recentes; (c) conta quantos clientes há por país.',
      hint: 'Começa simples: SELECT + WHERE. A seguir ORDER BY + LIMIT. Por fim GROUP BY.',
      solution: '-- (a) todos os clientes portugueses\nSELECT id, nome, email\nFROM clientes\nWHERE pais = \'PT\'\nORDER BY nome;\n\n-- (b) 5 mais recentes\nSELECT nome, email, criado_em\nFROM clientes\nORDER BY criado_em DESC\nLIMIT 5;\n\n-- (c) quantos por país\nSELECT pais, COUNT(*) AS n_clientes\nFROM clientes\nGROUP BY pais\nORDER BY n_clientes DESC;\n\nNota: em (c), `COUNT(*)` vem sempre com `GROUP BY` quando queres uma linha por grupo. Sem o `GROUP BY` obténs uma única linha com o total global.',
    },
    {
      id: 'e14-2',
      difficulty: 1,
      kind: 'open',
      title: 'Desenhar um esquema',
      statement: 'Desenha o esquema SQL para uma biblioteca com: livros (título, isbn, ano), autores (nome), empréstimos (livro, utilizador, data). Um livro pode ter vários autores, um autor vários livros. Decide bem onde ficam as chaves estrangeiras.',
      hint: 'A relação livros ↔ autores é muitos-para-muitos → precisa de uma tabela de ligação.',
      solution: '-- Tabelas principais\nCREATE TABLE autores (\n    id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    nome  TEXT NOT NULL\n);\n\nCREATE TABLE livros (\n    id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    isbn     TEXT UNIQUE NOT NULL,\n    titulo   TEXT NOT NULL,\n    ano      INTEGER CHECK (ano BETWEEN 1000 AND 2100)\n);\n\n-- Muitos-para-muitos: tabela de ligação com PK composta\nCREATE TABLE livro_autores (\n    livro_id   BIGINT NOT NULL REFERENCES livros(id) ON DELETE CASCADE,\n    autor_id   BIGINT NOT NULL REFERENCES autores(id),\n    PRIMARY KEY (livro_id, autor_id)\n);\n\nCREATE TABLE utilizadores (\n    id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    nome   TEXT NOT NULL,\n    email  TEXT UNIQUE NOT NULL\n);\n\nCREATE TABLE emprestimos (\n    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    livro_id        BIGINT NOT NULL REFERENCES livros(id),\n    utilizador_id   BIGINT NOT NULL REFERENCES utilizadores(id),\n    emprestado_em   TIMESTAMPTZ NOT NULL DEFAULT now(),\n    devolvido_em    TIMESTAMPTZ,\n    CHECK (devolvido_em IS NULL OR devolvido_em >= emprestado_em)\n);\n\nCREATE INDEX idx_emprestimos_livro ON emprestimos(livro_id);\nCREATE INDEX idx_emprestimos_abertos ON emprestimos(utilizador_id)\n    WHERE devolvido_em IS NULL;\n\nDecisões: (1) `livro_autores` com PK composta impede duplicados; (2) `ON DELETE CASCADE` em `livro_autores` apaga automaticamente as ligações quando apagas um livro; (3) `devolvido_em NULL` significa "ainda em empréstimo"; (4) índice parcial em empréstimos abertos torna a consulta "quem tem livros fora" quase instantânea.',
    },
    {
      id: 'e14-3',
      difficulty: 2,
      kind: 'open',
      title: 'Clientes com mais encomendas',
      statement: 'Com as tabelas `clientes` e `encomendas(cliente_id, total_cents, estado, criado_em)`, escreve uma consulta que devolve os 10 clientes com mais encomendas **pagas**, mostrando nome, nº de encomendas e gasto total em euros.',
      hint: 'JOIN + WHERE + GROUP BY + ORDER BY + LIMIT. Lembra-te que `COUNT(e.id)` conta encomendas, não clientes.',
      solution: 'SELECT\n    c.nome,\n    COUNT(e.id)                         AS n_encomendas,\n    ROUND(SUM(e.total_cents) / 100.0, 2) AS gasto_euros\nFROM clientes c\nJOIN encomendas e ON e.cliente_id = c.id\nWHERE e.estado = \'paga\'\nGROUP BY c.id, c.nome\nORDER BY n_encomendas DESC\nLIMIT 10;\n\nPontos a notar: (1) `JOIN` em vez de `LEFT JOIN` porque só queremos clientes que compraram; (2) `GROUP BY c.id, c.nome` — PostgreSQL permite usar só `c.id` se for PK, mas incluir `c.nome` torna o código portável; (3) `ROUND(..., 2)` só para apresentação — guarda sempre em cêntimos; (4) para uma versão que também inclua clientes **sem** encomendas pagas, trocarias para `LEFT JOIN` + `WHERE e.estado = \'paga\' OR e.id IS NULL` (com `COALESCE(COUNT(e.id), 0)`).',
    },
    {
      id: 'e14-4',
      difficulty: 2,
      kind: 'open',
      title: 'Clientes sem encomendas',
      statement: 'Lista todos os clientes que **nunca** fizeram uma encomenda. Dá duas soluções — uma com `LEFT JOIN`, outra com `NOT EXISTS` — e explica qual é preferível.',
      hint: '"Nunca comprou" = não há nenhuma linha na tabela encomendas para esse cliente.',
      solution: '-- Solução 1: LEFT JOIN + IS NULL\nSELECT c.*\nFROM clientes c\nLEFT JOIN encomendas e ON e.cliente_id = c.id\nWHERE e.id IS NULL;\n\n-- Solução 2: NOT EXISTS (mais clara na intenção)\nSELECT c.*\nFROM clientes c\nWHERE NOT EXISTS (\n    SELECT 1 FROM encomendas e\n    WHERE e.cliente_id = c.id\n);\n\n-- Solução 3: NOT IN (cuidado com NULLs!)\nSELECT c.*\nFROM clientes c\nWHERE c.id NOT IN (SELECT cliente_id FROM encomendas WHERE cliente_id IS NOT NULL);\n\n**Qual escolher:** `NOT EXISTS` é geralmente a melhor — clara, trata NULLs corretamente, e o PostgreSQL otimiza-a bem. `LEFT JOIN + IS NULL` tem desempenho equivalente mas a intenção fica menos óbvia. `NOT IN` é perigoso: se algum `cliente_id` for NULL, a consulta devolve nada (surpresa clássica).',
    },
    {
      id: 'e14-5',
      difficulty: 3,
      kind: 'open',
      title: 'Receita mensal e crescimento',
      statement: 'Dada `encomendas(criado_em, total_cents, estado)`, calcula a receita mensal dos últimos 12 meses (só encomendas pagas) e, ao lado, o crescimento percentual em relação ao mês anterior.',
      hint: 'Precisas de: (a) truncar a data ao mês; (b) agregar por mês; (c) usar `LAG()` para comparar com o anterior.',
      solution: 'WITH receita_mensal AS (\n    SELECT\n        date_trunc(\'month\', criado_em)::date AS mes,\n        SUM(total_cents) / 100.0            AS receita\n    FROM encomendas\n    WHERE estado = \'paga\'\n      AND criado_em >= date_trunc(\'month\', now() - interval \'12 months\')\n    GROUP BY 1\n)\nSELECT\n    mes,\n    receita,\n    LAG(receita) OVER (ORDER BY mes) AS receita_anterior,\n    ROUND(\n        100.0 * (receita - LAG(receita) OVER (ORDER BY mes))\n              / NULLIF(LAG(receita) OVER (ORDER BY mes), 0),\n        2\n    ) AS crescimento_pct\nFROM receita_mensal\nORDER BY mes;\n\nPontos: (1) `date_trunc(\'month\', ...)` normaliza todas as datas de um mês à sua primeira; (2) a CTE separa a agregação do cálculo de variação — mais legível que subquery aninhada; (3) `NULLIF(..., 0)` evita divisão por zero quando o mês anterior é zero; (4) a primeira linha vai ter `crescimento_pct = NULL` porque não há mês anterior, o que é correto.',
    },
    {
      id: 'e14-6',
      difficulty: 3,
      kind: 'open',
      title: 'Debugar performance',
      statement: 'A consulta `SELECT * FROM encomendas WHERE cliente_id = 42 AND criado_em >= \'2025-01-01\' ORDER BY criado_em DESC LIMIT 20` demora 3 segundos numa tabela de 10 M linhas. `EXPLAIN` mostra `Seq Scan`. Identifica a causa e propõe a correção com justificação.',
      hint: 'Que índice falta? Em que ordem devem estar as colunas? Porquê?',
      solution: '**Diagnóstico:** `Seq Scan` numa tabela de 10 M linhas = PostgreSQL está a ler e filtrar linha a linha. Há dois filtros (`cliente_id` e `criado_em`) e uma ordenação (`criado_em DESC`).\n\n**Correção:** criar um índice composto que sirva o filtro **e** a ordenação:\n\nCREATE INDEX idx_encomendas_cliente_data\n    ON encomendas(cliente_id, criado_em DESC);\n\n**Porquê esta ordem de colunas:**\n\n1. **`cliente_id` primeiro** — é o filtro de igualdade. Um índice (a, b) só é eficaz para `b` se `a` estiver fixado. A regra é: colunas de igualdade antes de intervalos ou ordenação.\n2. **`criado_em DESC` depois** — permite que o Postgres sirva o filtro `criado_em >= ...` **e** a ordenação sem passo de sort. Com `LIMIT 20`, o Postgres lê exatamente 20 entradas do índice e termina.\n\n**Plano esperado após o índice:**\n\n Index Scan Backward using idx_encomendas_cliente_data on encomendas\n   Index Cond: (cliente_id = 42 AND criado_em >= \'2025-01-01\')\n   Limit: 20\n\nTempo típico: milissegundos.\n\n**Erro comum:** criar `(criado_em, cliente_id)`. Como `criado_em` é intervalo, o índice tem de ler todas as encomendas dos últimos meses para só depois filtrar por `cliente_id`. Pior desempenho, apesar de parecer parecido.',
    },
    {
      id: 'e14-7',
      difficulty: 3,
      kind: 'open',
      title: 'Transferência bancária segura',
      statement: 'Escreve o SQL de uma transferência de 100 € da conta 1 para a conta 2. Tem de: (a) ser atómica; (b) falhar se a conta 1 ficar negativa; (c) trabalhar corretamente mesmo com transferências concorrentes sobre as mesmas contas.',
      hint: 'Transação + `FOR UPDATE` ou nível de isolamento SERIALIZABLE + uma CHECK constraint.',
      solution: '-- Opção A: locking explícito com FOR UPDATE\n\nBEGIN;\n\n-- Tranca ambas as contas, sempre na mesma ordem para evitar deadlock\nSELECT id, saldo_cents\nFROM contas\nWHERE id IN (1, 2)\nORDER BY id\nFOR UPDATE;\n\n-- Verifica saldo e atualiza\nUPDATE contas SET saldo_cents = saldo_cents - 10000 WHERE id = 1;\nUPDATE contas SET saldo_cents = saldo_cents + 10000 WHERE id = 2;\n\n-- A CHECK constraint impede saldo negativo:\n-- CREATE TABLE contas (... saldo_cents BIGINT NOT NULL CHECK (saldo_cents >= 0))\n-- Se o primeiro UPDATE puser o saldo negativo, falha e o BEGIN é abortado.\n\nCOMMIT;\n\n-- Opção B: SERIALIZABLE (sem FOR UPDATE)\n\nBEGIN ISOLATION LEVEL SERIALIZABLE;\nUPDATE contas SET saldo_cents = saldo_cents - 10000 WHERE id = 1;\nUPDATE contas SET saldo_cents = saldo_cents + 10000 WHERE id = 2;\nCOMMIT;\n-- Se dois clientes transferem ao mesmo tempo, um dos COMMITs falha com\n-- serialization_failure (SQLSTATE 40001). O código da aplicação deve\n-- fazer retry automático — a maioria das bibliotecas já faz isto.\n\n**Discussão:**\n\n1. **Ordem de locks (A)** — travar sempre pela ordem ascendente de id evita deadlocks quando duas transferências cruzadas acontecem (1→2 e 2→1).\n2. **CHECK constraint** — é a defesa final. Mesmo com bugs na aplicação, o Postgres rejeita saldos negativos. **Nunca confies apenas na aplicação para invariantes críticos.**\n3. **SERIALIZABLE** é mais elegante mas exige que a aplicação trate retries. Em serviços modernos é a escolha recomendada.\n4. **Em produção**, acrescenta uma tabela `transferencias` com o registo auditável — nunca tenhas movimentos sem rasto.',
    },
  ],
};
