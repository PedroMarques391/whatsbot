<h1 align="center">
  <img src="./src/assets/images/ada.jpg" alt="AdaBot"/>
  <br/>
  AdaBot
</h1>

<p align="center">
  Assistente para o WhatsApp, feita com <strong>TypeScript e whatsapp-web.js</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22+-43853D?style=flat&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/whatsapp--web.js-github%3Amain-green" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Mongoose-v9.3.1-880000?style=flat&logo=mongoose&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenRouter-v0.9.11-1e1e1e?style=flat&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/yarn-v4.12.0-blue" />
</p>

<p align="center">
  <a href="https://wa.me/5548988352837/?text=Ada, o que você pode fazer?"><strong> Fale com a Ada agora mesmo!</strong></a>
</p>

## Sobre a AdaBot

A **AdaBot** é uma assistente para WhatsApp escrita em **TypeScript**, estruturada com **Factory Design Pattern**, injeção de dependências (`StickerService` + `StickerHelper`), classes utilitárias estáticas (`MessageUtils`, `StringUtils`, `UrlUtils`, `ReactionLoadingUtils`, entre outras) e processamento de mídia via `sharp` e `fluent-ffmpeg`.

Entre os recursos recentes, o bot suporta **figurinhas nativas com áudio (Sound Stickers)** do WhatsApp e **download somente de áudio no YouTube**.

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
```

### 2. Configurar o Ambiente

Crie um arquivo `.env` na raiz do projeto contendo as variáveis necessárias (veja a tabela de Variáveis de Ambiente abaixo). Você pode usar as variáveis padrão do arquivo `.env.example`.

### 3. Iniciar o Bot

```bash
# Inicie o projeto em modo de desenvolvimento
yarn run dev

