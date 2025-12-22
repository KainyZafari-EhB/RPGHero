# RPG Hero API

A database-driven REST API for managing RPG heroes and quests, built with Node.js and Express.

## Features

- **Two CRUD interfaces**: Heroes and Quests
- **Pagination**: Limit and offset support for list endpoints
- **Search**: Search by name and other fields
- **Sorting**: Sort results by various fields
- **Validation**: Comprehensive input validation
- **Documentation**: API documentation available at root endpoint

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RPGHero
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Seed the database** (optional - adds sample data)
   ```bash
   npm run seed
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the API**
   - API Documentation: http://localhost:3000/
   - Heroes API: http://localhost:3000/heroes
   - Quests API: http://localhost:3000/quests

## API Endpoints

### Heroes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/heroes` | Get all heroes (supports pagination and sorting) |
| GET | `/heroes/:id` | Get a specific hero |
| POST | `/heroes` | Create a new hero |
| PUT | `/heroes/:id` | Update an existing hero |
| DELETE | `/heroes/:id` | Delete a hero |
| GET | `/heroes/search` | Search heroes by name or class |

### Quests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quests` | Get all quests (supports pagination and sorting) |
| GET | `/quests/:id` | Get a specific quest |
| POST | `/quests` | Create a new quest |
| PUT | `/quests/:id` | Update an existing quest |
| DELETE | `/quests/:id` | Delete a quest |
| GET | `/quests/search` | Search quests by title or difficulty |

### Query Parameters

- `limit` - Number of results to return (default: 10)
- `offset` - Number of results to skip (default: 0)
- `sort` - Field to sort by
- `order` - Sort order: `asc` or `desc` (default: asc)

## Technologies Used

- **Node.js** (v20+) - JavaScript runtime
- **Express.js** - Web framework
- **better-sqlite3** - SQLite database driver
- **express-validator** - Input validation

## Sources

- Express.js documentation: https://expressjs.com/
- better-sqlite3 documentation: https://github.com/WiseLibs/better-sqlite3
- express-validator documentation: https://express-validator.github.io/
- MDN Web Docs for JavaScript: https://developer.mozilla.org/

## License

ISC
