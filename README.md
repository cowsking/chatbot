# E-commerce chatbot for J. Crew

Create a chatgpt chatbot for J. Crew using LangChain, Supabase, Typescript, Openai, and Next.js. 


The visual guide of this repo and tutorial is in the `visual guide` folder.

## Development

1. Clone the repo

```
git clone [github https url]
```

2. Install packages

```
pnpm install
```

3. Set up your `.env` file

- Copy `.env.local.example` into `.env`
  Your `.env` file should look like this:

```
OPENAI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

```

## Run the app

Since I have save the data of J.Crew in supabase table, you can run the app `npm run dev` and type a question to ask the website regarding the products.

## Credit

Frontend of this repo is inspired by [langchain-chat-nextjs](https://github.com/zahidkhawaja/langchain-chat-nextjs)

This repo uses guides from the [repo](https://github.com/mayooear/langchain-supabase-website-chatbot) LangChain & Supabase - Create a ChatGpt Chatbot for Your Website
