FROM python:3

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update

# RUN sed -i 's|http://ports.ubuntu.com/ubuntu-ports|http://archive.ubuntu.com/ubuntu|g' /etc/apt/sources.list && \
#     apt-get update && \
#     apt-get install -y curl

RUN mkdir -p /workspace/app
RUN mkdir -p /workspace/runners
RUN mkdir -p /workspace/data

RUN curl -sL -o /tmp/updatecli_amd64.deb https://github.com/updatecli/updatecli/releases/download/v0.97.0/updatecli_amd64.deb && \
    dpkg -i /tmp/updatecli_amd64.deb && \
    rm /tmp/updatecli_amd64.deb

RUN python3 -m pip install --user ansible
# RUN updatecli version

WORKDIR /workspace/app

COPY ./workspace/repo_config.json /workspace/repo_config.json

COPY ./dist-pkg/index-linux-x64 ./index
