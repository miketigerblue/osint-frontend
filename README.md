# OSINT Threat Dashboard

A React + Vite-based frontend for visualising and filtering OSINT threat data. This dashboard consumes structured threat intelligence from a companion [Rust Feed Ingestor][rust-feed] service and provides interactive charts, severity filters, and detailed threat views.

---

**Related projects**  
- **Rust Feed Ingestor**: [miketigerblue/rust-feed-ingestor][rust-feed]  
- **OSINT Enricher**: [miketigerblue/osint-enricher][osint-enricher]  

---

## Features

- **Vite-powered** for lightning-fast builds and hot module replacement  
- **React** with **TypeScript** for a robust, type-safe codebase  
- **SWR** for data fetching, caching, and revalidation  
- **React Router** for client-side navigation between the dashboard and detail pages  
- **Tailwind CSS** for utility-first, responsive styling  
- **Recharts** for interactive area charts visualising threat trends  
- **Severity filter** and **date-range selector** (24 hrs, 48 hrs, 7 days, 1 month)  
- **Detail pages** with comprehensive threat information and indicators  
- Responsive, mobile-first layout with accessible components  

---

## Prerequisites

- **Node.js** v16+ and **npm** (or **Yarn**)  
- A running **Rust Feed Ingestor** backend on `http://localhost:3001`  
- (Optional) An **OSINT Enricher** service for AI-driven analysis  

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/miketigerblue/osint-frontend.git
cd osint-frontend
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

### 3. Configure the API proxy

By default, Vite proxies requests from `/mv_threat_frontend` to `http://localhost:3001`. You can adjust this in `vite.config.ts`:

```ts
export default defineConfig({
  server: {
    proxy: {
      '/mv_threat_frontend': 'http://localhost:3001'
    }
  }
});
```

### 4. Run in development mode

Start the dev server with hot-reload:

```bash
npm run dev
```

Then open [http://localhost:3005](http://localhost:3005) in your browser.

### 5. Build for production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### 6. Preview the production build

```bash
npm run preview
```

---

## Project Structure

```
osint-frontend/
├── public/               # Static assets and HTML template
├── src/
│   ├── assets/           # Images, icons, fonts
│   ├── components/       # Reusable React components (cards, badges, filters)
│   ├── hooks/            # Custom hooks (useThreats)
│   ├── pages/            # Page components (Dashboard, ThreatDetail)
│   ├── index.css         # Tailwind base styles
│   └── main.tsx          # Application entrypoint
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── package.json          # NPM scripts and dependencies
```

---

## Available Scripts

- `npm run dev` — start dev server  
- `npm run build` — build for production  
- `npm run preview` — locally preview production build  
- `npm run lint` — run ESLint (if configured)  
- `npm run format` — run Prettier (if configured)  

---

## Contributing

Contributions welcome! Please open an issue or submit a pull request to propose improvements. Ensure that:

- Code is formatted with **Prettier**  
- TypeScript errors are resolved  
- New features include tests where applicable  

---

## Licence

MIT © Mike Harris

---

[rust-feed]: https://github.com/miketigerblue/rust-feed-ingestor
[osint-enricher]: https://github.com/miketigerblue/osint-enricher
