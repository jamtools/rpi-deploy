FROM ubuntu:20.04

RUN mkdir -p /workspace/app
RUN mkdir -p /workspace/runners
RUN mkdir -p /workspace/data
WORKDIR /workspace/app

COPY ./workspace/repo_config.json /workspace/repo_config.json

COPY ./dist-pkg/index-linux-x64 ./index
