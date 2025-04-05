

FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y \
    python3 python3-venv python3-pip\
    nodejs npm \
    git \
    clang \
    clang-tidy \
    clang-format \
    jq \
    && rm -rf /var/lib/apt/lists/*



# Set the working directory
WORKDIR /app

# Create a virtual environment
RUN python3 -m venv /app/venv

# Activate the virtual environment
ENV PATH="/app/venv/bin:$PATH"

# Copy requirements.txt and install dependencies within the virtual environment
COPY requirement.txt /app/requirements.txt
RUN pip3 install --no-cache-dir -r /app/requirements.txt

# Install JavaScript packages (minimal, assuming you have package.json later)
# If you don't have package.json, you might install eslint and prettier globally or locally
RUN npm install -g eslint prettier

COPY . .

# Make the scripts executable
RUN chmod +x scripts/*.sh


ENTRYPOINT ["tail", "-f", "/dev/null"]
