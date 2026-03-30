# Jobbie Frontend

Frontend do Jobbie construído com Vue 3, Quasar e TypeScript, rodando em modo PWA.

O projeto hoje já cobre experiências de feed, frames, anúncios, chat, cadastro, galeria de mídia e um gate local de validação etária no cliente.

## Stack

- Vue 3
- Quasar 2
- TypeScript
- Vue Router
- PWA com Quasar
- `@vladmandic/face-api` para estimativa local de idade

## Instalação

```bash
npm install
```

## Desenvolvimento

Estamos rodando o frontend em modo PWA.

### Subir em desenvolvimento

```bash
npx quasar dev -m pwa
```

Alternativa via script:

```bash
npm run dev:pwa
```

## Integracao com backend (Vue 3 moderno)

O frontend agora esta preparado para migrar do mock para backend real sem trocar codigo das telas.

## Push Notifications (fluxo minimo - PWA)

Esta secao descreve o minimo necessario no frontend para receber push no navegador/PWA.

### 1. Compatibilidade rapida

- Android + Chrome/Edge: funciona bem.
- Desktop + Chrome/Edge/Firefox: funciona bem.
- iOS/iPadOS: funciona em PWA instalada na tela inicial (Add to Home Screen).

### 2. Configuracao base

1. Rode o app em HTTPS (ou localhost em desenvolvimento).
2. Garanta que o Service Worker do PWA esteja ativo.
3. Defina a chave publica VAPID no frontend (vinda do backend).

Exemplo de variavel:

```env
VITE_PUSH_PUBLIC_VAPID_KEY=coloque_a_chave_publica_vapid_aqui
```

### 3. Fluxo minimo no login

1. Frontend cria `anonymousSessionId` local ao abrir a app.
2. Usuario autentica normalmente.
3. Frontend pede permissao com Notification.requestPermission().
4. Se permitido, frontend cria/obtem subscription via PushManager.
5. Frontend envia a subscription para `POST /auth/push/subscriptions`.
6. Se houve login/registro, frontend chama `POST /auth/push/bind-anonymous` para migrar contexto anonimo para usuario logado.

Payload minimo sugerido para enviar ao backend:

```json
{
	"endpoint": "https://...",
	"expirationTime": null,
	"keys": {
		"p256dh": "...",
		"auth": "..."
	},
	"device": "web-pwa",
	"anonymousSessionId": "uuid-opcional"
}
```

### 4. Fluxo minimo no logout

1. Opcional: chamar rota para desativar o endpoint atual.
2. Opcional: unsubscribe local (quando fizer sentido para sua regra de produto).

### 5. Teste manual rapido

1. Login em um navegador suportado.
2. Aceite permissao de notificacao.
3. Verifique no backend se a subscription foi salva para usuario logado ou sessao anonima.
4. Dispare um push de teste pelo backend em `POST /auth/push/test`.
5. Confirme recebimento em foreground/background.

Observacao: o frontend sozinho nao envia push para o provedor. Ele registra a subscription; o disparo real acontece no backend.

### 1. Configure variaveis de ambiente

1. Copie `frontend/.env.example` para `.env`.
2. Ajuste `VITE_API_BASE_URL` com a URL do backend.
3. Coloque `VITE_USE_MOCK_API=false` para usar API real.

### 2. Onde integrar endpoints

As paginas **nao** chamam `axios` direto. A integracao deve acontecer nos services:

- `src/services/content.service.ts`
- `src/services/registration.service.ts`
- `src/composables/useAuth.ts`

Esses arquivos ja contem `TODO(back-end)` indicando os endpoints que precisam ser alinhados.

### 3. Regra de ouro para iniciantes

- Tela Vue (`pages/`): estado de UI, loading, erro, interacao.
- Service (`services/`): chamada HTTP e transformacao de payload.
- Tipos (`types/`): contratos de dados.

Se seguir essa divisao, o codigo fica simples de manter e mais facil de testar.

### 4. Tipos e constantes de dominio

Para evitar acoplamento com mock, os contratos ficam em:

- `src/types/content.ts`
- `src/constants/content.ts`

Assim, quando remover o mock no futuro, os componentes continuam estaveis.

## Build de produção

Para compilar o frontend em produção no mesmo modo PWA:

```bash
npx quasar build -m pwa
```

Alternativa via script:

```bash
npm run build:pwa
```

## Qualidade de código

### Lint

```bash
npm run lint
```

### Formatação

```bash
npm run format
```

## O que foi implementado hoje

### 1. Massa de dados mock mais rica

Foram adicionados e expandidos mocks para:

- posts de feed
- perfis anunciados
- detalhes de perfil
- threads de chat
- áudios e mensagens de voz
- vídeos para frames
- galerias de imagem

Arquivo principal (fallback em desenvolvimento):

- `src/data/mock-content.ts`

Importante: o consumo das telas agora passa pela camada de services.

### 2. Super comentários com J-GOLD

Foi criado um fluxo de super comentário com valor e destaque visual por temperatura.

Faixas visuais atuais:

- `cold`
- `warm`
- `hot`
- `blaze`

Principais arquivos:

- `src/types/comments.ts`
- `src/components/SuperCommentComposer.vue`
- `src/components/CommentMessageCard.vue`
- `src/components/PostCommentComposer.vue`
- `src/components/PostCommentsDialog.vue`

