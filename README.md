<h1 align="center">
  <img src="./src/assets/images/ada.jpg" alt="AdaBot"/>
  <br/>
  AdaBot
</h1>

<p align="center">
  Assistente para o WhatsApp, feita com <strong>TypeScript e whatsapp-web.js</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v24.13.1-43853D?style=flat&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/whatsapp--web.js-v1.23.0-green" />
  <img src="https://img.shields.io/badge/TypeScript-Refactor-blue" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Mongoose-v9.3.1-880000?style=flat&logo=mongoose&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenRouter-v0.9.11-1e1e1e?style=flat&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/yarn-v4.12.0-blue" />
</p>

<p align="center">
  <a href="https://wa.me/5548988352837/?text=Ada, o que você pode fazer?"><strong> Fale com a Ada agora mesmo!</strong></a>
</p>

## Sobre a AdaBot

A **AdaBot** é uma assistente para WhatsApp, agora reescrita em **TypeScript**, utilizando conceitos de **Factory Design Pattern**, modularização, melhorias de performance e organização de código. O resultado? Um bot mais rápido, estável e preparado para escalar.

Para o usuário final, a experiência permanece inalterada. No entanto, internamente, o código foi aprimorado com boas práticas de desenvolvimento de software, garantindo maior eficiência, escalabilidade e organização.

---

## Como Iniciar e Usar (Passo a Passo)

### 1. Clonar e instalar

```bash
# Clone o repositório
git clone https://github.com/PedroMarques391/whatsbot

# Entre no projeto
cd whatsbot

# Instale as dependências (recomendado usar Yarn)
yarn
# ou npm install
```

### 2. Configurar o Ambiente

Crie um arquivo `.env` na raiz do projeto contendo as variáveis necessárias (veja a tabela de Variáveis de Ambiente abaixo). Você pode usar as variáveis padrão do arquivo `.env.example`.

### 3. Iniciar o Bot

```bash
# Inicie o projeto em modo de desenvolvimento
yarn run dev
# ou npm run dev
```

### 4. Autenticação (QR Code)

- Ao iniciar o projeto pela primeira vez, o bot exibirá um **QR Code** no seu terminal.
- Abra o WhatsApp no seu celular.
- Vá em **Configurações > Aparelhos conectados > Conectar um aparelho**.
- Escaneie o QR Code que apareceu no terminal.
- Aguarde a mensagem informando que o cliente está pronto. O bot agora já estará lendo as mensagens e pronto para receber comandos!

---

## Variáveis de Ambiente

| Variável                        | Descrição                                      | Exemplo                               |
| ------------------------------- | ---------------------------------------------- | ------------------------------------- |
| `CLIENT_NUMBER`                 | Número do WhatsApp usado pelo bot              | `"551187654321@c.us"`                 |
| `EXECUTABLE_PATH`               | Caminho para o Chrome usado pelo Puppeteer     | `"/usr/bin/google-chrome-stable"`     |
| `GOOGLE_SEARCH_API_KEY`         | Chave da API do Google                         | `"sua_chave_da_api"`                  |
| `GOOGLE_SEARCH_API_CTX_GENERAL` | ID do mecanismo de busca para pesquisas gerais | `"seu_search_engine_id"`              |
| `GOOGLE_SEARCH_API_CTX_IMAGES`  | ID do mecanismo de busca para imagens          | `"seu_search_engine_id_para_imagens"` |
| `GROUPS_IDS`                    | IDs dos grupos em que o bot atua               | `"1234567890@c.us,0987654321@c.us"`   |
| `BOT_INSTRUCTIONS` (opcional)   | Instruções extras enviadas ao modelo Gemini IA | `"instrucoes_para_gemini"`            |

---

## Funcionalidades e Comandos

Aqui estão os comandos atualizados da AdaBot. Para utilizá-los, envie a mensagem diretamente no chat privado com o bot ou em um grupo onde ela estiver adicionada.

<p align="center">
  <a href="https://wa.me/5548988352837/?text=/start"><strong> Teste os comandos com a Ada</strong></a>
</p>

