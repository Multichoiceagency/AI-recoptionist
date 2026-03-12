FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    python3-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pyproject.toml ./
COPY receptionist/__init__.py receptionist/

RUN pip install --no-cache-dir -e .

COPY . .

CMD ["python", "receptionist/agent.py", "start", "--num-idle-processes", "1"]
