# Loja de Vendas API

## Descrição
Este projeto é uma API para gerenciar uma loja de vendas, incluindo clientes, produtos, vendedores, pedidos e itens de pedido. Foi desenvolvido utilizando Node.js, Express.js e Sequelize, com PostgreSQL como banco de dados.

## Estrutura do Projeto
```
/seu_projeto_api
|-- /public
|   |-- index.html
|   |-- /css
|   |   |-- style.css
|   |-- /js
|       |-- script.js
|-- /src
|   |-- /config
|   |   |-- db.config.js
|   |-- /controllers
|   |   |-- cliente.controller.js
|   |   |-- produto.controller.js
|   |   |-- vendedor.controller.js
|   |   |-- pedido.controller.js
|   |   |-- itemPedido.controller.js
|   |-- /middlewares
|   |-- /models
|   |   |-- cliente.model.js
|   |   |-- produto.model.js
|   |   |-- vendedor.model.js
|   |   |-- pedido.model.js
|   |   |-- itemPedido.model.js
|   |   |-- index.js
|   |-- /routes
|   |   |-- cliente.routes.js
|   |   |-- produto.routes.js
|   |   |-- vendedor.routes.js
|   |   |-- pedido.routes.js
|   |   |-- itemPedido.routes.js
|   |-- /utils
|   |-- app.js
|-- server.js
|-- package.json
|-- .env
|-- .gitignore
```

## Configuração

### Pré-requisitos
- Node.js instalado
- PostgreSQL configurado

### Instalação
1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com suas credenciais do banco de dados.

### Rodando o Projeto
1. Inicie o servidor:
   ```bash
   node server.js
   ```
2. Acesse a API em `http://localhost:8080/api`.

## Funcionalidades
- Gerenciamento de clientes
- Gerenciamento de produtos
- Gerenciamento de vendedores
- Gerenciamento de pedidos
- Gerenciamento de itens de pedido

## Estrutura de Rotas
- `/api/clientes`
- `/api/produtos`
- `/api/vendedores`
- `/api/pedidos`
- `/api/itens-pedido`

## Licença
Este projeto está licenciado sob a licença MIT.
