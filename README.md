# poe2-tools

A browser-based toolkit for Path of Exile 2 players. Evaluate weapon damage and track live currency market rates without leaving the site.

## Summary

poe2-tools includes the following utilities:

### Weapon DPS Calculator

![Weapon DPS Calculator](./docs/dps-calculator.png)

- Paste a weapon's item text directly from Path of Exile 2 to automatically extract damage stats.
- Manually enter Attacks Per Second and min/max values for Physical, Lightning, Fire, Cold, and Chaos damage.
- Instantly calculates Total DPS and per-damage-type DPS, shown as color-coded result cards.
- Keeps a local history of recent calculations.

### Market Currency Rates

![Market Currency Rates](./docs/market-currency.png) 

- Browse live currency market data sourced from poe.ninja.
- Switch between available leagues and categories (Currency, Fragments, etc.).
- Choose a reference currency (Divine Orb, Exalted Orb, or Chaos Orb) to reprice every other rate.
- View exchange ratios, hourly volume, 7-day change percentage, and sparkline trends.

## Tech Stack

- React 19 + TypeScript
- TanStack Router + TanStack Start
- Tailwind CSS v4
- Vite
- Vitest + React Testing Library
- Biome

## Development

Requires Node.js >= 24.

```bash
npm install
npm run dev    # Start the dev server at http://localhost:3000
npm run verify # Run typecheck, lint, and tests
```

## Future Plans

- Item valuation for gear.
- Additional market overviews beyond currency.
