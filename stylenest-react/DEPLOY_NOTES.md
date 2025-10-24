# Notas rápidas de deploy

- Build local: `npm run build` — gera `dist/`.
- Preview local do build: `npm run preview` (abre `dist/` em um servidor local).
- Netlify: certifique-se de que o repositório conectado contém `netlify.toml` e a pasta `netlify/functions/`.
- Variáveis de ambiente importantes a configurar em Netlify:
  - `STRIPE_SECRET_KEY` (seu sk_test ou chave ao vivo)
  - `VITE_STRIPE_PUBLISHABLE_KEY` (pk_test...)
  - `VITE_PAYMENT_SERVER_URL` (opcional — por padrão o frontend usa `/.netlify/functions`).

Se o deploy apresentar erro, abra Deploys → selecione deploy → veja logs para diagnosticar.
