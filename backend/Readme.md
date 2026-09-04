# CodeHub Backend

Backend API for **CodeHub** — a developer platform where developers can showcase their projects, discover other developers, interact through likes and comments, follow users, receive notifications, and connect their GitHub profiles.

---

## 🚀 Features

- User registration and authentication
- JWT-based authentication
- Access and refresh tokens
- Secure password hashing
- User profile management
- Avatar and cover image uploads
- Cloudinary image storage
- Project creation and management
- Project thumbnail uploads
- Project likes
- Project comments
- Follow / unfollow system
- Followers and following lists
- Follow statistics
- Notifications
- User and project search
- GitHub API integration
- Pagination
- Admin dashboard APIs
- User activation / deactivation
- Admin project moderation
- Rate limiting
- Centralized error handling
- Request validation
- Ownership-based authorization

---

# 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security

- JSON Web Token (JWT)
- bcryptjs
- Cookie Parser
- CORS
- Rate Limiting

### File & Image Handling

- Multer
- Cloudinary

### External API

- GitHub REST API

---

# 📁 Project Structure

```text
backend/
│
├── public/
│   └── temp/
│
├── src/
│   │
│   ├── config/
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │
│   ├── db/
│   │   └── index.js
│   │
│   ├── middlewares/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── utils/
│   │
│   ├── validators/
│   │
│   ├── constants.js
│   ├── app.js
│   └── index.js
│
├── .env
├── .env.sample
├── .gitignore
└── package.json
```

---

# 🏗️ Architecture

CodeHub follows a layered backend architecture.

```text
Client
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Models
   │
   ▼
MongoDB
```

### Responsibilities

**Routes**

Defines API endpoints and middleware.

**Controllers**

Handles HTTP requests and responses.

**Services**

Contains reusable business logic and external service integrations.

**Models**

Defines MongoDB schemas using Mongoose.

**Middlewares**

Handles authentication, authorization, uploads, rate limiting, and errors.

**Validators**

Validates incoming request data.

**Utils**

Contains reusable helper classes and functions.

---

# ⚙️ Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- MongoDB Atlas account
- Cloudinary account
- GitHub Personal Access Token

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/shashank1049/CodeHub.git
```

Move into the backend directory:

```bash
cd CodeHub/backend
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=8000

MONGODB_URI=your_mongodb_atlas_connection_string

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

GITHUB_TOKEN=your_github_token

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Never commit your `.env` file to GitHub.

---

# ▶️ Running the Backend

Start the development server:

```bash
npm run dev
```

The backend will run on:

```text
http://127.0.0.1:8000
```

Base API URL:

```text
http://127.0.0.1:8000/api/v1
```

---

# ❤️ Health Check

To verify that the API is running:

```http
GET /
```

Example response:

```json
{
    "success": true,
    "message": "CodeHub API is running"
}
```

---

# 🔑 Authentication

CodeHub uses JWT-based authentication.

Two tokens are used:

- Access Token
- Refresh Token

Access tokens are used to access protected routes.

Refresh tokens are used to generate new access tokens.

Authentication can be provided through:

### Cookie

```text
accessToken
```

### Authorization Header

```text
Authorization: Bearer <access-token>
```

---

# 👤 User APIs

## Register User

```http
POST /api/v1/users/register
```

Creates a new CodeHub account.

Example request:

```json
{
    "fullName": "Shashank Mishra",
    "username": "shashank1",
    "email": "shashank@gmail.com",
    "password": "Password@123"
}
```

### Password Requirements

Password must contain:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## Login

```http
POST /api/v1/users/login
```

Authenticates the user and generates access and refresh tokens.

---

## Logout

```http
POST /api/v1/users/logout
```

Requires authentication.

---

## Refresh Access Token

```http
POST /api/v1/users/refresh-token
```

Generates a new access token using the refresh token.

---

## Get Current User

```http
GET /api/v1/users/me
```

Requires authentication.

Returns information about the currently authenticated user.

---

## Get User Profile

```http
GET /api/v1/users/:username
```

