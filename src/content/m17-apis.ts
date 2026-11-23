import type { Module } from '../types';

export const m17: Module = {
  id: 'apis',
  number: 17,
  title: 'APIs — REST, GraphQL e gRPC',
  subtitle: 'HTTP a sério, desenho de APIs REST, GraphQL e gRPC: quando usar cada um, como testar, como versionar, e as armadilhas que separam APIs profissionais de amadoras',
  icon: '🔌',
  minutes: 120,
  goals: [
    'Dominar HTTP: verbos, códigos de estado, cabeçalhos, cache',
    'Desenhar APIs REST com recursos, nomes e semântica corretos',
    'Escolher mecanismo de autenticação adequado (API keys, JWT, OAuth)',
    'Tratar paginação, filtragem, versionamento e erros de forma consistente',
    'Perceber quando GraphQL ou gRPC são melhores que REST',
    'Documentar com OpenAPI e usá-lo para gerar clientes automaticamente',
    'Testar APIs com testes de contrato e de integração',
    'Aplicar idempotência e *rate limiting* onde interessa',
  ],
  sections: [
    {
      id: 'porque-apis',
      title: 'Porquê APIs e três sabores modernos',
      blocks: [
        { type: 'p', text: 'Uma **API** (*Application Programming Interface*) é um contrato pelo qual um programa pede serviços a outro. Durante décadas foi uma biblioteca na mesma máquina; hoje é tipicamente uma chamada pela rede. A API é a **superfície pública** do teu serviço: alterá-la quebra toda a gente que a usa, não alterá-la condena-te a decisões antigas. Desenhá-la bem é a diferença entre um sistema que sobrevive dez anos e um que precisa de ser reescrito em dois.' },
        {
          type: 'table',
          head: ['Estilo', 'Transporte', 'Formato', 'Pontos fortes', 'Tipicamente usado para'],
          rows: [
            ['**REST**', 'HTTP/1.1 ou 2', 'JSON (geralmente)', 'Universal, cache HTTP, debuggable', 'Web público, SaaS, integrações'],
            ['**GraphQL**', 'HTTP (POST)', 'JSON', 'Cliente escolhe o que recebe; evita *over-fetching*', 'Frontends com muitos ecrãs diferentes'],
            ['**gRPC**', 'HTTP/2', 'Protobuf (binário)', 'Baixíssima latência, streaming, código gerado tipado', 'Comunicação interna entre serviços'],
          ],
        },
        {
          type: 'callout', tone: 'key', title: 'A regra prática de 2026',
          text: 'Expor para o mundo (web, mobile, parceiros)? **REST** por omissão. Vários frontends a precisar de dados diferentes do mesmo backend? Pondera **GraphQL**. Comunicação serviço-a-serviço dentro da tua infraestrutura, com latência e volume a importar? **gRPC**. Ninguém é obrigado a escolher só um — é comum ter os três no mesmo sistema.',
        },
        {
          type: 'compare',
          left: {
            title: 'Sintomas de uma boa API',
            items: [
              'Lê-se como um manual de utilizador, não um despacho interno',
              'Erros são explícitos, estruturados, úteis',
              'Versões coexistem — clientes antigos não partem',
              'Documentação é gerada a partir do código, não escrita à mão',
              'Pedidos idempotentes podem ser repetidos sem efeitos secundários',
            ],
          },
          right: {
            title: 'Sintomas de uma má API',
            items: [
              '`POST /deleteUser` para apagar (verbo e método duplicados)',
              'Status 200 com `{"error": "..."}` no corpo',
              'Nomes diferentes para o mesmo conceito (user, customer, member)',
              'Documentação desatualizada a cada release',
              'Sem paginação → downloads de 2 GB em cada chamada',
              'Sem rate limit → um cliente desvairado leva o sistema abaixo',
            ],
          },
        },
      ],
    },
    {
      id: 'http',
      title: 'HTTP — a fundação',
      blocks: [
        { type: 'p', text: 'Nenhuma API REST faz sentido sem HTTP. Vamos ao que importa: verbos (métodos), códigos de estado e cabeçalhos.' },
        { type: 'h', text: 'Verbos — o que querem fazer' },
        {
          type: 'table',
          head: ['Verbo', 'Significado', 'Seguro?', 'Idempotente?', 'Exemplo'],
          rows: [
            ['`GET`', 'Ler um recurso', 'Sim', 'Sim', '`GET /produtos/42`'],
            ['`HEAD`', 'Como GET mas só cabeçalhos', 'Sim', 'Sim', '`HEAD /ficheiros/x.pdf`'],
            ['`POST`', 'Criar (ou ação não-idempotente)', 'Não', 'Não', '`POST /encomendas`'],
            ['`PUT`', 'Substituir recurso inteiro', 'Não', 'Sim', '`PUT /produtos/42`'],
            ['`PATCH`', 'Atualizar parcialmente', 'Não', 'Não (geralmente)', '`PATCH /produtos/42`'],
            ['`DELETE`', 'Apagar', 'Não', 'Sim', '`DELETE /produtos/42`'],
            ['`OPTIONS`', 'Metadados / CORS preflight', 'Sim', 'Sim', '`OPTIONS /produtos`'],
          ],
          caption: '*Seguro* = não altera estado. *Idempotente* = chamar N vezes tem o mesmo efeito de chamar uma.',
        },
        { type: 'h', text: 'Códigos de estado — resposta a 3 dígitos' },
        {
          type: 'table',
          head: ['Família', 'Significado', 'Mais comuns'],
          rows: [
            ['**1xx**', 'Informativa', '`101 Switching Protocols` (WebSocket upgrade)'],
            ['**2xx**', 'Sucesso', '`200 OK`, `201 Created`, `202 Accepted`, `204 No Content`'],
            ['**3xx**', 'Redireção', '`301 Moved Permanently`, `304 Not Modified`'],
            ['**4xx**', 'Erro do cliente', '`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `429 Too Many Requests`'],
            ['**5xx**', 'Erro do servidor', '`500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`'],
          ],
        },
        {
          type: 'callout', tone: 'trap', title: 'Os três erros mais comuns com status codes',
          text: '**(1)** Devolver `200 OK` com `{"error": "..."}` no corpo — a camada de rede, CDN e monitorização pensam que está tudo bem. Usa 4xx/5xx. **(2)** `401 vs 403`: 401 é "não sei quem és" (não autenticado); 403 é "sei quem és mas não podes" (não autorizado). **(3)** `404` para recursos que existem mas estão vazios — devolve `200` com lista vazia; `404` é "o recurso NÃO existe".',
        },
        { type: 'h', text: 'Cabeçalhos importantes' },
        {
          type: 'code', lang: 'bash', caption: 'um pedido HTTP inteiro',
          code: `POST /encomendas HTTP/1.1
Host: api.loja.pt
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Idempotency-Key: 7f3e8a2b-4c9d-11ee-be56-0242ac120002
Accept-Language: pt-PT
User-Agent: LojaApp/2.3.1 (iOS 17.2)

{"produto_id": 42, "quantidade": 2}`,
        },
        {
          type: 'terms', items: [
            { term: 'Content-Type', def: 'Formato do corpo do pedido/resposta (`application/json`, `application/xml`, `multipart/form-data`).' },
            { term: 'Accept', def: 'O que o cliente aceita receber. Permite content negotiation.' },
            { term: 'Authorization', def: 'Credenciais: `Bearer <token>`, `Basic base64(user:pass)`, API keys.' },
            { term: 'Cache-Control, ETag', def: 'Controlo de cache. `ETag` é uma "impressão digital" do recurso; pedidos condicionais com `If-None-Match` evitam downloads desnecessários.' },
            { term: 'X-Request-ID / Traceparent', def: 'Identificador propagado pelos serviços para seguir um pedido ao longo do sistema (observabilidade).' },
            { term: 'Idempotency-Key', def: 'UUID gerado pelo cliente. O servidor garante que, se o mesmo key chegar duas vezes, só processa uma — crítico em pagamentos.' },
          ],
        },
      ],
    },
    {
      id: 'rest-design',
      title: 'Desenhar uma API REST',
      blocks: [
        { type: 'p', text: '**REST** (*Representational State Transfer*) organiza o sistema em **recursos** — substantivos — identificados por URLs. Os verbos HTTP expressam o que fazer com eles. Não é um protocolo; é um estilo arquitetónico com cinco princípios base.' },
        { type: 'h', text: 'Os cinco princípios' },
        {
          type: 'terms', items: [
            { term: 'Recursos identificados por URL', def: '`/clientes/42`, não `/getClient?id=42`. O URL é o substantivo; o verbo HTTP é a ação.' },
            { term: 'Representações', def: 'Um mesmo recurso pode ter várias representações (JSON, XML, PDF) negociadas via `Accept`.' },
            { term: 'Stateless', def: 'Cada pedido contém tudo o que o servidor precisa. Nenhum "contexto de sessão" guardado entre pedidos. Facilita *load balancing* e horizontal scaling.' },
            { term: 'Interface uniforme', def: 'Os mesmos verbos (GET/POST/PUT/DELETE) e as mesmas regras em toda a API — sem surpresas.' },
            { term: 'HATEOAS (opcional)', def: 'A resposta inclui links para próximas ações possíveis. Raramente totalmente implementado, mas inspira boas APIs.' },
          ],
        },
        { type: 'h', text: 'Desenhar URLs — substantivos no plural' },
        {
          type: 'code', lang: 'bash',
          code: `# Coleção de recursos
GET    /produtos                 — listar (com filtros, paginação)
POST   /produtos                 — criar

# Recurso individual
GET    /produtos/42              — ler
PUT    /produtos/42              — substituir inteiro
PATCH  /produtos/42              — atualizar campos
DELETE /produtos/42              — apagar

# Sub-recursos (relação pertence-a)
GET    /clientes/7/encomendas    — encomendas do cliente 7
POST   /clientes/7/encomendas    — criar encomenda para o cliente 7

# Ações que não cabem em CRUD (usa verbos sub-recurso)
POST   /encomendas/42/cancelar
POST   /encomendas/42/pagamentos`,
        },
        {
          type: 'compare',
          left: {
            title: 'URLs limpos',
            items: [
              '`/clientes` — plural, substantivo',
              '`/clientes/42/encomendas` — relação',
              '`/encomendas?estado=paga&desde=2025-01-01`',
              'kebab-case: `/formas-de-pagamento`',
              'Versão no path: `/v1/produtos`',
            ],
          },
          right: {
            title: 'URLs maus',
            items: [
              '`/getClients`, `/listUsers` — verbo + ação na URL',
              '`/client/42`, `/user_list` — mistura singular/plural',
              '`/productsByCategory/5` — hierarquia disfarçada',
              '`/get_user_v2_new_final` — adjetivos de desespero',
              'camelCase: `/formasDePagamento`',
            ],
          },
        },
        { type: 'h', text: 'Exemplo de recurso bem desenhado' },
        {
          type: 'code', lang: 'bash', caption: 'listar com filtros e paginação cursor-based',
          code: `GET /produtos?estado=activo&categoria=electronica&limit=20&cursor=eyJpZCI6MTAwfQ

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: public, max-age=60

{
  "data": [
    { "id": 101, "nome": "iPhone 15", "preco_cents": 120000, "stock": 5 },
    { "id": 102, "nome": "MacBook Air", "preco_cents": 180000, "stock": 2 }
  ],
  "page": {
    "limit": 20,
    "next_cursor": "eyJpZCI6MTIwfQ",
    "has_more": true
  }
}`,
        },
        {
          type: 'code', lang: 'bash', caption: 'criar com Location e representação',
          code: `POST /produtos HTTP/1.1
Content-Type: application/json
Idempotency-Key: 7f3e8a2b-...

{ "nome": "iPad Pro", "preco_cents": 150000 }

HTTP/1.1 201 Created
Location: /produtos/103
Content-Type: application/json

{ "id": 103, "nome": "iPad Pro", "preco_cents": 150000, "criado_em": "2026-11-19T09:12:00Z" }`,
        },
        {
          type: 'callout', tone: 'tip', title: 'Paginação: offset vs cursor',
          text: '`?page=3&size=20` (offset) é fácil mas tem três problemas: lento em páginas distantes, duplica/salta itens quando há inserções entre pedidos, e expõe o número total. **Cursor-based** (`?cursor=xyz`) é estável, rápido e o padrão em APIs profissionais (GitHub, Stripe, Twitter). Reserva offset para dashboards internos.',
        },
      ],
    },
    {
      id: 'autenticacao',
      title: 'Autenticação e autorização',
      blocks: [
        {
          type: 'table',
          head: ['Mecanismo', 'Como funciona', 'Bom para', 'Cuidados'],
          rows: [
            ['**API Key**', 'Chave fixa, enviada em header ou query', 'Integrações máquina-máquina, APIs públicas simples', 'Não expires sozinha; precisas de rotação manual'],
            ['**Basic Auth**', '`Authorization: Basic base64(user:pass)`', 'Scripts internos sobre HTTPS', 'Nunca em HTTP; credenciais atravessam em cada pedido'],
            ['**JWT (Bearer token)**', 'Token assinado com payload JSON', 'Autenticação de utilizadores em frontends/mobile', 'Difícil de revogar; curto `exp` (<1h); refresh token em segredo'],
            ['**OAuth 2.0 / OIDC**', 'Fluxo tripartido: utilizador → autorizador → tua API', 'Login via Google/GitHub, acesso a APIs de terceiros', 'Nunca inventes um fluxo próprio; usa bibliotecas'],
            ['**mTLS**', 'Autenticação por certificado cliente', 'Serviços internos de alta segurança', 'Operacionalmente pesado; vale em zero-trust'],
            ['**HMAC request signing**', 'Cliente assina o pedido com um segredo partilhado', 'Webhooks (ex.: Stripe, GitHub)', 'Protege contra replay e tampering'],
          ],
        },
        {
          type: 'code', lang: 'text', caption: 'anatomia de um JWT (três partes separadas por ponto)',
          code: `header.payload.assinatura

{  "alg": "HS256", "typ": "JWT"  } .
{  "sub": "123", "iat": 1_763_000_000,
   "exp": 1_763_003_600, "scope": "read:produtos" } .
HMACSHA256(base64(header) + "." + base64(payload), SEGREDO)`,
        },
        {
          type: 'callout', tone: 'trap', title: 'JWTs que não deves assinar',
          text: '`alg: none` é um valor válido no spec de JWT — e permite tokens sem assinatura. Há bibliotecas que aceitam e aplicações que lhes confiam. **Fixa o algoritmo no verificador** (`verifier.setAlgorithm(HS256)`). Nunca aceites `alg` do próprio token.',
        },
        { type: 'h', text: 'Autorização ≠ autenticação' },
        {
          type: 'p', text: '**Autenticação** = provar quem és. **Autorização** = o que podes fazer. Confundir é fonte de bugs de segurança. Modelos típicos:',
        },
        {
          type: 'list', items: [
            '**RBAC (Role-Based Access Control)** — utilizador tem um ou mais *roles*; cada role tem permissões. "Admin pode apagar; Editor só pode criar".',
            '**ABAC (Attribute-Based)** — regras sobre atributos ("pode ver encomenda **se** é dele ou se é admin").',
            '**Scopes** (OAuth) — subconjunto de permissões gerido pelo cliente. Ex.: `read:encomendas`, `write:produtos`.',
          ],
        },
      ],
    },
    {
      id: 'erros',
      title: 'Erros que ajudam',
      blocks: [
        { type: 'p', text: 'Um erro de API é documentação ao vivo: deve dizer **o quê**, **onde** e, se possível, **como corrigir**. O RFC 7807 (Problem Details) define um formato padronizado — adota-o.' },
        {
          type: 'code', lang: 'bash', caption: 'Problem Details (RFC 7807)',
          code: `HTTP/1.1 422 Unprocessable Entity
Content-Type: application/problem+json

{
  "type": "https://api.loja.pt/erros/validacao",
  "title": "Dados inválidos",
  "status": 422,
  "detail": "O email não é válido e a quantidade tem de ser positiva",
  "instance": "/encomendas",
  "errors": [
    { "field": "email",      "message": "formato inválido" },
    { "field": "quantidade", "message": "deve ser > 0" }
  ],
  "request_id": "req_7f3e8a2b"
}`,
        },
        {
          type: 'compare',
          left: {
            title: 'Bom erro',
            items: [
              '**Status code** 4xx/5xx consistente com a categoria',
              '**Mensagem acionável** — diz o que corrigir',
              '**Stable error codes** (slugs que não mudam) — `email_invalid`, `insufficient_stock`',
              '**Request ID** para quem vai ver logs',
              'Apontador para documentação',
            ],
          },
          right: {
            title: 'Mau erro',
            items: [
              '`200 OK` com `{"ok": false, "error": "..."}`',
              '`"erro interno"` sem pista',
              'Stack trace exposto em produção',
              '`500` para entradas inválidas (devia ser `422`)',
              'Mensagens que variam a cada deploy ("não foi possível..." vs "falha ao...")',
            ],
          },
        },
        {
          type: 'callout', tone: 'key', title: 'Error codes são contrato',
          text: 'Mensagens mudam, traduzem-se, evoluem. **Códigos de erro** (slugs tipo `email_invalid`) são o que o cliente consome programaticamente. Documenta-os, não os mudes sem versão nova.',
        },
      ],
    },
    {
      id: 'versionamento-idempotencia',
      title: 'Versionamento, idempotência e rate limiting',
      blocks: [
        { type: 'h', text: 'Versionamento — não quebrar quem já usa' },
        {
          type: 'table',
          head: ['Estratégia', 'Exemplo', 'Prós', 'Contras'],
          rows: [
            ['**URL path**', '`/v1/produtos` → `/v2/produtos`', 'Simples, visível, debuggable', 'Duplicação se tens v1 e v2 em paralelo'],
            ['**Header**', '`API-Version: 2026-11-19`', 'URLs limpos, fácil para rolling updates', 'Invisível no browser, mais difícil de testar'],
            ['**Query param**', '`?version=2`', 'Fácil de experimentar', 'Confunde com filtros'],
            ['**Media type**', '`Accept: application/vnd.api.v2+json`', 'Puro HTTP', 'Verboso, pouco usado hoje'],
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'Alterações *breaking* vs *non-breaking*',
          text: 'Acrescentar campo à resposta → **non-breaking** (cliente ignora o que não conhece). Remover ou renomear campo → **breaking**, exige nova versão. Mudar semântica de um campo → **breaking**. Sê conservador no que remover; agressivo no que acrescentar.',
        },
        { type: 'h', text: 'Idempotência — pagamentos sem cobrar duas vezes' },
        { type: 'p', text: '`POST` não é idempotente por natureza: dois pedidos iguais criam duas encomendas. Se a resposta se perde, o cliente retenta... e cobra duas vezes. Solução: o cliente envia um `Idempotency-Key` único; o servidor regista o resultado para essa chave e serve o cache nas retentativas.' },
        {
          type: 'code', lang: 'text', caption: 'fluxo',
          code: `Cliente                                 Servidor
  │                                           │
  │  POST /pagamentos                         │
  │  Idempotency-Key: 7f3e8a2b                │
  │  { "valor": 10000, "conta": 42 }          │
  ├──────────────────────────────────────────▶│
  │                                           │  cria pagamento,
  │                                           │  guarda resultado com key
  │  201 Created                              │
  │◀──────────────────────────────────────────┤
  │  (timeout do cliente; reenvia o mesmo)    │
  │                                           │
  │  POST /pagamentos                         │
  │  Idempotency-Key: 7f3e8a2b                │
  │  { "valor": 10000, "conta": 42 }          │
  ├──────────────────────────────────────────▶│
  │                                           │  encontra key,
  │                                           │  devolve resposta cacheada
  │  201 Created (mesmo corpo de antes)       │
  │◀──────────────────────────────────────────┤`,
        },
        { type: 'h', text: 'Rate limiting — proteger a API' },
        {
          type: 'code', lang: 'bash', caption: 'cabeçalhos de rate limit',
          code: `GET /produtos HTTP/1.1

HTTP/1.1 200 OK
X-RateLimit-Limit:     1000
X-RateLimit-Remaining: 843
X-RateLimit-Reset:     1763003600

# Quando excedes:
HTTP/1.1 429 Too Many Requests
Retry-After: 30
Content-Type: application/problem+json

{ "type": ".../rate-limit", "title": "Demasiados pedidos", "status": 429 }`,
        },
        {
          type: 'terms', items: [
            { term: 'Token bucket', def: 'O cliente tem um balde de N tokens que se repõe a X por segundo. Cada pedido consome 1. Permite picos curtos acima da taxa média.' },
            { term: 'Leaky bucket', def: 'Pedidos entram num balde que escoa a taxa constante. Suaviza picos.' },
            { term: 'Fixed window', def: 'Conta pedidos em janelas fixas (ex.: 100/min). Simples, mas tem "efeito fronteira" — 100 pedidos no fim do minuto X + 100 no início do minuto X+1 = 200 em segundos.' },
            { term: 'Sliding window', def: 'Janela deslizante. Mais justo, mais complexo de implementar. É o padrão em ferramentas modernas.' },
          ],
        },
      ],
    },
    {
      id: 'graphql',
      title: 'GraphQL — o cliente pede exatamente o que quer',
      blocks: [
        { type: 'p', text: '**GraphQL** é uma linguagem de consulta sobre um schema tipado. O cliente envia uma *query* a dizer **que campos** quer; o servidor devolve só isso. Resolve o problema de *over-fetching* e *under-fetching* comum em REST (ou fazes vários pedidos ou recebes dados a mais).' },
        {
          type: 'code', lang: 'text', caption: 'schema',
          code: `type Produto {
  id: ID!
  nome: String!
  preco_cents: Int!
  stock: Int!
  categoria: Categoria!
}

type Categoria {
  id: ID!
  nome: String!
  produtos: [Produto!]!
}

type Query {
  produto(id: ID!): Produto
  produtos(categoria: ID, limit: Int = 20, cursor: String): ProdutoPage!
}

type Mutation {
  criarProduto(input: CriarProdutoInput!): Produto!
}

input CriarProdutoInput {
  nome: String!
  preco_cents: Int!
  categoria_id: ID!
}`,
        },
        {
          type: 'code', lang: 'text', caption: 'query — pede só o que precisas',
          code: `query ProdutoEcrã($id: ID!) {
  produto(id: $id) {
    nome
    preco_cents
    categoria {
      nome
    }
  }
}

# Resposta
{
  "data": {
    "produto": {
      "nome": "iPhone 15",
      "preco_cents": 120000,
      "categoria": { "nome": "Electrónica" }
    }
  }
}`,
        },
        {
          type: 'compare',
          left: {
            title: 'GraphQL brilha quando…',
            items: [
              'O frontend tem muitos ecrãs com diferentes slices de dados',
              'Acumulas chamadas REST por ecrã (3-10 pedidos → 1 query)',
              'Backend-for-Frontend (BFF) precisa de combinar várias APIs',
              'O schema evolui: acrescentas campos sem versões novas',
            ],
          },
          right: {
            title: 'GraphQL complica quando…',
            items: [
              'Dados são simples e CRUD — REST é 10× menos cerimónia',
              'Precisas de cache HTTP (só POST /graphql, sem cache por URL)',
              'Rate limiting por endpoint deixa de funcionar (todas as queries são POST /graphql)',
              'Problema N+1: a query `produtos { categoria { nome } }` pode gerar 1000 selects — precisa de *DataLoader*',
            ],
          },
        },
        {
          type: 'callout', tone: 'trap', title: 'O problema das queries pesadas',
          text: 'GraphQL expõe ao cliente a capacidade de pedir qualquer combinação — incluindo queries profundas (`cliente { encomendas { linhas { produto { categoria { produtos { ... } } } } } }`). Em produção, usa **query depth limiting**, **complexity scoring** (cada campo tem custo), e **persisted queries** (só queries pré-aprovadas são aceites).',
        },
      ],
    },
    {
      id: 'grpc',
      title: 'gRPC — comunicação de serviços em escala',
      blocks: [
        { type: 'p', text: '**gRPC** é um RPC binário sobre HTTP/2, com Protocol Buffers (*protobuf*) a definir o contrato. Gera código tipado em quase todas as linguagens. É a ferramenta por omissão para comunicação interna em Google, Netflix, Dropbox, Spotify.' },
        {
          type: 'code', lang: 'text', caption: 'produtos.proto — contrato',
          code: `syntax = "proto3";

package loja.produtos.v1;

service Produtos {
  rpc GetProduto(GetProdutoRequest) returns (Produto);
  rpc ListProdutos(ListProdutosRequest) returns (ListProdutosResponse);
  rpc CriarProduto(CriarProdutoRequest) returns (Produto);

  // Streaming: servidor envia uma sequência de produtos
  rpc Subscribe(SubscribeRequest) returns (stream ProdutoEvento);

  // Bidirecional: ambos os lados streamam
  rpc Sync(stream SyncMessage) returns (stream SyncMessage);
}

message Produto {
  int64  id          = 1;
  string nome        = 2;
  int64  preco_cents = 3;
  int32  stock       = 4;
}

message GetProdutoRequest { int64 id = 1; }
message ListProdutosRequest { int32 limit = 1; string cursor = 2; }
message ListProdutosResponse {
  repeated Produto data = 1;
  string next_cursor = 2;
}`,
        },
        {
          type: 'code', lang: 'bash', caption: 'gerar código tipado',
          code: `# Java (com gRPC-Java)
protoc --java_out=. --grpc-java_out=. produtos.proto

# Go
protoc --go_out=. --go-grpc_out=. produtos.proto

# TypeScript (com buf)
buf generate

# Resultado: classes/structs/interfaces para ambos os lados,
# cliente e servidor falam a mesma linguagem tipada.`,
        },
        {
          type: 'table',
          head: ['', 'REST', 'GraphQL', 'gRPC'],
          rows: [
            ['Transporte', 'HTTP/1.1 ou 2', 'HTTP (POST)', 'HTTP/2 (obrigatório)'],
            ['Formato', 'JSON', 'JSON', 'Protobuf (binário)'],
            ['Schema', 'Opcional (OpenAPI)', 'Obrigatório (SDL)', 'Obrigatório (.proto)'],
            ['Streaming', 'SSE / WebSocket (parche)', 'Subscriptions', 'Nativo, bidirecional'],
            ['Latência', 'Boa', 'Boa', 'Excelente (binário + HTTP/2)'],
            ['Debuggable no browser', 'Sim (curl, DevTools)', 'Sim', 'Não diretamente (gRPC-Web ou grpcurl)'],
            ['Cache HTTP', 'Sim', 'Limitado', 'Não'],
            ['Geração de código', 'Via OpenAPI', 'Via codegen', 'Nativo'],
          ],
        },
        {
          type: 'callout', tone: 'key', title: 'A arquitetura típica em 2026',
          text: '**Frontend → REST ou GraphQL** → **BFF / Gateway** → **gRPC entre serviços internos** → Base de dados. REST/GraphQL para quem está fora; gRPC entre os teus. gRPC-Web existe, mas raramente é a escolha certa para browser.',
        },
      ],
    },
    {
      id: 'openapi',
      title: 'OpenAPI — documentação como código',
      blocks: [
        { type: 'p', text: 'OpenAPI (ex-Swagger) é um formato (JSON ou YAML) que descreve a tua API REST. A partir dele geras: documentação interativa, clientes em qualquer linguagem, testes de contrato, mocks. É o Protobuf do REST.' },
        {
          type: 'code', lang: 'bash', caption: 'openapi.yaml — pedaço típico',
          code: `openapi: 3.1.0
info:
  title: Loja API
  version: 1.0.0

paths:
  /produtos/{id}:
    get:
      summary: Obter um produto
      operationId: getProduto
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: integer, format: int64 }
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Produto" }
        "404":
          description: Produto não existe
          content:
            application/problem+json:
              schema: { $ref: "#/components/schemas/Problem" }

components:
  schemas:
    Produto:
      type: object
      required: [id, nome, preco_cents]
      properties:
        id:          { type: integer, format: int64 }
        nome:        { type: string, minLength: 1, maxLength: 200 }
        preco_cents: { type: integer, minimum: 1 }
    Problem:
      type: object
      properties:
        type:   { type: string, format: uri }
        title:  { type: string }
        status: { type: integer }
        detail: { type: string }`,
        },
        {
          type: 'list', items: [
            '**[Swagger UI](https://swagger.io/tools/swagger-ui/)** — documentação interativa a partir do YAML. "Try it out" funciona.',
            '**[Redoc](https://github.com/Redocly/redoc)** — alternativa mais limpa visualmente.',
            '**[openapi-generator](https://openapi-generator.tech/)** — gera clientes tipados em 50+ linguagens.',
            '**[Prism](https://stoplight.io/open-source/prism)** — mock server a partir do YAML; útil para o frontend começar sem backend.',
            '**[Schemathesis](https://schemathesis.readthedocs.io/)** — testes de propriedade que geram pedidos aleatórios a partir do schema.',
          ],
        },
        {
          type: 'callout', tone: 'tip', title: 'Code-first ou schema-first?',
          text: '**Schema-first** (escreves o YAML, geras servidor + clientes): o contrato é a verdade. **Code-first** (anotações em código, geras o YAML): mais fácil no início. Em Spring, Quarkus e FastAPI, o code-first é confortável. Para APIs públicas com múltiplas linguagens de cliente, schema-first é mais seguro.',
        },
      ],
    },
    {
      id: 'testes',
      title: 'Testar APIs',
      blocks: [
        {
          type: 'table',
          head: ['Nível', 'O que valida', 'Ferramentas'],
          rows: [
            ['**Unitário**', 'Handlers isolados, controladores sem rede/BD', 'JUnit + MockMvc, pytest, Jest'],
            ['**Integração**', 'Stack real: HTTP + BD + autenticação', 'Testcontainers, docker compose + supertest'],
            ['**Contrato**', 'A API respeita o schema OpenAPI/Protobuf', 'Schemathesis, Pact, Dredd'],
            ['**Carga**', 'Latência e throughput sob carga', 'k6, JMeter, Locust'],
            ['**Smoke / E2E**', 'Fluxo completo em produção depois do deploy', 'Postman/Newman, Playwright'],
          ],
        },
        {
          type: 'code', lang: 'bash', caption: 'teste rápido manual: curl + jq',
          code: `# Criar
curl -X POST https://api.loja.pt/produtos \\
    -H "Content-Type: application/json" \\
    -H "Authorization: Bearer $TOKEN" \\
    -H "Idempotency-Key: $(uuidgen)" \\
    -d '{ "nome": "iPad", "preco_cents": 150000 }' | jq

# Listar (com filtros)
curl "https://api.loja.pt/produtos?categoria=electronica&limit=5" \\
    -H "Authorization: Bearer $TOKEN" | jq '.data[] | {id, nome}'

# Teste de carga (k6)
k6 run --vus 100 --duration 1m script.js`,
        },
        {
          type: 'code', lang: 'java', caption: 'teste de integração em Java com RestAssured',
          code: `@Test
void criarProduto_devolve201_comLocationHeader() {
    given()
        .contentType(ContentType.JSON)
        .header("Idempotency-Key", UUID.randomUUID().toString())
        .body(new CriarProdutoDTO("iPad Pro", 150_000, 42L))
    .when()
        .post("/produtos")
    .then()
        .statusCode(201)
        .header("Location", matchesPattern("/produtos/\\\\d+"))
        .body("nome", equalTo("iPad Pro"))
        .body("preco_cents", equalTo(150_000));
}`,
        },
      ],
    },
    {
      id: 'boas-praticas',
      title: 'Boas práticas e armadilhas',
      blocks: [
        {
          type: 'compare',
          left: {
            title: 'Faz',
            items: [
              'Documenta com OpenAPI/Protobuf gerado — nunca à mão',
              'Códigos de estado HTTP semânticos; `200` só em sucesso',
              'Problem Details para erros (RFC 7807)',
              'Paginação com cursor desde o dia 1',
              'Idempotency-Key em operações de criação/pagamento',
              'Rate limit com cabeçalhos informativos',
              'Logs com `request_id`/`traceparent` em todos os pedidos',
              'Versiona antes de precisares — `/v1/`',
              'CORS explícito e restritivo, nunca `*` em produção com credenciais',
            ],
          },
          right: {
            title: 'Evita',
            items: [
              '`200 OK` com `{"error": "..."}`',
              'Verbos na URL (`/getUsers`, `/createOrder`)',
              'Devolver stack traces em produção',
              'Senhas ou tokens nos logs',
              'Mudar formato de resposta sem versão nova',
              'Esquemas sem campos obrigatórios marcados',
              'APIs chattyness: 15 chamadas para carregar um ecrã',
              'JSON com datas em formatos locais — usa ISO 8601 UTC',
              'Chaves API no URL (aparecem em logs de todos os proxies)',
            ],
          },
        },
        {
          type: 'callout', tone: 'key', title: 'A regra do "quem vai ler isto às 3 da manhã"',
          text: 'Alguém vai ler o teu erro 500 em plena madrugada durante um incidente. A mensagem deve dizer o que correu mal, onde (request_id), e qual o próximo passo. O teu "eu futuro, bêbado e stressado" vai agradecer.',
        },
        { type: 'h', text: 'Para onde ir a seguir' },
        {
          type: 'list', ordered: true, items: [
            '**[REST API Design Rulebook](https://www.oreilly.com/library/view/rest-api-design/9781449317904/)** — Mark Massé — curto, denso, excelente.',
            '**[API Design Patterns](https://www.manning.com/books/api-design-patterns)** — JJ Geewax — padrões para tudo (long-running, filtering, soft-delete).',
            '**[Zalando API Guidelines](https://opensource.zalando.com/restful-api-guidelines/)** — referência pública, pragmática.',
            '**[Google API Design Guide](https://cloud.google.com/apis/design)** — as suas convenções, muito consistentes.',
            '**[GraphQL Learn](https://graphql.org/learn/)** — tutorial oficial.',
            '**[gRPC Docs](https://grpc.io/docs/)** — em todas as linguagens.',
            '**[OpenAPI Initiative](https://www.openapis.org/)** — spec, ferramentas, exemplos.',
          ],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'ap1',
      prompt: 'Para apagar um recurso em REST, usas…',
      options: ['`POST /deleteUser`', '`DELETE /utilizadores/42`', '`GET /remove?id=42`', '`PATCH /utilizadores/42?delete=true`'],
      answer: 1,
      explain: 'O verbo é DELETE; o URL identifica o recurso. Verbos na URL são sinal de API não-REST.',
    },
    {
      id: 'ap2',
      prompt: 'Qual destes cenários devolve `403 Forbidden` e não `401 Unauthorized`?',
      options: [
        'Sem cabeçalho Authorization',
        'Token expirado',
        'Utilizador autenticado tenta apagar algo que não é seu',
        'Token com assinatura inválida',
      ],
      answer: 2,
      explain: '401 = "não sei quem és" (autenticação falhou). 403 = "sei quem és mas não tens permissão" (autorização falhou).',
    },
    {
      id: 'ap3',
      prompt: '`PUT` e `PATCH` distinguem-se por…',
      options: [
        'PUT é mais rápido',
        'PUT substitui o recurso inteiro; PATCH atualiza parcialmente',
        'PATCH é idempotente, PUT não é',
        'São sinónimos',
      ],
      answer: 1,
      explain: 'PUT exige o recurso completo (campos omitidos passam a NULL). PATCH envia só os campos a mudar. Ambos devem ser idempotentes idealmente.',
    },
    {
      id: 'ap4',
      prompt: 'O Idempotency-Key serve para…',
      options: [
        'Autenticar o pedido',
        'Garantir que retentativas do mesmo pedido não causam efeitos duplicados',
        'Encriptar o corpo',
        'Acelerar o servidor',
      ],
      answer: 1,
      explain: 'O cliente gera um UUID único; o servidor regista a resposta para essa chave e serve-a de volta nas retentativas. Essencial em pagamentos.',
    },
    {
      id: 'ap5',
      prompt: 'Em GraphQL, o problema N+1 refere-se a…',
      options: [
        'Pedidos consecutivos ao mesmo endpoint',
        'Uma query que resolve campos aninhados fazendo 1 + N consultas à BD',
        'Latência excessiva no transporte',
        'Erros de validação do schema',
      ],
      answer: 1,
      explain: 'Ex.: `produtos { categoria { nome } }` com 100 produtos pode gerar 1 select + 100 selects (um por categoria). Solução: DataLoader (batch + cache por pedido).',
    },
    {
      id: 'ap6',
      prompt: 'gRPC exige obrigatoriamente…',
      options: [
        'JSON como formato',
        'HTTP/2 como transporte',
        'TLS sempre',
        'Clientes em Java',
      ],
      answer: 1,
      explain: 'gRPC assenta em HTTP/2 (multiplexing, streaming nativo). O formato por omissão é Protobuf binário.',
    },
    {
      id: 'ap7',
      prompt: 'Qual destas respostas HTTP indica que o cliente foi bloqueado por exceder o rate limit?',
      options: ['`403 Forbidden`', '`429 Too Many Requests`', '`503 Service Unavailable`', '`401 Unauthorized`'],
      answer: 1,
      explain: '429 é o código dedicado. Costuma vir com `Retry-After` a dizer quando pode tentar outra vez.',
    },
    {
      id: 'ap8',
      prompt: 'Em REST, criar recursos retorna tipicamente…',
      options: [
        '`200 OK`',
        '`201 Created` com cabeçalho `Location` para o novo recurso',
        '`202 Accepted` sempre',
        '`204 No Content`',
      ],
      answer: 1,
      explain: '201 indica criação; Location aponta para o recurso novo. 202 é para operações assíncronas que começaram mas não terminaram.',
    },
    {
      id: 'ap9',
      prompt: 'Qual é a razão principal para não devolver stack traces em produção?',
      options: [
        'Ocupa muito espaço no corpo',
        'Expõe detalhes internos (caminhos, versões, estrutura) que ajudam atacantes',
        'Aumenta a latência',
        'Não funciona em HTTPS',
      ],
      answer: 1,
      explain: 'Stack traces podem revelar framework, bibliotecas vulneráveis, estrutura de pastas, nomes de BD. Em produção: mensagem genérica + request_id para correlacionar com logs internos.',
    },
    {
      id: 'ap10',
      prompt: 'Qual destes é um caso onde GraphQL é tipicamente melhor que REST?',
      options: [
        'Upload de ficheiros grandes',
        'Um ecrã móvel que precisa de dados de 5 recursos diferentes no mesmo load',
        'Webhooks de terceiros',
        'Uma API pública consumida por scripts simples',
      ],
      answer: 1,
      explain: 'GraphQL combina múltiplos recursos numa query — evita 5 chamadas REST por ecrã. Para o resto dos casos, REST mantém-se mais simples.',
    },
    {
      id: 'ap11',
      prompt: 'O OpenAPI serve para…',
      options: [
        'Autenticar APIs',
        'Descrever o contrato de uma API REST, permitindo gerar docs, clientes e mocks',
        'Substituir o HTTP',
        'Comprimir respostas',
      ],
      answer: 1,
      explain: 'OpenAPI (ex-Swagger) é um YAML/JSON que descreve endpoints, parâmetros e schemas. A partir dele, ferramentas geram tudo o resto.',
    },
    {
      id: 'ap12',
      prompt: 'A diferença entre paginação offset e cursor é…',
      options: [
        'Offset é sempre mais rápido',
        'Cursor é estável face a inserções e escala melhor em páginas distantes; offset é mais fácil mas tem "drift" e lentidão',
        'Só cursor funciona em SQL',
        'Offset usa cache HTTP, cursor não',
      ],
      answer: 1,
      explain: 'Offset `LIMIT 20 OFFSET 10000` força a BD a saltar 10 000 linhas. Cursor (`WHERE id > ultimo_visto`) usa índice. Além disso, inserções entre pedidos saltam ou duplicam itens em paginação offset.',
    },
  ],
  exercises: [
    {
      id: 'e17-1',
      difficulty: 1,
      kind: 'open',
      title: 'Desenhar os endpoints',
      statement: 'Desenha os endpoints REST (verbo + URL + código de resposta esperado) para uma "biblioteca": listar livros, obter um livro, criar, atualizar, apagar, pesquisar por autor, e emprestar/devolver.',
      hint: 'Verbo na linha de HTTP, URL com substantivo no plural. Ações como "emprestar" ficam em sub-recursos.',
      solution: '# Livros — CRUD\nGET    /livros                         200 OK   (lista paginada)\nGET    /livros/{id}                    200 OK  |  404 Not Found\nPOST   /livros                         201 Created + Location\nPUT    /livros/{id}                    200 OK  |  404\nPATCH  /livros/{id}                    200 OK  |  404\nDELETE /livros/{id}                    204 No Content  |  404\n\n# Pesquisa — parâmetros de query\nGET    /livros?autor_id=7              200 OK\nGET    /livros?q=camoes&limit=20&cursor=... 200 OK\n\n# Empréstimos — recurso separado (tem o seu ciclo de vida)\nGET    /emprestimos                    200 OK\nPOST   /emprestimos                    201 Created\n  { "livro_id": 42, "utilizador_id": 7 }\n\n# Devolver — ação sub-recurso\nPOST   /emprestimos/{id}/devolver      200 OK\n  (ou PATCH /emprestimos/{id} com { "devolvido_em": "..." })\n\nNotas: (1) `emprestar` é a criação de uma linha em `/emprestimos` — por isso é POST, não uma ação em `/livros`. (2) `devolver` não é CRUD trivial — podes modelar como `POST /emprestimos/{id}/devolver` ou como `PATCH` que preenche `devolvido_em`. Ambos são aceitáveis; o primeiro é mais explícito.',
    },
    {
      id: 'e17-2',
      difficulty: 1,
      kind: 'open',
      title: 'Códigos de estado corretos',
      statement: 'Para cada cenário, diz qual deve ser o código de estado HTTP e porquê: (a) criar um produto; (b) obter um produto com `id` que não existe; (c) enviar JSON malformado; (d) enviar JSON válido mas com `preco_cents` negativo; (e) tentar apagar algo sem estar autenticado; (f) autenticado mas sem permissão; (g) a BD está em baixo; (h) excedeste o rate limit.',
      hint: 'Pensa nas famílias 4xx (erro do cliente) e 5xx (erro do servidor). Distingue 400 (JSON inválido) de 422 (JSON válido mas regra de negócio).',
      solution: '**(a) Criar produto:** `201 Created` + `Location: /produtos/42`. Corpo pode trazer o recurso criado. (`200` também aceitável, mas `201` é mais semântico.)\n\n**(b) Produto inexistente:** `404 Not Found`. Problema do cliente: pediu um ID que não existe.\n\n**(c) JSON malformado:** `400 Bad Request`. O servidor nem conseguiu interpretar o pedido.\n\n**(d) `preco_cents` negativo:** `422 Unprocessable Entity`. O JSON é sintaticamente válido, mas viola regras semânticas/validação. (Algumas APIs usam `400` para ambos — aceita-se, mas `422` é mais preciso.)\n\n**(e) Apagar sem autenticar:** `401 Unauthorized`. "Não sei quem és." O cabeçalho `WWW-Authenticate` indica como autenticar.\n\n**(f) Autenticado sem permissão:** `403 Forbidden`. "Sei quem és, mas não podes."\n\n**(g) BD em baixo:** `503 Service Unavailable` com `Retry-After`. É um problema do servidor, temporário. (Não uses `500` se sabes que é temporário.)\n\n**(h) Rate limit excedido:** `429 Too Many Requests` + `Retry-After`. Também é o padrão para quota diária esgotada.\n\n**Resumo mental:**\n- 2xx: tudo bem.\n- 3xx: vai a outro sítio.\n- 4xx: tu (cliente) fizeste algo errado.\n- 5xx: eu (servidor) estou com problemas.',
    },
    {
      id: 'e17-3',
      difficulty: 2,
      kind: 'open',
      title: 'Problem Details',
      statement: 'Escreve a resposta HTTP completa (cabeçalhos + corpo) para um pedido `POST /encomendas` com `{ "produto_id": 42, "quantidade": -1, "email": "naoevalido" }`. Deve: usar status apropriado, Problem Details (RFC 7807), identificar os campos inválidos com códigos de erro estáveis, incluir um `request_id`.',
      hint: '`422 Unprocessable Entity`, `Content-Type: application/problem+json`. Array de erros com `field`, `code`, `message`.',
      solution: 'HTTP/1.1 422 Unprocessable Entity\nContent-Type: application/problem+json\nX-Request-ID: req_7f3e8a2b-4c9d-11ee-be56\n\n{\n  "type": "https://api.loja.pt/erros/validacao",\n  "title": "Dados inválidos",\n  "status": 422,\n  "detail": "A quantidade tem de ser positiva e o email não é válido.",\n  "instance": "/encomendas",\n  "request_id": "req_7f3e8a2b-4c9d-11ee-be56",\n  "errors": [\n    {\n      "field": "quantidade",\n      "code": "min_value",\n      "message": "deve ser > 0",\n      "received": -1\n    },\n    {\n      "field": "email",\n      "code": "email_format",\n      "message": "não é um endereço de email válido",\n      "received": "naoevalido"\n    }\n  ]\n}\n\n**Decisões:**\n\n1. **`422` e não `400`** — o JSON parse foi OK; falha é semântica. Uns usam `400` para tudo; `422` é mais preciso quando separados.\n2. **`application/problem+json`** — content type dedicado (RFC 7807). Clientes podem detetá-lo e renderizar de forma especial.\n3. **`type` como URI** — aponta para documentação estável do erro. Pode ser um doc humano ou uma URL de API.\n4. **`code` por campo** — slugs estáveis (`min_value`, `email_format`). Os clientes podem traduzir ou comparar. **Nunca** confies na string da mensagem — ela muda.\n5. **`received`** opcional mas útil — ajuda o programador a ver o que o seu código enviou.\n6. **`request_id`** — correlacional com logs do servidor. Em produção, é o que permite a alguém de suporte encontrar o pedido nos logs.\n7. **Nunca** inclui stack trace ou mensagens de exceções internas em produção.',
    },
    {
      id: 'e17-4',
      difficulty: 2,
      kind: 'open',
      title: 'REST vs GraphQL vs gRPC',
      statement: 'Para cada contexto, recomenda REST, GraphQL ou gRPC — e justifica: (a) API pública consumida por centenas de empresas; (b) app móvel com 20 ecrãs, cada um com dados diferentes; (c) 50 microserviços internos comunicarem entre si; (d) um endpoint que envia atualizações em tempo real (feed de preços); (e) webhooks que terceiros chamam para te avisar de eventos.',
      hint: 'Pensa em: audiência (externa vs interna), número de clientes/ecrãs, latência, necessidade de streaming, cache HTTP.',
      solution: '**(a) API pública, centenas de empresas → REST + OpenAPI**\n- Universal: qualquer linguagem fala curl, Postman, browser DevTools.\n- Cache HTTP e CDN "funcionam de graça" em GETs.\n- OpenAPI permite a cada cliente gerar código automaticamente na sua linguagem.\n- GraphQL seria sobrecarga; gRPC exclui clientes de browser e muitas equipas.\n\n**(b) App móvel com 20 ecrãs diferentes → GraphQL**\n- Cada ecrã pede exatamente o que precisa. Reduz 5 chamadas REST por ecrã a 1 query.\n- Bateria e dados móveis (menos pedidos, payloads menores) são métricas que importam.\n- Schema tipado + ferramentas (Apollo, Relay) apanham erros em build.\n- Cuidado: usa persisted queries + depth limiting em produção.\n\n**(c) 50 microserviços internos → gRPC**\n- Latência mínima (binário, HTTP/2).\n- Contratos tipados em `.proto` — quebras de contrato apanhadas em build.\n- Streaming nativo para pub/sub entre serviços.\n- Geração de código elimina boilerplate em cada serviço.\n- Observabilidade uniforme (OpenTelemetry integrado em todas as bibliotecas gRPC).\n\n**(d) Feed de preços em tempo real → gRPC server streaming OU WebSocket/SSE sobre REST**\n- gRPC server streaming é a solução nativa, com backpressure e tipos.\n- Se os clientes são browsers, usa Server-Sent Events (SSE) ou WebSocket — gRPC-Web é possível mas raramente simples.\n- REST pode polling, mas é desperdício: latência, custo, estrangulamento.\n\n**(e) Webhooks de terceiros → REST (quase sempre)**\n- Terceiros esperam HTTP POST com JSON — é o padrão de facto.\n- Documenta o payload, assina o pedido com HMAC (`X-Signature`), e assegura idempotência (os webhooks são retentados).\n- gRPC/GraphQL exigiriam dependências específicas no lado deles — raramente aceitável.\n\n**Conclusão:** quase sempre a resposta é "depende de quem está do outro lado e de que infraestrutura partilhas". Não há vencedor absoluto. Na mesma empresa é normal ter REST para fora, GraphQL para apps, gRPC para dentro.',
    },
    {
      id: 'e17-5',
      difficulty: 3,
      kind: 'open',
      title: 'Idempotência em pagamentos',
      statement: 'Desenha o fluxo completo de `POST /pagamentos` idempotente, incluindo: (a) cabeçalho esperado do cliente; (b) tabela que o servidor usa para registar; (c) comportamento em: primeiro pedido, retentativa igual, retentativa com corpo diferente, chave em uso há 10 minutos a aguardar primeira resposta. Diz também o que acontece se o cliente esquece de enviar a chave.',
      hint: 'Tabela com (idempotency_key, request_hash, response_status, response_body, created_at). Pesquisa por key antes de processar. Compara hash do corpo.',
      solution: '**(a) Cabeçalho do cliente**\n\n`Idempotency-Key: 7f3e8a2b-4c9d-11ee-be56-0242ac120002` (UUID gerado pelo cliente; vive um período acordado — ex.: 24 h).\n\n**(b) Tabela no servidor**\n\n```\nCREATE TABLE idempotency_keys (\n    key              TEXT PRIMARY KEY,\n    request_hash     TEXT NOT NULL,          -- SHA-256 do (path + body)\n    response_status  INTEGER,\n    response_body    JSONB,\n    state            TEXT NOT NULL,          -- "in_progress" | "completed"\n    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),\n    expires_at       TIMESTAMPTZ NOT NULL DEFAULT (now() + interval \'24 hours\')\n);\nCREATE INDEX idx_idem_expires ON idempotency_keys(expires_at);\n```\n\n**(c) Comportamento**\n\n**Primeiro pedido (chave desconhecida):**\n1. `INSERT INTO idempotency_keys (key, request_hash, state) VALUES (..., \'in_progress\') ON CONFLICT DO NOTHING RETURNING *`.\n2. Se o INSERT devolveu linha, processo normal: cobra o cartão, cria pagamento.\n3. `UPDATE idempotency_keys SET state=\'completed\', response_status=201, response_body=... WHERE key=...`.\n4. Devolve 201 com corpo.\n\n**Retentativa igual (mesma key, mesmo body):**\n1. INSERT com ON CONFLICT não devolve → key já existe.\n2. Verifica `request_hash`: igual → devolve `response_status` e `response_body` guardados.\n3. Resultado: cliente recebe mesmo 201 que da primeira vez. Nenhuma cobrança extra.\n\n**Retentativa com corpo diferente (mesma key, body diferente):**\n1. INSERT com ON CONFLICT: key existe.\n2. `request_hash` difere → responde `422 Unprocessable Entity` com Problem Details:\n   ```\n   { "code": "idempotency_mismatch", "message": "Key reused with different body" }\n   ```\n3. **Não** processa — proteção contra bugs/ataques.\n\n**Chave em uso há 10 min, state=in_progress:**\n1. INSERT com ON CONFLICT: key existe, state=in_progress.\n2. Responde `409 Conflict` com `Retry-After: 5`:\n   ```\n   { "code": "idempotency_in_progress", "message": "Try again in a few seconds" }\n   ```\n3. O cliente faz back-off exponencial e retenta.\n\n**Cliente esquece a chave:**\n- Opção A (estrita): exigir `Idempotency-Key` em todas as mutations monetárias — devolve 400 se falta.\n- Opção B (lax): processar normal, mas o cliente arrisca cobrança dupla em caso de timeout.\n- **Stripe usa (A)** em `POST /charges`. Recomendo o mesmo.\n\n**Cuidados extras:**\n- Limpar keys expiradas: `DELETE FROM idempotency_keys WHERE expires_at < now()` em cron.\n- Para operações distribuídas: usa locks (Redis `SETNX`) com TTL curto para evitar dois servidores processarem a mesma key simultaneamente.\n- O hash tem de ser determinístico: ordena chaves do JSON antes de hash.\n- Documenta o TTL da key no OpenAPI — clientes precisam de saber.',
    },
    {
      id: 'e17-6',
      difficulty: 3,
      kind: 'open',
      title: 'Migrar REST para GraphQL sem quebrar clientes',
      statement: 'Tens uma API REST pública com 200 endpoints, usada por centenas de empresas. Queres introduzir GraphQL para os teus apps móveis sem obrigar os atuais consumidores REST a migrarem. Delineia uma estratégia de 6 meses, com os riscos principais.',
      hint: 'REST continua. GraphQL é adicional. Pensa em: endpoint, schema, autenticação partilhada, observabilidade, deprecação controlada.',
      solution: '**Plano em fases (6 meses):**\n\n**Mês 1 — Infra e autenticação**\n- Monta o endpoint GraphQL em `/graphql` (POST). Reutiliza o mesmo mecanismo de auth (JWT/OAuth) — o cliente pode usar REST ou GraphQL com o mesmo token.\n- Decide stack: Apollo Server, Graphene (Python), DGS/Netflix (Java), etc.\n- Observabilidade: cada query tem um `operationName`; regista-o nos logs e métricas, com `trace_id` propagado.\n\n**Mês 2 — Schema inicial a partir dos recursos existentes**\n- Começa pelos 5-10 recursos mais usados pelo cliente móvel (os teus próprios apps). Não tentes cobrir os 200 endpoints no primeiro mês.\n- Schema idiomático: tipos com relações, evitar o reflexo de "copiar exatamente a resposta REST". Ex.: `Produto.categoria` é um objecto, não um `categoria_id`.\n- Reutiliza as mesmas BDs e serviços — os *resolvers* chamam os mesmos use cases que os handlers REST.\n- **Risco:** schema pensado como "cópia de REST" gera APIs que não são melhores que o que já existe. Investe tempo no desenho.\n\n**Mês 3 — DataLoader e segurança**\n- Implementa DataLoader (batching + cache por pedido) em **todos** os resolvers que acedem à BD. É isto que evita o N+1.\n- Depth limiting (ex.: max 7 níveis), complexity scoring, timeouts por query.\n- Persisted queries para os teus apps — só queries assinadas pré-aprovadas são aceites. Clientes externos continuam a poder enviar queries ad-hoc, mas com rate limit por complexidade.\n- **Risco:** uma query mal-formada pode gerar 10 000 selects. Sem complexity scoring vais aprender isto da pior forma.\n\n**Mês 4 — Apps internos migram gradualmente**\n- Os apps móveis migram ecrã a ecrã, começando pelos mais custosos (vários pedidos REST por ecrã). Benefícios concretos: menos payload, menos round trips, menos bateria.\n- Dashboards de métricas: comparar latência média por ecrã, bytes transferidos, bateria.\n- **Risco:** regressões silenciosas — alguma query devolve dados ligeiramente diferentes. Mitigação: testes de contrato (snapshot da resposta REST e da query GraphQL para o mesmo ecrã, compara).\n\n**Mês 5 — Abertura a terceiros (opcional)**\n- Documenta `/graphql` no portal público. Explorador interativo (GraphQL Playground, Apollo Sandbox).\n- Rate limit por complexidade de query (não só por número de pedidos).\n- **Não deprecias REST.** GraphQL é adicional.\n\n**Mês 6 — Observabilidade e sustentabilidade**\n- Métricas por `operationName`: contagem, latência p50/p95/p99, erros.\n- Alertas em queries que subitamente ficaram lentas (campos novos no schema podem introduzir caminhos pesados).\n- Processo de review: toda a mudança de schema passa por revisão. Breaking changes (remover campo, mudar tipo) só com marcação prévia de `@deprecated` por 90 dias.\n\n**Riscos principais:**\n\n1. **N+1 a toda a hora** — sem DataLoader, qualquer query aninhada rebenta com a BD. Mitigação: policy "nenhum resolver que acede a BD sem DataLoader".\n2. **Queries maliciosas/pesadas** — DOS por profundidade ou complexidade. Mitigação: depth limiting + complexity + timeouts.\n3. **Cache perdida** — REST tinha cache de CDN em GETs; GraphQL só POST não cacheia por URL. Mitigação: `persisted queries` com GET (hash no URL), ou cache no cliente (Apollo).\n4. **Schema como contrato público** — uma vez exposto, remover campos partiu toda a gente. Mitigação: processo de deprecação, nunca mudar semântica silenciosamente.\n5. **Duplicação de lógica** — dois conjuntos de handlers a fazer o mesmo. Mitigação: resolvers e controladores REST chamam os mesmos use cases/services; apenas o transporte muda.\n6. **Treino da equipa** — GraphQL tem padrões próprios (resolvers, fragments, mutations, subscriptions). Investe em formação.\n\n**Resultado esperado aos 6 meses:** apps internos mais rápidos, plataforma mais flexível para novos ecrãs, REST ainda é o canal principal para o resto do mundo. Nenhum cliente ficou para trás.',
    },
  ],
};
