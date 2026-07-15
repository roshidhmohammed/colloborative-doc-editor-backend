 -  # Collaborative Document Editor - Backend


# Project Overview
  This backend powers a real-time collaborative document editor. It provides authentication, document management, collaboration, sharing, and real-time synchronization using Socket.IO and Yjs. The backend follows a RESTful architecture with JWT-based authentication,  PostgreSQL as the development database, and Supabase as the production database.

# Features:

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role based document Create, Read, and Edit.
- Real-time Collaboration
- Role based document sharing
- Role-based Access
- Autosave
- Socket.IO Integration
- Yjs CRDT Synchronization
- Prisma ORM
- PostgreSQL Database for development stage
- Supabase Database for production stage
- Error Handling
- Request Validation


# Prerequisites

- Node.js (v22+ recommended)
- PostgreSQL - pgAdmin (For development)
- Supabase Database (For production)

# Instruction to set up the project on the local machine

1. First clone the repo, and execute the below commands:

```bash
git clone https://github.com/roshidhmohammed/colloborative-doc-editor-backend.git
cd colloborative-doc-editor-backend
```

2.   Create .env.development, .env.testing, and .env.production file on the root on the project folder (outside the src folder) and then add the below fields into the file

```bash
NODE_ENV="development" || "production" || "testing"
PORT=
DATABASE_URL="postgresql://postgres:admin75111@localhost:5433/colloborative-doc-editor?schema=public"
JWT_SECRET=""
CLIENT_URL=""
```

3.  Install all the dependencies used in this app using the below command:

```bash
npm install
```

4. Run migrations
   
```bash
npx prisma migrate deploy
```

5. Generate Prisma Client

```bash
npx prisma generate
```

6.  Start the project using the below command (for development stage):

```bash
npm run dev
```

7.  Start the project using the below command (for production stage):

```bash
npm run start
```

8.  Start the project using the below command (for testing stage):

```bash
npm run test
```

# Database Design

1. User

| Column    | Data Type     | Constraints      | Description                    |
| --------- | ------------- | ---------------- | ------------------------------ |
| id        | String (UUID) | Primary Key      | Unique identifier for the user |
| email     | String        | Unique, Required | User email address             |
| password  | String        | Required         | Hashed password                |
| fullName  | String        | Optional         | User's full name               |
| createdAt | DateTime      | Default: `now()` | Account creation timestamp     |
| updatedAt | DateTime      | Default: `now()` | Last profile update timestamp  |

# relationships
| Relation            | Type        |
| ------------------- | ----------- |
| Documents Created   | One-to-Many |
| Collaborations      | One-to-Many |
| Document Versions   | One-to-Many |
| Share Links Created | One-to-Many |



2. Document

| Column      | Data Type     | Constraints      | Description                       |
| ----------- | ------------- | ---------------- | --------------------------------- |
| id          | String (CUID) | Primary Key      | Unique document identifier        |
| name        | String        | Required         | Document title                    |
| content     | Bytes         | Optional         | Current Yjs document binary state |
| creatorId   | String        | Foreign Key      | Owner of the document             |
| creatorLink | String        | Optional         | Public creator reference          |
| createdAt   | DateTime      | Default: `now()` | Document creation time            |
| updatedAt   | DateTime      | Auto Updated     | Last modification time            |

# relationships
| Relation      | Type               |
| ------------- | ------------------ |
| Creator       | Many-to-One (User) |
| Collaborators | One-to-Many        |
| Versions      | One-to-Many        |
| Share Links   | One-to-Many        |

# Indexes
| Index     |
| --------- |
| creatorId |



3. DocumentCollaborator

| Column     | Data Type     | Constraints       | Description                     |
| ---------- | ------------- | ----------------- | ------------------------------- |
| id         | String (CUID) | Primary Key       | Collaboration record identifier |
| documentId | String        | Foreign Key       | Associated document             |
| userId     | String        | Foreign Key       | Collaborating user              |
| role       | Enum          | Default: `EDITOR` | Access permission               |
| invitedBy  | String        | Optional          | User who invited collaborator   |
| joinedAt   | DateTime      | Default: `now()`  | Collaboration start time        |

# relationships
| Relation | Type        |
| -------- | ----------- |
| Document | Many-to-One |
| User     | Many-to-One |

# Indexes
| Index      |
| ---------- |
| documentId |
| userId     |

# Constraints
| Constraint                 | Description                      |
| -------------------------- | -------------------------------- |
| Unique(documentId, userId) | Prevents duplicate collaborators |



4. DocumentVersion

| Column      | Data Type     | Constraints      | Description                  |
| ----------- | ------------- | ---------------- | ---------------------------- |
| id          | String (CUID) | Primary Key      | Version identifier           |
| version     | Integer       | Required         | Version number               |
| content     | Bytes         | Optional         | Binary snapshot of document  |
| documentId  | String        | Foreign Key      | Associated document          |
| createdById | String        | Foreign Key      | User who created the version |
| createdAt   | DateTime      | Default: `now()` | Version creation time        |

