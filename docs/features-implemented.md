## 🧾 Registro de Implementação

- Data: 19-02-2025
- Issue (Linear): MYA-19 — [BACK][AUTH-01] Estrutura base do módulo auth e contratos internos
- Módulos afetados: auth

### 🎯 O que foi implementado
- Estrutura de pastas do módulo `auth` (domain, application, infra) conforme Clean Architecture.
- Contratos no domínio: interface `IAuthRepository` e tipos `AuthUserRecord`, `AuthSessionRecord` em `domain/repositories/`.
- Contratos de serviços: `IAuthSessionService` e `IAuthProviderService` em `domain/services/` (sem implementação).
- Interfaces dos use cases: `IRegisterUseCase`, `ILoginUseCase`, `ISocialAuthUseCase`, `IGetSessionUseCase`, `ILogoutUseCase` em `application/use-cases/`.
- DTOs de entrada/saída em `application/dto/` (Register, Login, SocialAuth, Session, Logout).
- Schemas Zod iniciais em `application/schemas/` com mensagens em português (apenas validação estrutural, sem regras de domínio).
- `index.ts` do módulo exportando contratos, DTOs e schemas (sem infra).

### 🧠 Decisões técnicas
- Serviços de auth como interfaces no domínio (`domain/services/`) para a infra (BetterAuth) implementar depois — mantém domínio puro e desacoplado.
- DTOs de application separados dos tipos do domínio (ex.: `SocialAuthInput` na application vs `SocialAuthResult` no provider service) para evitar acoplamento da camada de aplicação ao domínio de infra.
- Pastas vazias (entities, value-objects, rules, infra/database, infra/http, infra/mappers) com `index.ts` exportando vazio para manter a árvore oficial e evitar arquivos de documentação extras.

### 📐 Impacto arquitetural
- Primeiro módulo de domínio em `src/modules/`; estabelece o padrão para os demais (auth, users, dashboard, etc.).
- Módulo auth isolado: sem import de outros módulos; domínio sem Prisma, Zod ou HTTP.
- Infra do auth permanece vazia; implementação de repositórios, rotas e BetterAuth fica para issues futuras.

### 🔗 Referências
- Linear: MYA-19
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 19-02-2025
- Issue (Linear): MYA-20 — [BACK][AUTH-02] Modelagem de persistência Auth/Users (Prisma + schemas)
- Módulos afetados: auth (persistência), users (model User)

### 🎯 O que foi implementado
- Modelagem de persistência Auth/Users no `schema.prisma`: schema `users` com model `User` (id, email, name, emailVerified, image, created_at, updated_at) e relations para Session e Account; schema `auth` com models `Session` (id, user_id, token, expires_at, ip_address, user_agent, created_at, updated_at), `Account` (id, user_id, provider_id, account_id, password, tokens e datas opcionais, created_at, updated_at) e `Verification` (id, identifier, value, expires_at, created_at, updated_at).
- Uso explícito de schemas `users.*` e `auth.*`; campos globais (id, user_id onde aplicável, created_at, updated_at); constraint de unicidade em email (User) e em (providerId, accountId) (Account); unicidade em token (Session).
- Migration versionada `20260219000000_add_auth_users_persistence` criando schemas auth e users e tabelas correspondentes; índices em `user_id` em sessions e accounts para consultas por ownership e lookup por token/credencial social.

### 🧠 Decisões técnicas
- User sem coluna `user_id` (entidade raiz; ownership não se aplica) conforme database-infrastructure-architecture.
- Session e Account com `user_id` e índices em `user_id` para garantir que toda query futura filtre por ownership.
- Estrutura de campos (Session, Account, Verification) alinhada ao adapter Prisma do Better Auth para implementação futura da infra sem quebra de schema.
- Colunas mapeadas para snake_case no banco (@map) para convenção do projeto.

### 📐 Impacto arquitetural
- Persistência Auth/Users definida na infra (Prisma); domínio do auth permanece sem Prisma. Nenhuma alteração em use cases, controllers ou endpoints.
- Base pronta para implementação de repositórios Prisma em `auth/infra/database` e integração Better Auth em issue futura.

### 🔗 Referências
- Linear: MYA-20
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 24-02-2025
- Issue (Linear): MYA-21 — [BACK][AUTH-03] Regras de domínio para email único e vinculação social
- Módulos afetados: auth

