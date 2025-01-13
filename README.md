# Proyecto Learn Loop Backend

Este es un backend desarrollado en Node.js con Express y Prisma. Proporciona funcionalidades para la gestión de usuarios, tópicos, inscripciones, miembros de chats, mensajes, y autenticación.

## Requisitos previos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (v16 o superior)
- [PostgreSQL](https://www.postgresql.org/)
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

3. Configura las variables de entorno:
    - Crea un archivo `.env` en la raíz del proyecto.
    - Agrega las siguientes variables:
      ```env
      DATABASE_URL=postgresql://<usuario>:<contraseña>@<host>:<puerto>/<base_de_datos>
      SIGNATURE=abcd
      ```

4. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```

5. Ejecuta las migraciones para crear las tablas en la base de datos:
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
- **Ruta:** `POST /enrollment/create`
- **Body:**
  ```json
  {
    "userId": "number",
    "topicId": "number",
    "status": "PENDING" | "APPROVED" | "REJECTED" (opcional, por defecto "PENDING")
  }
  ```

#### Aceptar inscripción
- **Ruta:** `POST /enrollment/accept`
- **Body:**
  ```json
  {
    "id": "number",
    "status": "APPROVED"
  }
  ```

#### Rechazar inscripción
- **Ruta:** `POST /enrollment/deny`
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
- **Ruta:** `GET /notification/get?userId=number`

#### Crear notificación
- **Ruta:** `POST /notification/create`
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

## Licencia

Este proyecto está bajo la Licencia ISC.

