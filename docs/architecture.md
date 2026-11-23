# Technical Architecture Specification

## Overview
BreatheWise AI is an urban air-quality intelligence web application engineered with React, TypeScript, Vite, and Tailwind CSS on the frontend, with a decoupled Edge Function architecture and Postgres database layer.

## Component Layers

### 1. Presentation Layer
- **Dashboard**: Features the Primary AQI Display with tabular numbers, explicit data type chips (`observed`, `estimate`, `forecast`), scale indicators (`US_AQI`, `EU_EAQI`), and freshness indicators.
- **Pollutant Grid**: Reports physical concentrations in raw units (`µg/m³`) for PM2.5, PM10, O3, NO2, SO2, and CO.
- **Hourly Trend & Explorer**: Multi-hour trend graphs and interactive map with accessible list/table alternates.
- **Action List**: Ranked behavioral suggestions backed by public health guidance.
- **Indoor Guide**: Non-sensor source reduction, ventilation checks, and CADR/HEPA sizing.
- **Impact Tracker**: Deterministic transport emissions differential calculator.

### 2. Provider Abstraction Layer
- Provider adapter interface ensures no UI component is coupled directly to upstream schemas.
- `OpenMeteoAdapter`: Global gridded CAMS chemical transport model.
- `AirNowAdapter`: US EPA regulatory point station readings.
- `FixtureAdapter`: Contract test fixture with `[TEST FIXTURE ONLY]` labeling.

### 3. AI Safety & Closed-Context Flow
- The Gemini service receives only sanitized JSON payloads containing observed measurements, user preference enums, and approved public health guidelines.
- User inputs are delimited as untrusted data to protect against prompt injection.
- Automatic fallback routes to the deterministic rule engine if API keys are missing, invalid, or rate limited.
