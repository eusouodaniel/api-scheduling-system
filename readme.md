# Scheduling system

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6571ea8b6b2c4da6bcde5f78e50b37a6)](https://app.codacy.com/app/danielrodriguesdrs331/api-scheduling-system?utm_source=github.com&utm_medium=referral&utm_content=eusouodaniel/api-scheduling-system&utm_campaign=Badge_Grade_Dashboard)

Node Scheduling System

Para configurar o banco - SQL:
- docker run --name scheduling_sql -e POSTGRES_PASSWORD=root -p 5432:5432 -d postgres

Para configurar o banco - NoSQL:
- docker run --name scheduling_mongo -p 27017:27017 -d -t mongo

Para configurar o banco - NoSQL(Cache):
- docker run --name scheduling_redis -p 6379:6379 -d -t redis:alpine

Instalando pacotes:
- yarn

Rodando aplicação:
- yarn dev
