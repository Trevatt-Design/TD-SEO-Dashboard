/**
 * TD SEO Dashboard — Cloudflare Worker
 * Serves a self-contained React dashboard as static HTML.
 * Update the DASHBOARD_HTML below to update the dashboard.
 */

import { DASHBOARD_HTML } from './dashboard.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Serve dashboard
    return new Response(DASHBOARD_HTML, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
};
