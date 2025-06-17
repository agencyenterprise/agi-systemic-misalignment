.PHONY: lint lint-check install serve-api serve-frontend lint-frontend lint-frontend-check install-frontend

# Install dependencies
install:
	pip install -r requirements.txt
	pip install -r requirements-dev.txt

# Install frontend dependencies
install-frontend:
	cd app && npm install

# Install all dependencies
install-all: install install-frontend

# Format code and fix linting issues (backend)
lint-backend:
	black .
	ruff check --fix .
	find src -name "*.py" -o -name "*.pyi" | grep -q . && mypy src || true

# Check code without fixing (backend, used in CI)
lint-backend-check:
	black . --check
	ruff check .
	find src -name "*.py" -o -name "*.pyi" | grep -q . && mypy src || true

# Format code and fix linting issues (frontend)
lint-frontend:
	cd app && npm ci && npm run lint && npm run type-check

# Check code without fixing (frontend, used in CI)
lint-frontend-check:
	cd app && npm ci && npm run lint-check && npm run type-check

# Format code and fix linting issues (both backend and frontend)
lint: lint-backend lint-frontend

# Check code without fixing (both backend and frontend, used in CI)
lint-check: lint-backend-check lint-frontend-check

# Serve the FastAPI application
serve-api:
	uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

# Serve the React frontend application
serve-frontend:
	cd app && npm start