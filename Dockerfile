FROM node
RUN apt-get update && apt-get install -y \
  wget \
  unzip \
  fontconfig \
  locales \
  gconf-service \
  libasound2 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  ca-certificates \
  fonts-liberation \
  libappindicator1 \
  libnss3 \
  lsb-release \
  xdg-utils \
  wget
WORKDIR /code
COPY package.json yarn.lock /code/
COPY modules/cactus-fwk/package.json /code/modules/cactus-fwk/
COPY modules/cactus-i18n/package.json /code/modules/cactus-i18n/
COPY modules/cactus-icons/package.json /code/modules/cactus-icons/
COPY modules/cactus-theme/package.json /code/modules/cactus-theme/
COPY modules/cactus-web/package.json /code/modules/cactus-web/
RUN yarn --frozen-lockfile
COPY ["docs/Icons/Available Icons.md", "/code/docs/Icons/"]
COPY modules/ /code/modules/
COPY scripts/ /code/scripts/
COPY .prettierrc .prettierignore tsconfig.json /code/
RUN yarn cleanup && yarn build
CMD yarn web test:visual
