/**
 * SEO Audit Engine
 * Fetches pages from a target site and runs real checks against the HTML.
 * Returns structured results with scores, findings, and improvement actions.
 */

// ── Configuration ────────────────────────────────────────
const TIMEOUT_MS = 8000;
const USER_AGENT = 'TrevattDesign-SEO-Audit/1.0';

// ── Fetch helper ─────────────────────────────────────────
async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
    });
    clearTimeout(timer);
    const html = await res.text();
    const headers = {};
    res.headers.forEach((v, k) => { headers[k] = v; });
    return { url, status: res.status, headers, html, error: null };
  } catch (e) {
    clearTimeout(timer);
    return { url, status: 0, headers: {}, html: '', error: e.message };
  }
}

// ── HTML parsing helpers (regex-based, no DOM in Workers) ─
function extractTag(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : null;
}

function extractAllTags(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  const results = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, '').trim();
    if (text) results.push(text);
  }
  return results;
}

function extractMetaContent(html, nameOrProperty) {
  // Match name="X" or property="X"
  const re = new RegExp(
    `<meta[^>]*(?:name|property)=["']${nameOrProperty}["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${nameOrProperty}["']`,
    'i'
  );
  const m = html.match(re);
  return m ? (m[1] || m[2] || '').trim() : null;
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  return m ? m[1].trim() : null;
}

function extractJsonLd(html) {
  const schemas = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      if (Array.isArray(parsed)) {
        schemas.push(...parsed);
      } else if (parsed['@graph']) {
        schemas.push(...parsed['@graph']);
      } else {
        schemas.push(parsed);
      }
    } catch (e) {
      schemas.push({ _parseError: true, _raw: m[1].substring(0, 200) });
    }
  }
  return schemas;
}

function extractLinks(html, baseUrl) {
  const links = [];
  const re = /<a[^>]*href=["']([^"'#]+)["']/gi;
  let m;
  const base = new URL(baseUrl);
  while ((m = re.exec(html)) !== null) {
    try {
      const href = m[1].trim();
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
      const resolved = new URL(href, baseUrl);
      if (resolved.hostname === base.hostname) {
        links.push(resolved.href);
      }
    } catch (e) { /* skip invalid URLs */ }
  }
  return [...new Set(links)];
}

// ── Individual check functions ───────────────────────────
// Each returns { id, category, name, status, score, details, impact, effort, action }
// status: 'pass' | 'warn' | 'fail' | 'error'

function checkTitle(page) {
  const title = extractTag(page.html, 'title');
  if (!title) {
    return { status: 'fail', score: 0, finding: 'No title tag found', value: null };
  }
  const issues = [];
  if (title.length < 20) issues.push(`Too short (${title.length} chars, aim for 50-60)`);
  if (title.length > 65) issues.push(`Too long (${title.length} chars, may be truncated in SERPs)`);
  if (/^(Home|Page|Untitled)/i.test(title)) issues.push('Generic title — should be descriptive');

  return {
    status: issues.length === 0 ? 'pass' : 'warn',
    score: issues.length === 0 ? 100 : Math.max(40, 100 - issues.length * 25),
    finding: issues.length === 0 ? `Title tag present (${title.length} chars)` : issues.join('; '),
    value: title,
  };
}

