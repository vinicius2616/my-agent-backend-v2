Backend Agent rule

**Produto:** My Agent

**Escopo:** Backend

**Status:** Documento normativo (IA-first)

**Versão:** `v2.0.0`

**Base:** Backend Architecture `v2.0.0`

📌 Este documento define **regras obrigatórias** para qualquer código backend gerado por IA.

📌 O Agente **não decide**, **não otimiza arquitetura** e **não cria atalhos**.

---

# 1️⃣ Princípios Invioláveis

Estas regras **não admitem exceção**:

1. Tudo é autenticado
2. Backend orientado a **módulos de domínio**
3. Arquitetura **Modular Monolith**
4. **Clean Architecture por módulo**
5. **DDD light** (Entity, Value Object, Rule, Use Case)
6. Domínio **não conhece infra**
7. Dashboard **não contém regra de negócio**
8. Nenhum módulo acessa outro diretamente
9. Banco **não é fonte de regra**
10. Existe **um único contrato de response**
11. Toda request deve ser validada com **Zod**
12. Todas as mensagens devem estar em **português**

Violação de qualquer item = **código inválido**.

---

# 2️⃣ Stack Oficial (Imutável)

O Agente **não pode sugerir alternativas**.

## ✅ Permitido

- Node.js
- TypeScript (`strict`)
- PostgreSQL
- Prisma ORM
- Prisma Migrations
- BetterAuth
- Zod
- Docker / Docker Compose

## ❌ Proibido

- Drizzle
- TypeORM
- Sequelize
- Firebase / Supabase
- Auth custom
- Microservices
- ORM fora da infra
- Validação manual sem Zod

📌 Stack é fixa e normativa conforme Backend Architecture `v2.0.0`.

---

# 3️⃣ Estilo Arquitetural Global

## Modular Monolith

- Um deploy
- Um banco
- Domínios isolados
- Baixo acoplamento
- Preparado para extração futura

📌 Microserviços não existem nesta fase.

---

# 4️⃣ Estrutura Global de Pastas (Obrigatória)

```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── dashboard/
│   ├── finances/
│   ├── reminders/
│   ├── calendar/
│   └── whatsapp/
│
├── shared/
│   ├── database/
│   ├── http/
│   ├── config/
│   ├── env/
│   ├── errors/
│   ├── utils/
│   └── types/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── main.ts
└── server.ts
```

📌 O Agente **não cria novas pastas fora deste padrão**.

---

# 5️⃣ Estrutura Interna de Módulo (Regra Absoluta)

```
modules/{module}/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   └── rules/
│
├── application/
│   ├── use-cases/
│   ├── dto/
│   └── schemas/
│
├── infra/
│   ├── database/
│   ├── http/
│   └── mappers/
│
└── index.ts
```

---

# 6️⃣ Domínio — Regras Obrigatórias

## ✅ Pode existir no domínio

- Entities
- Value Objects
- Rules
- Interfaces de repositório
- Regras puras de negócio

## ❌ Proibido no domínio

- Prisma
- Zod
- HTTP
- Controllers
- Frameworks
- Libs externas
- `process.env`
- Auth

📌 Domínio é 100% puro.

---

# 7️⃣ Value Objects (Obrigatório)

## Definição

Value Object representa **valor que não pode existir inválido**.

## Regras

- Não possui ID
- É imutável
- Valida no construtor
- Falha cedo

📌 Validação estrutural é Zod.

📌 Validação de domínio é Value Object.

---

# 8️⃣ Rules (Obrigatório quando há decisão)

## O que são Rules

- Decisões de negócio
- Avaliam contexto
- Cruzam dados
- Retornam boolean / decisão

## Regras

- São puras
- Não acessam banco
- Não dependem de infra
- Não fazem side-effects

📌 Rule ≠ validação estrutural.

---

# 9️⃣ Use Cases (Application Layer)

Use Case:

- Orquestra fluxo
- Recebe dados já validados por Zod
- Cria Value Objects
- Executa Rules
- Usa Repositories

Fluxo obrigatório:

```
Controller
 → Validação Zod
 → Use Case
    → Value Objects
    → Rules
    → Repository
```

📌 Controller nunca contém regra.

---

# 🔟 Banco de Dados & Prisma

## Estratégia

- PostgreSQL único
- Prisma apenas na infra
- `schema.prisma` central

## Regras Prisma

- Apenas na camada infra
- Repository implementa interface do domínio
- Use Case nunca importa Prisma

❌ Prisma fora da infra = inválido.

---

# 1️⃣1️⃣ Migrations

- Prisma Migrations
- Versionadas
- Por ambiente
- Nunca manuais em produção

📌 Migration ≠ regra de negócio.

---

# 1️⃣2️⃣ Autenticação — BetterAuth

## Métodos Permitidos

- Email e senha
- Social login (OAuth)
- Sessão segura (HTTP Only)

## Regras Globais

- Tudo é autenticado
- Usuário autenticado é premissa
- Ownership via `userId`

📌 Apenas `modules/auth` pode conter auth.

---

# 🔐 Autorização

- Baseada em `userId`
- Queries sempre filtradas
- Preparado para planos / roles futuras

---

# 🔄 Comunicação HTTP — Contrato Oficial

📌 Existe um único formato de response no sistema.

## Estrutura Obrigatória

```
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

## Regras

- `success` obrigatório
- `data = null` quando erro
- `error` só existe se `success = false`
- `code` é referência principal no frontend
- Mensagens devem estar em português

📌 Nenhuma rota pode fugir deste padrão.

---

# 📝 Padrão de Mensagens (Obrigatório)

Todas as mensagens do sistema devem estar em português.

Inclui:

- Mensagens de erro
- Mensagens de validação
- Mensagens de sucesso
- Mensagens retornadas ao frontend

❌ Nunca retornar mensagens em inglês

❌ Nunca misturar idiomas

O código técnico pode estar em inglês.

A mensagem exibida ao usuário deve estar em português.

---

# 📊 Dashboard (Módulo Central)

## Pode

- Agregar dados
- Orquestrar módulos
- Expor resumos (`/summary`)

## Não pode

- Regra de negócio
- Query direta no banco
- Validação estrutural ou de domínio

📌 Dashboard é orquestrador.

---

# 1️⃣3️⃣ Variáveis de Ambiente (ENV)

## Regras

- ENV por ambiente
- Validação no boot
- Tipagem forte
- `process.env` só em `shared/env`

```
.env.development
.env.staging
.env.production
```

📌 App não sobe com env inválido.

---

# 🐳 Docker & Infra

- API container
- PostgreSQL container
- Docker Compose obrigatório

📌 Ambiente sempre reproduzível.

---

# ❌ Anti-Patterns (Proibidos)

- Controller com regra
- Domínio importando infra
- Prisma no domínio
- Zod no domínio
- Auth duplicada
- Dashboard acessando banco
- Contratos de response diferentes
- `process.env` espalhado
- Banco validando regra
- Mensagens em inglês

---

# ✅ Checklist Final para o Agente (Cursor)

Antes de gerar código:

- [ ]  Está dentro de um módulo?
- [ ]  Clean Architecture respeitada?
- [ ]  Domínio puro?
- [ ]  Value Objects usados?
- [ ]  Rules separadas?
- [ ]  Use Case orquestrando?
- [ ]  Prisma só na infra?
- [ ]  Zod validando request?
- [ ]  Auth respeitada?
- [ ]  Response no contrato padrão?
- [ ]  Mensagens em português?

Se qualquer item for **não** → **não gerar código**.