# relationships
| Relation   | Type               |
| ---------- | ------------------ |
| Document   | Many-to-One        |
| Created By | Many-to-One (User) |

# Indexes
| Index       |
| ----------- |
| documentId  |
| createdById |

# constraints
| Constraint                  | Description                                 |
| --------------------------- | ------------------------------------------- |
| Unique(documentId, version) | Ensures unique version numbers per document |


5. DocumentShareLink
| Column      | Data Type     | Constraints      | Description                          |
| ----------- | ------------- | ---------------- | ------------------------------------ |
| id          | String (CUID) | Primary Key      | Share link identifier                |
| token       | String        | Unique           | Secure share token                   |
| documentId  | String        | Foreign Key      | Shared document                      |
| role        | Enum          | Required         | Permission granted through the link  |
| createdById | String        | Foreign Key      | User who created the link            |
| expiresAt   | DateTime      | Optional         | Link expiration time                 |
| isActive    | Boolean       | Default: `true`  | Indicates whether the link is active |
| createdAt   | DateTime      | Default: `now()` | Link creation timestamp              |

# Relationships
| Relation   | Type               |
| ---------- | ------------------ |
| Document   | Many-to-One        |
| Created By | Many-to-One (User) |

# Indexes
| Index       |
| ----------- |
| token       |
| documentId  |
| createdById |


6. Role Enumeration

| Role   | Description                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------- |
| OWNER  | Full control over the document, including sharing, editing, deleting, and managing collaborators. |
| EDITOR | Can view and modify the document but cannot delete it or manage ownership.                        |
| VIEWER | Read-only access to the document.                                                                 |



# API Documentation

## User_Auth
| Method | Endpoint                            | Description                               |
| ------ | ------------------------------------| ------------------------------------------|
| POST   | `/api/auth/`                        | Register User                             |
| POST   | `/api/auth/login`                   | Login User                                |
| GET    | `/api/auth/check-user-auth`         | checking user authentication              |
| POST   | `/api/auth/logout`                  | user logout                               |

## User
| Method | Endpoint                            | Description                               |
| ------ | ------------------------------------| ------------------------------------------|
| GET    | `/api/user/profile`                 | getting the user profile info             |


## documents
| Method | Endpoint                                        | Description                                                 |
| ------ | ------------------------------------------------| ------------------------------------------------------------|
| POST   | `/api/document/`                                | Create a new document                                       |
| POST   | `/api/document/:documentId/collaborators`       | Assign Colloborators to a document                          |
| GET    | `/api/document/`                                | Get all documents associated with a user                    |
| GET    | `/api/document/:documentId/collaborators`       | get all collaborators of a document                         |
| GET    | `/api/document/:documentToken`                  | get document by a token (whether it is a editor or viewer)  |
| GET    | `/api/document/:documentId`                     | get document by document id                                 |
                                                                |


#  Role Based Authorization

## Owner
   - Read
   - Edit
   - Share

## Editor
   - Read
   - Edit

## Viewer
   - Read Only

# Packages Used or Frameworks:
  - Express.js         # Node.js Web Server Framework
  - @prisma/client     # ORM for connecting the postgreSQL or Supabase Database
  - @prisma/adapter-pg # Connects Prisma directly to PostgreSQL using the pg driver
  - bcrypt             # Password Encryption and storing the encrypted password in database
  - cookie-parser      # Parsing cookies to browser and the client
  - cors               # Server nad Client Cors configuration
  - cross-env          # Setting up the environment while running npm command in windows machines
  - crypto-js          # Cryptographic utilities (hashing, encryption, random values)
  - dotenv             # Setting up the .env files for storing the sensitive credentials
  - jsonwebtoken       # Creating the token for authentication and authorization
  - nodemon            # Automatically restrat the server after making any changes in codebase
  - socket.io          # Real time data transfer between client and server
  - zod                # For input data validation
  - yjs                # Conflict-free Replicated Data Types library for real-time collaborative editing
  - npm                # Package manager


# System Architecture
  - Include a high level diagram

    Frontend (Next.js)
        │
        ▼
REST API
        │
        ▼
Express Server
        │
 ┌──────┼──────────┐
 │      │          │
 ▼      ▼          ▼
Auth  Document   Socket.IO
 │                  │
 ▼                  ▼
Prisma           Yjs
 │
 ▼
PostgreSQL/Supabase


# Project Structure:

src/
  -  config/          # database and environment variables configuration
  -  controllers/     # API handlers and business logic
  -  routes/          # API routes and endpoints definition
  -  middlewares/     # middlewares likes authentication, error handling required for all the api endpoints
  -  utils/           # Reusable and helper function logic
  -  app.js           # app/global level configuration
  -  server.js        # server and socket creation logic
  -  services/socket  # socket based user authentication checking and socket event handling
  -  services/yjs     # Document content storing without 

prisma/
  - migrations        # It contains prisma migration file for setting up a new connection
  - schema.prisma     # Prisma connection and schema creation file

- prisma.config.ts    # Prisma configuration file for connecting the postgreSQL or supabase database


# Deployment

- Backend (Railway)
- Supabase PostgreSQL
