# Bookstore API

A RESTful API for a Bookstore Application built with TypeScript, Express.js, and MongoDB.

## Features

- User authentication with JWT
- Book management (CRUD operations)
- Search and filter books by title, author, category, and rating
- Pagination with sorting options
- Input validation using express-validator
- Error handling middleware

## Project Structure

```
bookstore/
├── src/
│   ├── routes/         # API routes
│   │   ├── auth.routes.ts    # Authentication routes
│   │   └── book.routes.ts    # Book management routes
│   ├── models/         # Database models
│   │   ├── user.model.ts     # User schema and model
│   │   └── book.model.ts     # Book schema and model
│   ├── middleware/     # Custom middleware
│   │   ├── auth.middleware.ts # Authentication middleware
│   │   └── error.middleware.ts # Error handling middleware
│   └── index.ts        # Application entry point
├── postman_output_images/  # Postman API response screenshots
├── .env                # Environment variables
├── .gitignore         # Git ignore file
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bookstore
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

4. Start the development server:
```bash
npm run dev
```

5. Build and start the production server:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "email": "user@example.com"
  },
  "token": "jwt_token_here"
}
```

### Books

#### Create Book
```
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "category": "Fiction",
  "price": 15.99,
  "rating": 4.8,
  "publishedDate": "1960-07-11"
}
```

#### Get All Books
```
GET /api/books?author=Author&category=Fiction&rating=4&title=Book&page=1&limit=10&sortBy=price&sortOrder=asc
Authorization: Bearer <token>
```

Response:
```json
{
  "books": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

#### Get Book by ID
```
GET /api/books/:id
Authorization: Bearer <token>
```

#### Update Book
```
PUT /api/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 39.99
}
```

#### Delete Book
```
DELETE /api/books/:id
Authorization: Bearer <token>
```

Response:
```json
{
  "message": "Book deleted successfully"
}
```

## Query Parameters

- `author`: Filter by author name (exact match)
- `category`: Filter by category (exact match)
- `rating`: Filter by rating (0-5)
- `title`: Search by title (case-insensitive partial match)
- `page`: Page number for pagination (default: 1)
- `limit`: Number of items per page (default: 10, max: 100)
- `sortBy`: Sort field (price or rating)
- `sortOrder`: Sort order (asc or desc)

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request (validation errors)
  ```json
  {
    "errors": [
      {
        "msg": "Title is required",
        "param": "title",
        "location": "body"
      }
    ]
  }
  ```
- 401: Unauthorized (invalid or missing token)
  ```json
  {
    "error": "Invalid credentials"
  }
  ```
- 404: Not Found (resource not found)
  ```json
  {
    "error": "Book not found"
  }
  ```
- 500: Internal Server Error
  ```json
  {
    "error": "Error creating book"
  }
  ```

## Dependencies

### Production
- express: ^4.18.2
- mongoose: ^7.6.3
- jsonwebtoken: ^9.0.2
- bcryptjs: ^2.4.3
- dotenv: ^16.3.1
- cors: ^2.8.5
- express-validator: ^7.0.1

### Development
- typescript: ^5.2.2
- nodemon: ^3.0.1
- ts-node: ^10.9.1
- jest: ^29.7.0
- @types/*: Latest versions

## Architecture

The application follows a modular architecture with clear separation of concerns:

1. **Routes**: Handle HTTP requests and delegate to appropriate handlers
2. **Models**: Define database schemas and business logic
3. **Middleware**: Handle cross-cutting concerns like authentication and error handling
4. **Configuration**: Centralized configuration management

## Naming Conventions

- Files: kebab-case (e.g., `auth.routes.ts`)
- Classes: PascalCase (e.g., `User`, `Book`)
- Functions: camelCase (e.g., `getAllBooks`)
- Variables: camelCase (e.g., `userEmail`)
- Constants: UPPER_SNAKE_CASE (e.g., `JWT_SECRET`)

## License

MIT 

![API Response Example](images) 

## Postman Collection

Postman screenshots demonstrating API responses are available in the `postman_output_images` directory. 