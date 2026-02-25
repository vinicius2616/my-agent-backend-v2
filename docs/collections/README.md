# Collections para Apidog

Collections OpenAPI do backend My Agent para importação no Apidog. Existem duas versões da collection, versionadas para não sobrescrever a já funcional.

## Versões

| Arquivo | Versão | Conteúdo |
|---------|--------|----------|
| **my-agent-backend.openapi.json** | v1 (1.0.0) | Health + Auth — 6 endpoints (MYA-25) |
| **my-agent-backend.openapi.v2.json** | v2 (1.1.0) | Health + Auth + Finances — 10 endpoints (MYA-25 + MYA-39) |

### v1 — my-agent-backend.openapi.json

- `GET /health` — Health check
- `POST /auth/register` — Registro (email/senha)
- `POST /auth/login` — Login (email/senha)
- `POST /auth/social` — Login/vinculação social (Google)
- `GET /auth/session` — Sessão atual (cookie)
- `POST /auth/logout` — Logout (cookie)

### v2 — my-agent-backend.openapi.v2.json

Inclui todos os endpoints da v1 e ainda:

- `POST /finances/transactions` — Criar transação
- `GET /finances/transactions/:id` — Buscar transação por ID
- `PATCH /finances/transactions/:id` — Atualizar transação
- `DELETE /finances/transactions/:id` — Excluir transação

**Recomendação:** use a **v2** (`my-agent-backend.openapi.v2.json`) para ter todos os endpoints atuais. Use a v1 apenas se quiser somente health e auth.

## Como importar no Apidog

1. Abra o Apidog.
2. Vá em **Importar** (ou equivalente para importação de coleção).
3. Selecione o arquivo desejado desta pasta (`docs/collections`):
   - **my-agent-backend.openapi.v2.json** — para todos os endpoints (recomendado)
   - **my-agent-backend.openapi.json** — apenas health e auth
4. Confirme a importação e ajuste a URL base do servidor se necessário (padrão: `http://localhost:3000`).
5. Use a collection para executar e validar os testes dos endpoints.

## Sessão (cookie)

Os endpoints `GET /auth/session`, `POST /auth/logout` e **todos os endpoints de `/finances`** usam o cookie HTTP Only `better-auth.session_token`. Após um login bem-sucedido em `POST /auth/login`, o Apidog pode reutilizar os cookies da resposta nas requisições seguintes, se estiver configurado para enviar cookies automaticamente. Para testar as rotas de finanças, é necessário estar autenticado (enviar o cookie de sessão).