### 🎯 O que foi implementado
- Value Objects no domínio auth: `Email` (formato válido, mensagens em português) e `AuthProvider` (provedores permitidos: `google`) em `domain/value-objects/`.
- Contrato de repositório estendido: tipo `AuthAccountRecord` e método `findAccountByUserIdAndProvider(userId, providerId)` em `IAuthRepository` para suportar decisão de vinculação de provider.
- Rules puras em `domain/rules/`: `socialAuthDecision` (retorna `'link' | 'create' | 'login'` a partir de `userExists` e `alreadyHasProvider`) e `emailUniqueForRegistration` (retorna se o email pode ser usado no registro).
- Schema Zod de social-auth alinhado ao domínio: `provider` validado com `z.enum(ALLOWED_AUTH_PROVIDERS)` e mensagem em português.

### 🧠 Decisões técnicas
- Email como VO apenas valida formato; unicidade fica a cargo da rule + repositório (domínio não acessa banco).
- AuthProvider com constante `ALLOWED_AUTH_PROVIDERS` exportada para reuso no Zod (application) sem duplicar lista de provedores.
- Rules recebem dados já carregados pelo use case (não acessam repositório), mantendo pureza do domínio.
- `AuthAccountRecord` mínimo (id, userId, providerId, accountId) suficiente para decisões de regra; implementação Prisma do novo método fica na infra em issue futura.

### 📐 Impacto arquitetural
- Domínio auth passa a ter value objects e rules utilizáveis pelos use cases de registro e social auth; nenhuma alteração em HTTP ou BetterAuth.
- Contrato `IAuthRepository` ganha método novo; implementações em infra precisarão implementar `findAccountByUserIdAndProvider`.

### 🔗 Referências
- Linear: MYA-21
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 24-02-2025
- Issue (Linear): MYA-22 — [BACK][AUTH-04] Fluxos HTTP de cadastro e login por email/senha
- Módulos afetados: auth

### 🎯 O que foi implementado
- Endpoints `POST /auth/register` e `POST /auth/login` com body validado por Zod (schemas existentes de register e login) e respostas no contrato `{ success, data, error, meta }`.
- Implementação dos use cases `RegisterUseCase` e `LoginUseCase`: orquestração com Value Object `Email`, rule `emailUniqueForRegistration` no registro, e chamada a `IAuthProviderService.signUpEmail` / `signInEmail`.
- Contrato de domínio estendido em `IAuthProviderService` com `SignUpEmailInput`, `SignInEmailInput`, `EmailAuthResult`, `signUpEmail` e `signInEmail`; DTO `LoginOutput` ajustado para `{ userId, email, name }`.
- Infra: Better Auth configurado em `auth/infra/auth/better-auth.ts` (emailAndPassword, Prisma adapter PostgreSQL); `BetterAuthProviderService` implementando o provider com `auth.api.signUpEmail` / `signInEmail`, repassando cookies de sessão para a resposta HTTP; `PrismaAuthRepository` com `findUserByEmail` em `users.User`; rotas em `auth/infra/http/auth-routes.ts` e montagem em `main.ts` em `/auth`.
- Helper `parseZod` em `shared/http/zod-parse.ts` para falha de validação em `ValidationError` com details em português; `asyncHandler` para repasse de erros assíncronos ao error handler; `ConflictError` (409) para email já cadastrado.

### 🧠 Decisões técnicas
- Provider de auth instanciado por request (`BetterAuthProviderService(req, res)`) para que `signInEmail`/`signUpEmail` recebam headers e possam setar cookie de sessão na resposta via `returnHeaders: true`.
- Erros do Better Auth em sign up mapeados para `ConflictError` quando mensagem indica email já existente; login retorna `null` em credenciais inválidas e use case lança `UnauthorizedError`.
- Repositório Prisma implementa apenas `findUserByEmail`; demais métodos da interface deixados como stub para issues futuras (sessão, social).

### 📐 Impacto arquitetural
- Fluxo Controller → Zod → Use Case → Value Objects/Rules → Repository/Provider → resposta no contrato padrão mantido; domínio permanece sem Prisma e sem HTTP.
- Variáveis de ambiente `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL` (opcional) adicionadas ao schema de env; shared/http ganha `zod-parse` e `async-handler` reutilizáveis.

### 🔗 Referências
- Linear: MYA-22
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 24-02-2025
- Issue (Linear): MYA-23 — [BACK][AUTH-05] Fluxo HTTP de login social (Google) com vinculação
- Módulos afetados: auth