Returns a public developer profile.

---

## Update Profile

```http
PATCH /api/v1/users/update-profile
```

Requires authentication.

Supported fields:

```text
fullName
bio
githubUsername
```

Example:

```json
{
    "fullName": "Shashank Mishra",
    "bio": "B.Tech AIML student and developer",
    "githubUsername": "shashank1049"
}
```

---

## Change Password

```http
PATCH /api/v1/users/change-password
```

Requires authentication.

---

# 🖼️ Image APIs

CodeHub uses:

- Multer for receiving files
- Cloudinary for image storage
- MongoDB for storing image metadata

---

## Update Avatar

```http
PATCH /api/v1/users/avatar
```

Requires authentication.

Use:

```text
multipart/form-data
```

Field:

```text
avatar
```

Supported image formats:

```text
JPG
JPEG
PNG
WebP
```

Maximum file size:

```text
5 MB
```

---

## Update Cover Image

```http
PATCH /api/v1/users/cover-image
```

Requires authentication.

Field:

```text
coverImage
```

---

#  Image Upload Architecture

```text
Frontend / Postman
       │
       ▼
Multipart Form Data
       │
       ▼
Multer memoryStorage
       │
       ▼
Image Service
       │
       ▼
Cloudinary
       │
       ▼
MongoDB
```

MongoDB stores:

```json
{
    "url": "https://...",
    "publicId": "codehub/..."
}
```

The `publicId` is used to delete old images from Cloudinary.

---

#  Project APIs

## Create Project

```http
POST /api/v1/projects
```

Requires authentication.

Example request:

```json
{
    "title": "CodeHub",
    "description": "A developer platform for showcasing projects.",
    "techStack": [
        "React",
        "Node.js",
        "Express",
        "MongoDB"
    ],
    "githubUrl": "https://github.com/example/codehub",
    "liveUrl": "https://example.com"
}
```

---

## Get All Projects

```http
GET /api/v1/projects
```

Supports:

- Pagination
- Search
- Tech stack filtering
- Sorting

Example:

```http
GET /api/v1/projects?page=1&limit=10
```

---

## Get Project

```http
GET /api/v1/projects/:projectId
```

Returns project information including:

- Project details
- Owner
- Likes count
- Comments count
- Current user's like status

---

## Update Project

```http
PATCH /api/v1/projects/:projectId
```

Requires authentication.

Supported fields:

```text
title
description
techStack
githubUrl
liveUrl
```

Only the project owner can update the project.

---

## Delete Project

```http
DELETE /api/v1/projects/:projectId
```

Requires authentication.

Only the project owner can delete the project.

If the project has a Cloudinary thumbnail, it is also removed.

---

#  Project Thumbnail

## Update Project Thumbnail

```http
PATCH /api/v1/projects/:projectId/thumbnail
```

Requires authentication.

Use:

```text
multipart/form-data
```

Field:

```text
thumbnail
```

The previous thumbnail is deleted from Cloudinary after the new thumbnail is successfully saved.

If the database update fails, the newly uploaded image is rolled back.

---

# ❤️ Project Likes

## Like Project

```http
POST /api/v1/projects/:projectId/like
```

Requires authentication.

A notification is generated for the project owner.

---

## Unlike Project

```http
DELETE /api/v1/projects/:projectId/like
```

Requires authentication.

---

# 💬 Comment APIs

## Get Project Comments

```http
GET /api/v1/comments/project/:projectId
```

Returns comments associated with a project.

---

## Create Comment

```http
POST /api/v1/comments/project/:projectId
```

Requires authentication.

Example:

```json
{
    "content": "Great project!"
}
```

A notification is generated for the project owner.

---

## Update Comment

```http
PATCH /api/v1/comments/:commentId
```

Requires authentication.

Only the comment owner can update the comment.

---

## Delete Comment

```http
DELETE /api/v1/comments/:commentId
```

Requires authentication.

Only the comment owner can delete the comment.

---

# 👥 Follow System

CodeHub allows users to follow other developers.

---

## Follow User

