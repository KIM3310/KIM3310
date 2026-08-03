.SHELLFLAGS := -eu -o pipefail -c
PYTHON ?= python3

.PHONY: verify verify-commercial verify-live ad-data-write adsense-publications-write

verify:
	$(PYTHON) scripts/validate_portfolio_frontdoor.py
	$(PYTHON) scripts/validate_repository_surface.py
	$(PYTHON) scripts/validate_architecture_blueprint.py

verify-commercial: verify
	$(PYTHON) scripts/validate_free_resource_matrix.py
	$(PYTHON) scripts/validate_service_consolidation.py
	$(PYTHON) scripts/validate_monetization_operating_system.py
	$(PYTHON) scripts/validate_ad_data_pivot.py
	node scripts/generate_adsense_publications.mjs
	$(PYTHON) scripts/validate_adsense_publications.py
	node scripts/implement_commerce_routes.mjs --check
	$(PYTHON) scripts/validate_commerce_routes.py

verify-live: verify-commercial
	$(PYTHON) scripts/validate_adsense_publications.py --live

ad-data-write:
	node scripts/generate_ad_data_pivot.mjs --write

adsense-publications-write:
	node scripts/generate_adsense_publications.mjs --write
