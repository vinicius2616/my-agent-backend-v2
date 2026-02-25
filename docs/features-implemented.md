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

---

## 🧾 Registro de Implementação

- Data: 24-02-2025
- Issue (Linear): MYA-30 — [BACK][FIN-01] Estrutura do módulo finances e modelagem Prisma (finances.transactions)
- Módulos afetados: finances

### 🎯 O que foi implementado

- Estrutura de pastas do módulo `finances` (domain, application, infra) conforme Clean Architecture, com pastas vazias exportando via `index.ts` (entities, value-objects, rules, repositories, use-cases, dto, schemas, database, http, mappers).
- Model `Transaction` no schema Prisma `finances` com: id (UUID), user_id (UUID), description (VARCHAR 255), amount (DECIMAL 12,2), type (enum ENTRADA/SAIDA), category (enum), is_recurring (BOOLEAN), installment_number e total_installments (INT nullable), created_at, updated_at, deleted_at (nullable, soft delete).
- Enums `TransactionType` (ENTRADA, SAIDA) e `TransactionCategory` (alimentacao, transporte, saude, educacao, lazer, outros) no schema `finances`.
- Índice em `user_id` e FK para `users.users` (ownership e integridade).
- Migration versionada `20260225000000_add_finances_transactions` criando schema finances, enums e tabela transactions.

### 🧠 Decisões técnicas

- Pastas vazias com `index.ts` para manter a árvore oficial do módulo sem contratos (escopo fora em MYA-30: contratos de domínio, use cases e rotas em issues futuras).
- Soft delete apenas com coluna `deleted_at`; sem regra de negócio na infra (queries filtram em use cases futuros).
- Enums definidos na infra (Prisma) no schema `finances`; valores de categoria mínimos, refináveis em FIN-02.
- Ownership obrigatório: índice em `user_id` e relação com User para filtro por usuário em todas as queries futuras.

### 📐 Impacto arquitetural

- Novo módulo `finances` em `src/modules/finances/` seguindo o padrão do auth; domínio vazio, sem Prisma/Zod/HTTP.
- Persistência `finances.transactions` definida na infra (Prisma); schema e migration prontos para repositórios e use cases em MYA-31/MYA-34.

### 🔗 Referências

- Linear: MYA-30
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 24-02-2025
- Issue (Linear): MYA-31 — [BACK][FIN-02] Contratos de domínio do módulo finances (entidades, value objects, enums, repositório)
- Módulos afetados: finances

### 🎯 O que foi implementado

- Enums no domínio: `TransactionType` (`entrada` | `saida`) e `TransactionCategory` (alimentacao, moradia, transporte, lazer, saude, educacao, salario, investimentos, outros) em `domain/value-objects/`, com constantes `ALLOWED_TRANSACTION_TYPES` e `ALLOWED_TRANSACTION_CATEGORIES` para reuso em Zod.
- Value Objects: `Description` (obrigatório, máx. 255 caracteres) e `Amount` (número válido, 2 casas decimais, limite absoluto alinhado a DECIMAL 12,2); `TransactionType` e `TransactionCategory` como VOs que validam contra os enums (mensagens em português).
- Entidade `Transaction` em `domain/entities/` com id, userId, description, amount, type, category, isRecurring, installmentNumber, totalInstallments, createdAt, updatedAt, deletedAt; sem Prisma/Zod/HTTP.
- Interface `ITransactionRepository` em `domain/repositories/` com métodos create, update, findById, delete (soft); tipos `TransactionRecord`, `CreateTransactionData` e `UpdateTransactionData` para persistência sem Prisma.
- Exportações atualizadas em `domain/entities`, `domain/value-objects`, `domain/repositories` e no `index.ts` do módulo finances.

### 🧠 Decisões técnicas

- Tipo e categoria no domínio em minúsculo (`entrada`/`saida`); Prisma mantém ENTRADA/SAIDA na infra — mapper na MYA-34 fará a conversão.
- Category no domínio com lista completa (inclui moradia, salario, investimentos); enum Prisma não foi alterado nesta issue; mapper futuro poderá mapear categorias não existentes no banco para `outros` ou migration separada.
- Value Objects com validação no construtor e mensagens em português; Amount permite positivo e negativo (regras de sinal por tipo ficam em MYA-32).
- Repositório com ownership em todos os métodos (userId como primeiro parâmetro); delete contratado como soft delete sem expor detalhe de implementação.

### 📐 Impacto arquitetural

- Domínio do módulo finances passa a ter entidade, value objects, enums e contrato de repositório utilizáveis pelos use cases e pela infra em MYA-32/MYA-33/MYA-34.
- Nenhuma alteração em Prisma, Zod, rotas ou use cases; domínio permanece 100% puro.

