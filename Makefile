.SHELLFLAGS := -eu -o pipefail -c
PYTHON ?= python3

.PHONY: verify ad-data-write firebase-deploy firebase-seed

verify:
	$(PYTHON) scripts/validate_portfolio_frontdoor.py
	$(PYTHON) scripts/validate_repository_surface.py
	$(PYTHON) scripts/validate_architecture_blueprint.py
	$(PYTHON) scripts/validate_free_resource_matrix.py
	$(PYTHON) scripts/validate_service_consolidation.py
	$(PYTHON) scripts/validate_monetization_operating_system.py
	$(PYTHON) scripts/validate_ad_data_pivot.py
	node scripts/implement_commerce_routes.mjs --check
	$(PYTHON) scripts/validate_commerce_routes.py

ad-data-write:
	node scripts/generate_ad_data_pivot.mjs --write

firebase-deploy:
	npx firebase-tools@15.24.0 deploy --only firestore:rules,firestore:indexes --project kim3310-free-tools

firebase-seed:
	node scripts/seed_firebase_aggregates.mjs
