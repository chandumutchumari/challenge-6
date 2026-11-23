# BreatheWise AI

Decision-grade urban air quality assistant built with React, TypeScript, Tailwind CSS, and Vite.

## Features

- **Live Air Quality Dashboard**: Shows real-time AQI with clear scale, data type, and provenance metadata.
- **Pollutant Breakdown**: Displays measured concentrations for PM2.5, PM10, O3, NO2, SO2, and CO in physical units.
- **Hourly Trend & Forecasting**: Multi-hour trend view with an accessible data table alternative.
- **Evidence-Linked Advice**: Actionable daily routines tailored to user preferences and grounded in public health guidelines.
- **Indoor Air Quality Guide**: Source reduction, ventilation timing, and air cleaner sizing guidance.
- **Transport Impact Calculator**: Deterministic carbon dioxide equivalent emissions differential calculations.
- **Community Share Card**: Privacy-preserving shareable reports with coarsened coordinates.
- **AI Assistant**: Context-bounded assistant with prompt-injection defenses and deterministic fallback.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Security & Privacy

- Location coordinates are coarsened to approximately 1.1 km to protect user privacy.
- No medical diagnoses or sensitive personal health information are collected.
- Secrets are stored exclusively in environment variables and never exposed to the client bundle.
