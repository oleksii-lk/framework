# E2E testing lab

A learning project for demonstrating approaches to unit, integration, and e2e testing.

**Stack:**
- Frontend: React + TypeScript (Vite)
- Backend: Python + FastAPI
- Unit/Component tests: Vitest + Testing Library
- API tests: Pytest
- E2E tests: Playwright

---

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

### E2E

```bash
cd e2e
npm install
npx playwright install chromium
```

---

## Running the app

```bash
# Terminal 1 — backend
cd backend && uvicorn app.main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend && npm run dev
```

Then open http://localhost:5173

**Test accounts:**
| Username | Password    |
|----------|-------------|
| test     | test        |


---

## Running tests

### Backend unit + integration tests (Pytest)

```bash
cd backend
pytest                          # run all tests
pytest tests/unit/              # unit tests only
pytest tests/integration/       # integration tests only
pytest -v                       # verbose output
```

### Frontend tests (Vitest)

```bash
cd frontend
npm test                        # run once
npm run test:watch              # watch mode
npm run coverage                # with coverage report
```

### E2E tests (Playwright)

> Both servers must be running, OR Playwright will start them automatically.

```bash
cd e2e
npx playwright test             # headless
npx playwright test --headed    # watch the browser
npx playwright test --ui        # interactive UI mode
```

---

## Testing tech stack

| Test type   | Tool       | What it tests | Speed | Where |
|-------------|------------|---------------|-------|-------|
| Unit        | Pytest     | Single function in isolation | Fast | `backend/tests/unit/` |
| Unit        | Vitest     | React component / hook / function | Fast | `frontend/src/tests/` |
| Integration | Pytest + TestClient | Full HTTP request/response cycle | Medium | `backend/tests/integration/` |
| E2E         | Playwright | Real browser + full stack | Slow | `e2e/tests/` |
