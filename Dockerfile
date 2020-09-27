FROM node:12

EXPOSE ${PORT}

COPY / /workspace
WORKDIR /workspace

RUN yarn
RUN yarn build

CMD ["yarn", "start:production"]
