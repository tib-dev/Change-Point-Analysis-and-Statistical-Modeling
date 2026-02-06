# Save this as 'Makefile' in your root directory
install:
	pip install -e .
	pip-compile pyproject.toml --output-file=requirements.lock

sync:
	pip install -r requirements.lock
