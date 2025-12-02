# Inventory Management API

Ett webbaserat lagerhanterings-API byggt med **Node.js**, **Express** och **PostgreSQL**.
API:et hanterar både produkter och leverantörer, och returnerar data som JSON.
Produkter är kopplade till leverantörer via en SQL-relation och all produktdata kan hämtas tillsammans med leverantörsinfo via JOINs.

---

## Funktioner
- CRUD för produkter
- CRUD för leverantörer
- SQL-relation mellan produkter och leverantörer (`supplier_id -> suppliers.id`)
- JOIN-frågor för att returnera komplett produktinformation
- Användning av `jsonb_build_object` för att bygga inbäddade JSON-objekt i SQL-responsen
- Input-validering och tydlig felhantering
- Validering av ID-parametrar och tom body via middleware
- Miljövariabler via `.env` för säker konfiguration
- Repository-struktur för ren och testbar databaslogik

---

## API-endpoints

### Produkter
- GET /products
- GET /products/:id
- POST /products
- PUT /products/:id
- DELETE /products/:id

### Leverantörer
- GET /suppliers
- GET /suppliers/:id
- GET /suppliers/:id/products
- POST /suppliers
- PUT /suppliers/:id
- DELETE /suppliers/:id

**Relationsregler**
- **ON DELETE RESTRICT** - förhindrar att ta bort en leverantör med produkter
- **ON UPDATE CASCADE** - uppdaterar produkternas foreign key om leverantörens id ändras

---

## Databas
Produkter kopplas till leverantörer via en foreign key:
`products.supplier_id -> suppliers.id`

---

## Tekniker
- Node.js
- Express
- PostgreSQL
- SQL-joins
- jsonb_build_object
- ES Modules (import/export)

---

## Projektstruktur
Projektet är organiserat för tydlig separation av ansvar:
```text
/routes        - Express-routes som hanterar API-endpoints
/repositories  - SQL-logik och databasfrågor (DB-lagret)
/helpers       - Valideringsfunktioner och återanvändbara hjälpfunktioner
/config        - Databasanslutning och setup
.env.example   - Exempel på miljövariabler för konfiguration
```

---

## Installation & Setup

### 1. Klona repot och gå in i mappen
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Installera beroenden
```bash
npm install
```

### 3. Konfigurera miljövariabler
Skapa en env.-fil i projektets rotkatalog baserat på .env.example:
```env
# Server
HOST=localhost
PORT=3000

# Databas
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory
DB_USER=your_username
DB_PASSWORD=your_password
```

### 4. Skapa databasen
```sql
CREATE DATABASE inventory;
```

### 5. Starta servern
```bash
npm start
```
Servern körs på porten som anges i .env (t.ex. http://localhost:3000)

---

## Lärdomar
- Hur man bygger ett REST API med Node.js, Express och PostgreSQL
- Hantering av relationer mellan tabeller och SQL-joins
- Validering av indata och felhantering på serversidan
- Strukturering av projekt med routes, repositories och helpers
- Användning av miljövariabler för säker konfiguration
