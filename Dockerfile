FROM cactus/tests:base
WORKDIR /code
COPY .yarnrc.yml package.json yarn.lock /code/
COPY .yarn/plugins/ /code/.yarn/plugins/
COPY .yarn/releases/ /code/.yarn/releases/
COPY website/package.json /code/website/
COPY examples/mock-ebpp/package.json /code/examples/mock-ebpp/
COPY examples/standard/package.json /code/examples/standard/
COPY examples/theme-components/package.json /code/examples/theme-components/
COPY modules/cactus-fwk/package.json /code/modules/cactus-fwk/
COPY modules/cactus-i18n/package.json /code/modules/cactus-i18n/
COPY modules/cactus-form/package.json /code/modules/cactus-form/
COPY modules/cactus-icons/package.json /code/modules/cactus-icons/
COPY modules/cactus-theme/package.json /code/modules/cactus-theme/
COPY modules/cactus-web/package.json /code/modules/cactus-web/
RUN yarn install --immutable
ENTRYPOINT []
CMD yarn web test:visual
