# Prueba Tecnica FullStack

Sistema de personalización de dashboards con almacenamiento persistente, desarrollado utilizando NestJS para el backend
y Vue.js para el frontend. La base de datos se gestiona mediante contenedores Docker para garantizar portabilidad y
facilidad de despliegue.

## Requisitos

- Git
- NODE: 22.16.0
- Docker
- Docker compose

## Pasos para levantar el proyecto

- Clona el repositorio y accede al directorio principal:

```bash
git clone https://github.com/raksodiano/TechnicalTests.git
cd TechnicalTests
```

- Levanta la base de datos con Docker:

```bash
cd database
docker compose up -d
```

- Inicia el backend (NestJS):

```bash
cd ../backend
npm install
npm run start:dev
```

- Inicia el frontend (Vue 3):

Abre una nueva terminal y navega al directorio del frontend:

```bash
cd frontend
npm i
npm run dev
```

## Credenciales

- email: admin@correo.com
- pass: 123456

## Nota

- Los archivos .env fueron incluidos únicamente con fines de prueba.
- La sesión tiene un tiempo de 5min
- Me gustó la idea de la prueba, despues de la evaluación comenzaré a ir mejorandola
