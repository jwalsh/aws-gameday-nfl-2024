FROM ubuntu:22.04

# Environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV CODE_SERVER_VERSION=4.93.1
ENV NODE_VERSION=20.5.1
ENV AWS_CLI_VERSION=2.18.12
ENV CODE_SERVER_PASSWORD=860939655105
ENV CODE_SERVER_PORT=8080

# Create ubuntu user to match GameDay environment
RUN useradd -m -s /bin/bash ubuntu \
    && echo "ubuntu ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    nginx \
    git \
    python3.9 \
    python3-pip \
    python3-venv \
    fontconfig \
    build-essential \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf aws awscliv2.zip

# Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | bash

# Create the NflApp directory and set permissions
RUN mkdir -p /NflApp \
    && chown ubuntu:ubuntu /NflApp

# Switch to ubuntu user
USER ubuntu
WORKDIR /NflApp

# Code Server configuration
RUN mkdir -p ~/.config/code-server
RUN echo '{\n\
    "bind-addr": "0.0.0.0:8080",\n\
    "auth": "password",\n\
    "password": "860939655105",\n\
    "cert": false\n\
}' > ~/.config/code-server/config.yaml

# VS Code settings
RUN mkdir -p ~/.local/share/code-server/User
RUN echo '{\n\
    "extensions.autoUpdate": false,\n\
    "extensions.autoCheckUpdates": false,\n\
    "terminal.integrated.cwd": "/NflApp",\n\
    "telemetry.telemetryLevel": "off",\n\
    "security.workspace.trust.startupPrompt": "never",\n\
    "security.workspace.trust.enabled": false,\n\
    "security.workspace.trust.banner": "never",\n\
    "security.workspace.trust.emptyWindow": false,\n\
    "editor.indentSize": "tabSize",\n\
    "editor.tabSize": 2,\n\
    "python.testing.pytestEnabled": true,\n\
    "auto-run-command.rules": [\n\
        {\n\
            "command": "workbench.action.terminal.new"\n\
        }\n\
    ]\n\
}' > ~/.local/share/code-server/User/settings.json

# Install VS Code extensions as ubuntu user
RUN code-server --install-extension amazonwebservices.amazon-q-vscode \
    && code-server --install-extension synedra.auto-run-command \
    && code-server --install-extension vscjava.vscode-java-pack \
    && code-server --install-extension ms-vscode.live-server

# Create start script
USER root
RUN echo '#!/bin/bash\n\
service nginx start\n\
sudo -u ubuntu code-server --bind-addr 0.0.0.0:8080 /NflApp\n\
' > /start.sh \
    && chmod +x /start.sh

# Setup nginx as root
RUN echo 'server {\n\
    listen 80;\n\
    listen [::]:80;\n\
    server_name localhost;\n\
    location / {\n\
        proxy_pass http://localhost:8080/;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header Upgrade $http_upgrade;\n\
        proxy_set_header Connection upgrade;\n\
        proxy_set_header Accept-Encoding gzip;\n\
    }\n\
}' > /etc/nginx/sites-available/default

# Switch back to ubuntu user
USER ubuntu

EXPOSE 80 8080 5173

CMD ["/start.sh"]
