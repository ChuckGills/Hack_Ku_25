
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    clang \
    clang-format \
    clang-tidy \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    autopep8 \
    google-generativeai \
    python-dotenv

# Install Node.js packages
RUN npm install -g \
    prettier \
    eslint \
    eslint-config-prettier

# Copy application code
COPY . .

# Command to run when container starts
CMD ["python", "app.py"]