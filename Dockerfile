FROM cactus/tests:base
WORKDIR /code
COPY . /code/
RUN yarn install --immutable
CMD ["test:visual"]