### 🔗 Referências

- Linear: MYA-31
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 24-02-2025
- Issue (Linear): MYA-32 — [BACK][FIN-03] Regras de domínio para transações (parcelamento, recorrência, valor, descrição, ownership, update)
- Módulos afetados: finances

### 🎯 O que foi implementado

- Value Object `Description` ajustado para exigir entre 3 e 255 caracteres (mensagem em português).
- Rules puras em `domain/rules/`: `isInstallmentRecurringExclusive` (parcelado não pode ser recorrente), `isAmountGreaterThanZero` (valor maior que zero), `isDescriptionValid` (descrição 3–255 caracteres), `transactionBelongsToUser` (ownership), `canChangeTotalInstallments` (não alterar total_installments após criação), `canSetRecurring` (não transformar parcelado em recorrente). Todas retornam boolean; recebem dados já carregados, sem acesso a repositório ou HTTP.
- Exportações em `domain/rules/index.ts` e no `index.ts` do módulo finances.

### 🧠 Decisões técnicas

- Rules como funções puras sem side-effects; mensagens de erro ao usuário ficam nos use cases que invocam as rules.
- Descrição válida: regra `isDescriptionValid` alinhada ao VO `Description` (mesmos limites 3–255) para uso em decisões booleanas sem instanciar o VO.
- Regras de update (`canChangeTotalInstallments`, `canSetRecurring`) recebem estado existente e valor novo; use case carrega a transação e passa os dados para a rule.

### 📐 Impacto arquitetural

- Domínio finances passa a ter rules utilizáveis pelos use cases de create/update em MYA-33/MYA-34. Nenhuma alteração em Prisma, Zod, rotas ou repositório; domínio permanece puro.

### 🔗 Referências

- Linear: MYA-32
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 24-02-2025
- Issue (Linear): MYA-33 — [BACK][FIN-04] Schemas Zod e DTOs para transações (create/update e respostas)
- Módulos afetados: finances

### 🎯 O que foi implementado

- Schema Zod `createTransactionSchema` em `application/schemas/create-transaction.schema.ts`: validação de description (3–255 caracteres), amount (número, 2 decimais, limite absoluto 9_999_999_999.99), type, category (enums do domínio), isRecurring, installmentNumber e totalInstallments opcionais; mensagens em português.
- Schema Zod `updateTransactionSchema` em `application/schemas/update-transaction.schema.ts`: mesmos campos todos opcionais, com as mesmas regras de formato quando presentes.
- Reuso de `ALLOWED_TRANSACTION_TYPES` e `ALLOWED_TRANSACTION_CATEGORIES` do domínio nos schemas, sem duplicar listas.
- DTOs em `application/dto/`: `CreateTransactionInput`, `UpdateTransactionInput` (alinhados a CreateTransactionData/UpdateTransactionData do repositório), `TransactionOutput` (id, userId, description, amount, type, category, isRecurring, installmentNumber, totalInstallments, createdAt, updatedAt; sem deletedAt).
- Exportações em `application/schemas/index.ts`, `application/dto/index.ts` e no `index.ts` do módulo finances.

### 🧠 Decisões técnicas

- Zod apenas validação estrutural; regras de negócio (parcelado não recorrente, valor > 0, etc.) permanecem nas Rules do domínio (MYA-32).
- Limites de description (3–255) e amount espelhados do domínio no Zod para falha rápida na request; domínio continua como fonte de verdade nas Rules/VOs.
- TransactionOutput não expõe deletedAt na resposta HTTP; contrato público limpo para o cliente.

### 📐 Impacto arquitetural

- Camada de aplicação do módulo finances passa a ter schemas Zod e DTOs prontos para uso por controllers e use cases em MYA-34; nenhuma alteração em domínio, infra ou rotas.

### 🔗 Referências

- Linear: MYA-33
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 24-02-2025
- Issue (Linear): MYA-34 — [BACK][FIN-05] Implementação do repositório de transações (Prisma + mappers)
- Módulos afetados: finances

### 🎯 O que foi implementado

- Classe `PrismaTransactionRepository` em `finances/infra/database` implementando `ITransactionRepository` com métodos create, update, findById(userId, id) e delete (soft delete).
- Mappers em `finances/infra/mappers/transaction-mapper.ts`: `toTransactionRecord` (Prisma → domínio), `toPrismaCreateData` e `toPrismaUpdateData` (domínio → Prisma); conversão de type (ENTRADA/SAIDA ↔ entrada/saida), categoria (moradia, salario, investimentos → outros na persistência), amount (Decimal ↔ number).
- Todas as queries filtradas por `userId`; findById e update excluem registros com `deleted_at` preenchido; delete atualiza `deleted_at` em vez de remover o registro.
- Exportações em `finances/infra/database/index.ts` e `finances/infra/mappers/index.ts`.