# Ou compile e execute em produção
yarn run start
```

### 4. Autenticação (QR Code)

- Ao iniciar o projeto pela primeira vez, o bot exibirá um **QR Code** no seu terminal.
- Abra o WhatsApp no seu celular.
- Vá em **Configurações > Aparelhos conectados > Conectar um aparelho**.
- Escaneie o QR Code que apareceu no terminal.
- Aguarde a mensagem informando que o cliente está pronto. O bot agora já estará lendo as mensagens e pronto para receber comandos!

---

## Variáveis de Ambiente

| Variável                  | Descrição                                                   | Exemplo                            |
| ------------------------- | ----------------------------------------------------------- | ---------------------------------- |
| `CLIENT_NUMBER`           | Número do WhatsApp usado pelo bot                           | `"551187654321@c.us"`              |
| `GROUPS_IDS`              | IDs dos grupos onde o bot envia aviso ao iniciar            | `"120363000000000,120363000000001"` |
| `RECIPIENT_ID`            | ID do administrador/responsável pelo bot                    | `"5511999999999@c.us"`             |
| `OPEN_ROUTER_API_KEY`     | Chave da API do OpenRouter usada pela IA                    | `"sk-or-v1-..."`                   |
| `MONGO_URL`               | URI de conexão com o MongoDB                                | `"mongodb+srv://..."`              |
| `RAPIDAPI_KEY`            | Chave da RapidAPI usada no download do Instagram            | `"sua_chave_rapidapi"`             |
| `RAPIDAPI_HOST_INSTAGRAM` | Host da API do Instagram na RapidAPI                        | `"instagram-downloader..."`        |

---

## Funcionalidades e Comandos

Aqui estão os comandos atualizados da AdaBot. Para utilizá-los, envie a mensagem diretamente no chat privado com o bot ou em um grupo onde ela estiver adicionada.

<p align="center">
  <a href="https://wa.me/5548988352837/?text=/start"><strong> Teste os comandos com a Ada</strong></a>
</p>

### Gerais

| Comando                                   | Descrição                                                                                                                                      |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `/start`                                  | Inicia o bot e exibe o menu principal                                                                                                          |
| `/help <comando>`                         | Mostra descrição, atalhos e sintaxe de um comando específico                                                                                   |
| `/info`                                   | Exibe informações sobre o bot e seu criador                                                                                                    |
| `/register`                               | Registra o usuário no banco de dados do bot                                                                                                    |
| `/sticker` (`/s`)                         | Cria figurinha estática ou animada a partir de imagem ou vídeo (envie ou marque a mídia)                                                       |
| `/sticker --audio` (`/s --audio`)         | Cria **figurinha nativa com áudio** (Sound Sticker): em vídeo com som (até 5s) ou em imagem/vídeo enviado respondendo a um áudio (até 10s/5s) |
| `/rename <nome>`                          | Renomeia o pacote/autor de uma figurinha já existente (marque o sticker)                                                                       |
| `/removeBg` (`/rmbg`)                     | Remove o fundo de uma imagem ou figurinha (envie ou marque a mídia)                                                                            |
| `/tiktok <link>`                          | Baixa um vídeo do TikTok sem marca d'água                                                                                                      |
| `/instagram <link>`                       | Baixa um vídeo ou reels do Instagram                                                                                                           |
| `/youtube <link>` (`/yt`, `/ytb`, `/shorts`) | Baixa um vídeo ou shorts do YouTube                                                                                                         |
| `/youtube <link> --onlyAudio` (`--oa`)    | Baixa **apenas o áudio em MP3** de um vídeo ou shorts do YouTube                                                                               |
| `/twitter <link>` (`/tw`, `/x`)           | Baixa um vídeo do Twitter / X                                                                                                                  |
| `/pinterest <link>` (`/pin`)              | Baixa um vídeo ou mídia do Pinterest                                                                                                           |
| `/resume`                                 | IA gera um resumo das últimas mensagens do chat                                                                                                |
| `/test`                                   | Comando de teste do bot                                                                                                                        |

### Como criar Figurinhas com Áudio (`--audio`)

- **Figurinha animada com áudio (até 5s):** envie um vídeo com a legenda `/sticker --audio` (ou `/s --audio`), ou responda a um vídeo com `/s --audio`. Também é possível enviar um vídeo respondendo a um áudio externo.
- **Figurinha estática com áudio (até 10s):** envie uma imagem com a legenda `/sticker --audio` (ou `/s --audio`) **respondendo** a uma mensagem de áudio.
- O áudio é convertido para `audio/ogg; codecs=opus`, criptografado (E2E) e enviado acoplado à figurinha em uma **única mensagem nativa** do WhatsApp.

### Grupos (Para todos os membros)

| Comando               | Descrição                                                      |
| --------------------- | -------------------------------------------------------------- |
| `/list`               | Lista todos os participantes atuais do grupo                   |
| `/past`               | Mostra os membros que já saíram do grupo                       |
| `/getRevoked [@user]` | Recupera as mensagens que foram apagadas recentemente no grupo |

### Administradores de Grupo

| Comando               | Descrição                                                     |
| --------------------- | ------------------------------------------------------------- |
| `/add + número`       | Adiciona um novo participante ao grupo                        |
| `/ban + @user`        | Remove um participante do grupo                               |
| `/upgrade + @user`    | Dá poder de administrador a um participante                   |
| `/downgrade + @user`  | Remove os privilégios de administrador de um participante     |
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

- `src/bot`: Inicialização, conexão, eventos e configuração do cliente Puppeteer
- `src/commands`: Definição e roteamento dos comandos do usuário
- `src/errors`: Classes de erro padronizadas (`BotError`)
- `src/factories`: Fábricas para instanciar serviços (`AIFactory`, `DownloadFactory`, `StickerFactory`)
- `src/handlers`: Manipulação dos eventos da biblioteca (`onMessageCreate`, `onCall`, `onRevoke`, etc.)
- `src/helpers`: Helpers especializados (`StickerHelper`, validações de grupo e permissões)
- `src/lib`: Conexão com MongoDB via Mongoose
- `src/middleware`: Validações de comandos e interações automáticas (`onGreeting`, `onQuotedReply`)
- `src/models`: Schemas do Mongoose (`group`, `user`, `revokeMessages`)
- `src/providers`: Provedor de IA (`AIProvider` via OpenRouter)
- `src/services`: Regras de negócio (`StickerService`, `DownloadService`, `AIService`, grupos, etc.)
- `src/utils`: Classes utilitárias estáticas (`MessageUtils`, `StringUtils`, `UrlUtils`, `DateUtils`, `TimerUtils`, `MentionUtils`, `ReactionLoadingUtils`, `ShutdownUtils`)
- `types`: Definições de tipos TypeScript (`.type.ts` e `.d.ts`)
- `identity`: Arquivo de personalidade da Ada (`PERSONALITY.json`)
- `src/assets`: Recursos visuais e mídias

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
Sim! Desde que você tenha Node.js, Yarn, FFmpeg (`ffmpeg` + `ffprobe`) e o Google Chrome instalados corretamente.

**Como ela se conecta ao WhatsApp?**  
A AdaBot utiliza a biblioteca [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js), que emula o WhatsApp Web por meio do Puppeteer.

---

## Créditos

- Biblioteca base: [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js)
