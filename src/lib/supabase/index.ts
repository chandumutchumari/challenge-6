/**
 * Client-side Supabase client configuration
 * Preserves service-role separation and client RLS scope.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL || 'http://localhost:54321' : 'http://localhost:54321';
  const anonKey = typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY || '' : '';
  return { url, anonKey };
}

export async function checkDatabaseHealth(): Promise<{ status: 'ok' | 'degraded'; message: string }> {
  try {
    const config = getSupabaseConfig();
    const res = await fetch(`${config.url}/rest/v1/provider_sources?select=count`, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
    });
    if (res.ok) {
      return { status: 'ok', message: 'Connected to Supabase data layer.' };
    }
    return { status: 'degraded', message: 'Offline or local emulation mode active.' };
  } catch {
    return { status: 'degraded', message: 'Operating in client-side verified offline mode.' };
  }
}