### Gerais

| Comando           | Descrição                                                                |
| ----------------- | ------------------------------------------------------------------------ |
| `/start`          | Inicia o bot e exibe mensagem inicial                                    |
| `/help`           | Mostra o menu de ajuda com a lista de comandos                           |
| `/info`           | Exibe informações sobre o bot e seu criador                              |
| `/register`       | Registra o usuário no banco de dados do bot                              |
| `/sticker`        | Cria uma figurinha a partir de imagem ou vídeo (envie ou marque a mídia) |
| `/rename + nome`  | Renomeia o autor de uma figurinha já existente (marque o sticker)        |
| `/removeBg`       | Remove o fundo de uma imagem (envie ou marque a imagem)                  |
| `/images + texto` | Busca imagens no Google com base no texto fornecido                      |
| `/tiktok + link`  | Baixa um vídeo do TikTok sem marca d'água                                |
| `/instagram + link` | Baixa um vídeo ou reels do Instagram                                   |
| `/resume`         | IA gera um resumo das últimas mensagens do chat                          |
| `/test`           | Comando de teste do bot                                                  |

### Grupos (Para todos os membros)

| Comando       | Descrição                                                      |
| ------------- | -------------------------------------------------------------- |
| `/list`       | Lista todos os participantes atuais do grupo                   |
| `/past`       | Mostra os membros que já saíram do grupo                       |
| `/getRevoked` | Recupera as mensagens que foram apagadas recentemente no grupo |

### Administradores de Grupo

| Comando               | Descrição                                                     |
| --------------------- | ------------------------------------------------------------- |
| `/add + número`       | Adiciona um novo participante ao grupo                        |
| `/ban + número`       | Remove um participante do grupo                               |
| `/upgrade + número`   | Dá poder de administrador a um participante                   |
| `/downgrade + número` | Remove os privilégios de administrador de um participante     |
| `/block + comando`    | Bloqueia o uso de um comando específico dentro do grupo       |
| `/unblock + comando`  | Desbloqueia o uso de um comando no grupo                      |
| `/setWelcome`         | Define uma mensagem de boas-vindas personalizada para o grupo |
| `/setLeft`            | Define uma mensagem de saída personalizada para o grupo       |

### Administrador do Bot

| Comando       | Descrição                                                                |
| ------------- | ------------------------------------------------------------------------ |
| `/sendUpdate` | Envia uma mensagem de atualização para todos os grupos em que o bot está |

---

## Interações Especiais com IA

Você pode interagir naturalmente com a inteligência artificial do bot.

```text
╭─≺ *Converse Comigo* ≻─╮
┃ 💬 Me chame carinhosamente:
┃    Exemplo → *Ada, qual sua música favorita?* 🎶
┃ ou marque minha mensagem
╰────────────╯
```

---

## Estrutura Interna

- `src/bot`: Inicialização, autenticação e controle do cliente
- `src/bot/events`: Eventos do WhatsApp
- `src/commands`: Comandos do usuário
- `src/handlers`: Manipulação dos eventos da lib
- `src/services`: Serviços como IA, grupos, mídias
- `src/utils`: Funções utilitárias
- `src/config`: Local onde todas as váriaveis de ambiente são importadas e exportadas
- `src/assets`: Recursos visuais (como avatar da Ada)

---

## Teste Agora mesmo!

[Fale com a Ada](https://wa.me/5548988352837)

## Contribuindo

Quer contribuir com a AdaBot? Show! Siga os passos:

1. Faça o Fork do repositório
2. Crie sua branch: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: minha nova feature'`
4. Faça o Push na branch: `git push origin minha-feature`
5. Crie um Pull Request

---

## FAQ

**AdaBot é compatível com todos os sistemas operacionais?**  
Sim! Desde que você tenha Node.js, yarn, ffmpeg e o Chrome instalados corretamente.

**Como ela se conecta ao WhatsApp?**  
A AdaBot utiliza a biblioteca [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js), que emula o WhatsApp Web por meio do Puppeteer.

---

## Créditos

- Biblioteca base: [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js)
