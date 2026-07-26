.SHELLFLAGS := -eu -o pipefail -c
PYTHON ?= python3

.PHONY: verify

verify:
	$(PYTHON) scripts/validate_portfolio_frontdoor.py
	$(PYTHON) scripts/validate_repository_surface.py
	$(PYTHON) scripts/validate_architecture_blueprint.py
	$(PYTHON) scripts/validate_free_resource_matrix.py
	$(PYTHON) scripts/validate_service_consolidation.py
	$(PYTHON) scripts/validate_monetization_operating_system.py
	node scripts/implement_commerce_routes.mjs --check
	$(PYTHON) scripts/validate_commerce_routes.py
