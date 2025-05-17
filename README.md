# Tech Stack

- Next.js
- TypeScript
- TailwindCSS
- PostgreSQL
- Drizzle ORM
- Auth.js
- NeonDB Serverless
- Shadcn UI

## Data Login

- admin
    - email: admin@gmail.com
    - password: admin123

- approver1
    - email: approver1@gmail.com
    - password: approver1pass

- approver2
    - email: approver2@gmail.com
    - password: approver2pass

## Setup

First, run the development server:

```bash
npm install

npm run dev
```

## Database Setup

```bash
npm run db:generate

npm run db:migrate
```

## Setup .env.local

```bash
npx auth secret
```

```env
DATABASE_URL=
```

## Deploy on Vercel

https://vehicles-monitoring.vercel.app/
