# API de Redirecionamento de Links - EstudaMais.tech v1.0.0

Um microsserviço interno, construído em Node.js e TypeScript, para gerenciar e
rastrear cliques em links externos da plataforma EstudaMais.tech.

## Sobre o Projeto

O objetivo deste serviço é centralizar todos os links de saída da plataforma,
permitindo a coleta de métricas de engajamento de forma segura e privada. Toda
vez que um usuário clica em um link externo, ele é direcionado para esta API,
que registra o evento e então o redireciona para o destino final.

Isso nos permite gerar relatórios sobre quais parceiros e ferramentas são mais
acessados, demonstrar nosso poder de distribuição para futuras parcerias e
organizar o tráfego externo da plataforma.

## Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript.
- **[Express.js](https://expressjs.com/)**: Framework para a construção do
  servidor web.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que
  adiciona tipagem estática.
- **[Dotenv](https://github.com/motdotla/dotenv)**: Para gerenciamento de
  variáveis de ambiente.
- **[ts-node](https://github.com/TypeStrong/ts-node)**: Para executar o código
  TypeScript diretamente em desenvolvimento.
- **[Nodemon](https://nodemon.io/)**: Para reiniciar o servidor automaticamente
  durante o desenvolvimento.

---

## Estrutura do Projeto

```
/redirecionador-links
|
|-- /dist/                     # Código JavaScript compilado (para produção)
|-- /src/
|   |-- /db/
|   |   |-- /supabase/
|   |   |   |-- admin-client.ts
|   |   |   |-- supabase-client.ts
|   |-- /repo/
|   |   |-- links/
|   |   |   |-- supabase-user-repo.ts  # Lógica para ler o banco de dados
|   |-- /services/
|   |   |-- destinationService.ts  # Lógica para obter a URL de um destino
|   |   |-- loggingService.ts      # Lógica para registrar os cliques
|   |-- /utils/
|   |   |-- hash.ts                # Função para criar o hash do IP
|   |-- main.ts                    # Ponto de entrada da aplicação (servidor Express)
|
|-- .env                       # Arquivo com variáveis de ambiente (local)
|-- .env.example               # Exemplo de arquivo .env
|-- package.json
|-- tsconfig.json
|-- README.md
```

---

## Como Começar

Com o Docker, o processo de configuração do ambiente é simplificado para um
único comando.

### Pré-requisitos

- **[Docker](https://www.docker.com/products/docker-desktop/)**
- **[Docker Compose](https://docs.docker.com/compose/install/)** (geralmente já
  vem com o Docker Desktop)

### Configuração do Projeto

Siga estes passos para configurar o ambiente de desenvolvimento após clonar o
projeto.

1.  **Instale as Dependências do Projeto** Navegue até a raiz do projeto no seu
    terminal e execute o comando para instalar todos os pacotes necessários.

    ```bash
    npm install
    ```

2.  **Crie seu Projeto na Supabase**

    - Vá para [supabase.com](https://supabase.com) e crie uma nova organização e
      um novo projeto.
    - Guarde bem a **senha do seu banco de dados**, pois ela será necessária.

3.  **Configure o Schema do Banco de Dados**

    - No painel do seu projeto Supabase, encontre o **SQL Editor**.
    - Execute os scripts SQL necessários para criar as tabelas `links` e
      `clicks`, incluindo colunas, chaves primárias e chaves estrangeiras.

4.  **Configure as Políticas de Segurança (RLS)**

    - Para cada tabela criada (`links` e `clicks`), vá até a seção
      **Authentication > Policies**.
    - Habilite o **Row Level Security (RLS)** e crie as políticas de acesso
      necessárias (por exemplo, permitir `SELECT` público na tabela `links` e
      bloquear todas as ações na tabela `clicks`).

5.  **Configure as Variáveis de Ambiente**

    - Crie um arquivo chamado `.env` na raiz do projeto. Você pode copiar o
      exemplo:
      ```bash
      cp .env.example .env
      ```
    - Vá para **Project Settings > API** no seu painel Supabase.
    - Copie os seguintes valores e cole-os no seu arquivo `.env`:
      - `SUPABASE_URL` (Project URL)
      - `SUPABASE_API` (a chave `anon` `public`)
      - `SUPABASE_SERVICE_KEY` (a chave `service_role` `secret`)
    - Defina também um valor secreto para o `IP_HASH_SALT`.

6.  **Sincronize os Tipos do TypeScript**

    - Para que seu código TypeScript conheça a estrutura do seu banco de dados,
      rode os seguintes comandos no terminal:

    ```bash
    # Faz o login na sua conta Supabase (só precisa na primeira vez)
    npx supabase login

    # Liga esta pasta local com seu projeto na nuvem (substitua <project-ref>)
    npx supabase link --project-ref <seu-project-ref>

    # Gera o arquivo de tipos
    npx supabase gen types typescript --linked > src/types/supabase.ts
    ```

7.  **Inicie o Ambiente Docker**
    - Com tudo configurado, inicie a aplicação com o Docker Compose:
    ```bash
    docker-compose up --build
    ```
    Sua API agora está rodando localmente e conectada ao seu banco de dados na
    Supabase.

## Uso

### Modo de Produção

Para um ambiente de produção, primeiro compile o código TypeScript para
JavaScript:

```bash
npm run build
```

Depois, inicie o servidor otimizado:

```bash
npm start
```

### Testando o Redirecionamento

Você pode testar acessando a URL diretamente no navegador ou usando uma
ferramenta como o `curl` no terminal.

- **Navegador:** `http://localhost:3000/go/ghsdp`
- **Terminal:**
  ```bash
  # O -v mostra os detalhes dos cabeçalhos, incluindo o redirecionamento 302
  curl -v http://localhost:3000/go/ghsdp
  ```

---

## Gerenciando Destinos

Para gerenciar os links, acesse o Table Editor no painel da sua aplicação na
Supabase e edite as linhas da tabela links diretamente.

- `name`: O identificador que será usado na URL (`/go/<name>`).
- `url`: O link final para onde o usuário será redirecionado.
- `description`: Apenas para documentação interna.
- `isActive`: `true` para o link funcionar, `false` para desativá-lo
  temporariamente.

---

## Análise de Métricas

Os dados de cliques são armazenados na tabela log_data. Para análises,
conecte-se ao seu banco de dados (usando a interface da Supabase ou um cliente
de banco de dados como DBeaver/TablePlus) e execute consultas SQL.

Exemplo: Para contar quantos IPs únicos foram redirecionados para ghsdp:

SQL

SELECT COUNT(DISTINCT ip_hash) FROM log_data JOIN links ON log_data.link_id =
links.id WHERE links.link_name = 'ghsdp';
