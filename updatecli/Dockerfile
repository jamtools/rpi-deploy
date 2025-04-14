# FROM ubuntu:22.04
FROM python:3

ENV DEBIAN_FRONTEND=noninteractive

RUN rm -rf /var/lib/apt/lists/*
RUN apt-get update

RUN apt-get install --allow-downgrades --fix-missing -y systemd systemd-sysv npm

# FROM python:3

# ENV DEBIAN_FRONTEND=noninteractive

# RUN apt-get update

RUN mkdir -p /workspace/app
RUN mkdir -p /workspace/runners
RUN mkdir -p /workspace/data

RUN curl -sL -o /tmp/updatecli_arm64.deb https://github.com/updatecli/updatecli/releases/download/v0.97.0/updatecli_arm64.deb && \
    dpkg -i /tmp/updatecli_arm64.deb && \
    rm /tmp/updatecli_arm64.deb

ARG NODE_VERSION=22

ENV PATH="$HOME/.fnm:$PATH"

# RUN apt-get install -y unzip && \
#     curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir /usr/local/fnm && \
#     ln -s /usr/local/fnm/fnm /usr/local/bin/fnm && \
#     eval "$(fnm env)" && \
#     fnm install $NODE_VERSION && \
#     fnm default $NODE_VERSION && fnm use $NODE_VERSION

# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
# ENV NVM_DIR=/root/.nvm
# RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
# RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
# RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
# ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
# RUN node --version
# RUN npm --version

# RUN corepack enable pnpm

RUN mkdir -p /app
WORKDIR /app

RUN npm init -y
RUN npm i eventsource
COPY new_stuff/updatecli.d/scripts/check_esbuild.js .

# # WORKDIR /workspace/app

# # COPY ./workspace/repo_config.json /workspace/repo_config.json

# # COPY ./dist-pkg/index-linux-x64 ./index

RUN pip3 install ansible

VOLUME [ "/sys/fs/cgroup" ]
STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]
