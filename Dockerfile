
FROM node:22-slim AS builder

WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN yarn install --immutable

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build 

RUN yarn cache clean


FROM node:22-slim

ARG CHROME_PATH="/usr/bin/google-chrome-stable"

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    gnupg \
    ca-certificates \
    ffmpeg \
    python3 \
    && install -m 0755 -d /etc/apt/keyrings \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/keyrings/google.gpg \
    && echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=${CHROME_PATH}

WORKDIR /app
RUN corepack enable

COPY --from=builder /app ./

CMD ["yarn", "start"]
