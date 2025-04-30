
<h1 align="center">
  <img src="./src/assets/images/ada.jpg"" alt="AdaBot"/>
  <br/>
  AdaBot
</h1>

<p align="center">
  Assistente para o WhatsApp, feita com <strong>TypeScript e whatsapp-web.js</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/whatsapp--web.js-v1.23.0-green" />
  <img src="https://img.shields.io/badge/TypeScript-Refactor-blue" />
  <img src="https://img.shields.io/badge/yarn-v1.22-blue" />
</p>



## Sobre a AdaBot

A **AdaBot** é uma assistente para WhatsApp, agora reescrita em **TypeScript**, utilizando conceitos de **Factory Design Pattern**, modularização, melhorias de performance e organização de código. O resultado? Um bot mais rápido, estável e preparado para escalar.

Para o usuário final, a experiência permanece inalterada. No entanto, internamente, o código foi aprimorado com boas práticas de desenvolvimento de software, garantindo maior eficiência, escalabilidade e organização. 

---

## Como iniciar

```bash
# clone o repositório
git clone https://github.com/PedroMarques391/whatsbot

# entre no projeto
cd whatsbot
```
## Instale as dependências


```bash
# Com Yarn
yarn 

# Ou com NPM
npm i

# Inicie o projeto em modo de desenvolvimento
# Usando ts-node com respawn
yarn run dev

# Ou com NPM
npm run dev
```

---

## Variáveis de Ambiente

| Variável                          | Descrição                                             | Exemplo                               |
|----------------------------------|-------------------------------------------------------|----------------------------------------|
| `CLIENT_NUMBER`                  | Número do WhatsApp usado pelo bot                    | `"551187654321@c.us"`                  |
| `EXECUTABLE_PATH`                | Caminho para o Chrome usado pelo Puppeteer           | `"/usr/bin/google-chrome-stable"`      |
| `GOOGLE_SEARCH_API_KEY`          | Chave da API do Google                               | `"sua_chave_da_api"`                   |
| `GOOGLE_SEARCH_API_CTX_GENERAL`  | ID do mecanismo de busca para pesquisas gerais       | `"seu_search_engine_id"`               |
| `GOOGLE_SEARCH_API_CTX_IMAGES`   | ID do mecanismo de busca para imagens                | `"seu_search_engine_id_para_imagens"`  |
| `GROUPS_IDS`                     | IDs dos grupos em que o bot atua                     | `"1234567890@c.us,0987654321@c.us"`    |
| `BOT_INSTRUCTIONS` (opcional)    | Instruções extras enviadas ao modelo Gemini IA       | `"instrucoes_para_gemini"`             |

---

## Funcionalidades

### Gerais

| Comando           | Descrição                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `/sticker`          | Transforma uma imagem em figurinha                                       |
| `/audios`           | Lista áudios disponíveis                                                 |
| `/search + termo`   | Pesquisa no Google                                                       |
| `/images + texto`   | Envia imagem baseada na descrição                                        |
| `/resume`           | Faz um resumo das últimas conversas                                      |
| `/rename + nome`    | Altera o nome de do sticker marcado                                      |
| `/removeBg`         | Remove o fundo da imagem marcada ou enviada                              |


### Grupos

| Comando | Descrição                           |
|---------|-------------------------------------|
| `/list` | Lista os participantes do grupo     |
| `/past` | Mostra antigos membros              |

### Administradores

| Comando          | Descrição                             |
|------------------|---------------------------------------|
| `/add + número`  | Adiciona um novo participante         |
| `/rm + número`   | Remove um membro                      |
| `/promote + número` | Promove para admin                |
| `/demote + número`  | Remove privilégio de administrador |

---

## Interações Especiais

```text
╭─≺ *Converse Comigo* ≻─╮  
┃ 💬 Me chame carinhosamente:  
┃    Exemplo → *Ada, qual sua música favorita?* 🎶  
┃ ou marque minha mensagem hihihi  
┃ 🐾 Eu vou responder com muito amor e fofura! 💕  
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
- `src/config`: Local onde todas as váriaveis de ambiente são importadas e exportadas.
- `src/assets`: Recursos visuais (como avatar da Ada)

---

## Contribuindo

Quer contribuir com a AdaBot? Show! Siga os passos:

1. Fork o repositório
2. Crie sua branch: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: minha nova feature'`
4. Push na branch: `git push origin minha-feature`
5. Crie um Pull Request

---

## FAQ

**AdaBot é compatível com todos os sistemas operacionais?**  
Sim! Desde que você tenha Node.js, yarn, ffmpeg e o Chrome instalados corretamente.


**Como ela se conecta ao WhatsApp?**  
Usei a biblioteca [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js), que emula o WhatsApp Web por meio do Puppeteer.

---

## Créditos

- Biblioteca base: [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js)
---
