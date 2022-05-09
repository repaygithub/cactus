FROM cactus/tests:base
WORKDIR /code
ENTRYPOINT []
CMD yarn web test:visual
