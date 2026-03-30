# Backend Project with Elysia and Bun.js

This project is a TypeScript backend application built using the Elysia framework and the Bun.js runtime. It incorporates various features for authentication, database management, and real-time communication.

## Features

- **JWT Authentication**: Secure endpoints using JSON Web Tokens for user authentication.
- **Bearer Token Support**: Implement session inference through Bearer tokens.
- **OpenAPI Documentation**: Automatic generation of API documentation based on defined routes and schemas.
- **Prisma ORM**: Connect to a PostgreSQL (PostGIS) database for data management.
- **TypeBox Validation**: Use Prismabox for validation models to ensure data integrity.
- **WebSocket Support**: Real-time message sending capabilities using uWebSocket.

## Project Structure

```
backend
├── src
│   ├── app.ts                # Entry point of the application
│   ├── index.ts              # Starts the application
│   ├── config
│   │   └── env.ts           # Manages environment variables
│   ├── plugins
│   │   ├── bearer.ts         # Bearer plugin for session inference
│   │   ├── jwt.ts            # JWT plugin for authentication
│   │   ├── openapi.ts        # OpenAPI documentation setup
│   │   ├── prisma.ts         # Prisma configuration for PostgreSQL
│   │   └── websocket.ts      # WebSocket endpoint setup
│   ├── modules
│   │   ├── auth
│   │   │   ├── auth.controller.ts  # Handles authentication logic
│   │   │   ├── auth.routes.ts       # Defines authentication routes
│   │   │   └── auth.schema.ts       # Validation schemas for auth
│   │   ├── places
│   │   │   ├── places.controller.ts  # Logic for places management
│   │   │   ├── places.routes.ts       # Defines places routes
│   │   │   ├── places.schema.ts       # Validation schemas for places
│   │   │   └── places.service.ts      # Business logic for places
│   │   └── ws
│   │       └── messages.ws.ts         # WebSocket message handling
│   ├── models
│   │   └── index.ts             # Exports application models
│   ├── services
│   │   └── geo-filter.service.ts  # Logic for geo-based filtering
│   └── types
│       └── index.ts             # Custom types and interfaces
├── prisma
│   ├── schema.prisma            # Prisma schema definition
│   ├── migrations
│   │   └── .gitkeep             # Placeholder for migrations
│   └── seed.ts                  # Database seeding logic
├── docker
│   └── postgres
│       └── init.sql             # SQL commands for database initialization
├── tests
│   └── app.test.ts              # Application tests
├── .env.example                  # Example environment variables
├── .gitignore                    # Git ignore file
├── bunfig.toml                  # Bun.js configuration
├── docker-compose.yml            # Docker Compose configuration
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## Getting Started

1. **Clone the Repository**: 
   ```
   git clone <repository-url>
   cd backend
   ```

2. **Install Dependencies**: 
   ```
   bun install
   ```

3. **Set Up Environment Variables**: 
   Copy `.env.example` to `.env` and fill in the required values.

4. **Run the Application**: 
   ```
   bun run start
   ```

5. **Run Tests**: 
   ```
   bun run test
   ```

6. **Docker Setup**: 
   To run the PostgreSQL + PostGIS server, use:
   ```
   docker-compose up
   ```

## Local Development (Postgres + Prisma + Dev Server)

Use this flow to start everything needed for local development.

1. **Start PostgreSQL (Docker)**:
   ```
   docker compose up -d postgres
   ```

2. **Create and configure `.env`**:
   ```
   cp .env.example .env
   ```
   Make sure `DATABASE_URL` matches the credentials from `docker-compose.yml`.

   Example:
   ```
   DATABASE_URL=postgresql://your_username:your_password@localhost:5432/your_database?schema=public
   ```

3. **Prepare Prisma**:
   ```
   bunx prisma generate
   bunx prisma migrate dev --name init
   ```

   If you don't have migrations yet and only want to sync schema quickly:
   ```
   bunx prisma db push
   ```

4. **Start development server**:
   ```
   bun run dev
   ```

Notes:
- Prismabox is a validation library used in code. It is not a separate service to start.
- If you need to stop Postgres later, run `docker compose stop postgres`.

## Product Roadmap (Future Implementation)

This section records moderation and recommendation decisions for a future phase. Nothing below is implemented yet.

### Moderation Strategy (MVP)

1. User uploads media normally.
2. Media enters an async moderation queue (Redis-based worker).
3. A fast moderation pass classifies the content:
   - Adult/nudity content: allowed, but flagged as sensitive.
   - Gore/graphic violence: blocked and removed.
4. User trust score can change exposure policy, but should not bypass moderation safety checks.
5. A second, deeper moderation pass runs in background for extra risk categories (weapons, drugs, other policy risks).
6. If deep moderation fails, backend can unpublish/remove content and apply account actions (strike, score reduction, notification).

### Moderation States (Proposed)

- `PENDING_FAST`: waiting for quick moderation.
- `PENDING_DEEP`: waiting for deep moderation.
- `APPROVED`: safe to show.
- `FLAGGED_ADULT`: allowed with sensitive label.
- `REJECTED`: removed/blocked due to policy violation.

### Recommendation Strategy (MVP)

To keep cost low and implementation simple, recommendation starts with manual tags (no advanced embedding pipeline in MVP):

1. Media receives predefined tags (manual or rule-assisted).
2. Feed ranking uses user interactions with those tags (likes, watch time, skips, comments).
3. Recommendation and moderation are separated pipelines, so moderation latency does not depend on recommendation processing.

### Post-MVP Direction

- Add richer automated tagging and semantic similarity later.
- Evaluate vector embeddings for organic "similar content" discovery after MVP is stable.

## License

This project is licensed under the MIT License. See the LICENSE file for details.