### 🧠 Decisões técnicas

- Tipo Prisma (ENTRADA/SAIDA) mapeado para domínio em minúsculo (entrada/saida); categorias do domínio não presentes no enum Prisma (moradia, salario, investimentos) persistidas como `outros` sem migration.
- Amount: conversão Decimal → number via helper que suporta `.toNumber()` ou `Number()`; create/update passam number (Prisma aceita para Decimal).
- Interface `PrismaTransactionRow` no mapper para desacoplar do tipo gerado do Prisma; update com data vazia devolve findById existente em vez de chamar updateMany.

### 📐 Impacto arquitetural

- Infra do módulo finances passa a ter repositório e mappers prontos para injeção nos use cases (MYA-35 ou equivalente); domínio permanece sem Prisma; nenhuma alteração em use cases, controllers ou rotas.

### 🔗 Referências

- Linear: MYA-34
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 24-02-2025
- Issue (Linear): MYA-35 — [BACK][FIN-06] Use Case CreateTransaction (incluindo parcelamento)
- Módulos afetados: finances, auth

### 🎯 O que foi implementado

- Use case `CreateTransactionUseCase` em `finances/application/use-cases/create-transaction.use-case.ts`: orquestra criação de lançamento(s) com aplicação das Rules (`isDescriptionValid`, `isAmountGreaterThanZero`, `isInstallmentRecurringExclusive`), construção dos Value Objects `Description` e `Amount`, e persistência via `ITransactionRepository.create`. Em caso de `totalInstallments` > 1, cria N transações (mesmo valor, category, description, `installment_number` 1..N, `total_installments`, `isRecurring: false`); caso contrário uma transação com dados do input.
- DTO de saída `CreateTransactionOutput` em `application/dto/create-transaction.dto.ts` com `message` e `transactionIds`.
- Middleware `requireAuth` em `auth/infra/http/require-auth.middleware.ts`: resolve sessão a partir do cookie, valida token e expiração, obtém usuário e define `req.userId`; em falha chama `next(UnauthorizedError)`.
- Extensão do tipo Express `Request` em `src/types/express.d.ts` com `userId?: string`.
- Rota `POST /finances/transactions` em `finances/infra/http/finances-routes.ts`: body validado por `createTransactionSchema`, use case executado com `req.userId`, resposta 201 no contrato `successResponse(data)`.
- Montagem em `main.ts`: `app.use('/finances', requireAuth(authRepository), createFinancesRoutes())`.

### 🧠 Decisões técnicas

- Middleware de auth recebe `IAuthRepository` por parâmetro para desacoplamento; instância de `PrismaAuthRepository` criada em `main.ts` e reutilizada no middleware e nas rotas de finances.
- Parcelamento: `totalInstallments ?? 1`; quando > 1 todas as transações criadas com `isRecurring: false`; transação única usa `installmentNumber` e `totalInstallments` null quando não informados.
- Use case lança `ValidationError` com mensagens em português quando alguma Rule falha; Value Objects Description e Amount validados no use case para falha consistente no domínio.

### 📐 Impacto arquitetural

- Fluxo Controller → Zod → Use Case → Rules/Value Objects → Repository mantido; domínio permanece sem Prisma e sem HTTP.
- Módulo auth expõe `requireAuth` para uso por rotas que exigem ownership; finances não importa auth diretamente — o app monta o middleware em `main.ts`.
- Contrato HTTP padrão (success, data, error, meta) e mensagem de sucesso em português ("Lançamento criado com sucesso.").

### 🔗 Referências

- Linear: MYA-35
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 25-02-2025
- Issue (Linear): MYA-36 — [BACK][FIN-07] Use Case GetTransactionById
- Módulos afetados: finances

### 🎯 O que foi implementado

- Use case `GetTransactionByIdUseCase` em `finances/application/use-cases/get-transaction-by-id.use-case.ts`: recebe `userId` e `id`, chama `ITransactionRepository.findById(userId, id)`; se não encontrar lança `NotFoundError` ("Transação não encontrada."); se encontrar mapeia `TransactionRecord` para `TransactionOutput` (sem `deletedAt`) e retorna no envelope padrão.
- Interface `IGetTransactionByIdUseCase` com `execute(userId: string, id: string): Promise<TransactionOutput>`.
- Exportações em `finances/application/use-cases/index.ts`.

### 🧠 Decisões técnicas

