---
'@react-lgpd-consent/core': patch
'@react-lgpd-consent/mui': patch
'react-lgpd-consent': patch
---

# Changelog

## ✨ Added

### Coverage Analysis
- Added `coverage-analysis.sh` to perform comprehensive test coverage analysis.
- Automated execution of tests with coverage enabled and extraction of metrics from `coverage-summary.json`.
- Added support for multiple coverage output formats:
  - LCOV
  - Cobertura XML
  - Clover XML
  - JSON
  - HTML
- Automatic opening of the HTML coverage report in the default browser.
- Updated `README.md` with documentation for the new coverage analysis script and usage instructions.

### Versioning & Releases
- Added `VERSIONING.md` describing the versioning strategy based on **Changesets** and **Turborepo**.
- Documented the full release workflow, including automated CI/CD steps for versioning, publishing, and tagging.

### CI/CD Documentation
- Added `WORKFLOWS.md` detailing the CI/CD architecture and guiding principles.
- Documented CI steps, automated version bumps, NPM publishing, and documentation deployment processes.

### Dependency & CI Improvements
- Updated peer dependencies to improve React version compatibility.
- Enhanced CI permissions to support the updated release and publishing workflows.

## 📝 Documentation
- Updated example documentation links in `examples/README.md` to reflect the new documentation structure.
- Corrected troubleshooting links in the following package READMEs:
  - `core`
  - `mui`
  - `react-lgpd-consent`
- Updated Quickstart documentation links to point to the new documentation paths.
- Updated `INTEGRACOES.md` to reflect the new locations for recipes and troubleshooting documentation.

## 🐛 Fixed

### Coverage Configuration
- Updated Jest coverage thresholds in `jest.config.mjs`:
  - Statements: **98%**
  - Lines: **98%**
  - Functions: **98%**
  - Branches: **91%**
- Updated coverage thresholds in `coverage-check.cjs` and related scripts to align with the new coverage standards.

