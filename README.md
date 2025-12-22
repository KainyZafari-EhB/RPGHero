# 🗡️ RPG Hero API

A powerful, database-driven REST API for managing RPG heroes and QUESTS, built with Node.js and Express. This project demonstrates a complete backend implementation with CRUD operations, advanced validation, and a dashboard GUI.


##  Features

- **Resource Management**: Complete CRUD interfaces for **Heroes** and **Quests**.
- **Admin Dashboard**: A built-in GUI for easy data management (no terminal needed!).
- **Advanced Search**: Filter results by multiple criteria (class, level, difficulty, rewards).
- **Pagination**: Efficient data loading with `limit` and `offset`.
- **Sorting**: Sort results by any field in ascending or descending order.
- **Validation**: Robust input validation including date ranges and logic checks.
- **Documentation**: Beautiful, fully documented API available at the root endpoint.

##  Getting Started

### Prerequisites
- Node.js (v20 or later)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RPGHero
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Seed the database** (Optional)
   Populates the database with sample heroes (like Aragorn, Gandalf) and quests.
   ```bash
   npm run seed
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 📖 Usage

### 1. API Documentation
Once the server is running, open your browser to:
[http://localhost:3000/](http://localhost:3000/)

This page contains detailed documentation for every endpoint, including parameters and example requests.

### 2. Admin Dashboard
Manage your data with a user-friendly interface:
[http://localhost:3000/admin.html](http://localhost:3000/admin.html)

### 3. API Endpoints Overview

#### Heroes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/heroes` | List all heroes (supports pagination/sorting) |
| `GET` | `/heroes/:id` | Get details of a specific hero |
| `GET` | `/heroes/search` | Search by name, class, or level |
| `POST` | `/heroes` | Create a new hero |
| `PUT` | `/heroes/:id` | Update an existing hero |
| `DELETE` | `/heroes/:id` | Delete a hero |

#### Quests
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/quests` | List all quests (supports pagination/sorting) |
| `GET` | `/quests/:id` | Get details of a specific quest |
| `GET` | `/quests/search` | Search by title, difficulty, rewards |
| `POST` | `/quests` | Create a new quest |
| `PUT` | `/quests/:id` | Update an existing quest |
| `DELETE` | `/quests/:id` | Delete a quest |

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (via `better-sqlite3`)
- **Validation**: `express-validator`
- **Security**: `express-rate-limit`

## 📚 Sources used

- [Express.js Documentation](https://expressjs.com/)
- [Better-SQLite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Twilio API Docs](https://www.twilio.com/docs/usage/api) (Inspiration for documentation style)

## 📄 License

This project is licensed under the ISC License.
