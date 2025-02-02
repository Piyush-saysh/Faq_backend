# FAQ API

Simple FAQ management API built with Node.js, Express, MongoDB, and Redis.

## Prerequisites

- Node.js 23+
- MongoDB
- Redis

## Assumptions

- A distinct service is responsible for managing the creation and refreshing of JWT tokens.

## Local Development

1. Clone repository:

```bash
git clone https://github.com/Piyush-saysh/Faq_backend.git
cd faq-backend
```

2. Install dependencies

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Start development server:

```bash
npm run dev
```


## Environment Variables

Create `.env` with:

```bash
MONGO_URL=mongodb://localhost:27017/faqs
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secure_secret
```

## Testing

Run tests:

```bash
npm test
```
