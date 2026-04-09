/**
 * SEO Dashboard — Cloudflare Worker
 * Serves a live SEO audit dashboard.
 *
 * Config: Set AUDIT_DOMAIN and AUDIT_PAGES in wrangler.toml vars,
 * or change the defaults below.
 */

import { runAudit } from './checks.js';
import { DASHBOARD_UI } from './ui.js';

// ── Site config (override via env vars) ──────────────────
const DEFAULT_CONFIG = {
  domain: 'trevattdesign.com',
  siteSchemaType: 'LocalBusiness',
  pages: [
    { path: '/', name: 'Home' },
    { path: '/services/', name: 'Services' },
    { path: '/about/', name: 'About' },
    { path: '/contact/', name: 'Contact' },
    { path: '/logos/', name: 'Logos' },
    { path: '/latest/', name: 'Blog' },
  ],
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── CORS headers for API ──────────────────────────────
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ── Health check ──────────────────────────────────────
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // ── API: run audit ────────────────────────────────────
    if (url.pathname === '/api/audit') {
      try {
        // Allow overriding domain via query param (for reuse)
        const domain = url.searchParams.get('domain') || env.AUDIT_DOMAIN || DEFAULT_CONFIG.domain;
        const siteSchemaType = url.searchParams.get('schema') || env.SITE_SCHEMA_TYPE || DEFAULT_CONFIG.siteSchemaType;

        // Parse custom pages from env or use defaults
        let pages = DEFAULT_CONFIG.pages;
        if (env.AUDIT_PAGES) {
          try {
            pages = JSON.parse(env.AUDIT_PAGES);
          } catch (e) { /* use defaults */ }
        }

        const result = await runAudit({ domain, pages, siteSchemaType });

        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            ...corsHeaders,
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // ── Serve dashboard UI ────────────────────────────────
    return new Response(DASHBOARD_UI, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  },
};