### 🎯 O que foi implementado
- Endpoint `POST /auth/social` com body validado por Zod (provider, providerAccountId, email, name) e resposta no contrato `{ success, data: { userId, provider }, error, meta }`.
- DTOs e schema de social-auth ajustados ao contrato da issue: `SocialAuthInput` com provider, providerAccountId, email, name; `SocialAuthOutput` com userId e provider.
- Use case `SocialAuthUseCase` implementado: orquestração com Value Objects `Email` e `AuthProvider`, rule `socialAuthDecision`, e repositório para decisão link (vincular provider à conta existente), create (criar usuário e vincular provider) ou login (conta já vinculada).
- Contrato `IAuthRepository` estendido com `findAccountByProviderIdAndAccountId`, `createUser` e `createAccount`; `PrismaAuthRepository` com implementação dos quatro métodos (incluindo `findAccountByUserIdAndProvider`). Mapper `toAuthAccountRecord` em `infra/mappers/account-mapper.ts`.
- Tratamento de conflito (email já cadastrado em create) via `ConflictError`; comportamento idempotente quando provider+accountId já vinculado (retorno de userId e provider sem erro).

### 🧠 Decisões técnicas
- Fluxo social sem uso de `IAuthProviderService` neste endpoint; dados recebidos do frontend e persistidos via repositório; integração OAuth Better Auth fica para issue futura.
- Verificação de conta existente por `findAccountByProviderIdAndAccountId` no início do use case para retorno idempotente; rechecagem antes de createUser/createAccount para evitar race e manter uso de `ConflictError` sem depender de exceção do Prisma no domínio.
- Provider restrito ao enum de domínio (google); schema Zod reutiliza `ALLOWED_AUTH_PROVIDERS`; sem criação de sessão/cookie em `/auth/social` (escopo MYA-24).

### 📐 Impacto arquitetural
- Fluxo Controller → Zod → Use Case → Value Objects/Rules → Repository mantido; domínio permanece sem Prisma e sem HTTP.
- Nenhuma migration nova; tabelas `users` e `auth.accounts` já existentes (MYA-20) suficientes para o fluxo.

### 🔗 Referências
- Linear: MYA-23
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 24-02-2025
- Issue (Linear): MYA-24 — [BACK][AUTH-06] Sessão autenticada e logout (HTTP Only)
- Módulos afetados: auth

### 🎯 O que foi implementado
- Endpoints `GET /auth/session` e `POST /auth/logout` com sessão via cookie HTTP Only e respostas no contrato `{ success, data, error, meta }`: GET retorna `data: { userId, email, name }` ou `data: null` quando não há sessão; POST retorna `data: null`.
- DTOs ajustados: `SessionOutput` com `{ userId, email, name }`; `GetSessionInput` e `LogoutInput` com `sessionToken: string | null`; `LogoutOutput` tipado como `null`.
- Implementação dos use cases `GetSessionUseCase` e `LogoutUseCase`: GetSession usa `IAuthRepository.findSessionByToken` e `findUserById`; Logout chama `IAuthSessionService.invalidateSession`. Contrato `IAuthRepository` estendido com `findUserById`.
- Infra: `PrismaAuthRepository` com `findSessionByToken`, `deleteSessionByToken` e `findUserById`; mapper `toAuthSessionRecord` em `infra/mappers/session-mapper.ts`; `BetterAuthSessionService` implementando `IAuthSessionService.invalidateSession` via `auth.api.signOut` com repasse de headers Set-Cookie para limpar o cookie; helper `getSessionTokenFromRequest` em `infra/http/get-session-token.ts` para extrair token do cookie `better-auth.session_token`. Schemas Zod de session e logout com body vazio (`z.object({}).strict()`).

### 🧠 Decisões técnicas
- Token de sessão obtido do cookie na request (controller extrai e passa ao use case); sem body em GET/POST para esses endpoints, validação Zod com schema vazio para manter “Zod em toda request”.
- GET session usa apenas repositório (findSessionByToken + findUserById); logout usa apenas `IAuthSessionService.invalidateSession` (Better Auth signOut limpa sessão e cookie).
- Nome do cookie alinhado ao padrão Better Auth (`better-auth.session_token`); parse manual do header Cookie sem dependência extra.

### 📐 Impacto arquitetural
- Fluxo Controller → Zod → Use Case → Repository/SessionService mantido; domínio permanece sem Prisma e sem HTTP.
- Nova implementação de `IAuthSessionService` na infra (`BetterAuthSessionService`) para logout; repositório passa a expor `findUserById` para uso no GetSessionUseCase.

### 🔗 Referências
- Linear: MYA-24
- Architect Agent: não se aplica