- Use case apenas orquestra: chama repositório e mapeia para DTO; ownership e exclusão de registros com `deleted_at` já garantidos pelo `findById` existente.
- 404 único para "não existe" e "não pertence ao usuário" para não vazar informação (segurança).
- Reuso de `TransactionOutput` e `NotFoundError`; nenhuma alteração em domínio, infra ou rotas.

### 📐 Impacto arquitetural

- Camada de aplicação do módulo finances ganha use case de leitura por id; fluxo Controller → Use Case → Repository mantido; rota HTTP fica para MYA-39.

### 🔗 Referências

- Linear: MYA-36
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 25-02-2025
- Issue (Linear): MYA-37 — [BACK][FIN-08] Use Case UpdateTransaction
- Módulos afetados: finances

### 🎯 O que foi implementado

- Use case `UpdateTransactionUseCase` em `finances/application/use-cases/update-transaction.use-case.ts`: recebe `userId`, `id` e payload validado por Zod; verifica ownership via `findById`; revalida regras de update (`canChangeTotalInstallments`, `canSetRecurring`, `isInstallmentRecurringExclusive` sobre estado resultante); valida campos presentes com Value Objects `Description` e `Amount` e rules `isDescriptionValid` e `isAmountGreaterThanZero`; atualiza via `ITransactionRepository.update`; retorna `UpdateTransactionOutput` (message + transaction) no contrato padrão.
- DTO `UpdateTransactionOutput` em `application/dto/update-transaction.dto.ts` com `message` e `transaction` (TransactionOutput).
- Rota `PATCH /finances/transactions/:id` em `finances/infra/http/finances-routes.ts`: body validado por `updateTransactionSchema`, use case executado com `req.userId` e `id` dos params, resposta 200 com `successResponse(data)`.
- Exportações em `application/use-cases/index.ts` e `application/dto/index.ts`.

### 🧠 Decisões técnicas

- Ownership e 404 únicos via `findById(userId, id)`; não alterar `total_installments` após criação e não transformar parcelado em recorrente garantidos pelas rules do domínio.
- Estado resultante (merge existing + input) usado para revalidar `canChangeTotalInstallments`, `canSetRecurring` e `isInstallmentRecurringExclusive`; payload enviado ao repositório contém apenas chaves presentes no input.
- Quando não há campos para atualizar, retorna transação existente mapeada para output sem chamar `update`; mensagens de erro em português via `ValidationError`.

### 📐 Impacto arquitetural

- Fluxo Controller → Zod → Use Case → Rules/Value Objects → Repository mantido; domínio permanece sem Prisma e sem HTTP; contrato HTTP padrão e mensagem de sucesso em português ("Lançamento atualizado com sucesso.").

### 🔗 Referências

- Linear: MYA-37
- Architect Agent: não se aplica

---

## 🧾 Registro de Implementação

- Data: 25-02-2025
- Issue (Linear): MYA-38 — [BACK][FIN-09] Use Case DeleteTransaction (soft delete)
- Módulos afetados: finances

### 🎯 O que foi implementado

- Use case `DeleteTransactionUseCase` em `finances/application/use-cases/delete-transaction.use-case.ts`: recebe `userId` e `id`; verifica ownership via `findById`; chama `ITransactionRepository.delete` (soft delete); retorna `DeleteTransactionOutput` com mensagem "Lançamento removido com sucesso." no contrato padrão.
- DTO `DeleteTransactionOutput` em `application/dto/delete-transaction.dto.ts` com `message: string`.
- Schema Zod `deleteTransactionParamsSchema` em `application/schemas/delete-transaction.schema.ts` para validação de params (id como UUID).
- Rota `DELETE /finances/transactions/:id` em `finances/infra/http/finances-routes.ts`: params validados por `deleteTransactionParamsSchema`, use case executado com `req.userId` e `id`, resposta 200 com `successResponse(data)`.
- Exportações em `application/use-cases/index.ts`, `application/dto/index.ts` e `application/schemas/index.ts`.

### 🧠 Decisões técnicas

- Ownership e 404 únicos via `findById(userId, id)` antes de `delete`, mesmo padrão de Get e Update; 404 único para "não existe" ou "não pertence ao usuário".
- Zod em params (id como UUID) para manter "Zod em toda request"; mensagens em português ("Transação não encontrada.", "Lançamento removido com sucesso.").

### 📐 Impacto arquitetural

- Fluxo Controller → Zod → Use Case → Repository mantido; domínio permanece sem Prisma e sem HTTP; contrato HTTP padrão; repositório já implementava soft delete em MYA-34.

### 🔗 Referências

- Linear: MYA-38
- Architect Agent: não se aplica
