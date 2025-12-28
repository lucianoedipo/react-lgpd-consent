// tsup.config.ts
import { defineConfig } from "tsup";

// package.json
var package_default = {
  name: "react-lgpd-consent",
  version: "0.7.1",
  description: "Biblioteca de consentimento LGPD, integra\xE7\xF5es nativas e sistema extens\xEDvel para React.",
  keywords: [
    "lgpd",
    "anpd",
    "cookie",
    "consent",
    "react",
    "typescript",
    "js-cookie",
    "consentimento",
    "privacidade",
    "acessibilidade",
    "google-analytics",
    "userway"
  ],
  publishConfig: {
    access: "public"
  },
  author: {
    name: "Luciano \xC9dipo",
    email: "luciano.psilva@anpd.gov.br",
    url: "https://github.com/lucianoedipo"
  },
  license: "MIT",
  type: "module",
  main: "dist/index.cjs",
  module: "dist/index.js",
  types: "dist/index.d.ts",
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    },
    "./core": {
      types: "./dist/core.d.ts",
      import: "./dist/core.js",
      require: "./dist/core.cjs"
    },
    "./mui": {
      types: "./dist/mui.d.ts",
      import: "./dist/mui.js",
      require: "./dist/mui.cjs"
    },
    "./integrations": {
      types: "./dist/integrations.d.ts",
      import: "./dist/integrations.js",
      require: "./dist/integrations.cjs"
    },
    "./package.json": "./package.json"
  },
  sideEffects: [
    "dist/chunk-*.js",
    "dist/chunk-*.cjs"
  ],
  files: [
    "dist",
    "README.md",
    "API.md",
    "package.json",
    "README.en.md",
    "QUICKSTART.md",
    "QUICKSTART.en.md",
    "INTEGRACOES.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  engines: {
    node: ">=20.0.0"
  },
  scripts: {
    clean: "rimraf dist",
    build: "cross-env NODE_ENV=production tsup",
    dev: "cross-env NODE_ENV=development tsup --watch",
    lint: 'eslint "src/**/*.{ts,tsx}" --cache',
    "lint:ci": 'eslint "src/**/*.{ts,tsx}" --cache --max-warnings=0',
    format: 'prettier --write "src/**/*.{ts,tsx,json,md}"',
    "type-check": "tsc --noEmit",
    test: "jest --config ../../jest.config.mjs",
    "test:a11y": "jest --config ../../jest.config.mjs --testMatch='**/*.a11y.test.tsx'",
    "test:coverage": "jest --config ../../jest.config.mjs --coverage",
    "coverage-check": "node ../../scripts/coverage-check.cjs",
    "size-check": "size-limit",
    prepublishOnly: "pnpm run build",
    "docs:generate": "node ../../scripts/run-typedoc.mjs",
    storybook: "storybook dev -p 6006 --config-dir ../../.storybook",
    "build-storybook": "storybook build --config-dir ../../.storybook --output-dir ../../storybook-static"
  },
  repository: {
    type: "git",
    url: "git+https://github.com/lucianoedipo/react-lgpd-consent.git"
  },
  bugs: {
    url: "https://github.com/lucianoedipo/react-lgpd-consent/issues"
  },
  homepage: "https://lucianoedipo.github.io/react-lgpd-consent/",
  peerDependencies: {
    "@mui/icons-material": "^7.0.0 || ^6.0.0 || ^5.15.0",
    "@mui/material": "^7.0.0 || ^6.0.0 || ^5.15.0",
    react: "^18.2.0 || ^19.0.0",
    "react-dom": "^18.2.0 || ^19.0.0"
  },
  peerDependenciesMeta: {
    "@mui/icons-material": {
      optional: true
    },
    "@mui/material": {
      optional: true
    }
  },
  dependencies: {
    "@react-lgpd-consent/core": "workspace:^0.7.1",
    "@react-lgpd-consent/mui": "workspace:^0.7.1"
  },
  "size-limit": [
    {
      name: "ESM Bundle",
      path: "dist/index.js",
      limit: "80 KB"
    },
    {
      name: "CJS Bundle",
      path: "dist/index.cjs",
      limit: "120 KB"
    },
    {
      name: "Types",
      path: "dist/index.d.ts",
      limit: "130 KB"
    },
    {
      name: "Complete Package Import",
      path: "dist/index.js",
      import: "{ ConsentProvider, useConsent, ConsentScriptLoader }",
      limit: "80 KB"
    }
  ]
};

