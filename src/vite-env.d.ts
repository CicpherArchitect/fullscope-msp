/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

interface ImportMetaEnv {
  readonly VITE_SALESMATE_API_KEY: string
  readonly VITE_SALESMATE_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}