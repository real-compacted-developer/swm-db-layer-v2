FROM node:12

EXPOSE ${PORT}

COPY / /workspace
WORKDIR /workspace

RUN yarn

CMD ["yarn", "start"]
