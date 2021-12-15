
FROM node:lts

COPY entrypoint.sh /entrypoint.sh


RUN wget https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip && \
  unzip BrowserStackLocal-linux-x64.zip && \
  rm BrowserStackLocal-linux-x64.zip && \
  chmod +x /BrowserStackLocal && \
  chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
