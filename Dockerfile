FROM node:12

EXPOSE ${PORT}

COPY / /workspace
WORKDIR /workspace

RUN yarn
RUN yarn build

VOLUME ["/ca"]

CMD ["yarn", "start:production"]
