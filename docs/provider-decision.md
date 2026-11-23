# Air Quality Provider Decision Memorandum

## Evaluation Summary

### Open-Meteo / Copernicus CAMS
- **Characteristics**: CAMS chemical transport model offering gridded data (~11 km EU / ~45 km global).
- **Entitlements**: Open data under CC BY 4.0 with attribution.
- **Implementation Status**: Selected as default live provider for global queries. Labeled strictly as `estimate` and `grid` scope.

### US EPA AirNow
- **Characteristics**: Ground monitoring stations across the United States.
- **Entitlements**: Public agency data with preliminary observational flags.
- **Implementation Status**: Integrated via `AirNowAdapter` for US regulatory point observations when an API key is provided.

### Test Fixtures
- **Characteristics**: Deterministic test scenarios (fresh, stale, unavailable).
- **Implementation Status**: Visibly designated with `[TEST FIXTURE ONLY]` badges to ensure test records cannot be confused with live environmental observations.