function checkMetaDescription(page) {
  const desc = extractMetaContent(page.html, 'description');
  if (!desc) {
    return { status: 'fail', score: 0, finding: 'No meta description found', value: null };
  }
  const issues = [];
  if (desc.length < 70) issues.push(`Too short (${desc.length} chars, aim for 120-160)`);
  if (desc.length > 165) issues.push(`Too long (${desc.length} chars, will be truncated)`);
  if (/https?:\/\//.test(desc)) issues.push('Contains URLs — likely auto-generated from page content');
  if (/^\d+\./.test(desc)) issues.push('Starts with a number — likely scraped from page content');

  return {
    status: issues.length === 0 ? 'pass' : (desc.length > 300 || /https?:\/\//.test(desc) ? 'fail' : 'warn'),
    score: issues.length === 0 ? 100 : Math.max(20, 100 - issues.length * 30),
    finding: issues.length === 0 ? `Meta description present (${desc.length} chars)` : issues.join('; '),
    value: desc.substring(0, 200) + (desc.length > 200 ? '…' : ''),
  };
}

function checkH1(page) {
  const h1s = extractAllTags(page.html, 'h1');
  if (h1s.length === 0) {
    return { status: 'fail', score: 0, finding: 'No H1 tag found', value: null };
  }
  if (h1s.length > 1) {
    return {
      status: 'fail', score: 30,
      finding: `${h1s.length} H1 tags found — should be exactly 1`,
      value: h1s.map((h, i) => `${i + 1}. "${h.substring(0, 60)}"`).join('\n'),
    };
  }
  return { status: 'pass', score: 100, finding: 'Single H1 tag present', value: h1s[0] };
}

function checkHeadingHierarchy(page) {
  const headings = [];
  const re = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(page.html)) !== null) {
    const level = parseInt(m[1][1]);
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (text) headings.push({ level, text });
  }

  if (headings.length === 0) {
    return { status: 'fail', score: 0, finding: 'No headings found', value: null };
  }

  const issues = [];
  // Check for skipped levels
  let prevLevel = 0;
  for (const h of headings) {
    if (h.level > prevLevel + 1 && prevLevel > 0) {
      issues.push(`Skips from H${prevLevel} to H${h.level}`);
      break;
    }
    prevLevel = h.level;
  }

  // Check for duplicate H1/H2 text
  const h1Texts = headings.filter(h => h.level === 1).map(h => h.text.toLowerCase());
  const h2Texts = headings.filter(h => h.level === 2).map(h => h.text.toLowerCase());
  const duplicated = h1Texts.filter(t => h2Texts.includes(t));
  if (duplicated.length > 0) {
    issues.push(`H1 and H2 contain duplicate text (${duplicated.length} matches)`);
  }

  const score = issues.length === 0 ? 100 : Math.max(40, 100 - issues.length * 20);
  return {
    status: issues.length === 0 ? 'pass' : 'warn',
    score,
    finding: issues.length === 0
      ? `${headings.length} headings with proper hierarchy`
      : issues.join('; '),
    value: headings.slice(0, 8).map(h => `${'  '.repeat(h.level - 1)}H${h.level}: ${h.text.substring(0, 50)}`).join('\n'),
  };
}

function checkCanonical(page) {
  const canonical = extractCanonical(page.html);
  if (!canonical) {
    return { status: 'fail', score: 0, finding: 'No canonical URL set', value: null };
  }
  const issues = [];
  if (canonical !== page.url && canonical !== page.url.replace(/\/$/, '') && canonical + '/' !== page.url) {
    issues.push(`Canonical (${canonical}) differs from page URL`);
  }
  if (!canonical.startsWith('https://')) {
    issues.push('Canonical uses HTTP instead of HTTPS');
  }
  return {
    status: issues.length === 0 ? 'pass' : 'warn',
    score: issues.length === 0 ? 100 : 50,
    finding: issues.length === 0 ? 'Canonical URL correctly set' : issues.join('; '),
    value: canonical,
  };
}

function checkOpenGraph(page) {
  const ogTitle = extractMetaContent(page.html, 'og:title');
  const ogDesc = extractMetaContent(page.html, 'og:description');
  const ogImage = extractMetaContent(page.html, 'og:image');
  const ogType = extractMetaContent(page.html, 'og:type');

  const present = [ogTitle, ogDesc, ogImage, ogType].filter(Boolean).length;
  const issues = [];

  if (!ogTitle) issues.push('Missing og:title');
  if (!ogDesc) issues.push('Missing og:description');
  if (!ogImage) issues.push('Missing og:image');
  if (ogImage && /myftpupload\.com|staging|localhost/i.test(ogImage)) {
    issues.push('og:image points to staging/dev domain');
  }
  if (!ogType) issues.push('Missing og:type');

  const score = Math.round((present / 4) * 100) - (issues.some(i => i.includes('staging')) ? 20 : 0);
  return {
    status: issues.length === 0 ? 'pass' : (present >= 3 ? 'warn' : 'fail'),
    score: Math.max(0, score),
    finding: issues.length === 0 ? 'All OpenGraph tags present' : issues.join('; '),
    value: ogImage ? `Image: ${ogImage.substring(0, 80)}` : null,
  };
}

