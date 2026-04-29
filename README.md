# Ensemble CRM — v5.1
**Ensemble Digital Labs** · [ensembledigilabs.com](https://ensembledigilabs.com)

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # → /dist  (production)
npm run preview    # → preview production build
```

## Login
Navigate to `http://localhost:3000` and sign in with your credentials.
*(Default admin account: Username `Admin` / Password `Admin` — change after first login)*

---

## Modules

| Sidebar | Description |
|---|---|
| 🏠 Home | KPI dashboard, pipeline funnel, activity feed |
| 🎯 Leads | Lead lifecycle — activities, proposals, convert to account |
| 🏢 Accounts | Detail pages — contacts, opportunities, contracts, timeline |
| 👤 Contacts | Global list with account linking |
| 💰 Opportunities | Kanban + list pipeline, detail page with child activities |
| 📄 Contracts | Dedicated screen — Cards / Table, side detail panel, file open/preview |
| 📅 Activities | Global list + interactive calendar view |
| ⬆️ Import / Export | CSV import (5 modules), CSV export, full JSON backup / restore |
| 🛡️ Users | Invite, role management, deactivate *(Admin only)* |

## Project Structure

```
ensemble-crm/
├── index.html          # HTML shell
├── vite.config.js
├── package.json
├── public/favicon.svg
└── src/
    ├── main.jsx        # ReactDOM entry point
    ├── App.jsx         # All 49 components  (3 998 lines)
    └── index.css       # Reset, splash, login animations
```

## Data Persistence
All data stored in `localStorage` under the `ecrm_` prefix.

| Key | Contents |
|---|---|
| `ecrm_session` | Active session |
| `ecrm_users` | User accounts |
| `ecrm_accts` | Accounts (15 pre-loaded) |
| `ecrm_contacts` | Contacts (20 pre-loaded) |
| `ecrm_opps` | Opportunities |
| `ecrm_acts` | Activities |
| `ecrm_leads` | Leads |
| `ecrm_contracts` | Contracts |

---
© Ensemble Digital Labs
