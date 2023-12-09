
## Project Structure

- app contains all separated features
- handlers => app logic only => request sanitization & response data
- services => business logic only => database & cache operations
- schemas => request validation & response serialization

## Installation Steps

### Without Docker

make sure install the redis server on your mechine

`cp .env.exapmle .env`
set the environment veriables

```bash
npm run sql

npm run key

npm run dev
```

### Docker :

Install Docker and Docker Compose
Set the `.env` values before starting instances

```
docker compose up
```