function checkSchema(page, siteSchemaType) {
  const schemas = extractJsonLd(page.html);
  if (schemas.length === 0) {
    return { status: 'fail', score: 0, finding: 'No JSON-LD schema markup found', value: null };
  }

  const parseErrors = schemas.filter(s => s._parseError);
  if (parseErrors.length > 0) {
    return {
      status: 'fail', score: 20,
      finding: `${parseErrors.length} schema block(s) failed to parse`,
      value: parseErrors[0]._raw,
    };
  }

  const types = schemas.map(s => s['@type']).filter(Boolean);
  const issues = [];

  if (siteSchemaType && !types.includes(siteSchemaType)) {
    issues.push(`Missing site-wide ${siteSchemaType} schema`);
  }
  if (!types.includes('BreadcrumbList')) {
    issues.push('Missing BreadcrumbList schema');
  }

  const score = issues.length === 0 ? 100 : Math.max(40, 100 - issues.length * 25);
  return {
    status: issues.length === 0 ? 'pass' : 'warn',
    score,
    finding: issues.length === 0
      ? `${schemas.length} schema(s): ${types.join(', ')}`
      : issues.join('; '),
    value: types.join(', '),
  };
}

function checkSchemaConsistency(pages) {
  // Check for conflicting data across schemas
  const issues = [];
  const allSchemas = pages.flatMap(p => extractJsonLd(p.html));

  // Check foundingDate consistency
  const foundingDates = new Set();
  for (const s of allSchemas) {
    if (s.foundingDate) foundingDates.add(s.foundingDate);
  }
  if (foundingDates.size > 1) {
    issues.push(`Conflicting foundingDate values: ${[...foundingDates].join(', ')}`);
  }

  // Check for staging URLs in schemas
  const schemaStr = JSON.stringify(allSchemas);
  if (/myftpupload\.com|staging|localhost/i.test(schemaStr)) {
    issues.push('Schema contains staging/development URLs');
  }

  return {
    status: issues.length === 0 ? 'pass' : 'fail',
    score: issues.length === 0 ? 100 : Math.max(20, 100 - issues.length * 30),
    finding: issues.length === 0 ? 'Schema data consistent across pages' : issues.join('; '),
    value: null,
  };
}

// ── Technical checks (non-page-specific) ─────────────────

function checkRobotsTxt(result) {
  if (result.error || result.status !== 200) {
    return { status: 'fail', score: 0, finding: 'robots.txt not accessible', value: null };
  }
  const issues = [];
  if (!result.html.includes('Sitemap:')) issues.push('No sitemap reference');
  if (result.html.includes('Disallow: /')) {
    const lines = result.html.split('\n');
    const disallowAll = lines.some(l => l.trim() === 'Disallow: /');
    if (disallowAll) issues.push('Disallow: / blocks all crawling');
  }

  return {
    status: issues.length === 0 ? 'pass' : (issues.some(i => i.includes('blocks all')) ? 'fail' : 'warn'),
    score: issues.length === 0 ? 100 : Math.max(20, 100 - issues.length * 30),
    finding: issues.length === 0 ? 'robots.txt properly configured' : issues.join('; '),
    value: result.html.substring(0, 300),
  };
}

function checkSitemap(result) {
  if (result.error || result.status !== 200) {
    return { status: 'fail', score: 0, finding: 'Sitemap not accessible', value: null };
  }
  const issues = [];
  const urlCount = (result.html.match(/<loc>/g) || []).length;
  if (urlCount === 0) issues.push('Sitemap contains no URLs');

  // Check for sitemap index
  const isSitemapIndex = result.html.includes('<sitemapindex');
  const type = isSitemapIndex ? 'Sitemap index' : 'URL sitemap';

  return {
    status: issues.length === 0 ? 'pass' : 'warn',
    score: issues.length === 0 ? 100 : 50,
    finding: issues.length === 0 ? `${type} with ${urlCount} entries` : issues.join('; '),
    value: `${type}: ${urlCount} entries`,
  };
}

function checkHttps(page) {
  // We fetched via HTTPS — if it worked, HTTPS is fine
  if (page.status === 200) {
    return { status: 'pass', score: 100, finding: 'HTTPS working', value: null };
  }
  return { status: 'fail', score: 0, finding: 'HTTPS not working', value: null };
}

function checkSecurityHeaders(page) {
  const h = page.headers;
  const present = [];
  const missing = [];

  if (h['content-security-policy']) present.push('CSP');
  else missing.push('Content-Security-Policy');

  if (h['x-content-type-options']) present.push('X-Content-Type-Options');
  else missing.push('X-Content-Type-Options');

  if (h['x-frame-options'] || (h['content-security-policy'] && h['content-security-policy'].includes('frame-ancestors')))
    present.push('Frame protection');
  else missing.push('X-Frame-Options');

  if (h['strict-transport-security']) present.push('HSTS');
  else missing.push('Strict-Transport-Security (HSTS)');

  const score = Math.round((present.length / (present.length + missing.length)) * 100);
  return {
    status: missing.length === 0 ? 'pass' : (missing.length <= 2 ? 'warn' : 'fail'),
    score,
    finding: missing.length === 0 ? 'All key security headers present' : `Missing: ${missing.join(', ')}`,
    value: present.length > 0 ? `Present: ${present.join(', ')}` : null,
  };
}

