# Collections para Apidog

Collection gerada para **MYA-25**, contendo todos os endpoints do backend My Agent criados até o momento (health + auth), com body e response completo.

## Arquivo

- **my-agent-backend.openapi.json** — OpenAPI 3.0 com os 6 endpoints:
  - `GET /health` — Health check
  - `POST /auth/register` — Registro (email/senha)
  - `POST /auth/login` — Login (email/senha)
  - `POST /auth/social` — Login/vinculação social (Google)
  - `GET /auth/session` — Sessão atual (cookie)
  - `POST /auth/logout` — Logout (cookie)

## Como importar no Apidog

1. Abra o Apidog.
2. Vá em **Importar** (ou equivalente para importação de coleção).
3. Selecione o arquivo **my-agent-backend.openapi.json** desta pasta (`docs/collections`).
4. Confirme a importação e ajuste a URL base do servidor se necessário (padrão: `http://localhost:3000`).
5. Use a collection para executar e validar os testes dos endpoints.

## Sessão (cookie)

Os endpoints `GET /auth/session` e `POST /auth/logout` usam o cookie HTTP Only `better-auth.session_token`. Após um login bem-sucedido em `POST /auth/login`, o Apidog pode reutilizar os cookies da resposta nas requisições seguintes, se estiver configurado para enviar cookies automaticamente.
