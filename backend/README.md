# Jobbie Backend

API principal do Jobbie, construída com Elysia + Bun + Prisma.

O backend concentra autenticação, regras de negócio, feed, interações, mensagens em tempo real e integração com storage de mídia.

## Visão Geral

O projeto foi estruturado para ser rápido de desenvolver localmente e fácil de evoluir para produção:

- Runtime: Bun
- Framework HTTP: Elysia
- ORM: Prisma
- Banco: PostgreSQL (com PostGIS no ambiente Docker local)
- Documentação de API: OpenAPI/Swagger gerada automaticamente
- Comunicação em tempo real: WebSocket

## Stack e Responsabilidades

- Elysia: define rotas, schemas e plugins da aplicação.
- Prisma: modelagem, migrações e acesso type-safe ao banco.
- JWT/Bearer: autenticação e autorização das rotas protegidas.
- AWS SDK (S3 compatível): geração de URL assinada para upload e download de mídia privada.
- Swagger/OpenAPI: documentação viva da API, derivada dos schemas e rotas existentes.

## Push Notifications (fluxo minimo)

Nesta arquitetura, o frontend registra a subscription e o backend faz o envio real do push.

### 1. Responsabilidade do backend

- Receber e validar subscription do navegador/app PWA.
- Salvar subscription vinculada ao usuario autenticado.
- Disparar notificacoes para as subscriptions ativas do usuario.
- Remover/desativar subscriptions invalidas (ex.: status 404/410 no envio).

### 2. Variaveis de ambiente sugeridas

```env
PUSH_VAPID_PUBLIC_KEY=
PUSH_VAPID_PRIVATE_KEY=
PUSH_VAPID_SUBJECT=mailto:seu-email@dominio.com
```

Gerar chaves VAPID (uma vez):

```bash
npx web-push generate-vapid-keys
```

### 3. Endpoints minimos sugeridos

1. POST /auth/push/subscriptions
  - Auth opcional.
  - Quando sem token, usa anonymousSessionId para contexto anonimo.
  - Faz upsert por endpoint para usuario logado ou sessao anonima.
2. POST /auth/push/bind-anonymous
  - Auth obrigatoria.
  - Vincula subscriptions anonimas ao usuario logado (transicao login/registro).
3. DELETE /auth/push/subscriptions
  - Auth opcional.
  - Desativa/remove endpoint informado.
4. POST /auth/push/test
  - Auth opcional.
  - Com token: dispara para o proprio usuario.
  - Sem token: dispara para anonymousSessionId informado.

Payload minimo de subscription:

```json
{
  "endpoint": "https://...",
  "expirationTime": null,
  "keys": {
   "p256dh": "...",
   "auth": "..."
  },
  "device": "web-pwa",
  "anonymousSessionId": "uuid-opcional-quando-nao-logado"
}
```

### 4. Modelo minimo no banco

Campos recomendados para tabela de subscriptions:

- id
- userId
- endpoint (unico)
- p256dh
- auth
- device
- createdAt
- updatedAt
- lastUsedAt
- isActive

Regra importante: um usuario pode ter varias subscriptions (celular, desktop, navegadores diferentes).

### 5. Fluxo de envio

1. Evento de negocio ocorre (ex.: nova mensagem).
2. Backend busca subscriptions ativas do usuario destino.
3. Backend envia payload para cada endpoint.
4. Se retorno indicar endpoint invalido (404/410), desativa/remove no banco.

### 6. Teste manual rapido

1. Usuario faz login no frontend e aceita permissao de notificacao.
2. Frontend registra subscription em POST /auth/push/subscriptions.
3. Backend confirma registro no banco.
4. Chame POST /auth/push/test.
5. Valide recebimento no dispositivo.

## Estrutura do Projeto

```text
backend
├── src
│   ├── app.ts
│   ├── index.ts
│   ├── config
│   │   ├── env.ts
│   │   └── prisma.ts
│   ├── modules
│   │   ├── auth
│   │   ├── media
│   │   ├── places
│   │   ├── posts
│   │   ├── profile
│   │   └── ws
│   ├── plugins
│   │   ├── auth-guard.ts
│   │   ├── bearer.ts
│   │   ├── jwt.ts
│   │   ├── openapi.ts
│   │   ├── prisma.ts
│   │   ├── sanitize.ts
│   │   └── websocket.ts
│   ├── services
│   │   ├── geo-filter.service.ts
│   │   └── storage.service.ts
│   └── types
├── prisma
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations
├── docker
│   └── postgres
│       └── init.sql
├── tests
├── docker-compose.yml
├── package.json
└── README.md
```

