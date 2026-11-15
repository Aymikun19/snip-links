# Snip: Link Shortener with Analytics

Create short links (`snip.app/my-talk`) and see who clicks them: clicks per day, top referrers, devices and countries.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e) ![Recharts](https://img.shields.io/badge/charts-Recharts-22b5bf) ![Tests](https://img.shields.io/badge/tests-vitest-yellow)

## Features

- Random or custom slugs, validated and checked against reserved route names
- Fast redirects through a Route Handler (`/[slug]`) that logs the click and redirects in one database round trip
- Analytics dashboard: 30-day zero-filled daily chart, top referrers, devices and countries
- **Bot filtering**: WhatsApp, Facebook and other link-preview crawlers are counted separately so they don't inflate your numbers

## Design

- The public redirect calls a `security definer` function, `resolve_link()`, that records the click and returns the URL. Anonymous visitors never get direct access to the `links` or `clicks` tables.
- Country comes from Vercel's `x-vercel-ip-country` header, with no third-party geo-IP service.
- Aggregation lives in pure functions (`src/lib/analytics.ts`) with unit tests.

## Run it

```bash
# run supabase/schema.sql
cp .env.example .env.local
npm install && npm run dev
npm test
```
