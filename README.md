
**AdaBot**

![Imagem do AdaBot](./src/img/adaProfile.jpeg)

# AdaBot

A **AdaBot** é uma assistente fofa e adorável desenvolvida com **JavaScript**, utilizando a biblioteca **whatsapp-web.js**. Criada para tornar suas interações no WhatsApp mais divertidas e práticas, a AdaBot conta com diversas funcionalidades, incluindo automação de tarefas, interações especiais em grupos e assistência personalizada para usuários.

---

## Funcionalidades

A **AdaBot** possui um conjunto de comandos projetados para tornar suas interações no WhatsApp mais dinâmicas e eficientes. Ela pode criar figurinhas, buscar informações, interagir com grupos e muito mais!

### **Funções Gerais**

- **/sticker**: Transforma uma imagem em uma figurinha. (Basta enviar o comando junto com a imagem!)
- **/audios**: Exibe uma lista de áudios disponíveis para envio.
- **/search + palavra**: Pesquisa no Google o que você quiser.
- **/images + descrição detalhada**: Pesquisa e envia uma imagem baseada na descrição fornecida.
- **/resume**: Faz um resumo das ultimas conversas.

### **Funções para Grupos**

- **/list**: Lista todos os participantes do grupo.
- **/past**: Mostra os antigos membros do grupo.

### **Funções para Administradores**

- **/add + número**: Adiciona um participante ao grupo.
- **/rm + número**: Remove um participante do grupo.
- **/promote + número**: Promove um membro a administrador.
- **/demote + número**: Rebaixa um administrador a membro comum.

---

## Configuração do Ambiente

Para que a **AdaBot** funcione perfeitamente, é necessário configurar corretamente o arquivo `.env`. Este arquivo contém informações essenciais, como os IDs dos grupos, chaves da API do Google e configurações do cliente.

### **Passos para Configurar o Arquivo `.env`**

1. **CLIENT_NUMBER**
   - Número do WhatsApp que será usado pelo bot.
   - **Exemplo:**
     ```plaintext
     CLIENT_NUMBER="551187654321@c.us"
     ```

2. **EXECUTABLE_PATH**
   - Caminho do executável do Google Chrome utilizado pelo bot.
   - **Exemplo:**
     ```plaintext
     EXECUTABLE_PATH="/usr/bin/google-chrome-stable"
     ```

3. **GOOGLE_SEARCH_API_KEY**
   - Chave da API do Google para realizar pesquisas.
   - **Exemplo:**
     ```plaintext
     GOOGLE_SEARCH_API_KEY="sua_chave_da_api"
     ```

4. **GOOGLE_SEARCH_API_CTX_GENERAL**
   - Contexto da API de pesquisa do Google para buscas gerais.
   - **Exemplo:**
     ```plaintext
     GOOGLE_SEARCH_API_CTX_GENERAL="seu_search_engine_id"
     ```

5. **GOOGLE_SEARCH_API_CTX_IMAGES**
   - Contexto da API de pesquisa para imagens.
   - **Exemplo:**
     ```plaintext
     GOOGLE_SEARCH_API_CTX_IMAGES="seu_search_engine_id_para_imagens"
     ```

###  **Exemplo Completo do Arquivo `.env`**

```plaintext
GROUPS_IDS="1234567890@c.us,0987654321@c.us"
CLIENT_NUMBER="551187654321@c.us"
EXECUTABLE_PATH="/usr/bin/google-chrome-stable"
GOOGLE_SEARCH_API_KEY="sua_chave_da_api"
GOOGLE_SEARCH_API_CTX_GENERAL="seu_search_engine_id"
GOOGLE_SEARCH_API_CTX_IMAGES="seu_search_engine_id_para_imagens"
BOT_INSTRUCTIONS="intrucoes_para_gemini"
```

### **Importante!**
- **Renomeie o arquivo**: Após preencher as variáveis no arquivo `.env.example`, renomeie-o para `.env` para que a AdaBot possa utilizar as configurações corretamente.

---

Com o arquivo `.env` configurado corretamente, a **AdaBot** estará pronta para ser usada!

Agora é só chamar a AdaBot no WhatsApp e aproveitar todas as funcionalidades fofas e útis que ela oferece!

