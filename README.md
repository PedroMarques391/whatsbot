
**AdaBot**

![Imagem do AdaBot](./src/img/hasturProfile.jpg)

**AdaBot** é um bot desenvolvido com **JavaScript** utilizando a biblioteca **whatsapp-web.js**. Ele oferece uma variedade de funcionalidades para automação de tarefas dentro do WhatsApp, com foco especial em **funções específicas para grupos** e **usuários**. O bot possui funções como pesquisa online, criação de figurinhas, envio de áudios, entre outras.

## **Funcionalidades**

O **AdaBot** possui diversas funções que podem ser utilizadas dentro de grupos do WhatsApp, incluindo comandos específicos para administradores, funcionalidades para interagir com os membros, e ações gerais. Veja abaixo algumas das principais funcionalidades:

### **Funções Gerais**

- **/sticker**: Transforma uma imagem em uma figurinha. (Envie o comando junto com a imagem)
- **/audios**: Envia uma lista de áudios disponíveis.
- **/search + palavra**: Pesquisa no Google o que você deseja.
- **/images + descrição detalhada**: Pesquisa e envia uma imagem baseada na descrição fornecida.

### **Funções para Grupos**

- **/list**: Lista todos os membros do grupo.
- **/past**: Mostra os antigos membros do grupo.

### **Funções para Administradores**

- **/add + número**: Adiciona um participante ao grupo.
- **/rm + número**: Remove um participante do grupo.
- **/promote + número**: Promove um membro a Administrador.
- **/demote + número**: Rebaixa um administrador a membro.

## **Configuração do Ambiente**

Para que o **AdaBot** tenhas todas suas funções ativas, você precisa preencher as variáveis de ambiente no arquivo `.env.example`. Esse arquivo contém várias configurações importantes, como IDs dos grupos, chave da API do Google e configurações do cliente. Após preencher as variáveis corretamente, você pode renomear o arquivo para `.env` e iniciar o bot.

### **Passos para Preencher o Arquivo `.env.example`**

*Esses Ids serão usados para que o bot envie a mensagem de inicialização(opcional)*
1. **GROUPS_IDS**:
   - **Descrição**: IDs dos grupos onde o bot pode ser usado.
   - **Exemplo**:
     ```plaintext
     GROUPS_IDS="1234567890,0987654321"
     ```

2. **ALLOWED_GROUPS (opcional)**:
   - **Descrição**: Grupos permitidos para o bot. Caso não queira restringir, basta deixar em branco.
   - **Exemplo**:
     ```plaintext
     ALLOWED_GROUPS="1234567890@c.us"
     ```

3. **CLIENT_NUMBER**:
   - **Descrição**: Número de telefone do cliente (WhatsApp) utilizado pelo bot (use no mesmo formato expecificado).
   - **Exemplo**:
     ```plaintext
     CLIENT_NUMBER="551187654321@c.us"
     ```

4. **EXECUTABLE_PATH**:
   - **Descrição**: Caminho do executável do navegador Google Chrome.
   - **Exemplo**:
     ```plaintext
     EXECUTABLE_PATH="/usr/bin/google-chrome-stable"
     ```

5. **GOOGLE_SEARCH_API_KEY**:
   - **Descrição**: Chave da API do Google para realizar pesquisas.
   - **Exemplo**:
     ```plaintext
     GOOGLE_SEARCH_API_KEY="sua_chave_da_api"
     ```

6. **GOOGLE_SEARCH_API_CTX_GENERAL**:
   - **Descrição**: Contexto da API de pesquisa do Google para pesquisas gerais.
   - **Exemplo**:
     ```plaintext
     GOOGLE_SEARCH_API_CTX_GENERAL="seu_search_engine_id"
     ```

7. **GOOGLE_SEARCH_API_CTX_IMAGES**:
   - **Descrição**: Contexto da API de pesquisa de imagens do Google.
   - **Exemplo**:
     ```plaintext
     GOOGLE_SEARCH_API_CTX_IMAGES="seu_search_engine_id_para_imagens"
     ```

### **Exemplo Completo do Arquivo `.env`**

```plaintext
GROUPS_IDS="1234567890@c.us,0987654321@c.us"
ALLOWED_GROUPS="1234567890@c.us"
CLIENT_NUMBER="551187654321@c.us"
EXECUTABLE_PATH="/usr/bin/google-chrome-stable"
GOOGLE_SEARCH_API_KEY="sua_chave_da_api"
GOOGLE_SEARCH_API_CTX_GENERAL="seu_search_engine_id"
GOOGLE_SEARCH_API_CTX_IMAGES="seu_search_engine_id_para_imagens"
```

### **Importante!**
- **Renomeie o arquivo**: Após preencher as variáveis no arquivo `.env.example`, renomeie-o para `.env` para que o bot possa utilizar essas configurações corretamente.

---

Com o arquivo `.env` configurado corretamente, o **AdaBot** estará pronto para ser executado e você poderá usar todas as funcionalidades que ele oferece no WhatsApp!