```http
POST /api/v1/follows/:username
```

Requires authentication.

Example:

```http
POST /api/v1/follows/rahul123
```

---

## Unfollow User

```http
DELETE /api/v1/follows/:username
```

Requires authentication.

---

## Get Followers

```http
GET /api/v1/follows/:username/followers
```

Supports pagination.

Example:

```http
GET /api/v1/follows/shashank1/followers?page=1&limit=20
```

---

## Get Following

```http
GET /api/v1/follows/:username/following
```

Supports pagination.

---

## Follow Statistics

```http
GET /api/v1/follows/:username/stats
```

Returns:

```json
{
    "followersCount": 10,
    "followingCount": 5,
    "isFollowing": true
}
```

---

#  Notifications

CodeHub generates notifications for:

- Project likes
- Project comments
- New followers

---

## Get Notifications

```http
GET /api/v1/notifications
```

Requires authentication.

Supports pagination.

Example:

```http
GET /api/v1/notifications?page=1&limit=20
```

---

## Get Unread Notification Count

```http
GET /api/v1/notifications/unread-count
```

Requires authentication.

Example response:

```json
{
    "success": true,
    "data": {
        "unreadCount": 3
    }
}
```

---

## Mark Notification as Read

```http
PATCH /api/v1/notifications/:notificationId/read
```

Requires authentication.

---

## Mark All Notifications as Read

```http
PATCH /api/v1/notifications/read-all
```

Requires authentication.

---

## Delete Notification

```http
DELETE /api/v1/notifications/:notificationId
```

Requires authentication.

---

# 🔎 Search APIs

CodeHub provides basic search functionality for developers and projects.

---

## Search Everything

```http
GET /api/v1/search?q=<query>
```

Searches:

- Users
- Projects

Example:

```http
GET /api/v1/search?q=react
```

---

## Search Users

```http
GET /api/v1/search/users?q=<query>
```

Searches users by:

- username
- fullName
- bio

Example:

```http
GET /api/v1/search/users?q=rahul
```

Supports pagination:

```http
GET /api/v1/search/users?q=rahul&page=1&limit=10
```

---

## Search Projects

```http
GET /api/v1/search/projects?q=<query>
```

Searches projects by:

- title
- description
- techStack

Supports:

- Pagination
- Tech stack filtering
- Sorting

Example:

```http
GET /api/v1/search/projects?q=react
```

With filters:

```http
GET /api/v1/search/projects?q=react&techStack=React&sortBy=mostLiked
```

Supported sorting options:

```text
relevance
latest
oldest
mostLiked
```

---

#  GitHub Integration

CodeHub integrates with the GitHub REST API to display developer repositories.

---

## Get GitHub Repositories

```http
GET /api/v1/users/:username/github
```

Supports pagination.

Example:

```http
GET /api/v1/users/shashank1/github?page=1&limit=10
```

---

## Get GitHub Repository

```http
GET /api/v1/users/:username/github/:repoName
```

Example:

```http
GET /api/v1/users/shashank1/github/CodeHub
```

Returns repository information such as:

- Repository name
- Description
- GitHub URL
- Programming language
- Stars
- Forks
- Watchers
- Open issues
- Topics
- Default branch
- Created date
- Updated date

---

# 👑 Admin APIs

Admin routes require:

1. Valid authentication
2. `admin` role

---

## Get All Users

```http
GET /api/v1/admin/users
```

Requires admin authentication.

Supports:

- Pagination
- Search

Example:

```http
GET /api/v1/admin/users?page=1&limit=20
```

Search:

```http
GET /api/v1/admin/users?search=rahul
```

Sensitive fields such as passwords and refresh tokens are excluded from the response.

---

## Get All Projects

```http
GET /api/v1/admin/projects
```

Requires admin authentication.

Supports:

- Pagination
- Search

---

## Delete Project as Admin

```http
DELETE /api/v1/admin/projects/:projectId
```

Requires admin authentication.

Admins can delete projects regardless of project ownership.

Associated Cloudinary thumbnails are also cleaned up.

