# Privacy and Data Lifecycle Map

## Data Handling Rules

1. **Location Data**:
   - Geolocation queries are coarsened to approximately 1.1 km (~2 decimal places).
   - Exact device GPS coordinates are never transmitted to LLM endpoints.

2. **Personal Health & Medical Data**:
   - No medical diagnoses, conditions, or clinical histories are collected.
   - Sensitive group guidance is managed via a broad opt-in toggle without diagnosis collection.

3. **User Preferences**:
   - Stored in browser local storage or authenticated user profiles.
   - Includes commute mode, outdoor activity windows, and AQI scale preference.

4. **Data Deletion Cascade**:
   - Users can permanently delete all local preferences, saved locations, and cached data via the Settings panel.
