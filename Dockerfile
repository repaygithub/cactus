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
COPY modules/cactus-web/package.json /code/modules/cactus-web/
RUN yarn --frozen-lockfile
COPY modules/cactus-web/.jest/ /code/modules/cactus-web/.jest/
COPY modules/cactus-web/.storybook/ /code/modules/cactus-web/.storybook/
COPY modules/cactus-web/cactus-addon/ /code/modules/cactus-web/cactus-addon
COPY modules/cactus-web/.babelrc /code/modules/cactus-web
COPY modules/cactus-web/src/ /code/modules/cactus-web/src
COPY modules/cactus-web/tests/ /code/modules/cactus-web/tests
CMD yarn web test:visual
