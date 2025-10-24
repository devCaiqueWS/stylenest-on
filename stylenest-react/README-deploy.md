# Deploy no Netlify — passo a passo (PT-BR)

Este documento descreve os passos mínimos para que o projeto seja publicado no Netlify com as Netlify Functions de pagamento (Stripe).

Pré-requisitos
- Repositório Git hospedado (GitHub/GitLab/Bitbucket) contendo este projeto.
- Conta no Netlify conectada ao repositório.

1) Ajustes obrigatórios antes do deploy
- Verifique que `.env` NÃO está com chaves no repositório. Use apenas `.env.example` como referência.
- Confirme que os arquivos `netlify.toml` e a pasta `netlify/functions/` estão no repositório (já adicionados).

2) Variáveis de ambiente no painel Netlify
Vá em Site settings → Build & deploy → Environment → Environment variables e adicione (exemplo para testes):

- `STRIPE_SECRET_KEY` = sk_test_xxx
- `VITE_STRIPE_PUBLISHABLE_KEY` = pk_test_xxx
- (opcional) `VITE_PAYMENT_SERVER_URL` = https://<seu-site>.netlify.app/.netlify/functions

Observações:
- `STRIPE_SECRET_KEY` é um segredo do servidor — não deve ser commitado.
- `VITE_` prefix é necessário para variáveis acessíveis no frontend (Vite).

3) Configuração de build no Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions` (já configurado em `netlify.toml`).

4) SPA redirects
Já existe `netlify.toml` com uma regra de redirect `/* -> /index.html 200` que permite rotas do React funcionarem diretamente.

5) Teste pós-deploy
- Após deploy bem-sucedido, abra `https://<seu-site>.netlify.app` e teste as rotas:
  - `/` (home)
  - `/homem`, `/mulher`, `/kids`
  - `/pagamento` (teste o fluxo de pagamento)

6) Logs e Debug
- Se o deploy falhar ou as functions apresentarem erro: vá em Deploys → selecione o deploy → veja logs de build.
- Para funções: Netlify → Functions → selecione a function → visualize logs e invocações.

7) Passo opcional (webhook)
- Para reconciliar pagamentos com segurança, configure um webhook da Stripe apontando para uma function dedicada (recomendo implementar `netlify/functions/stripe-webhook.js`).

Se quiser, eu posso criar a function de webhook e uma página de confirmação/recibo automaticamente.
