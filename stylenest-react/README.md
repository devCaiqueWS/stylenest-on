# StyleNest React

Frontend React reescrito a partir das páginas estáticas originais do projeto StyleNest.

## Tecnologias

- React 18
- Vite 5
- React Router DOM

## Scripts

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build para produção
npm run preview  # pré-visualização do build
```

## Configurações

- O backend é consumido em `https://stylenest-mi9i.onrender.com/api`.
- Produtos e categorias foram mapeados a partir do conteúdo estático existente.
- Login/Cadastro utilizam os mesmos endpoints (`/api/usuarios`).

## Estrutura

- `src/data` – catálogo de produtos e categorias.
- `src/contexts` – contexto de autenticação e carrinho.
- `src/components` – componentes reutilizáveis (header, footer, modais, etc.).
- `src/pages` – páginas e rotas (Home, categorias, checkout, institucionais).

Para publicar em outro repositório (_ex_: `devCaiqueWS/stylenest-on`), basta copiar a pasta `stylenest-react`, subir para o novo repo e ajustar as configurações de deploy (Netlify/Vercel).
