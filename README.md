# Sanctuary

> Uninfluenced Data for Black and Latino Communities

A navigation and intelligence platform built on **verified, sourced, uninfluenced data** — no social feed, no influencer layer, no promotional content mixed into safety data. Think Pew Research, Waze, Zillow, and the original Green Book pulled into one platform, with every artificial flavor and filler removed.

Built by **Shaun Barton** & **Jarrod Simpson**, Co-Founders.

---

## The Problem

44 million Black Americans and 63 million Latino Americans make daily decisions about where to travel, where to live, and where to build their families using tools built for general audiences — with no cultural context, no safety intelligence, and no community-specific data.

- Over **1,300 confirmed sundown towns** exist across the United States. No mainstream navigation tool flags them or routes around them.
- **Hate crime incidents** targeting Black and Latino individuals reached a 12-year high in 2023 (FBI data).
- Families commit to six-figure relocation decisions without minority business density data, faith community mapping, or displacement risk analysis.
- Neurodivergent users and introverted professionals need clean, dense, actionable data — with no social noise.

---

## The Solution — Three Modes

### 🧭 Navigation Mode
A community-aware routing engine. Enter an origin and destination and Sanctuary generates a route that **actively deflects around** historically flagged zones, documented sundown towns, and areas with elevated civil rights incident rates.

- Interactive dark map with flagged-zone radius overlays (red = sundown town, orange = elevated incident)
- Route planning between city centers and verified businesses
- Avoidance routing that calculates clearance margins for each zone bypassed
- Every zone displays its historical note and sourcing

### 📍 Travel Mode
Real-time safety intelligence and verified business discovery.

- Filterable directory of verified **Black-owned** and **Latino-owned** businesses by city, community, and category
- Safety advisory banner with live civil rights / immigration enforcement intelligence context
- One-tap emergency resources: ACLU, United We Dream, NAACP Legal Defense Fund, Mijente
- Every business shows verification date and full details

### 🏘️ Relocation Mode
Comprehensive **Sanctuary Scores** for any U.S. zip code, built across six verified data pillars.

| Pillar | What it measures |
|---|---|
| Safety | Crime rates, civil rights incident elevation, sundown town designation |
| Schools | District quality, majority-minority enrollment, nearby HBCUs |
| Financial Institutions | Black-owned banks/credit unions, CDFIs, predatory lending density |
| Community Resources | Health centers, legal aid, NAACP chapter presence |
| Minority Business | Black/Latino business density, chamber of commerce activity |
| Faith Community | AME, COGIC, NBC congregation density and community programming |

- Side-by-side comparison of any two locations
- Displacement risk ratings (Low → Critical) with analysis
- Demographic trajectory charts tracking Black population percentage over time
- Every data point displays its **source** and **last updated** date — no sponsored content touches the score

---

## The "No Filler" Design Principle

Every feature passes one test before it ships: **does this make the data clearer, or does it add noise?** If it adds noise, it does not ship.

Existing community platforms push safe places to go. Sanctuary delivers both sides of the equation — verified safe destinations **and** documented areas to avoid, with active routing around the latter.

---

## Tech Stack

- **React** + **Vite** + **Tailwind CSS**
- **react-leaflet** for interactive mapping
- **Base44** BaaS — entities, data storage, and hosting
- **lucide-react** for icons
- Dark, data-forward UI with warm amber accents evoking the Green Book heritage

### Data Model (Entities)

| Entity | Description |
|---|---|
| `Business` | Verified Black-owned and Latino-owned businesses with geo-coordinates |
| `FlaggedZone` | Sundown towns and elevated incident zones with historical notes and sourcing |
| `SanctuaryScore` | Zip-code-level scores across six pillars with displacement and demographic data |

---

## Pilot Cities

Sanctuary launches in three pilot cities through existing community organization infrastructure:

- **Atlanta, GA** — NAACP chapters, HBCU networks, AME church infrastructure
- **Houston, TX** — UnidosUS affiliates, Texas Southern University, Wheeler Avenue Baptist
- **Los Angeles, CA** — Leimert Park community, Latino Catholic networks, CRLA

---

## Data Sources

Every data point in Sanctuary carries its source and last-updated date. Current sources include:

- Loewen Sundown Town Database
- FBI Uniform Crime Reporting (UCR)
- DOJ Civil Rights Division / California DOJ Civil Rights Division
- National Center for Education Statistics (NCES)
- National Bankers Association
- CFPB HMDA data
- HRSA / Census ABS / AME Church Directory
- NAACP Chapter Directory

---

## Why Now

The original Green Book existed because Black Americans needed intelligence to survive travel in this country. That need never disappeared — it evolved. Elevated ICE enforcement, rising hate crime rates, and rollbacks of civil rights protections create a user base actively searching for exactly what Sanctuary delivers.

**Sanctuary meets it where it lives in 2026.**

---

## Contact

For inquiries, partnership opportunities, and investor conversations:

**Shaun Barton & Jarrod Simpson** — Co-Founders, Sanctuary