# Data Login

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

## Setup .env

```bash
npx auth secret
```

```env
DATABASE_URL=
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