// tsup.config.ts
var tsup_config_default = defineConfig({
  entry: ["src/index.ts", "src/core.ts", "src/mui.ts", "src/integrations.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  minify: false,
  sourcemap: false,
  target: "es2020",
  outDir: "dist",
  define: {
    __LIBRARY_VERSION__: JSON.stringify(package_default.version)
  },
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@react-lgpd-consent/core",
    "@react-lgpd-consent/mui"
  ],
  banner: {
    js: "// react-lgpd-consent aggregate build"
  },
  esbuildOptions(options) {
    options.legalComments = "none";
  }
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIi9ob21lL2x1Y2lhbm8vbHVjaWFub2VkaXBvL3JlYWN0LWxncGQtY29uc2VudC9wYWNrYWdlcy9yZWFjdC1sZ3BkLWNvbnNlbnQvdHN1cC5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL2hvbWUvbHVjaWFuby9sdWNpYW5vZWRpcG8vcmVhY3QtbGdwZC1jb25zZW50L3BhY2thZ2VzL3JlYWN0LWxncGQtY29uc2VudFwiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vaG9tZS9sdWNpYW5vL2x1Y2lhbm9lZGlwby9yZWFjdC1sZ3BkLWNvbnNlbnQvcGFja2FnZXMvcmVhY3QtbGdwZC1jb25zZW50L3RzdXAuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndHN1cCdcbmltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuL3BhY2thZ2UuanNvbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgZW50cnk6IFsnc3JjL2luZGV4LnRzJywgJ3NyYy9jb3JlLnRzJywgJ3NyYy9tdWkudHMnLCAnc3JjL2ludGVncmF0aW9ucy50cyddLFxuICBmb3JtYXQ6IFsnZXNtJywgJ2NqcyddLFxuICBkdHM6IHRydWUsXG4gIGNsZWFuOiB0cnVlLFxuICBzcGxpdHRpbmc6IHRydWUsXG4gIHRyZWVzaGFrZTogdHJ1ZSxcbiAgbWluaWZ5OiBmYWxzZSxcbiAgc291cmNlbWFwOiBmYWxzZSxcbiAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgb3V0RGlyOiAnZGlzdCcsXG4gIGRlZmluZToge1xuICAgIF9fTElCUkFSWV9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLnZlcnNpb24pLFxuICB9LFxuICBleHRlcm5hbDogW1xuICAgICdyZWFjdCcsXG4gICAgJ3JlYWN0LWRvbScsXG4gICAgJ3JlYWN0L2pzeC1ydW50aW1lJyxcbiAgICAnQHJlYWN0LWxncGQtY29uc2VudC9jb3JlJyxcbiAgICAnQHJlYWN0LWxncGQtY29uc2VudC9tdWknLFxuICBdLFxuICBiYW5uZXI6IHtcbiAgICBqczogJy8vIHJlYWN0LWxncGQtY29uc2VudCBhZ2dyZWdhdGUgYnVpbGQnLFxuICB9LFxuICBlc2J1aWxkT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5sZWdhbENvbW1lbnRzID0gJ25vbmUnXG4gIH0sXG59KVxuIiwgIntcbiAgXCJuYW1lXCI6IFwicmVhY3QtbGdwZC1jb25zZW50XCIsXG4gIFwidmVyc2lvblwiOiBcIjAuNy4xXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJCaWJsaW90ZWNhIGRlIGNvbnNlbnRpbWVudG8gTEdQRCwgaW50ZWdyYVx1MDBFN1x1MDBGNWVzIG5hdGl2YXMgZSBzaXN0ZW1hIGV4dGVuc1x1MDBFRHZlbCBwYXJhIFJlYWN0LlwiLFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcImxncGRcIixcbiAgICBcImFucGRcIixcbiAgICBcImNvb2tpZVwiLFxuICAgIFwiY29uc2VudFwiLFxuICAgIFwicmVhY3RcIixcbiAgICBcInR5cGVzY3JpcHRcIixcbiAgICBcImpzLWNvb2tpZVwiLFxuICAgIFwiY29uc2VudGltZW50b1wiLFxuICAgIFwicHJpdmFjaWRhZGVcIixcbiAgICBcImFjZXNzaWJpbGlkYWRlXCIsXG4gICAgXCJnb29nbGUtYW5hbHl0aWNzXCIsXG4gICAgXCJ1c2Vyd2F5XCJcbiAgXSxcbiAgXCJwdWJsaXNoQ29uZmlnXCI6IHtcbiAgICBcImFjY2Vzc1wiOiBcInB1YmxpY1wiXG4gIH0sXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJMdWNpYW5vIFx1MDBDOWRpcG9cIixcbiAgICBcImVtYWlsXCI6IFwibHVjaWFuby5wc2lsdmFAYW5wZC5nb3YuYnJcIixcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9sdWNpYW5vZWRpcG9cIlxuICB9LFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwibWFpblwiOiBcImRpc3QvaW5kZXguY2pzXCIsXG4gIFwibW9kdWxlXCI6IFwiZGlzdC9pbmRleC5qc1wiLFxuICBcInR5cGVzXCI6IFwiZGlzdC9pbmRleC5kLnRzXCIsXG4gIFwiZXhwb3J0c1wiOiB7XG4gICAgXCIuXCI6IHtcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiLFxuICAgICAgXCJpbXBvcnRcIjogXCIuL2Rpc3QvaW5kZXguanNcIixcbiAgICAgIFwicmVxdWlyZVwiOiBcIi4vZGlzdC9pbmRleC5janNcIlxuICAgIH0sXG4gICAgXCIuL2NvcmVcIjoge1xuICAgICAgXCJ0eXBlc1wiOiBcIi4vZGlzdC9jb3JlLmQudHNcIixcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L2NvcmUuanNcIixcbiAgICAgIFwicmVxdWlyZVwiOiBcIi4vZGlzdC9jb3JlLmNqc1wiXG4gICAgfSxcbiAgICBcIi4vbXVpXCI6IHtcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvbXVpLmQudHNcIixcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L211aS5qc1wiLFxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L211aS5janNcIlxuICAgIH0sXG4gICAgXCIuL2ludGVncmF0aW9uc1wiOiB7XG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L2ludGVncmF0aW9ucy5kLnRzXCIsXG4gICAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9pbnRlZ3JhdGlvbnMuanNcIixcbiAgICAgIFwicmVxdWlyZVwiOiBcIi4vZGlzdC9pbnRlZ3JhdGlvbnMuY2pzXCJcbiAgICB9LFxuICAgIFwiLi9wYWNrYWdlLmpzb25cIjogXCIuL3BhY2thZ2UuanNvblwiXG4gIH0sXG4gIFwic2lkZUVmZmVjdHNcIjogW1xuICAgIFwiZGlzdC9jaHVuay0qLmpzXCIsXG4gICAgXCJkaXN0L2NodW5rLSouY2pzXCJcbiAgXSxcbiAgXCJmaWxlc1wiOiBbXG4gICAgXCJkaXN0XCIsXG4gICAgXCJSRUFETUUubWRcIixcbiAgICBcIkFQSS5tZFwiLFxuICAgIFwicGFja2FnZS5qc29uXCIsXG4gICAgXCJSRUFETUUuZW4ubWRcIixcbiAgICBcIlFVSUNLU1RBUlQubWRcIixcbiAgICBcIlFVSUNLU1RBUlQuZW4ubWRcIixcbiAgICBcIklOVEVHUkFDT0VTLm1kXCIsXG4gICAgXCJMSUNFTlNFXCIsXG4gICAgXCJDSEFOR0VMT0cubWRcIlxuICBdLFxuICBcImVuZ2luZXNcIjoge1xuICAgIFwibm9kZVwiOiBcIj49MjAuMC4wXCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImNsZWFuXCI6IFwicmltcmFmIGRpc3RcIixcbiAgICBcImJ1aWxkXCI6IFwiY3Jvc3MtZW52IE5PREVfRU5WPXByb2R1Y3Rpb24gdHN1cFwiLFxuICAgIFwiZGV2XCI6IFwiY3Jvc3MtZW52IE5PREVfRU5WPWRldmVsb3BtZW50IHRzdXAgLS13YXRjaFwiLFxuICAgIFwibGludFwiOiBcImVzbGludCBcXFwic3JjLyoqLyoue3RzLHRzeH1cXFwiIC0tY2FjaGVcIixcbiAgICBcImxpbnQ6Y2lcIjogXCJlc2xpbnQgXFxcInNyYy8qKi8qLnt0cyx0c3h9XFxcIiAtLWNhY2hlIC0tbWF4LXdhcm5pbmdzPTBcIixcbiAgICBcImZvcm1hdFwiOiBcInByZXR0aWVyIC0td3JpdGUgXFxcInNyYy8qKi8qLnt0cyx0c3gsanNvbixtZH1cXFwiXCIsXG4gICAgXCJ0eXBlLWNoZWNrXCI6IFwidHNjIC0tbm9FbWl0XCIsXG4gICAgXCJ0ZXN0XCI6IFwiamVzdCAtLWNvbmZpZyAuLi8uLi9qZXN0LmNvbmZpZy5tanNcIixcbiAgICBcInRlc3Q6YTExeVwiOiBcImplc3QgLS1jb25maWcgLi4vLi4vamVzdC5jb25maWcubWpzIC0tdGVzdE1hdGNoPScqKi8qLmExMXkudGVzdC50c3gnXCIsXG4gICAgXCJ0ZXN0OmNvdmVyYWdlXCI6IFwiamVzdCAtLWNvbmZpZyAuLi8uLi9qZXN0LmNvbmZpZy5tanMgLS1jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2UtY2hlY2tcIjogXCJub2RlIC4uLy4uL3NjcmlwdHMvY292ZXJhZ2UtY2hlY2suY2pzXCIsXG4gICAgXCJzaXplLWNoZWNrXCI6IFwic2l6ZS1saW1pdFwiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJwbnBtIHJ1biBidWlsZFwiLFxuICAgIFwiZG9jczpnZW5lcmF0ZVwiOiBcIm5vZGUgLi4vLi4vc2NyaXB0cy9ydW4tdHlwZWRvYy5tanNcIixcbiAgICBcInN0b3J5Ym9va1wiOiBcInN0b3J5Ym9vayBkZXYgLXAgNjAwNiAtLWNvbmZpZy1kaXIgLi4vLi4vLnN0b3J5Ym9va1wiLFxuICAgIFwiYnVpbGQtc3Rvcnlib29rXCI6IFwic3Rvcnlib29rIGJ1aWxkIC0tY29uZmlnLWRpciAuLi8uLi8uc3Rvcnlib29rIC0tb3V0cHV0LWRpciAuLi8uLi9zdG9yeWJvb2stc3RhdGljXCJcbiAgfSxcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vbHVjaWFub2VkaXBvL3JlYWN0LWxncGQtY29uc2VudC5naXRcIlxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2x1Y2lhbm9lZGlwby9yZWFjdC1sZ3BkLWNvbnNlbnQvaXNzdWVzXCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vbHVjaWFub2VkaXBvLmdpdGh1Yi5pby9yZWFjdC1sZ3BkLWNvbnNlbnQvXCIsXG4gIFwicGVlckRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAbXVpL2ljb25zLW1hdGVyaWFsXCI6IFwiXjcuMC4wIHx8IF42LjAuMCB8fCBeNS4xNS4wXCIsXG4gICAgXCJAbXVpL21hdGVyaWFsXCI6IFwiXjcuMC4wIHx8IF42LjAuMCB8fCBeNS4xNS4wXCIsXG4gICAgXCJyZWFjdFwiOiBcIl4xOC4yLjAgfHwgXjE5LjAuMFwiLFxuICAgIFwicmVhY3QtZG9tXCI6IFwiXjE4LjIuMCB8fCBeMTkuMC4wXCJcbiAgfSxcbiAgXCJwZWVyRGVwZW5kZW5jaWVzTWV0YVwiOiB7XG4gICAgXCJAbXVpL2ljb25zLW1hdGVyaWFsXCI6IHtcbiAgICAgIFwib3B0aW9uYWxcIjogdHJ1ZVxuICAgIH0sXG4gICAgXCJAbXVpL21hdGVyaWFsXCI6IHtcbiAgICAgIFwib3B0aW9uYWxcIjogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHJlYWN0LWxncGQtY29uc2VudC9jb3JlXCI6IFwid29ya3NwYWNlOl4wLjcuMVwiLFxuICAgIFwiQHJlYWN0LWxncGQtY29uc2VudC9tdWlcIjogXCJ3b3Jrc3BhY2U6XjAuNy4xXCJcbiAgfSxcbiAgXCJzaXplLWxpbWl0XCI6IFtcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJFU00gQnVuZGxlXCIsXG4gICAgICBcInBhdGhcIjogXCJkaXN0L2luZGV4LmpzXCIsXG4gICAgICBcImxpbWl0XCI6IFwiODAgS0JcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiQ0pTIEJ1bmRsZVwiLFxuICAgICAgXCJwYXRoXCI6IFwiZGlzdC9pbmRleC5janNcIixcbiAgICAgIFwibGltaXRcIjogXCIxMjAgS0JcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiVHlwZXNcIixcbiAgICAgIFwicGF0aFwiOiBcImRpc3QvaW5kZXguZC50c1wiLFxuICAgICAgXCJsaW1pdFwiOiBcIjEzMCBLQlwiXG4gICAgfSxcbiAgICB7XG4gICAgICBcIm5hbWVcIjogXCJDb21wbGV0ZSBQYWNrYWdlIEltcG9ydFwiLFxuICAgICAgXCJwYXRoXCI6IFwiZGlzdC9pbmRleC5qc1wiLFxuICAgICAgXCJpbXBvcnRcIjogXCJ7IENvbnNlbnRQcm92aWRlciwgdXNlQ29uc2VudCwgQ29uc2VudFNjcmlwdExvYWRlciB9XCIsXG4gICAgICBcImxpbWl0XCI6IFwiODAgS0JcIlxuICAgIH1cbiAgXVxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVcsU0FBUyxvQkFBb0I7OztBQ0F0WTtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsVUFBWTtBQUFBLElBQ1Y7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGVBQWlCO0FBQUEsSUFDZixRQUFVO0FBQUEsRUFDWjtBQUFBLEVBQ0EsUUFBVTtBQUFBLElBQ1IsTUFBUTtBQUFBLElBQ1IsT0FBUztBQUFBLElBQ1QsS0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFNBQVc7QUFBQSxFQUNYLE1BQVE7QUFBQSxFQUNSLE1BQVE7QUFBQSxFQUNSLFFBQVU7QUFBQSxFQUNWLE9BQVM7QUFBQSxFQUNULFNBQVc7QUFBQSxJQUNULEtBQUs7QUFBQSxNQUNILE9BQVM7QUFBQSxNQUNULFFBQVU7QUFBQSxNQUNWLFNBQVc7QUFBQSxJQUNiO0FBQUEsSUFDQSxVQUFVO0FBQUEsTUFDUixPQUFTO0FBQUEsTUFDVCxRQUFVO0FBQUEsTUFDVixTQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBUztBQUFBLE1BQ1QsUUFBVTtBQUFBLE1BQ1YsU0FBVztBQUFBLElBQ2I7QUFBQSxJQUNBLGtCQUFrQjtBQUFBLE1BQ2hCLE9BQVM7QUFBQSxNQUNULFFBQVU7QUFBQSxNQUNWLFNBQVc7QUFBQSxJQUNiO0FBQUEsSUFDQSxrQkFBa0I7QUFBQSxFQUNwQjtBQUFBLEVBQ0EsYUFBZTtBQUFBLElB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
