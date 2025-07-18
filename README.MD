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
|   |   |-- /seed/
|   |   |   |-- destinations.json  # Arquivo com os links de destino
|   |-- /models/
|   |   |-- Destination.ts       # Modelo de dados para os destinos
|   |-- /repo/
|   |   |-- links/
|   |   |   |-- json-user-repo.ts  # Lógica para ler o destinations.json
|   |-- /services/
|   |   |-- destinationService.ts  # Lógica para obter a URL de um destino
|   |   |-- loggingService.ts      # Lógica para registrar os cliques
|   |-- /utils/
|   |   |-- hash.ts                # Função para criar o hash do IP
|   |-- main.ts                    # Ponto de entrada da aplicação (servidor Express)
|
|-- .env                       # Arquivo com variáveis de ambiente (local)
|-- .env.example               # Exemplo de arquivo .env
|-- clicks.log                 # Arquivo onde os cliques são registrados
|-- analytics.js               # Script para analisar o clicks.log
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

### Instalação e Execução

1.  Clone o repositório:
    ```bash
    git clone <url-do-seu-repositorio>
    ```
2.  Navegue até a pasta do projeto:
    ```bash
    cd redirecionador-links
    ```
3.  Crie seu arquivo de ambiente `.env` a partir do exemplo e defina sua
    `IP_HASH_SALT`:
    ```bash
    cp .env.example .env
    # Agora edite o arquivo .env com seu editor preferido
    ```
4.  Suba o container com Docker Compose. O `--build` é necessário na primeira
    vez.
    ```bash
    docker-compose up --build
    ```

E é só! O servidor estará disponível em `http://localhost:3000`. O Nodemon está
funcionando dentro do container e irá reiniciar o servidor a cada alteração que
você salvar nos arquivos.

Para parar o serviço, pressione `Ctrl + C` no terminal.

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

Para adicionar, editar ou remover um link de redirecionamento, modifique o
arquivo `src/db/seed/destinations.json`. A estrutura para cada destino é a
seguinte:

```json
{
  "name": "nome-unico-do-destino",
  "url": "[https://link.externo.completo.com](https://link.externo.completo.com)",
  "description": "Uma breve descrição do link.",
  "isActive": true
}
```

- `name`: O identificador que será usado na URL (`/go/<name>`).
- `url`: O link final para onde o usuário será redirecionado.
- `description`: Apenas para documentação interna.
- `isActive`: `true` para o link funcionar, `false` para desativá-lo
  temporariamente.

---

## Análise de Métricas

Todos os cliques bem-sucedidos são registrados no arquivo `clicks.log` na raiz
do projeto. Cada linha do arquivo é um objeto JSON (formato JSONL) com os
detalhes do evento.

Para analisar esses dados, use o script `analytics.js`.

### Como usar o Script de Análise

Execute o script via terminal, passando o `name` do destino que você deseja
analisar como argumento.

**Exemplo:** Para contar quantos IPs únicos foram redirecionados para `ghsdp`:

```bash
node analytics.js ghsdp
```

**Saída Esperada:**

```
Analisando cliques para o destino: "ghsdp"...

--- Análise Concluída ---
Total de cliques para "ghsdp": 25
Total de visitantes únicos (IPs únicos) para "ghsdp": 8
------------------------
```
