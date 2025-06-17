.PHONY: lint lint-check

# Format code and fix linting issues
lint:
	black .
	ruff check --fix .
	find src -name "*.py" -o -name "*.pyi" | grep -q . && mypy src || true

# Check code without fixing (used in CI)
lint-check:
	black . --check
	ruff check .
	find src -name "*.py" -o -name "*.pyi" | grep -q . && mypy src || true