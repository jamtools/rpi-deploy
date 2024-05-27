FROM ubuntu:20.04

RUN mkdir -p /app
WORKDIR /app

COPY ./dist-pkg/index-linux-x64 ./index
ENTRYPOINT ["./index"]
