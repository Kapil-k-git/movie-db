## Movie DB API

Simple Node.js + TypeScript REST API for querying movies and people stored in MongoDB, with JWT-based authentication and hardcoded users.

### Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm**
- **MongoDB** running locally (default: `mongodb://localhost:27017`)

### 1. Install dependencies

```bash
cd movie-db
npm install
```

### 2. Environment configuration

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL="your_db_url"
JWT_SECRET=change_me_to_a_long_random_string
```

> Adjust `DATABASE_URL` if your Mongo instance is different.

### 3. Seed the database

Make sure MongoDB is running,
then past the dataset to the data folder of the repo by rename them as movie.tsv and person.tsv then seed movies and people by running this:

```bash
npm run seed:movie
npm run seed:person
```

These commands read the TSV files under `src/data` (already in the repo) and populate the `movies` and `people` collections.

### 4. Authentication

The API uses **JWT** with **hardcoded users** stored in `src/utils/users.ts`.  
Open that file to see the current credentials (emails and plain passwords or bcrypt hashes).

#### 4.1. Get a token

Login with one of the hardcoded users (example):

```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use this token in the `Authorization` header for protected endpoints:

```bash
-H "Authorization: Bearer <token>"
```

### 5. Run the API

```bash
npm run dev
```

Server will start on:

```text
http://localhost:5000
```

### 6. API endpoints

- **Auth**
  - **POST** `/api/auth/login` – returns a JWT for valid credentials.

- **Movies**
  - **GET** `/api/movies` – search movies with optional query params:
    - `year` – number
    - `genre` – string
    - `type` – string
    - `personName` – string (filters movies by associated person name)
  - **GET** `/api/movies/list` – returns a small list of movies.

- **People**
  - **GET** `/api/people` – search people with optional query params:
    - `name`
    - `profession`
    - `movieTitle`
  - **GET** `/api/people/list` – returns a small list of people.

All movie/people endpoints require a valid **`Authorization: Bearer <token>`** header.

### 7. Example requests

```bash
# Search movies by genre
curl "http://localhost:5000/api/movies?genre=Comedy" \
  -H "Authorization: Bearer <token>"

# Search movies by person name
curl "http://localhost:5000/api/movies?personName=Lauren%20Bacall" \
  -H "Authorization: Bearer <token>"

# Search people by name
curl "http://localhost:5000/api/people?name=Tom" \
  -H "Authorization: Bearer <token>"
```
