# Elas Fazem — Service Marketplace for Women

Service marketplace platform built for women, featuring dual-role authentication (**Cliente** & **Prestadora de Serviços**), provider discovery, quote requests, two-way direct contact links (WhatsApp & Instagram), and integrated real-time messaging built with **Angular**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

🔗 **[Live Demo](https://thamiresvs.github.io/angular-elas-fazem-mvp/)**

---

## Key Features

- **Dual-Role Registration & Auth:** Separate onboarding and profile flows for **Clientes** (name, email, phone/WhatsApp, city) and **Prestadoras de Serviços** (category, bio, hourly rate, WhatsApp, and Instagram).
- **Provider Discovery:** Search and filter female service providers by category, city, or keyword, with direct one-click links to **WhatsApp** and **Instagram**.
- **Quote Requests & Two-Way Contact:** Clients can request tailored quotes; providers can accept or decline requests and reach out directly to the client's WhatsApp.
- **Integrated Real-Time Chat + Fallback:** Built-in messaging thread per quote request powered by Supabase Realtime (with seamless `localStorage` demo fallback so visitors can test every flow without external configuration).

---

## Tech Stack

- **Front-End:** Angular 18 (Standalone Components, Signals, Reactive Forms), TypeScript, Tailwind CSS
- **BaaS / Database:** Supabase (Auth, PostgreSQL, Realtime) + Hybrid `localStorage` Demo Engine

---

## Running Locally

1. Clone the repository:

```bash
git clone https://github.com/Thamiresvs/elas-fazem-mvp.git
cd elas-fazem-mvp
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Configure your Supabase credentials in `src/environments/environment.ts` and execute `supabase/schema.sql`. If left unconfigured, the app automatically runs in full interactive demo mode.

4. Start the development server:

```bash
npm start
```

Open `http://localhost:4200` in your browser.