function checkCaching(page) {
  const h = page.headers;
  const hasLiteSpeed = !!h['x-litespeed-cache'];
  const hasCacheControl = !!h['cache-control'];
  const hasCDN = !!(h['x-hcdn-cache-status'] || h['cf-cache-status']);

  const layers = [hasLiteSpeed && 'LiteSpeed', hasCDN && 'CDN', hasCacheControl && 'Cache-Control'].filter(Boolean);

  if (layers.length === 0) {
    return { status: 'warn', score: 40, finding: 'No caching headers detected', value: null };
  }
  return {
    status: 'pass',
    score: Math.min(100, 60 + layers.length * 15),
    finding: `Caching active: ${layers.join(', ')}`,
    value: h['cache-control'] || null,
  };
}

// ── Score computation ────────────────────────────────────
function computeCategoryScore(checks) {
  if (checks.length === 0) return 0;
  const total = checks.reduce((sum, c) => sum + c.score, 0);
  return Math.round(total / checks.length);
}

// ── Improvement plan generation ──────────────────────────
function generateImprovements(allChecks) {
  const improvements = [];

  for (const check of allChecks) {
    if (check.status === 'pass') continue;

    let impact = 'medium';
    let effort = 'low';
    let action = '';

    switch (check.id) {
      case 'h1':
        impact = 'high'; effort = 'low';
        action = check.finding.includes('No H1')
          ? 'Add a descriptive H1 heading to this page'
          : 'Remove extra H1 tags — keep only one per page';
        break;
      case 'meta-description':
        impact = 'high'; effort = 'low';
        action = 'Write a unique, compelling meta description (120-160 chars) that includes target keywords';
        break;
      case 'title':
        impact = 'high'; effort = 'low';
        action = 'Optimise the title tag — keep under 60 chars, include primary keyword and location';
        break;
      case 'heading-hierarchy':
        impact = 'medium'; effort = 'medium';
        action = 'Fix heading structure — ensure logical H1 > H2 > H3 order with no skipped levels';
        break;
      case 'canonical':
        impact = 'medium'; effort = 'low';
        action = 'Set or fix the canonical URL to match the page URL';
        break;
      case 'og':
        impact = 'medium'; effort = 'low';
        if (check.finding.includes('staging')) {
          action = 'Update og:image to use the production domain instead of staging URL';
        } else {
          action = 'Add missing OpenGraph tags for better social sharing';
        }
        break;
      case 'schema':
        impact = 'medium'; effort = 'medium';
        action = check.finding.includes('parse') ? 'Fix broken schema markup' : 'Add missing schema types';
        break;
      case 'schema-consistency':
        impact = 'medium'; effort = 'low';
        action = check.finding.includes('staging')
          ? 'Replace all staging/dev URLs in schema with production URLs'
          : 'Align conflicting data across schema blocks';
        break;
      case 'robots-txt':
        impact = 'high'; effort = 'low';
        action = 'Fix robots.txt to ensure search engines can crawl the site';
        break;
      case 'sitemap':
        impact = 'high'; effort = 'low';
        action = 'Fix or create an XML sitemap and submit to Google Search Console';
        break;
      case 'security-headers':
        impact = 'low'; effort = 'medium';
        action = 'Add missing security headers via server config or plugin';
        break;
      case 'caching':
        impact = 'low'; effort = 'medium';
        action = 'Configure browser caching headers for static assets';
        break;
      default:
        action = `Address: ${check.finding}`;
    }

    improvements.push({
      page: check.page || 'Site-wide',
      category: check.category,
      check: check.name,
      status: check.status,
      finding: check.finding,
      impact,
      effort,
      action,
      score: check.score,
    });
  }

  // Sort by impact (high first), then effort (low first)
  const impactOrder = { high: 0, medium: 1, low: 2 };
  const effortOrder = { low: 0, medium: 1, high: 2 };
  improvements.sort((a, b) => {
    const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
    if (impactDiff !== 0) return impactDiff;
    return effortOrder[a.effort] - effortOrder[b.effort];
  });

  return improvements;
}

