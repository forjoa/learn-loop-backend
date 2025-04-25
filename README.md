# Proyecto Learn Loop Backend

Este es un backend desarrollado en Node.js con Express y Prisma. Proporciona funcionalidades para la gestión de usuarios, tópicos, inscripciones, miembros de chats, mensajes, y autenticación.

## Requisitos previos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (v16 o superior)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) (para ejecutar PostgreSQL en contenedor)
- [PostgreSQL](https://www.postgresql.org/) (opcional si usas Docker)
- [Prisma CLI](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-typescript) (opcional, pero recomendado para trabajar con la base de datos)

## Configuración inicial

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd learn-loop-backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la base de datos PostgreSQL con Docker:
   ```bash
   docker-compose up -d
   ```
   Esto iniciará un contenedor PostgreSQL con las siguientes credenciales:
   - Usuario: postgres
   - Contraseña: postgres
   - Base de datos: learn_loop_db
   - Puerto: 5432

4. Configura las variables de entorno:
    - Crea un archivo `.env` en la raíz del proyecto.
    - Agrega las siguientes variables:
      ```env
      DATABASE_URL=postgresql://postgres:postgres@localhost:5432/learn_loop_db
      SIGNATURE=abcd
      ```

5. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```

6. Ejecuta las migraciones para crear las tablas en la base de datos:
   ```bash
   npx prisma migrate dev
   ```

## Comandos disponibles

- **Construir el proyecto:**
  ```bash
  npm run build
  ```

- **Iniciar el servidor en producción:**
  ```bash
  npm start
  ```

- **Iniciar el servidor en desarrollo:**
  ```bash
  npm run serve
  ```

## Endpoints disponibles

### Autenticación

#### Registrar usuario
- **Ruta:** `POST /auth/register`
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "TEACHER" | "STUDENT" (opcional, por defecto "STUDENT")
  }
  ```

#### Iniciar sesión
- **Ruta:** `POST /auth/login`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Usuarios

#### Editar usuario
- **Ruta:** `POST /users/edit`
- **Body:**
  ```json
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "TEACHER" | "STUDENT"
  }
  ```

### Tópicos

#### Crear tópico
- **Ruta:** `POST /topics`
- **Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "ownerId": "number"
  }
  ```

### Inscripciones

#### Crear inscripción
- **Ruta:** `POST /enrollments/create`
- **Body:**
  ```json
  {
    "userId": "number",
    "topicId": "number",
    "status": "PENDING" | "APPROVED" | "REJECTED" (opcional, por defecto "PENDING")
  }
  ```

#### Aceptar inscripción
- **Ruta:** `POST /enrollments/accept`
- **Body:**
  ```json
  {
    "id": "number",
    "status": "APPROVED"
  }
  ```

#### Rechazar inscripción
- **Ruta:** `POST /enrollments/deny`
- **Body:**
  ```json
  {
    "id": "number",
    "status": "REJECTED"
  }
  ```

### Miembros de chat

#### Crear miembro de chat
- **Ruta:** `POST /chatMembers/create`
- **Body:**
  ```json
  {
    "chatId": "number",
    "userId": "number"
  }
  ```

#### Eliminar miembro de chat
- **Ruta:** `POST /chatMembers/delete`
- **Body:**
  ```json
  {
    "id": "number"
  }
  ```

### Mensajes

#### Enviar mensaje
- **Ruta:** `POST /messages/send`
- **Body:**
  ```json
  {
    "content": "string",
    "senderId": "number",
    "chatId": "number"
  }
  ```

#### Obtener mensajes
- **Ruta:** `GET /messages/get?chatId=number`

### Notificaciones

#### Obtener notificaciones
- **Ruta:** `GET /notifications/get?userId=number`

#### Crear notificación
- **Ruta:** `POST /notifications/create`
- **Body:**
  ```json
  {
    "userId": "number",
    "title": "string",
    "content": "string"
  }
  ```

## Notas adicionales

- Todos los endpoints (excepto los de autenticación) requieren un token de autenticación válido en el encabezado `Authorization` con el formato: `Bearer <token>`.
- Asegúrate de que la base de datos esté correctamente configurada antes de iniciar el servidor.

## Uso de Docker

### Iniciar los contenedores
Para iniciar la base de datos PostgreSQL:
```bash
docker-compose up -d
```

### Detener los contenedores
Para detener y eliminar los contenedores:
```bash
docker-compose down
```

Para detener y eliminar los contenedores junto con los volúmenes (esto eliminará todos los datos de la base de datos):
```bash
docker-compose down -v
```

## Licencia

Este proyecto está bajo la Licencia ISC.