---

## Activate / Deactivate User

```http
PATCH /api/v1/admin/users/:userId/status
```

Requires admin authentication.

Request:

```json
{
    "isActive": false
}
```

Activate:

```json
{
    "isActive": true
}
```

A deactivated user cannot access protected routes.

Admins cannot change their own account status.

---

# 🛡️ Security

The backend implements several security measures.

### Password Security

Passwords are hashed using bcrypt before being stored in MongoDB.

### JWT Authentication

Protected routes verify access tokens before allowing access.

### Authorization

Ownership checks prevent users from modifying or deleting resources they do not own.

### Admin Authorization

Admin-only APIs verify the user's role before processing requests.

### Rate Limiting

Sensitive endpoints such as authentication are protected with rate limiting.

### File Validation

Uploaded images are validated by MIME type.

Allowed types:

```text
image/jpeg
image/jpg
image/png
image/webp
```

### File Size Limit

Maximum image size:

```text
5 MB
```

### Environment Variables

Sensitive credentials are stored in `.env` and excluded from Git.

### Sensitive Data Protection

Passwords and refresh tokens are excluded from normal user/admin responses.

---

# ⚡ Rate Limiting

CodeHub currently uses an in-memory rate limiter.

The limiter tracks requests by IP address within a configured time window.

When the limit is exceeded:

```http
429 Too Many Requests
```

is returned.

Example:

```json
{
    "success": false,
    "message": "Too many requests, please try again later"
}
```

---

# ❌ Error Handling

The backend uses centralized error handling.

Errors follow a consistent format:

```json
{
    "success": false,
    "message": "Something went wrong",
    "errors": []
}
```

Common status codes:

```text
200  Success
201  Created
400  Bad Request
401  Unauthorized
403  Forbidden
404  Not Found
409  Conflict
413  Payload Too Large
429  Too Many Requests
500  Internal Server Error
502  Bad Gateway
```

---

# 📄 API Response Format

Successful responses use a common response structure.

Example:

```json
{
    "statusCode": 200,
    "data": {},
    "message": "Success",
    "success": true
}
```

Error responses:

```json
{
    "success": false,
    "message": "Something went wrong",
    "errors": []
}
```

---

# 🗄️ Database

CodeHub uses MongoDB Atlas.

Database name:

```text
codehub
```

Main collections/models include:

```text
users
projects
comments
notifications
follows
```

---

# 🧩 Models

## User

Stores:

- Full name
- Username
- Email
- Password
- Avatar
- Cover image
- Bio
- GitHub username
- Role
- Account status
- Refresh token

---

## Project

Stores:

- Title
- Description
- Tech stack
- GitHub URL
- Live URL
- Thumbnail
- Owner
- Likes
- Timestamps

---

## Comment

Stores:

- Content
- Project
- Owner
- Timestamps

---

## Follow

Stores:

- Follower
- Following
- Timestamps

A unique compound index prevents duplicate follow relationships.

Users cannot follow themselves.

---

## Notification

Stores:

- Recipient
- Sender
- Notification type
- Project
- Comment
- Message
- Read status
- Timestamps

Notification types:

```text
LIKE
COMMENT
FOLLOW
```

---

#  Project Interaction Flow

A typical project interaction works like this:

```text
User
 │
 ├── Creates Project
 │       ↓
 │    MongoDB
 │
 ├── Uploads Thumbnail
 │       ↓
 │    Multer
 │       ↓
 │    Cloudinary
 │
 ├── Likes Project
 │       ↓
 │    Project Updated
 │       ↓
 │    Notification Created
 │
 ├── Comments
 │       ↓
 │    Comment Created
 │       ↓
 │    Notification Created
 │
 └── Other Users Follow Owner
         ↓
      Notification Created
```

---

#  Service Layer

Business logic is separated into services.

Examples:

```text
services/
├── cache.service.js
├── cloudinary.service.js
├── follow.service.js
├── github.service.js
├── image.service.js
└── notification.service.js
```

This keeps controllers focused on handling requests and responses while reusable business logic stays inside services.