## Pré-requisitos

- Bun instalado
- Docker e Docker Compose instalados
- Porta 5432 livre para PostgreSQL local

## Configuração Local

### 1. Instalar dependências

```bash
bun install
```

### 2. Subir banco local com Docker

```bash
docker compose up -d postgres
```

### 3. Configurar variáveis de ambiente

Crie o arquivo .env com base no .env.example e ajuste os valores.

Exemplo mínimo para desenvolvimento:

```env
API_PORT=3000
DATABASE_URL=postgresql://postgres:jb_1234567890_@localhost:5432/jobbie?schema=public
JWT_SECRET=troque_este_valor
OPENAPI_TITLE=Jobbie API
OPENAPI_VERSION=1.0.0
```

Se for usar storage S3 compatível local/remoto, configure também:

```env
STORAGE_URL=
STORAGE_NAME=
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

### 4. Preparar Prisma

Gerar client e aplicar migrações:

```bash
bunx prisma generate
bunx prisma migrate dev --name init
```

Em cenários de prototipagem rápida (sem criar migration):

```bash
bunx prisma db push
```

### 5. Rodar servidor de desenvolvimento

```bash
bun run dev
```

A API será iniciada na porta definida em API_PORT (fallback 3000).

## Prisma no Dia a Dia

Fluxo recomendado:

1. Alterar schema no arquivo prisma/schema.prisma.
2. Criar migração com bunx prisma migrate dev --name nome_da_alteracao.
3. Validar o Prisma Client gerado.
4. Versionar as migrations junto do código.

Comandos úteis:

```bash
bunx prisma studio
bunx prisma migrate status
bunx prisma generate
```

## Documentação Swagger/OpenAPI

O projeto já possui integração para geração automática da especificação OpenAPI a partir das rotas e schemas.

Na prática isso significa:

- As rotas documentadas no código aparecem automaticamente na documentação.
- Contratos de request/response ficam sincronizados com os schemas.
- Fica mais simples integrar frontend, QA e consumidores externos.

Após iniciar o servidor, acesse:

- http://localhost:3000/swagger

Se a aplicação estiver em outra porta, ajuste a URL conforme o valor de API_PORT.

## Testes

Executar a suíte de testes:

```bash
bun run test
```

## Build e Execução em Produção

### Build

```bash
bun run build
```

### Start em produção

```bash
bun run start
```

### Recomendações de deploy

- Executar atrás de proxy reverso (Nginx, Caddy ou load balancer).
- Injetar variáveis de ambiente por secret manager da plataforma.
- Usar banco gerenciado em produção.
- Habilitar logs estruturados e monitoramento de healthcheck.
- Executar migrações no pipeline de release antes de subir a nova versão.

Fluxo de release sugerido:

1. CI roda lint/testes.
2. Build da aplicação.
3. Aplicar migrações Prisma.
4. Subir nova versão.
5. Validar healthcheck e métricas.

## Roadmap de Produto (Planejado)

As decisões abaixo estão documentadas para implementação futura.

### Moderação de Conteúdo (MVP)

- Upload de mídia continua normal para o usuário.
- Mídia entra em fila assíncrona (Redis + workers).
- Primeiro estágio: moderação rápida.
  - Nudez/conteúdo adulto: permitido com sinalização sensível.
  - Gore/violência gráfica: bloqueado e removido.
- Segundo estágio: moderação profunda para categorias de risco adicionais (armas, drogas e outros sinais de violação).
- Caso reprovado em estágio profundo, o conteúdo pode ser despublicado e receber ações de conta (strike, redução de score, notificação).

Estados propostos:

- PENDING_FAST
- PENDING_DEEP
- APPROVED
- FLAGGED_ADULT
- REJECTED

### Recomendação (MVP)

Para manter custo baixo e velocidade de entrega:

- Iniciar com tags manuais e regras simples de ranking.
- Usar sinais de interação (curtida, tempo de visualização, skip, comentários) para ordenar feed.
- Manter recomendação separada do pipeline de moderação.

Evolução pós-MVP:

- Enriquecimento automático de tags.
- Embeddings vetoriais para descoberta semântica de conteúdo similar.

## Troubleshooting Rápido

- Erro de conexão com banco:
  - Verifique se o container postgres está ativo.
  - Confirme credenciais e host no DATABASE_URL.
- Prisma client desatualizado:
  - Rode bunx prisma generate após alterações de schema.
- Upload de mídia falhando:
  - Revise variáveis STORAGE_* e conectividade com serviço S3 compatível.

## Licença

MIT.
