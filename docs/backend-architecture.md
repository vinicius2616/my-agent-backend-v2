Backend Architecture

**Versão:** `v2.0.0`

**Status:** Documento normativo

**Escopo:** Backend / Infra / Arquitetura

**Stack oficial:** Node.js · TypeScript · PostgreSQL · Prisma · BetterAuth · Zod · Docker

---

# 1️⃣ Objetivo do Documento

Definir a arquitetura oficial de backend do **My Agent**, garantindo:

- Escalabilidade
- Organização por domínio
- Segurança por padrão
- Clareza entre frontend e backend
- Padronização de contratos
- Base sólida para crescimento do sistema

📌 Este documento é a **fonte única de verdade do backend**.

---

# 2️⃣ Stack Oficial (Obrigatória)

## Core

- Node.js
- TypeScript (strict mode)

## Banco de Dados

- PostgreSQL
- Prisma ORM
- Prisma Migrations

## Autenticação

- BetterAuth
    - Email e senha
    - Social login (OAuth)
    - Sessões seguras (HTTP Only)

## Validação

- Zod (obrigatório para todas as requests)

## Infra

- Docker
- Docker Compose

## Arquitetura

- Modular Monolith
- Clean Architecture por módulo
- DDD light

---

# 3️⃣ Princípios Arquiteturais

1. Tudo é autenticado
2. Backend orientado a módulos de domínio
3. Separação clara entre:
    - Domínio
    - Aplicação
    - Infraestrutura
    - Apresentação
4. Nenhum módulo acessa outro diretamente
5. Dashboard é apenas orquestrador
6. Contrato HTTP único e obrigatório
7. Todas as mensagens do sistema devem estar em português
8. Código preparado para escala horizontal

---

# 4️⃣ Estilo Arquitetural

## ✅ Modular Monolith

- Um único deploy
- Domínios isolados
- Baixo acoplamento
- Alta coesão

📌 Microserviços não são adotados nesta fase.

---

# 5️⃣ Estrutura Global de Pastas

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

---

# 6️⃣ Estrutura Interna de um Módulo

```
modules/finances/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── rules/
│   └── repositories/
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

📌 Domínio nunca importa Prisma, Zod ou HTTP.

---

# 7️⃣ Banco de Dados — Prisma

## Estratégia

- PostgreSQL único
- Prisma como camada de infraestrutura
- Um `schema.prisma` central
- Models organizadas por domínio

📌 Prisma é exclusivamente infraestrutura.

---

## Regras Oficiais do Prisma

- Nunca importar Prisma no domínio
- Repositories implementam interfaces do domínio
- Controllers não acessam Prisma diretamente
- Use Cases nunca recebem Prisma Client

---

# 8️⃣ Validação de Requests — Zod (Obrigatório)

Toda request deve ser validada com Zod antes de chegar ao Use Case.

## Responsabilidade do Zod

- Validar tipo
- Validar formato
- Validar campos obrigatórios
- Validar enums estruturais

📌 Zod não contém regra de negócio.

---

## Fluxo Oficial

Controller

→ Validação com Zod

→ Use Case

→ Value Objects

→ Rules

→ Repository

---

## Tratamento de Erros de Validação

Erros devem seguir o contrato padrão e estar em português.

Exemplo:

```
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERRO_VALIDACAO",
    "message": "Dados inválidos",
    "details": {
      "campo": "amount",
      "erro": "O valor deve ser maior que zero"
    }
  },
  "meta": {}
}
```

---

# 9️⃣ Contrato HTTP Oficial

Todas as respostas devem seguir o padrão:

```
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {}
}
```

## Regras

- Nunca retornar objeto cru
- Nunca retornar array cru
- Nunca retornar erro fora do padrão
- Sempre incluir `success`

---

# 🔟 Padrão de Mensagens (Obrigatório)

Todas as mensagens do sistema devem estar em português.

Inclui:

- Mensagens de erro
- Mensagens de validação
- Mensagens de sucesso
- Mensagens internas de regra
- Mensagens retornadas ao frontend

❌ Nunca retornar mensagens em inglês

❌ Nunca misturar idiomas

O código técnico DEVE estar em inglês, sem comentarios mas que esteja EXPLICIDAMENTE coeso com o que faz.

A mensagem exibida ao usuário DEVE estar em português.

---

# 1️⃣1️⃣ Autenticação — BetterAuth

## Métodos permitidos

- Email e senha
- Social login (Google, GitHub, etc.)
- Sessão via cookie HTTP Only

## Regras

- Todas as rotas protegidas
- Ownership por `userId`
- Nenhuma lógica de auth fora do módulo auth

---

# 1️⃣2️⃣ Variáveis de Ambiente

Ambientes oficiais:

- development
- staging
- production

Regras:

- Validação obrigatória na inicialização
- Nenhum uso direto de `process.env`
- App não sobe com env inválido

---

# 1️⃣3️⃣ Escalabilidade

## Horizontal

- API stateless
- Sessão segura
- Preparado para Redis futuro

## Evolução futura

- Extração de módulos
- Sem refatoração estrutural

---

# ❌ Anti-Patterns

- ORM no domínio
- Zod dentro do domínio
- Controller com regra de negócio
- Retornar payload cru
- Mensagens em inglês
- Módulos acoplados
- process.env espalhado

---

# ✅ Resumo Executivo

- Prisma como ORM oficial
- BetterAuth como autenticação única
- Zod obrigatório para validação
- Contrato HTTP padronizado
- Todas mensagens em português
- Clean Architecture por módulo
- Modular Monolith
- Arquitetura pronta para escalar