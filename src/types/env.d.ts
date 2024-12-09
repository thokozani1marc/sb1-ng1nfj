/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_LEMONSQUEEZY_API_KEY: string;
  readonly VITE_LEMONSQUEEZY_STORE_ID: string;
  readonly VITE_LEMONSQUEEZY_VARIANT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}