// ── Main audit runner ────────────────────────────────────
export async function runAudit(config) {
  const { domain, pages, siteSchemaType } = config;
  const baseUrl = `https://${domain}`;

  // Fetch all pages + robots + sitemap in parallel
  const fetchJobs = [
    ...pages.map(p => fetchPage(`${baseUrl}${p.path}`)),
    fetchPage(`${baseUrl}/robots.txt`),
    fetchPage(`${baseUrl}/sitemap.xml`),
  ];

  const results = await Promise.all(fetchJobs);
  const pageResults = results.slice(0, pages.length);
  const robotsResult = results[pages.length];
  const sitemapResult = results[pages.length + 1];

  // Run checks per page
  const allChecks = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pageResults[i];
    const pageName = pages[i].name;

    if (page.error || page.status !== 200) {
      allChecks.push({
        id: 'page-access', category: 'Technical', name: 'Page accessible',
        page: pageName, url: pages[i].path,
        status: 'fail', score: 0,
        finding: page.error ? `Fetch error: ${page.error}` : `HTTP ${page.status}`,
        value: null,
      });
      continue;
    }

    const pageChecks = [
      { id: 'title', category: 'Content', name: 'Title tag', ...checkTitle(page) },
      { id: 'meta-description', category: 'Content', name: 'Meta description', ...checkMetaDescription(page) },
      { id: 'h1', category: 'Content', name: 'H1 heading', ...checkH1(page) },
      { id: 'heading-hierarchy', category: 'Content', name: 'Heading hierarchy', ...checkHeadingHierarchy(page) },
      { id: 'canonical', category: 'Technical', name: 'Canonical URL', ...checkCanonical(page) },
      { id: 'og', category: 'Social', name: 'OpenGraph tags', ...checkOpenGraph(page) },
      { id: 'schema', category: 'Schema', name: 'Schema markup', ...checkSchema(page, siteSchemaType) },
    ];

    for (const check of pageChecks) {
      check.page = pageName;
      check.url = pages[i].path;
      allChecks.push(check);
    }
  }

  // Site-wide checks
  const siteChecks = [
    { id: 'robots-txt', category: 'Technical', name: 'robots.txt', page: 'Site-wide', url: '/robots.txt', ...checkRobotsTxt(robotsResult) },
    { id: 'sitemap', category: 'Technical', name: 'XML Sitemap', page: 'Site-wide', url: '/sitemap.xml', ...checkSitemap(sitemapResult) },
    { id: 'https', category: 'Technical', name: 'HTTPS', page: 'Site-wide', url: '/', ...checkHttps(pageResults[0]) },
    { id: 'security-headers', category: 'Technical', name: 'Security headers', page: 'Site-wide', url: '/', ...checkSecurityHeaders(pageResults[0]) },
    { id: 'caching', category: 'Technical', name: 'Caching', page: 'Site-wide', url: '/', ...checkCaching(pageResults[0]) },
    { id: 'schema-consistency', category: 'Schema', name: 'Schema consistency', page: 'Site-wide', url: '*', ...checkSchemaConsistency(pageResults.filter(p => p.status === 200)) },
  ];
  allChecks.push(...siteChecks);

  // Compute category scores
  const categories = {};
  for (const check of allChecks) {
    if (!categories[check.category]) categories[check.category] = [];
    categories[check.category].push(check);
  }

  const categoryScores = {};
  for (const [cat, checks] of Object.entries(categories)) {
    categoryScores[cat] = {
      score: computeCategoryScore(checks),
      total: checks.length,
      pass: checks.filter(c => c.status === 'pass').length,
      warn: checks.filter(c => c.status === 'warn').length,
      fail: checks.filter(c => c.status === 'fail').length,
    };
  }

  // Overall score (weighted)
  const weights = { Content: 35, Technical: 25, Schema: 20, Social: 20 };
  let weightedSum = 0;
  let weightTotal = 0;
  for (const [cat, data] of Object.entries(categoryScores)) {
    const w = weights[cat] || 20;
    weightedSum += data.score * w;
    weightTotal += w;
  }
  const overallScore = Math.round(weightedSum / weightTotal);

  // Generate improvement plan
  const improvements = generateImprovements(allChecks);

  return {
    domain,
    auditDate: new Date().toISOString(),
    overallScore,
    categoryScores,
    checks: allChecks,
    improvements,
    meta: {
      pagesAudited: pages.length,
      totalChecks: allChecks.length,
      fetchErrors: pageResults.filter(p => p.error).length,
    },
  };
}
