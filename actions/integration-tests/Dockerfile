
FROM node:16-bullseye-slim

COPY entrypoint.sh /entrypoint.sh

RUN apt-get update && apt-get install -y \
  wget \
  unzip \
  procps \
# These are existing packages with security updates.
  libc6 zlib1g libpcre2-8-0
RUN wget https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip && \
  unzip BrowserStackLocal-linux-x64.zip && \
  rm BrowserStackLocal-linux-x64.zip && \
  chmod +x /BrowserStackLocal && \
  chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