---

# 🖼️ Image Replacement Strategy

When replacing an existing image:

```text
Existing Image
      │
      ▼
Upload New Image
      │
      ▼
Cloudinary
      │
      ▼
Update MongoDB
      │
      ├── Success
      │      ↓
      │   Delete Old Image
      │
      └── Failure
             ↓
       Delete New Image
```

This prevents unnecessary orphaned images when database updates fail.

---

#  API Summary

| Feature | Method | Endpoint |
|---|---|---|
| Register | POST | `/users/register` |
| Login | POST | `/users/login` |
| Logout | POST | `/users/logout` |
| Refresh Token | POST | `/users/refresh-token` |
| Current User | GET | `/users/me` |
| User Profile | GET | `/users/:username` |
| Update Profile | PATCH | `/users/update-profile` |
| Change Password | PATCH | `/users/change-password` |
| Update Avatar | PATCH | `/users/avatar` |
| Update Cover | PATCH | `/users/cover-image` |
| GitHub Repositories | GET | `/users/:username/github` |
| GitHub Repository | GET | `/users/:username/github/:repoName` |
| Create Project | POST | `/projects` |
| Get Projects | GET | `/projects` |
| Get Project | GET | `/projects/:projectId` |
| Update Project | PATCH | `/projects/:projectId` |
| Delete Project | DELETE | `/projects/:projectId` |
| Update Thumbnail | PATCH | `/projects/:projectId/thumbnail` |
| Like Project | POST | `/projects/:projectId/like` |
| Unlike Project | DELETE | `/projects/:projectId/like` |
| Get Comments | GET | `/comments/project/:projectId` |
| Create Comment | POST | `/comments/project/:projectId` |
| Update Comment | PATCH | `/comments/:commentId` |
| Delete Comment | DELETE | `/comments/:commentId` |
| Follow User | POST | `/follows/:username` |
| Unfollow User | DELETE | `/follows/:username` |
| Followers | GET | `/follows/:username/followers` |
| Following | GET | `/follows/:username/following` |
| Follow Stats | GET | `/follows/:username/stats` |
| Notifications | GET | `/notifications` |
| Unread Count | GET | `/notifications/unread-count` |
| Mark Read | PATCH | `/notifications/:notificationId/read` |
| Mark All Read | PATCH | `/notifications/read-all` |
| Delete Notification | DELETE | `/notifications/:notificationId` |
| Search All | GET | `/search` |
| Search Users | GET | `/search/users` |
| Search Projects | GET | `/search/projects` |
| Admin Users | GET | `/admin/users` |
| Admin Projects | GET | `/admin/projects` |
| Admin Delete Project | DELETE | `/admin/projects/:projectId` |
| User Status | PATCH | `/admin/users/:userId/status` |

---

# Development

Run the backend in development mode:

```bash
npm run dev
```

The server uses Nodemon for automatic restarts during development.

---

#  Future Improvements

The current backend is feature-complete for the first version.

Potential future improvements include:

- Redis-based caching
- Distributed rate limiting
- Advanced search
- Real-time notifications
- WebSocket integration
- Email notifications
- Online presence
- Automated testing
- API documentation with Swagger/OpenAPI
- Production logging
- Docker deployment
- CI/CD pipeline

These features are intentionally kept outside the current backend scope.

---

# 📈 Project Status

## Backend — Complete ✅

Implemented:

- Authentication ✅
- Authorization ✅
- User profiles ✅
- Projects ✅
- Likes ✅
- Comments ✅
- Follow system ✅
- Notifications ✅
- Search ✅
- GitHub integration ✅
- Cloudinary image uploads ✅
- Admin moderation ✅
- Rate limiting ✅
- Centralized error handling ✅
- Validation ✅
- API documentation ✅

The backend is ready for frontend integration.

---

# 👨 Author

**Shashank Mishra**

B.Tech — Artificial Intelligence & Machine Learning

GitHub:

https://github.com/shashank1049

---

# License

This project is developed for learning, portfolio, and educational purposes.