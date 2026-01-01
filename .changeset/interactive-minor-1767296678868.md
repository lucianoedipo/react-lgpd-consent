---
'@react-lgpd-consent/core': minor
'@react-lgpd-consent/mui': minor
'react-lgpd-consent': minor
---

feat: enhance cookie consent banner positioning and clarity
- Updated `main.ts` to remove MDX stories and add Vite configuration for chunk size warnings.
- Revised `CONFORMIDADE.md` to include clear communication about cookie categories.
- Added positioning options for the cookie banner and floating button in `QUICKSTART.md`.
- Clarified default texts in `README.md` regarding cookie usage and user consent.
- Improved related package links in `README.md` and `core/README.md`.
- Enhanced consent texts in `ConsentContext.tsx` for better user understanding.
- Updated `DesignContext.tsx` to improve prop documentation.
- Revised advanced texts in `advancedTexts.ts` for clarity on cookie usage.
- Adjusted tests in `cookieUtils.test.ts` for legacy cookie parsing.
- Removed unnecessary browser environment comment in `cookieDiscovery.ts`.
- Cleaned up developer guidance in `developerGuidance.ts`.
- Updated `CookieBanner` and `CookieBanner.stories.tsx` to support new positioning props.
- Added API documentation for banner positioning in `API.md`.
- Increased bundle size limits in `react-lgpd-consent/package.json`.
- Created patch for `@mui/icons-material` to address compatibility issues.
- Updated `pnpm-lock.yaml` to reflect new dependencies and patches.
- Removed shell execution in `run-typedoc.mjs` for improved compatibility.