### 3. Feed e posts

Melhorias aplicadas no feed:

- remoção de banner/topo desnecessário
- layout desktop em duas colunas
- imagens com proporção mais natural
- suporte a comentários inline
- suporte a super comentários
- visualização fullscreen de imagens

Arquivo principal:

- `src/pages/FeedPage.vue`

### 4. Frames e mídia

Melhorias aplicadas em vídeos e comentários de frames:

- comentários com payload tipado
- fullscreen em players de vídeo
- reuso dos mesmos componentes de mídia do restante do app

Principais arquivos:

- `src/pages/FramesPage.vue`
- `src/components/SimpleVideoPlayer.vue`
- `src/components/ChatVideoPlayer.vue`

### 5. Página de anúncios e cards

Redesign da experiência de anúncios:

- cards com imagem/carrossel como fundo
- filtros recolhidos inicialmente
- grid mais forte em desktop
- badges e atributos extras
- rolagem infinita
- estado final de listagem

Principais arquivos:

- `src/pages/AdsPage.vue`
- `src/components/AdProfileCard.vue`

### 6. Perfil detalhado do anunciante

O perfil detalhado passou a reutilizar os componentes centrais do sistema:

- players de áudio e vídeo
- comentários
- super comentários
- galeria de preview no perfil
- navegação para uma página dedicada de galeria

Principais arquivos:

- `src/pages/AdProfileDetailPage.vue`
- `src/pages/AdProfileGalleryPage.vue`

### 7. Visualizador de imagens

Foi criado um visualizador reutilizável com:

- fullscreen
- navegação lateral
- miniaturas
- reuso em feed, chat e perfil

Arquivo principal:

- `src/components/ImageViewerDialog.vue`

### 8. Cadastro com verificação por email ou celular

O fluxo de registro foi atualizado para suportar:

- escolha entre email e telefone
- confirmação por código OTP em modo mock
- reenvio com cooldown
- criação de conta apenas após validação

Observação atual:

- a validação do código está em modo simulação
- qualquer código com 6 dígitos é aceito

Arquivo principal:

- `src/pages/RegisterPage.vue`

### 9. Tipos de usuário

Hoje o frontend trabalha com três perfis lógicos:

- `anonymous`
- `registered`
- `creator`

Regras atuais:

- `anonymous`: usuário sem conta, mas com acesso após validação etária
- `registered`: conta para histórico e compras
- `creator`: conta de criador com pendência de verificação manual de documentos

Arquivo principal:

- `src/composables/useAuth.ts`

### 10. Gate de maioridade com face-api

Foi implementado um bloqueio global de acesso à plataforma até a validação etária local ser concluída.

Fluxo atual:

- abre câmera frontal do dispositivo
- roda inferência de idade no navegador com `@vladmandic/face-api`
- tira múltiplas leituras
- calcula média estimada
- aprova apenas se a média for maior ou igual a 18

Persistência local:

- após aprovação, um selo local é salvo no `localStorage`
- esse selo possui hash de integridade e expiração
- se estiver expirado ou adulterado, a pessoa precisa validar de novo

Arquivos principais:

- `src/components/AgeVerificationGate.vue`
- `src/composables/useAgeVerification.ts`

Modelos locais usados pelo `face-api`:

- `public/models/face-api/age_gender_model.bin`
- `public/models/face-api/age_gender_model-weights_manifest.json`
- `public/models/face-api/tiny_face_detector_model.bin`
- `public/models/face-api/tiny_face_detector_model-weights_manifest.json`

## Observações importantes

### Validação etária atual

O fluxo de maioridade implementado nesta etapa é exclusivamente frontend.

Isso significa:

- nenhuma imagem é enviada ao backend
- nenhum score é enviado ao backend
- a proteção atual é adequada para prototipação e UX local
- ela não substitui uma validação forte de compliance quando o backend entrar

### Contas de criador

O frontend já diferencia conta registrada de conta criador, mas a validação documental de criadores ainda está apenas sinalizada como pendente de análise manual.

## Estrutura relevante

```text
frontend/
├── public/
│   └── models/face-api/        # Pesos do modelo local de estimativa etária
├── src/
│   ├── components/
│   │   ├── AgeVerificationGate.vue
│   │   ├── ImageViewerDialog.vue
│   │   ├── PostCommentComposer.vue
│   │   ├── PostCommentsDialog.vue
│   │   ├── SuperCommentComposer.vue
│   │   └── CommentMessageCard.vue
│   ├── composables/
│   │   ├── useAgeVerification.ts
│   │   ├── useAuth.ts
│   │   └── useUserPreferences.ts
│   ├── data/
│   │   └── mock-content.ts
│   ├── pages/
│   │   ├── FeedPage.vue
│   │   ├── FramesPage.vue
│   │   ├── AdsPage.vue
│   │   ├── AdProfileDetailPage.vue
│   │   ├── AdProfileGalleryPage.vue
│   │   ├── MessagesPage.vue
│   │   └── RegisterPage.vue
│   └── router/
│       └── routes.ts
└── quasar.config.ts
```

## Resumo operacional

### Instalar

```bash
npm install
```

### Rodar em desenvolvimento PWA

```bash
npx quasar dev -m pwa
```

### Build de produção PWA

```bash
npx quasar build -m pwa
```

### Lint

```bash
npm run lint
```
