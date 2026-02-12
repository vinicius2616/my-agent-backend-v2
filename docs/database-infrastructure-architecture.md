Database and Infrastructure Architecture

**Papel:** Tech Lead DBA

**Escopo:** Infraestrutura + PostgreSQL + Docker

**Status:** Normativo

**Compatível com:** Backend Architecture v2.0.0

---

# 1️⃣ Princípios de Infra (Regra de Ouro)

1. **Ambiente reproduzível via Docker**
2. **PostgreSQL único**
3. **Banco como persistência, nunca como regra**
4. **Schemas isolados por módulo**
5. **API stateless**
6. **Infra simples > infra complexa**
7. **Preparado para cloud, mas otimizado para local**
8. **Prisma exclusivamente na camada de infraestrutura**

📌 Nada de Kubernetes, múltiplos bancos ou stacks paralelas nesta fase.

---

# 2️⃣ Visão Geral da Infra

## Componentes

| Componente | Função |
| --- | --- |
| API | Backend Node.js |
| PostgreSQL | Banco relacional |
| Docker Compose | Orquestração local |

---

# 3️⃣ Estrutura Docker (Oficial)

## Containers obrigatórios

- `api`
- `postgres`

📌 Nenhum outro container no MVP.

---

# 4️⃣ Docker Compose — Estrutura Base

```
version: '3.9'

services:
  api:
    container_name: my-agent-api
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3333:3333"
    env_file:
      - .env.development
    depends_on:
      - postgres
    volumes:
      - .:/app
    command: npm run dev

  postgres:
    container_name: my-agent-postgres
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: my_agent
      POSTGRES_USER: my_agent
      POSTGRES_PASSWORD: my_agent
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

📌 **Volume persistente é obrigatório** (dados sobrevivem a restart).

---

# 5️⃣ Dockerfile da API (Padrão)

```
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]
```

📌 Produção futuramente terá build separado (`npm run build`).

---

# 6️⃣ Estratégia de Banco de Dados

## Banco Único

- 1 PostgreSQL
- 1 database: `my_agent`

📌 Nada de banco por módulo.

---

# 7️⃣ Estratégia de Schemas (Muito Importante)

Cada módulo tem **seu próprio schema** dentro do mesmo banco.

```
auth.*
users.*
finances.*
reminders.*
calendar.*
dashboard.* (opcional, somente views)
```

## Benefícios

- Isolamento lógico
- Clareza de ownership
- Migração facilitada para microservices no futuro
- Organização estrutural do domínio

📌 Schema ≠ banco. Continua sendo um único banco.

---

# 8️⃣ Convenção de Tabelas

## Padrão de nome

```
schema.table_name
```

Exemplos:

```
finances.transactions
reminders.reminders
calendar.events
```

📌 Nunca usar tabelas globais fora de schema.

---

# 9️⃣ Colunas Obrigatórias (Padrão Global)

Toda tabela de domínio **DEVE** ter:

```
id UUID PRIMARY KEY
user_id UUID NOT NULL
created_at TIMESTAMP NOT NULL
updated_at TIMESTAMP NOT NULL
```

## Regra

- `user_id` = ownership obrigatório
- Nada é global sem usuário

---

# 🔐 Segurança & Ownership

## Regra de Ouro

> Toda query SEMPRE filtra por `user_id`.
> 

Exemplo correto:

```
SELECT *
FROM finances.transactions
WHERE user_id = $1;
```

📌 Isso vale em TODOS os módulos, sem exceção.

---

# 🔟 Prisma ORM — Regras de Infra

## Uso obrigatório

- Prisma é utilizado exclusivamente na camada `infra`
- Nunca no domínio
- Nunca em Use Case
- Nunca em Controller

## Estrutura Oficial

```
prisma/
├── schema.prisma
└── migrations/
```

## Regras do Prisma

- Um `schema.prisma` central
- Models organizadas por domínio
- Repositories implementam interfaces do domínio
- Nenhuma regra de negócio dentro das models

Exemplo:

```
model Transaction {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  amount    Decimal
  type      String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("transactions")
  @@schema("finances")
}
```

📌 Prisma não valida regra de domínio.

📌 Prisma não substitui Value Objects ou Rules.

---

# 1️⃣1️⃣ Migrations (Prisma)

## Estratégia

- Prisma Migrations
- Versionadas
- Executadas por ambiente

Comandos padrão:

```
npx prisma migrate dev
npx prisma migrate deploy
```

## Regras

- ❌ Nunca alterar tabela manualmente
- ❌ Nunca rodar SQL direto em produção
- ✅ Migration sempre versionada
- ✅ Histórico mantido no repositório

---

# 1️⃣2️⃣ Índices (Performance Básica)

## Índices obrigatórios

```
CREATE INDEX idx_transactions_user_id
ON finances.transactions (user_id);
```

## Quando criar novos índices?

- Listagens frequentes
- Queries por data
- Resumos do dashboard
- Filtros combinados

📌 Índice deve ser justificado, mas não negligenciado.

---

# 1️⃣3️⃣ Dashboard & Banco

## Regra Especial

- Dashboard NÃO acessa banco diretamente
- Dashboard consome Use Cases
- Pode utilizar views materializadas no futuro

📌 Se precisar de performance:

→ Criar query otimizada no módulo dono

→ Nunca centralizar regra no dashboard

---

# 1️⃣4️⃣ Estratégia de Escala (Preparada)

## Hoje

- Docker Compose
- PostgreSQL single instance

## Amanhã (sem refatorar domínio)

- RDS / Cloud SQL
- Read replicas
- Redis (cache)
- Extração de módulo para serviço isolado

📌 Arquitetura já permite isso.

---

# ❌ Anti-Patterns de Infra (Proibidos)

- ❌ Banco por módulo
- ❌ Prisma no domínio
- ❌ Regra no banco
- ❌ Trigger para lógica de negócio
- ❌ Tabelas sem `user_id`
- ❌ SQL espalhado fora da infra
- ❌ Migration manual em produção

---

# ✅ Resumo Executivo (DBA)

- PostgreSQL único
- Schemas por módulo
- Prisma exclusivamente na infra
- Docker Compose como base
- Ownership via `user_id`
- Migrations versionadas
- Infra simples, limpa e escalável