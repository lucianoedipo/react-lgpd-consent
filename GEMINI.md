# GEMINI.md: AI Assistant Guide for `react-lgpd-consent`

This document provides a comprehensive guide for an AI assistant to understand and interact with the `react-lgpd-consent` codebase.

## 1. Project Overview

`react-lgpd-consent` is a modular TypeScript-based monorepo for creating a React library to manage LGPD/GDPR cookie consent. It provides both headless logic and pre-built UI components using Material-UI.

-   **Purpose**: To offer a flexible and compliant way for React applications to handle user consent for cookies.
-   **Key Features**:
    -   Modular architecture (core logic vs. UI).
    -   Headless hooks and context (`@react-lgpd-consent/core`).
    -   Ready-to-use Material-UI components (`@react-lgpd-consent/mui`).
    -   SSR-safe and React 19 StrictMode compatible.
    -   Extensive test coverage and documentation.

## 2. Monorepo Architecture

The project is a `pnpm` workspace managed with `Turborepo`.

-   `packages/core`: The headless library containing all business logic, hooks, context, and utility functions. It has no UI dependencies.
-   `packages/mui`: Provides UI components (`CookieBanner`, `PreferencesModal`, etc.) built on top of Material-UI. It depends on the `core` package.
-   `packages/react-lgpd-consent`: The main aggregator package that exports functionality from `@react-lgpd-consent/mui` for easy consumption and backward compatibility. This is the recommended package for most users.
-   `example/`: Contains various usage examples.
-   `examples/`: Contains full project examples for frameworks like Next.js and Vite.
-   `.storybook/`: Configuration for Storybook, used for interactive UI development and testing.

## 3. Core Technologies

-   **Language**: TypeScript
-   **Framework**: React (v18, v19 compatible)
-   **UI Library**: Material-UI (MUI)
-   **Package Manager**: `pnpm`
-   **Monorepo Manager**: `Turborepo`
-   **Bundler**: `tsup`
-   **Testing**: Jest, React Testing Library, `@axe-core/react` for a11y.
-   **Linting & Formatting**: ESLint, Prettier

## 4. Key Commands

All commands should be run from the root of the project.

-   **Install Dependencies**:
    ```bash
    pnpm install
    ```

-   **Build All Packages**:
    ```bash
    pnpm build
    ```

-   **Run All Tests**:
    ```bash
    pnpm test
    ```

-   **Run Tests with Coverage**:
    ```bash
    pnpm test:coverage
    ```

-   **Run Linter**:
    ```bash
    pnpm lint
    ```

-   **Run Type Checking**:
    ```bash
    pnpm type-check
    ```

-   **Start Storybook**:
    ```bash
    pnpm storybook
    ```
    This is the primary way to work on UI components interactively. Stories are located in `packages/mui/src/**/*.stories.tsx`.

-   **Development Watch Mode**:
    ```bash
    pnpm dev
    ```
    This runs `tsup` in watch mode for the main `react-lgpd-consent` package.

## 5. Development Conventions

-   **Code Style**: Follows the rules defined in `.eslintrc.js` and `.prettierrc`. Always run `pnpm format` before committing.
-   **Testing**: New features or bug fixes **must** be accompanied by tests. Test files are co-located with source files (`*.test.tsx`). The project aims for high test coverage (>90%).
-   **Commits**: Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This is used to automate changelog generation.
-   **Branching**: Create feature branches from `main` (e.g., `feature/my-new-feature`).
-   **Documentation**: The project values high-quality documentation. Any changes to architecture or user-facing APIs should be reflected in the relevant Markdown files (`README.md`, `ARCHITECTURE.md`, etc.).
-   **SSR and StrictMode**: All code, especially React Effects, must be idempotent, SSR-safe, and compatible with React 19's StrictMode. This means checking for `window` existence and providing proper effect cleanup functions.

## 6. Common Tasks

-   **Adding a new component to `@react-lgpd-consent/mui`**:
    1.  Create the component file in `packages/mui/src/components/`.
    2.  Create a test file `.../MyComponent.test.tsx`.
    3.  Create a Storybook file `.../MyComponent.stories.tsx`.
    4.  Export the component from `packages/mui/src/index.ts`.
    5.  Run `pnpm storybook` to develop and test visually.

-   **Modifying the core logic in `@react-lgpd-consent/core`**:
    1.  Locate the relevant file in `packages/core/src/` (e.g., `context/`, `hooks/`, `utils/`).
    2.  Update the logic and the corresponding tests (`*.test.ts(x)`).
    3.  Run `pnpm test --filter=@react-lgpd-consent/core` to verify changes.

-   **Running a single package's script**:
    Use `pnpm --filter <package-name> <script>`:
    ```bash
    # Run tests only for the core package
    pnpm --filter @react-lgpd-consent/core test

    # Build only the mui package
    pnpm --filter @react-lgpd-consent/mui build
    ```
