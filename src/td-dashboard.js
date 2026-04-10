// td-dashboard.js — Trevatt Design SEO Command Centre
// Single-file Cloudflare Worker serving a comprehensive SEO dashboard

export default {
  async fetch(request) {
    const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trevatt Design — SEO Dashboard</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></` + `script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></` + `script>
  <script src="https://unpkg.com/prop-types@15/prop-types.min.js"></` + `script>
  <script src="https://unpkg.com/recharts@2.12.7/umd/Recharts.js"></` + `script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></` + `script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAFBFC; color: #1a1a2e; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState } = React;
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } = window.Recharts;

    // ─── PALETTE ──────────────────────────────────────────────────
    const C = {
      pri: "#1a1a2e", sec: "#16213e", accent: "#0f3460", blue: "#533483",
      pass: "#10b981", warn: "#f59e0b", alert: "#ef4444", mut: "#94a3b8",
      bg: "#FAFBFC", card: "#FFFFFF", border: "#e5e7eb", borderLight: "#f3f4f6",
      text: "#1a1a2e", textSec: "#64748b", textMut: "#94a3b8",
      indigo: "#6366f1", purple: "#8b5cf6", teal: "#14b8a6",
    };

    // ─── SITE PAGES ───────────────────────────────────────────────
    const sitePages = [
      { url: "/", name: "Home", title: "Home - Digital Agency, UX & Design - London | UK", titleLen: 52, metaDesc: "Award-winning London digital agency, Trevatt Design, turns ideas into extraordinary experiences through bespoke design solutions.", descLen: 126, h1Count: 1, h1s: ["Digital Design"], schema: "BreadcrumbList, Organization, WebSite, LocalBusiness, AggregateRating, Review", ogImage: true, canonical: true, keywordTarget: "london digital agency, ux design agency london" },
      { url: "/services/", name: "Services", title: "Services - Digital Agency, UX & Design - London | UK", titleLen: 53, metaDesc: "London UX and web design agency. We handle strategy, branding, UI/UX and development for startups and scaling businesses.", descLen: 120, h1Count: 1, h1s: ["We innovate, we create, we deliver"], schema: "BreadcrumbList, Organization, WebPage, WebSite", ogImage: true, canonical: true, keywordTarget: "ux design services, web design london" },
      { url: "/about/", name: "About", title: "About - Digital Agency, UX & Design - London | UK", titleLen: 49, metaDesc: "Trevatt Design is a London digital agency founded in 2010 by Michael Trevatt. We build websites, apps and brands that put the user first.", descLen: 137, h1Count: 1, h1s: ["London Design Studio"], schema: "BreadcrumbList, Organization, WebPage, WebSite", ogImage: true, canonical: true, keywordTarget: "london design studio, about trevatt design" },
      { url: "/contact/", name: "Contact", title: "Contact - Digital Agency, UX & Design - London | UK", titleLen: 51, metaDesc: "Get in touch with Trevatt Design. Based in London, available worldwide. Tell us about your project and we will get back to you within 24 hours.", descLen: 142, h1Count: 1, h1s: ["Get a great feeling"], schema: "BreadcrumbList, Organization, WebPage, WebSite", ogImage: true, canonical: true, keywordTarget: "contact design agency london" },
      { url: "/logos/", name: "Logos", title: "Logos - Digital Agency, UX & Design - London | UK", titleLen: 49, metaDesc: "Logo design and brand identity by Trevatt Design, London. From concept to final mark, we create logos that work across every medium and scale.", descLen: 141, h1Count: 1, h1s: ["Let's start right now!"], schema: "BreadcrumbList, Organization, WebPage, WebSite", ogImage: true, canonical: true, keywordTarget: "logo design london, brand identity" },
      { url: "/latest/", name: "Blog", title: "Latest - Digital Agency, UX & Design - London | UK", titleLen: 50, metaDesc: "Thoughts on UX, branding, visual design, and building better digital products. Written by a designer, not a content mill.", descLen: 120, h1Count: 1, h1s: ["Latest"], schema: "BreadcrumbList, CollectionPage, Organization, WebSite", ogImage: true, canonical: true, keywordTarget: "ux design blog, design thinking articles" },
    ];

    // ─── BLOG POSTS ───────────────────────────────────────────────
    const blogPosts = [
      { title: "Sales Is Not About Selling", url: "/sales-is-not-about-selling-its-about-helping-your-customers-get-what-they-want/", cluster: "Business", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Understanding the Power of Price and Value", url: "/understanding-the-power-of-price-and-value/", cluster: "Business", hasSchema: true, hasMetaDesc: "Check"},
      { title: "3 Ways to Reclaim your Creativity and Productivity", url: "/3-ways-to-reclaim-your-creativity-and-productivity/", cluster: "Productivity", hasSchema: true, hasMetaDesc: "Check"},
      { title: "5 Simple Ways to Improve the User Experience", url: "/5-simple-ways-to-improve-the-user-experience-on-your-website/", cluster: "UX", hasSchema: true, hasMetaDesc: "Check"},
      { title: "What is UX Design? A Beginner's Guide", url: "/what-is-ux-design-a-beginners-guide-to-understanding-user-experience-design/", cluster: "UX", hasSchema: true, hasMetaDesc: "Check"},
      { title: "You Are Your Name", url: "/you-are-your-name/", cluster: "Branding", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Your Frame of Reference", url: "/your-frame-of-reference/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Elegant Solutions", url: "/elegant-solutions/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Coming into Being", url: "/coming-into-being/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Don't Appeal to Everyone", url: "/dont-appeal-to-everyone/", cluster: "Strategy", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Genre in Logo Design", url: "/genre-in-logo-design/", cluster: "Branding", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Exploration of Tone", url: "/exploration-of-tone/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Exploration of Space", url: "/exploration-of-space/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "An Exploration of Contrast", url: "/an-exploration-of-contrast/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Simple or Minimal", url: "/simple-or-minimal/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Why Pretty Works", url: "/why-pretty-works/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Semiotics: The Interpretation of Symbols", url: "/semiotics-the-interpretation-of-symbols/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Composition in Web Design", url: "/composition-in-web-design/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Is Originality Important?", url: "/is-originality-important/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Demographics vs Psychographics", url: "/demographics-vs-psychographics/", cluster: "Strategy", hasSchema: true, hasMetaDesc: "Check"},
      { title: "Understanding Visual Literacy", url: "/understanding-visual-literacy/", cluster: "Design thinking", hasSchema: true, hasMetaDesc: "Check"},
    ];

    // ─── PORTFOLIO / CASE STUDIES ─────────────────────────────────
    const caseStudies = [
      { title: "ES Therapy Centre", url: "/work/es-therapy-centre/", hasSchema: true, industry: "Healthcare" },
      { title: "Truphone Digital eSIM", url: "/work/truphone-digital-esim-technology/", hasSchema: true, industry: "Telecoms" },
      { title: "Dinner Twist", url: "/work/dinner-twist-local-healthy-delivered/", hasSchema: true, industry: "Food & Delivery" },
      { title: "Eternal Eve", url: "/work/eternal-eve-social-platform/", hasSchema: true, industry: "Social Platform" },
      { title: "Icetana AI Surveillance", url: "/work/icetana-ia-powered-surveillance/", hasSchema: true, industry: "AI / Security" },
      { title: "My Life Story (Dementia App)", url: "/work/my-life-story-dementia-app/", hasSchema: true, industry: "Healthcare" },
      { title: "Our Online Canteen", url: "/work/our-online-canteen-ecommerce-for-schools/", hasSchema: true, industry: "Education" },
      { title: "My Local Savings", url: "/work/my-local-savings-super-market-aggregator/", hasSchema: true, industry: "Retail / Fintech" },
      { title: "Rapport Employee Engagement", url: "/work/rapport-employee-engagement-platform/", hasSchema: true, industry: "HR Tech" },
      { title: "Lunch Break Networking", url: "/work/lunch-break-professional-networking/", hasSchema: true, industry: "Networking" },
      { title: "Remotify Remote Hiring", url: "/work/remotify-scalable-cost-effective-remote-hiring/", hasSchema: true, industry: "HR Tech" },
    ];

    // ─── TECHNICAL ISSUES ─────────────────────────────────────────
    const technicalIssues = [
      { issue: "H1 tags on all pages", severity: "High", category: "On-Page", status: "Fixed", note: "Verified: Home, Services, About, Contact, Logos, Blog all have exactly 1 H1. No action needed." },
      { issue: "Services meta description", severity: "High", category: "On-Page", status: "Fixed", note: "Rewritten via aioseo_description filter in functions.php. Now 120 chars, keyword-optimised." },
      { issue: "About meta description", severity: "High", category: "On-Page", status: "Fixed", note: "Rewritten. Now mentions London, 2010, Michael Trevatt. 137 chars." },
      { issue: "Contact meta description", severity: "Medium", category: "On-Page", status: "Fixed", note: "Rewritten. Now 142 chars with location + response time." },
      { issue: "Logos meta description", severity: "Medium", category: "On-Page", status: "Fixed", note: "Rewritten. Now 141 chars targeting 'logo design london'." },
      { issue: "Article schema on blog posts", severity: "Medium", category: "Schema", status: "Fixed", note: "Article/BlogPosting schema added site-wide via functions.php. Author, dates, images all included." },
      { issue: "CreativeWork schema on portfolio", severity: "Medium", category: "Schema", status: "Fixed", note: "CreativeWork schema added for all work CPT posts via functions.php." },
      { issue: "foundingDate conflict", severity: "Medium", category: "Schema", status: "Fixed", note: "Fixed via aioseo_schema_output filter. Now consistently 2010-01-01." },
      { issue: "AggregateRating + Review schema", severity: "Medium", category: "Schema", status: "Fixed", note: "12 testimonials with named clients now output as Review schema on homepage." },
      { issue: "Same og:image across all pages", severity: "Low", category: "Social", status: "Open", note: "Every page uses TD-Website-image.png. Page-specific images improve CTR from social sharing." },
      { issue: "Missing security headers", severity: "Low", category: "Technical", status: "Open", note: "HSTS, X-Content-Type-Options, X-Frame-Options missing. Add via server config or LiteSpeed." },
      { issue: "Blog URLs at root level", severity: "Low", category: "Structure", status: "Info", note: "Posts sit at root (e.g. /dont-appeal-to-everyone/). Cosmetic, not SEO-critical. Do not change without redirect plan." },
      { issue: "10 draft blog posts styled + images added", severity: "Medium", category: "Content", status: "Fixed", note: "CSS styling, inline images, auto-CTA, and author box all applied via functions.php. No Elementor needed." },
    ];

    // ─── HEALTH SCORES ────────────────────────────────────────────
    const healthScores = [
      { area: "Technical SEO", score: 72, items: "HTTPS, sitemap, robots.txt all good. LiteSpeed caching active. Missing security headers. No performance audit done." },
      { area: "On-Page SEO", score: 78, items: "All pages have single H1. Meta descriptions rewritten for Services, About, Contact, Logos. Heading hierarchy clean." },
      { area: "Content", score: 68, items: "21 existing posts + 10 new SEO-targeted drafts with images, styling, and auto-CTA. Ready for review and publish. No case study write-ups optimised yet." },
      { area: "Schema", score: 90, items: "LocalBusiness + AggregateRating + Review on homepage. Article schema on all blog posts. CreativeWork on case studies. foundingDate fixed." },
      { area: "Local SEO", score: 38, items: "Review schema now active. Still no Google Business Profile audit, no local landing pages. Location in schema." },
      { area: "E-E-A-T", score: 62, items: "Author box on all posts with bio. Founder in schema + Article author. 12 testimonials with Review schema. Dedicated credentials page still recommended." },
      { area: "Link Authority", score: 25, items: "No backlink audit done. No guest posting strategy. Social profiles linked but no active link building." },
    ];

    // ─── KEYWORDS ─────────────────────────────────────────────────
    const topKeywords = [
      { kw: "ux design agency london", vol: 320, diff: "High", page: "Homepage", exists: true, position: "Unknown" },
      { kw: "london digital agency", vol: 260, diff: "High", page: "Homepage", exists: true, position: "Unknown" },
      { kw: "web design agency london", vol: 1300, diff: "High", page: "Services", exists: true, position: "Unknown" },
      { kw: "branding agency london", vol: 720, diff: "High", page: "Services", exists: false, position: "—" },
      { kw: "logo design london", vol: 480, diff: "Medium", page: "Logos", exists: true, position: "Unknown" },
      { kw: "ux design services", vol: 210, diff: "Medium", page: "Services", exists: true, position: "Unknown" },
      { kw: "app design agency london", vol: 170, diff: "Medium", page: "Services Hub", exists: false, position: "—" },
      { kw: "digital design agency uk", vol: 140, diff: "Medium", page: "Homepage", exists: true, position: "Unknown" },
      { kw: "website redesign agency", vol: 110, diff: "Low", page: "Services Hub", exists: false, position: "—" },
      { kw: "startup design agency", vol: 90, diff: "Low", page: "New Page", exists: false, position: "—" },
      { kw: "healthcare ux design", vol: 70, diff: "Low", page: "Case Study Hub", exists: false, position: "—" },
      { kw: "ux audit london", vol: 50, diff: "Low", page: "Services Hub", exists: false, position: "—" },
      { kw: "what is ux design", vol: 4400, diff: "High", page: "Blog Post", exists: true, position: "Unknown" },
      { kw: "ux design process", vol: 880, diff: "Medium", page: "Blog Post", exists: true, position: "Draft" },
      { kw: "how to choose a design agency", vol: 140, diff: "Low", page: "Blog Post", exists: true, position: "Draft" },
    ];

    const kwByIntent = [
      { name: "Transactional", value: 5 },
      { name: "Informational", value: 6 },
      { name: "Commercial", value: 3 },
      { name: "Navigational", value: 1 },
    ];

    const kwByRelevance = [
      { name: "Direct target", value: 8, color: C.pass },
      { name: "Related", value: 4, color: C.warn },
      { name: "Informational", value: 3, color: C.indigo },
    ];

    // ─── COMPETITORS ──────────────────────────────────────────────
    const competitors = [
      { name: "Clay (clay.global)", threat: "High", type: "Premium", note: "Award-winning, strong backlink profile. Targets premium market segment." },
      { name: "Made by Shape", threat: "High", type: "Direct", note: "Manchester but ranks for London terms. Strong portfolio + blog SEO." },
      { name: "Clearleft", threat: "Medium", type: "UX-focused", note: "UX consultancy, strong thought leadership content and conference presence." },
      { name: "Supercreative", threat: "Medium", type: "Direct", note: "London-based, similar size. Good portfolio SEO with case study schema." },
      { name: "Bureau", threat: "Medium", type: "Boutique", note: "Small agency, ranks well for niche design terms. Strong local SEO." },
      { name: "Else London", threat: "Low", type: "Branding", note: "Branding focused. Limited web presence but good social following." },
    ];

    // ─── MISSING PAGES (GAP ANALYSIS) ────────────────────────────
    const missingPages = [
      { page: "Individual Service Pages (UX, Branding, Web, Mobile, Strategy)", volume: "3,000+/mo combined", impact: "Critical", reason: "Services page is a single page listing everything. Competitors have dedicated /services/ux-design/, /services/branding/ etc. that rank individually." },
      { page: "Industry/Sector Pages (Healthcare, Fintech, Education)", volume: "500+/mo combined", impact: "High", reason: "11 case studies span multiple industries. No landing pages targeting 'healthcare ux design' or 'fintech design agency'." },
      { page: "Process/Approach Page", volume: "200+/mo", impact: "Medium", reason: "No dedicated page explaining how you work. 'design process' and 'ux design process' have strong search volume." },
      { page: "Case Study Hub with Filters", volume: "N/A (internal link equity)", impact: "High", reason: "Portfolio items are flat list under /work/. No filterable hub page, no category pages, no proper internal linking." },
      { page: "FAQ Page", volume: "Long-tail capture", impact: "Medium", reason: "No FAQ page to capture 'how much does a website cost' (2,900/mo), 'how long does web design take' (320/mo), etc." },
      { page: "London / Location Page", volume: "400+/mo", impact: "Medium", reason: "No dedicated London landing page. Relying on schema and meta only for local signals." },
    ];

    // ─── CONTENT PLAN ─────────────────────────────────────────────
    const blogTopics = [
      { title: "How Much Does a Website Cost in 2026?", cluster: "Commercial", volume: "2,900/mo", priority: "TOP", status: "Draft"},
      { title: "How to Choose a Web Design Agency", cluster: "Commercial", volume: "140/mo", priority: "TOP", status: "Draft"},
      { title: "UX Design Process: A Complete Guide", cluster: "UX", volume: "880/mo", priority: "High", status: "Draft"},
      { title: "Website Redesign Checklist", cluster: "Commercial", volume: "320/mo", priority: "High", status: "Draft"},
      { title: "What Makes a Good Portfolio Website?", cluster: "Design", volume: "210/mo", priority: "High", status: "Draft"},
      { title: "Branding vs Logo Design: What's the Difference?", cluster: "Branding", volume: "170/mo", priority: "Medium", status: "Draft"},
      { title: "How UX Design Improves Conversion Rates", cluster: "UX", volume: "110/mo", priority: "Medium", status: "Draft"},
      { title: "Design Systems: Why Your Business Needs One", cluster: "UX", volume: "90/mo", priority: "Medium", status: "Draft"},
      { title: "Mobile App Design: Native vs Cross-Platform UX", cluster: "Mobile", volume: "150/mo", priority: "Medium", status: "Draft"},
      { title: "Accessibility in Web Design: A Business Case", cluster: "UX", volume: "70/mo", priority: "Medium", status: "Draft"},
    ];

    const caseStudyContent = [
      { title: "ES Therapy Centre: Designing for Mental Health", type: "Long-form case study", priority: "TOP", status: "Not started", seoAngle: "Healthcare UX, therapy website design" },
      { title: "Truphone eSIM: Enterprise Telecoms UX", type: "Long-form case study", priority: "High", status: "Not started", seoAngle: "Telecoms UX, enterprise app design" },
      { title: "Dinner Twist: Food Delivery App Design", type: "Long-form case study", priority: "High", status: "Not started", seoAngle: "Food delivery UX, startup design" },
    ];

    // ─── LOCAL SEO ────────────────────────────────────────────────
    const localChecks = [
      { item: "Google Business Profile", status: "Unknown", note: "Not audited. Need to verify GBP exists, is claimed, and has correct info." },
      { item: "NAP Consistency", status: "Partial", note: "Name + phone in schema. No street address (London only). Check GBP, social profiles, directories." },
      { item: "Local schema markup", status: "Done", note: "LocalBusiness schema site-wide via functions.php with address, phone, social links." },
      { item: "Reviews / Testimonials", status: "Done", note: "AggregateRating + individual Review schema from 12 testimonials on homepage via functions.php." },
      { item: "Local directory listings", status: "Unknown", note: "Not audited. Check Clutch, DesignRush, The Manifest, Bark, Yell, etc." },
      { item: "Location page", status: "Missing", note: "No dedicated London/UK landing page to reinforce local signals." },
      { item: "Local content", status: "Missing", note: "No London-focused blog posts or guides. No 'design agencies in London' comparison content." },
    ];

    // ─── PLUGIN LIST ──────────────────────────────────────────────
    const pluginList = [
      { name: "All in One SEO (AIOSEO)", status: "active", note: "SEO plugin. Managing titles, meta, sitemap, schema. v4.9.5.1" },
      { name: "Elementor / Elementor Pro", status: "active", note: "Page builder. Source of heading structure issues." },
      { name: "LiteSpeed Cache", status: "active", note: "Caching + performance. Working correctly." },
      { name: "Blocksy (theme)", status: "active", note: "Theme with child theme. functions.php has custom schema + MIME types." },
    ];

    // ─── E-E-A-T SIGNALS ─────────────────────────────────────────
    const eeatSignals = [
      { signal: "Author/Founder visibility", status: "Partial", note: "Michael Trevatt named in schema as founder. No dedicated author page or bio on blog posts." },
      { signal: "Credentials & Awards", status: "Missing", note: "Award-winning mentioned in meta but no awards page, no badge markup, no specific awards listed." },
      { signal: "Client testimonials", status: "Good", note: "12 testimonials with AggregateRating + Review schema on homepage. Individual reviews attributed to named clients." },
      { signal: "Case study depth", status: "Weak", note: "Portfolio pages exist but are image-heavy with minimal text. No metrics, no process description, no results." },
      { signal: "External validation", status: "Missing", note: "No Clutch/DesignRush profile linked. No press mentions. No guest posts on other sites." },
      { signal: "Social proof", status: "Partial", note: "Instagram, LinkedIn, Medium, Pinterest, Facebook in schema. Activity level unknown." },
      { signal: "Contact transparency", status: "Good", note: "Phone, email discoverable. Contact page with form. London address in schema." },
    ];

    // ─── TABS ─────────────────────────────────────────────────────
    const TABS = [
      { id: "overview", label: "Overview" },
      { id: "audit", label: "Site Audit" },
      { id: "technical", label: "Technical" },
      { id: "keywords", label: "Keywords" },
      { id: "content", label: "Content Plan" },
      { id: "local", label: "Local SEO" },
      { id: "plan", label: "Action Plan" },
    ];

    // ═══════════════════════════════════════════════════════════════
    // UTILITY COMPONENTS
    // ═══════════════════════════════════════════════════════════════

    const s = {
      card: { background: C.card, borderRadius: 10, border: "1px solid " + C.border, padding: 20, marginBottom: 12 },
      cardSmall: { background: C.card, borderRadius: 8, border: "1px solid " + C.border, padding: 14 },
      h2: { fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 12 },
      h3: { fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 8 },
      label: { fontSize: 11, fontWeight: 600, color: C.textMut, textTransform: "uppercase", letterSpacing: 0.5 },
      grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
      grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
      grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 },
      row: { display: "flex", alignItems: "center", gap: 8 },
      table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
      th: { textAlign: "left", padding: "8px 12px", borderBottom: "2px solid " + C.border, fontSize: 11, fontWeight: 600, color: C.textMut, textTransform: "uppercase", letterSpacing: 0.5 },
      td: { padding: "10px 12px", borderBottom: "1px solid " + C.borderLight, verticalAlign: "top" },
    };

    function Badge({ type, children }) {
      const colors = {
        pass: { bg: "#ecfdf5", text: "#065f46", dot: C.pass },
        warn: { bg: "#fffbeb", text: "#92400e", dot: C.warn },
        fail: { bg: "#fef2f2", text: "#991b1b", dot: C.alert },
        info: { bg: "#eff6ff", text: "#1e40af", dot: "#3b82f6" },
        purple: { bg: "#f5f3ff", text: "#5b21b6", dot: C.purple },
      };
      const c = colors[type] || colors.info;
      return React.createElement("span", {
        style: { display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }
      }, React.createElement("span", { style: { width: 5, height: 5, borderRadius: "50%", background: c.dot } }), children);
    }

    function StatCard({ label, value, color, sub }) {
      return React.createElement("div", { style: s.cardSmall },
        React.createElement("div", { style: s.label }, label),
        React.createElement("div", { style: { fontSize: 28, fontWeight: 700, color: color || C.text, marginTop: 4 } }, value),
        sub && React.createElement("div", { style: { fontSize: 12, color: C.textSec, marginTop: 2 } }, sub)
      );
    }

    function Section({ title, children, extra }) {
      return React.createElement("div", { style: s.card },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
          React.createElement("h2", { style: s.h2, style: { fontSize: 16, fontWeight: 700, color: C.text, margin: 0 } }, title),
          extra
        ),
        children
      );
    }

    function severity(sev) {
      if (sev === "High" || sev === "Critical") return "fail";
      if (sev === "Medium") return "warn";
      return "info";
    }

    function impact(imp) {
      if (imp === "Critical" || imp === "TOP") return "fail";
      if (imp === "High") return "warn";
      return "info";
    }

    // ═══════════════════════════════════════════════════════════════
    // TAB: OVERVIEW
    // ═══════════════════════════════════════════════════════════════

    function Overview() {
      const avgScore = Math.round(healthScores.reduce(function(a, b) { return a + b.score; }, 0) / healthScores.length);
      const radarData = healthScores.map(function(h) { return { area: h.area.replace("SEO", "").trim(), score: h.score, fullMark: 100 }; });
      const issuesByStatus = { High: 0, Medium: 0, Low: 0 };
      technicalIssues.forEach(function(i) { issuesByStatus[i.severity] = (issuesByStatus[i.severity] || 0) + 1; });

      return React.createElement("div", null,
        // Score + Radar
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, marginBottom: 16 } },
          React.createElement("div", { style: Object.assign({}, s.card, { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }) },
            React.createElement("div", { style: { fontSize: 56, fontWeight: 800, color: avgScore >= 60 ? C.warn : C.alert, letterSpacing: -2 } }, avgScore),
            React.createElement("div", { style: { fontSize: 14, color: C.textSec, marginTop: 4 } }, "Overall SEO Score"),
            React.createElement("div", { style: { fontSize: 12, color: C.textMut, marginTop: 8, textAlign: "center" } },
              technicalIssues.length + " issues found \\u00b7 " + missingPages.length + " page gaps")
          ),
          React.createElement("div", { style: s.card },
            React.createElement("div", { style: { height: 240 } },
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
                React.createElement(RadarChart, { data: radarData },
                  React.createElement(PolarGrid, { stroke: C.border }),
                  React.createElement(PolarAngleAxis, { dataKey: "area", tick: { fontSize: 11, fill: C.textSec } }),
                  React.createElement(PolarRadiusAxis, { angle: 30, domain: [0, 100], tick: { fontSize: 10 } }),
                  React.createElement(Radar, { name: "Score", dataKey: "score", stroke: C.indigo, fill: C.indigo, fillOpacity: 0.15, strokeWidth: 2 })
                )
              )
            )
          )
        ),

        // Health area cards
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 16 } },
          healthScores.map(function(h) {
            var color = h.score >= 70 ? C.pass : h.score >= 50 ? C.warn : C.alert;
            return React.createElement("div", { key: h.area, style: s.cardSmall },
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
                React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: C.textSec } }, h.area),
                React.createElement("span", { style: { fontSize: 20, fontWeight: 700, color: color } }, h.score)
              ),
              React.createElement("div", { style: { height: 3, background: C.borderLight, borderRadius: 2, overflow: "hidden" } },
                React.createElement("div", { style: { height: "100%", width: h.score + "%", background: color, borderRadius: 2 } })
              ),
              React.createElement("div", { style: { fontSize: 11, color: C.textMut, marginTop: 6, lineHeight: 1.4 } }, h.items)
            );
          })
        ),

        // Quick stats
        React.createElement("div", { style: s.grid4 },
          React.createElement(StatCard, { label: "Pages indexed", value: sitePages.length, sub: "+ " + blogPosts.length + " blog + " + caseStudies.length + " case studies" }),
          React.createElement(StatCard, { label: "Keywords tracked", value: topKeywords.length, color: C.indigo }),
          React.createElement(StatCard, { label: "Page gaps", value: missingPages.length, color: C.alert, sub: "Missing high-value pages" }),
          React.createElement(StatCard, { label: "Content ideas", value: blogTopics.length + caseStudyContent.length, color: C.teal, sub: "Blog + case study topics" })
        )
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // TAB: SITE AUDIT
    // ═══════════════════════════════════════════════════════════════

    function SiteAudit() {
      return React.createElement("div", null,
        // Per-page table
        React.createElement(Section, { title: "Page-by-Page Audit" },
          React.createElement("div", { style: { overflowX: "auto" } },
            React.createElement("table", { style: s.table },
              React.createElement("thead", null,
                React.createElement("tr", null,
                  ["Page", "Title", "Meta Desc", "H1s", "Schema", "OG"].map(function(h) {
                    return React.createElement("th", { key: h, style: s.th }, h);
                  })
                )
              ),
              React.createElement("tbody", null,
                sitePages.map(function(p) {
                  var titleOk = p.titleLen >= 30 && p.titleLen <= 65;
                  var descOk = p.descLen >= 70 && p.descLen <= 165;
                  var h1Ok = p.h1Count === 1;
                  return React.createElement("tr", { key: p.url },
                    React.createElement("td", { style: s.td },
                      React.createElement("div", { style: { fontWeight: 600 } }, p.name),
                      React.createElement("div", { style: { fontSize: 11, color: C.textMut } }, p.url)
                    ),
                    React.createElement("td", { style: s.td },
                      React.createElement(Badge, { type: titleOk ? "pass" : "warn" }, p.titleLen + " chars"),
                      React.createElement("div", { style: { fontSize: 11, color: C.textMut, marginTop: 4, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, p.title)
                    ),
                    React.createElement("td", { style: s.td },
                      React.createElement(Badge, { type: descOk ? "pass" : "fail" }, p.descLen + " chars"),
                      React.createElement("div", { style: { fontSize: 11, color: C.textMut, marginTop: 4, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, p.metaDesc)
                    ),
                    React.createElement("td", { style: s.td },
                      React.createElement(Badge, { type: h1Ok ? "pass" : "fail" }, p.h1Count + (p.h1Count === 1 ? " H1" : " H1s")),
                      !h1Ok && React.createElement("div", { style: { fontSize: 10, color: C.alert, marginTop: 4 } }, "Should be 1")
                    ),
                    React.createElement("td", { style: s.td },
                      React.createElement("div", { style: { fontSize: 11, color: C.textSec, maxWidth: 140 } }, p.schema)
                    ),
                    React.createElement("td", { style: s.td },
                      React.createElement(Badge, { type: p.ogImage ? "pass" : "fail" }, p.ogImage ? "Yes" : "No")
                    )
                  );
                })
              )
            )
          )
        ),

        // Blog posts
        React.createElement(Section, { title: "Blog Posts (" + blogPosts.length + ")", extra: React.createElement(Badge, { type: "pass" }, "Article schema active") },
          React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 } },
            blogPosts.map(function(p) {
              return React.createElement("div", { key: p.url, style: { padding: "8px 12px", background: C.borderLight, borderRadius: 6, fontSize: 12 } },
                React.createElement("div", { style: { fontWeight: 500 } }, p.title),
                React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 4 } },
                  React.createElement(Badge, { type: "purple" }, p.cluster)
                )
              );
            })
          )
        ),

        // Case studies
        React.createElement(Section, { title: "Portfolio (" + caseStudies.length + " case studies)", extra: React.createElement(Badge, { type: "fail" }, "No CreativeWork schema") },
          React.createElement("table", { style: s.table },
            React.createElement("thead", null,
              React.createElement("tr", null,
                ["Project", "Industry", "Schema", "URL"].map(function(h) {
                  return React.createElement("th", { key: h, style: s.th }, h);
                })
              )
            ),
            React.createElement("tbody", null,
              caseStudies.map(function(cs) {
                return React.createElement("tr", { key: cs.url },
                  React.createElement("td", { style: s.td }, React.createElement("span", { style: { fontWeight: 500 } }, cs.title)),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: "info" }, cs.industry)),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: "fail" }, "Missing")),
                  React.createElement("td", { style: s.td }, React.createElement("span", { style: { fontSize: 11, color: C.textMut } }, cs.url))
                );
              })
            )
          )
        )
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // TAB: TECHNICAL
    // ═══════════════════════════════════════════════════════════════

    function Technical() {
      return React.createElement("div", null,
        React.createElement(Section, { title: "Open Issues (" + technicalIssues.length + ")" },
          React.createElement("table", { style: s.table },
            React.createElement("thead", null,
              React.createElement("tr", null,
                ["Severity", "Category", "Issue", "Status"].map(function(h) {
                  return React.createElement("th", { key: h, style: s.th }, h);
                })
              )
            ),
            React.createElement("tbody", null,
              technicalIssues.map(function(t, i) {
                return React.createElement("tr", { key: i },
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: severity(t.severity) }, t.severity)),
                  React.createElement("td", { style: s.td }, React.createElement("span", { style: { fontSize: 12, color: C.textSec } }, t.category)),
                  React.createElement("td", { style: s.td },
                    React.createElement("div", { style: { fontWeight: 500, fontSize: 13 } }, t.issue),
                    React.createElement("div", { style: { fontSize: 11, color: C.textMut, marginTop: 3 } }, t.note)
                  ),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: t.status === "Open" ? "warn" : "pass" }, t.status))
                );
              })
            )
          )
        ),

        // Schema overview
        React.createElement(Section, { title: "Schema Markup" },
          React.createElement("div", { style: s.grid2 },
            React.createElement("div", null,
              React.createElement("div", { style: s.h3 }, "Present"),
              ["LocalBusiness (site-wide)", "BreadcrumbList (all pages)", "Organization (AIOSEO)", "WebSite (AIOSEO)", "WebPage (service pages)", "CollectionPage (blog listing)"].map(function(item) {
                return React.createElement("div", { key: item, style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13 } },
                  React.createElement("span", { style: { color: C.pass } }, "\\u2713"),
                  item
                );
              })
            ),
            React.createElement("div", null,
              React.createElement("div", { style: s.h3 }, "Missing"),
              ["Article / BlogPosting (21 posts)", "CreativeWork (11 case studies)", "Review / AggregateRating", "FAQPage", "Person (author/founder)", "Service (individual services)"].map(function(item) {
                return React.createElement("div", { key: item, style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 13 } },
                  React.createElement("span", { style: { color: C.alert } }, "\\u2717"),
                  item
                );
              })
            )
          )
        ),

        // Plugins + Infrastructure
        React.createElement(Section, { title: "Infrastructure" },
          React.createElement("div", { style: s.grid2 },
            React.createElement("div", null,
              React.createElement("div", { style: s.h3 }, "Stack"),
              React.createElement("table", { style: s.table },
                React.createElement("tbody", null,
                  [["Platform", "WordPress + Elementor Pro"], ["Theme", "Blocksy / Blocksy Child"], ["Hosting", "Hostinger (LiteSpeed)"], ["CDN", "Hostinger hCDN"], ["PHP", "8.3.30"], ["SSL", "HTTPS with CSP"]].map(function(row) {
                    return React.createElement("tr", { key: row[0] },
                      React.createElement("td", { style: Object.assign({}, s.td, { fontWeight: 500, width: 100 }) }, row[0]),
                      React.createElement("td", { style: s.td }, row[1])
                    );
                  })
                )
              )
            ),
            React.createElement("div", null,
              React.createElement("div", { style: s.h3 }, "Key Plugins"),
              pluginList.map(function(p) {
                return React.createElement("div", { key: p.name, style: { padding: "8px 0", borderBottom: "1px solid " + C.borderLight, fontSize: 13 } },
                  React.createElement("div", { style: { fontWeight: 500 } }, p.name),
                  React.createElement("div", { style: { fontSize: 11, color: C.textMut } }, p.note)
                );
              })
            )
          )
        ),

        // E-E-A-T
        React.createElement(Section, { title: "E-E-A-T Signals" },
          React.createElement("table", { style: s.table },
            React.createElement("thead", null,
              React.createElement("tr", null,
                ["Signal", "Status", "Detail"].map(function(h) {
                  return React.createElement("th", { key: h, style: s.th }, h);
                })
              )
            ),
            React.createElement("tbody", null,
              eeatSignals.map(function(e, i) {
                var type = e.status === "Good" ? "pass" : e.status === "Partial" ? "warn" : "fail";
                return React.createElement("tr", { key: i },
                  React.createElement("td", { style: Object.assign({}, s.td, { fontWeight: 500 }) }, e.signal),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: type }, e.status)),
                  React.createElement("td", { style: s.td }, React.createElement("span", { style: { fontSize: 12, color: C.textSec } }, e.note))
                );
              })
            )
          )
        )
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // TAB: KEYWORDS
    // ═══════════════════════════════════════════════════════════════

    function Keywords() {
      var existing = topKeywords.filter(function(k) { return k.exists; }).length;
      var gaps = topKeywords.length - existing;
      var COLORS = [C.pass, C.warn, C.indigo, C.textMut];

      return React.createElement("div", null,
        React.createElement("div", { style: s.grid3 },
          React.createElement(StatCard, { label: "Keywords tracked", value: topKeywords.length, color: C.indigo }),
          React.createElement(StatCard, { label: "Pages targeting", value: existing, color: C.pass, sub: "Have a landing page" }),
          React.createElement(StatCard, { label: "Keyword gaps", value: gaps, color: C.alert, sub: "Need a page" })
        ),

        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "16px 0" } },
          React.createElement(Section, { title: "By Intent" },
            React.createElement("div", { style: { height: 200 } },
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
                React.createElement(PieChart, null,
                  React.createElement(Pie, { data: kwByIntent, cx: "50%", cy: "50%", outerRadius: 70, dataKey: "value", label: function(e) { return e.name + " (" + e.value + ")"; }, labelLine: true, fontSize: 11 },
                    kwByIntent.map(function(_, i) { return React.createElement(Cell, { key: i, fill: COLORS[i % COLORS.length] }); })
                  ),
                  React.createElement(Tooltip, null)
                )
              )
            )
          ),
          React.createElement(Section, { title: "By Relevance" },
            React.createElement("div", { style: { height: 200 } },
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
                React.createElement(PieChart, null,
                  React.createElement(Pie, { data: kwByRelevance, cx: "50%", cy: "50%", outerRadius: 70, dataKey: "value", label: function(e) { return e.name + " (" + e.value + ")"; }, labelLine: true, fontSize: 11 },
                    kwByRelevance.map(function(d, i) { return React.createElement(Cell, { key: i, fill: d.color }); })
                  ),
                  React.createElement(Tooltip, null)
                )
              )
            )
          )
        ),

        React.createElement(Section, { title: "Top Keywords" },
          React.createElement("table", { style: s.table },
            React.createElement("thead", null,
              React.createElement("tr", null,
                ["Keyword", "Volume", "Difficulty", "Target Page", "Page Exists"].map(function(h) {
                  return React.createElement("th", { key: h, style: s.th }, h);
                })
              )
            ),
            React.createElement("tbody", null,
              topKeywords.map(function(k, i) {
                return React.createElement("tr", { key: i },
                  React.createElement("td", { style: Object.assign({}, s.td, { fontWeight: 500 }) }, k.kw),
                  React.createElement("td", { style: s.td }, React.createElement("span", { style: { fontWeight: 600 } }, k.vol.toLocaleString() + "/mo")),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: k.diff === "High" ? "fail" : k.diff === "Medium" ? "warn" : "pass" }, k.diff)),
                  React.createElement("td", { style: s.td }, React.createElement("span", { style: { fontSize: 12 } }, k.page)),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: k.exists ? "pass" : "fail" }, k.exists ? "Yes" : "No"))
                );
              })
            )
          )
        ),

        React.createElement(Section, { title: "Page Gap Analysis" },
          missingPages.map(function(mp, i) {
            return React.createElement("div", { key: i, style: { padding: "12px 0", borderBottom: i < missingPages.length - 1 ? "1px solid " + C.borderLight : "none" } },
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, mp.page),
                React.createElement("div", { style: { display: "flex", gap: 8 } },
                  React.createElement(Badge, { type: impact(mp.impact) }, mp.impact),
                  React.createElement(Badge, { type: "info" }, mp.volume)
                )
              ),
              React.createElement("div", { style: { fontSize: 12, color: C.textSec, marginTop: 4 } }, mp.reason)
            );
          })
        )
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // TAB: CONTENT PLAN
    // ═══════════════════════════════════════════════════════════════

    function ContentPlan() {
      var clusterCounts = {};
      blogPosts.forEach(function(p) { clusterCounts[p.cluster] = (clusterCounts[p.cluster] || 0) + 1; });
      var clusterData = Object.entries(clusterCounts).map(function(e) { return { name: e[0], count: e[1] }; }).sort(function(a, b) { return b.count - a.count; });

      return React.createElement("div", null,
        // Existing content analysis
        React.createElement(Section, { title: "Existing Content: " + blogPosts.length + " Posts by Cluster" },
          React.createElement("div", { style: { height: 200 } },
            React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
              React.createElement(BarChart, { data: clusterData },
                React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: C.borderLight }),
                React.createElement(XAxis, { dataKey: "name", tick: { fontSize: 11 } }),
                React.createElement(YAxis, { tick: { fontSize: 11 } }),
                React.createElement(Tooltip, null),
                React.createElement(Bar, { dataKey: "count", fill: C.indigo, radius: [4, 4, 0, 0] })
              )
            )
          ),
          React.createElement("div", { style: { fontSize: 12, color: C.textSec, marginTop: 8 } },
            "\\u26A0 Content is heavily weighted toward design-thinking essays. No commercial/service-focused content. No case study write-ups optimised for search.")
        ),

        // New blog topics
        React.createElement(Section, { title: "Proposed Blog Topics", extra: React.createElement(Badge, { type: "info" }, blogTopics.length + " topics") },
          React.createElement("table", { style: s.table },
            React.createElement("thead", null,
              React.createElement("tr", null,
                ["Topic", "Cluster", "Volume", "Priority", "Status"].map(function(h) {
                  return React.createElement("th", { key: h, style: s.th }, h);
                })
              )
            ),
            React.createElement("tbody", null,
              blogTopics.map(function(t, i) {
                return React.createElement("tr", { key: i },
                  React.createElement("td", { style: Object.assign({}, s.td, { fontWeight: 500 }) }, t.title),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: "purple" }, t.cluster)),
                  React.createElement("td", { style: s.td }, t.volume),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: impact(t.priority) }, t.priority)),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: "info" }, t.status))
                );
              })
            )
          )
        ),

        // Case study content
        React.createElement(Section, { title: "Case Study Content Plan", extra: React.createElement(Badge, { type: "info" }, caseStudyContent.length + " pieces") },
          caseStudyContent.map(function(cs, i) {
            return React.createElement("div", { key: i, style: { padding: "12px 0", borderBottom: i < caseStudyContent.length - 1 ? "1px solid " + C.borderLight : "none" } },
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                React.createElement("span", { style: { fontWeight: 600 } }, cs.title),
                React.createElement("div", { style: { display: "flex", gap: 6 } },
                  React.createElement(Badge, { type: impact(cs.priority) }, cs.priority),
                  React.createElement(Badge, { type: "info" }, cs.status)
                )
              ),
              React.createElement("div", { style: { fontSize: 12, color: C.textSec, marginTop: 4 } },
                cs.type + " \\u2014 SEO angle: " + cs.seoAngle)
            );
          })
        )
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // TAB: LOCAL SEO
    // ═══════════════════════════════════════════════════════════════

    function LocalSEO() {
      var doneCount = localChecks.filter(function(c) { return c.status === "Done"; }).length;
      var totalCount = localChecks.length;

      return React.createElement("div", null,
        React.createElement("div", { style: s.grid3 },
          React.createElement(StatCard, { label: "Local checklist", value: doneCount + "/" + totalCount, color: C.warn, sub: "Items completed" }),
          React.createElement(StatCard, { label: "Competitors tracked", value: competitors.length }),
          React.createElement(StatCard, { label: "Local score", value: healthScores.find(function(h) { return h.area === "Local SEO"; }).score, color: C.alert })
        ),

        React.createElement(Section, { title: "Local SEO Checklist" },
          localChecks.map(function(c, i) {
            var type = c.status === "Done" ? "pass" : c.status === "Partial" ? "warn" : c.status === "Missing" ? "fail" : "info";
            return React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid " + C.borderLight } },
              React.createElement("div", null,
                React.createElement("div", { style: { fontWeight: 500, fontSize: 14 } }, c.item),
                React.createElement("div", { style: { fontSize: 12, color: C.textSec, marginTop: 3 } }, c.note)
              ),
              React.createElement(Badge, { type: type }, c.status)
            );
          })
        ),

        React.createElement(Section, { title: "Competitor Landscape" },
          React.createElement("table", { style: s.table },
            React.createElement("thead", null,
              React.createElement("tr", null,
                ["Competitor", "Threat", "Type", "Notes"].map(function(h) {
                  return React.createElement("th", { key: h, style: s.th }, h);
                })
              )
            ),
            React.createElement("tbody", null,
              competitors.map(function(c, i) {
                return React.createElement("tr", { key: i },
                  React.createElement("td", { style: Object.assign({}, s.td, { fontWeight: 600 }) }, c.name),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: severity(c.threat) }, c.threat)),
                  React.createElement("td", { style: s.td }, React.createElement(Badge, { type: "purple" }, c.type)),
                  React.createElement("td", { style: s.td }, React.createElement("span", { style: { fontSize: 12, color: C.textSec } }, c.note))
                );
              })
            )
          )
        )
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // TAB: ACTION PLAN
    // ═══════════════════════════════════════════════════════════════

    function ActionPlan() {
      const doneActions = [
        { action: "Fix H1 tags on all pages", category: "On-Page", date: "9 Apr 2026" },
        { action: "Rewrite meta descriptions (Services, About, Contact, Logos)", category: "On-Page", date: "9 Apr 2026" },
        { action: "Add Article/BlogPosting schema to all blog posts", category: "Schema", date: "9 Apr 2026" },
        { action: "Add CreativeWork schema to all 11 case studies", category: "Schema", date: "9 Apr 2026" },
        { action: "Add AggregateRating + Review schema from 12 testimonials", category: "Schema", date: "9 Apr 2026" },
        { action: "Fix foundingDate conflict (aligned to 2010)", category: "Schema", date: "9 Apr 2026" },
        { action: "Draft 10 SEO-targeted blog posts (in WP as drafts)", category: "Content", date: "9 Apr 2026" },
        { action: "Style blog posts with CSS to match Elementor layout", category: "Content", date: "10 Apr 2026" },
        { action: "Add inline images to all 10 draft posts", category: "Content", date: "10 Apr 2026" },
        { action: "Add auto-CTA section to non-Elementor posts", category: "Content", date: "10 Apr 2026" },
        { action: "Enable Blocksy author box + boxed content style", category: "E-E-A-T", date: "10 Apr 2026" },
        { action: "Set up WordPress author profile (Michael Trevatt)", category: "E-E-A-T", date: "10 Apr 2026" },
      ];

      const michaelActions = [
        { action: "Review and publish 10 draft blog posts", impact: "High", effort: "Medium", category: "Content", why: "Posts are written, styled, and have images + CTA. Need your review for accuracy and voice before publishing. Top priority: Website Cost (2,900/mo volume)." },
        { action: "Add featured images for social sharing", impact: "Medium", effort: "Low", category: "Content", why: "Posts have inline images but need a featured image set in WP for og:image and blog listing thumbnails. 2 min per post in the editor." },
        { action: "Audit and claim Google Business Profile", impact: "High", effort: "Low", category: "Local", why: "Foundation of local SEO. Check if GBP exists, is claimed, has correct hours/phone/address. Upload photos. Enable messaging. Ask past clients for reviews." },
        { action: "Register on Clutch, DesignRush, The Manifest", impact: "High", effort: "Medium", category: "E-E-A-T", why: "External validation + backlinks from authoritative design directories. Clutch alone can generate leads. Each profile takes ~30 min to complete." },
        { action: "Create individual service pages in Elementor", impact: "Critical", effort: "High", category: "Content", why: "3,000+/mo combined volume. Need: /services/ux-design/, /services/branding/, /services/web-design/, /services/mobile-app-design/, /services/digital-strategy/. Claude can draft content; you build in Elementor." },
        { action: "Create industry landing pages (Healthcare, Fintech, Education)", impact: "High", effort: "High", category: "Content", why: "Target healthcare ux design, fintech design agency etc. Link to relevant case studies. Claude can draft; you build in Elementor." },
        { action: "Create a dedicated author/credentials page", impact: "Medium", effort: "Low", category: "E-E-A-T", why: "Author box now shows on all posts with bio. A standalone /about/michael-trevatt/ page with credentials, awards, and social links would strengthen E-E-A-T further." },
        { action: "Run PageSpeed / Core Web Vitals audit", impact: "Medium", effort: "Low", category: "Technical", why: "No performance baseline. Run Lighthouse on Home, Services, a blog post. Note LCP, CLS, INP scores. Share results and Claude can recommend fixes." },
        { action: "Upload unique og:images for key pages", impact: "Low", effort: "Low", category: "Social", why: "All pages share TD-Website-image.png. Set page-specific images in AIOSEO for Home, Services, About, Logos. 5 min per page." },
        { action: "Add security headers via LiteSpeed config", impact: "Low", effort: "Low", category: "Technical", why: "Missing HSTS, X-Content-Type-Options, X-Frame-Options. Can add in LiteSpeed Cache settings or .htaccess. Claude can guide you through it." },
      ];

      const claudeActions = [
        { action: "Set up daily keyword research task for Trevatt Design", impact: "High", effort: "Low", category: "Keywords", why: "Replicate the ES Therapy methodology: daily competitor analysis, keyword gap discovery, SERP monitoring. Runs automatically like the ES Therapy task." },
        { action: "Draft content for individual service pages", impact: "Critical", effort: "Medium", category: "Content", why: "Write SEO-optimised copy for each service page once Michael creates the Elementor templates." },
        { action: "Draft content for industry landing pages", impact: "High", effort: "Medium", category: "Content", why: "Healthcare UX, fintech design, education design. Link to case studies. Ready when pages exist." },
        { action: "Write long-form case study: ES Therapy Centre", impact: "High", effort: "Medium", category: "Content", why: "Demonstrates healthcare UX expertise. Targets therapy website design, healthcare ux keywords." },
        { action: "Create FAQ page content", impact: "Medium", effort: "Low", category: "Content", why: "Target how much does a website cost (2,900/mo), how long does web design take (320/mo), etc. FAQ schema for rich results." },
        { action: "Build London location page content", impact: "Medium", effort: "Low", category: "Local", why: "Dedicated London landing page to reinforce local signals. Include map, transport, service area." },
        { action: "Build case study hub page content", impact: "Medium", effort: "Medium", category: "Structure", why: "Filterable portfolio page with proper categories, internal linking, and structured data." },
      ];

      const impOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      michaelActions.sort(function(a, b) { return impOrder[a.impact] - impOrder[b.impact]; });
      claudeActions.sort(function(a, b) { return impOrder[a.impact] - impOrder[b.impact]; });

      var michaelCritical = michaelActions.filter(function(a) { return a.impact === "Critical"; }).length;
      var michaelHigh = michaelActions.filter(function(a) { return a.impact === "High"; }).length;

      return React.createElement("div", null,
        React.createElement("div", { style: s.grid4 },
          React.createElement(StatCard, { label: "Completed", value: doneActions.length, color: C.pass, sub: "Done by Claude" }),
          React.createElement(StatCard, { label: "Michael\\u2019s tasks", value: michaelActions.length, color: C.warn, sub: michaelCritical + " critical, " + michaelHigh + " high" }),
          React.createElement(StatCard, { label: "Claude queue", value: claudeActions.length, color: C.indigo, sub: "Ready when needed" }),
          React.createElement(StatCard, { label: "Total progress", value: Math.round(doneActions.length / (doneActions.length + michaelActions.length + claudeActions.length) * 100) + "%", color: C.pass })
        ),

        // DONE section
        React.createElement(Section, { title: "Completed", extra: React.createElement(Badge, { type: "pass" }, doneActions.length + " done") },
          React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 6 } },
            doneActions.map(function(a, i) {
              return React.createElement("div", { key: i, style: { padding: "8px 12px", background: "#f0fdf4", borderRadius: 6, border: "1px solid #bbf7d0", fontSize: 13 } },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                  React.createElement("span", null, "\\u2705 " + a.action),
                  React.createElement("span", { style: { fontSize: 11, color: C.textMut } }, a.date)
                )
              );
            })
          )
        ),

        // MICHAEL section
        React.createElement(Section, { title: "\\ud83d\\udc64 Michael \\u2014 Your Tasks", extra: React.createElement(Badge, { type: "warn" }, michaelActions.length + " pending") },
          michaelActions.map(function(a, i) {
            return React.createElement("div", { key: i, style: Object.assign({}, s.card, { marginBottom: 8, borderLeft: "3px solid " + (a.impact === "Critical" ? C.alert : a.impact === "High" ? C.warn : C.indigo) }) },
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                React.createElement("div", { style: { flex: 1 } },
                  React.createElement("div", { style: { fontWeight: 600, fontSize: 14, marginBottom: 4 } }, a.action),
                  React.createElement("div", { style: { fontSize: 12, color: C.textSec, lineHeight: 1.5 } }, a.why)
                ),
                React.createElement("div", { style: { display: "flex", gap: 6, marginLeft: 16, flexShrink: 0 } },
                  React.createElement(Badge, { type: impact(a.impact) }, a.impact),
                  React.createElement(Badge, { type: a.effort === "Low" ? "pass" : a.effort === "Medium" ? "warn" : "fail" }, a.effort + " effort"),
                  React.createElement(Badge, { type: "purple" }, a.category)
                )
              )
            );
          })
        ),

        // CLAUDE section
        React.createElement(Section, { title: "\\ud83e\\udd16 Claude \\u2014 Queued Tasks", extra: React.createElement(Badge, { type: "info" }, claudeActions.length + " ready") },
          React.createElement("div", { style: { fontSize: 12, color: C.textSec, marginBottom: 12 } }, "These tasks will be done by Claude when prerequisites are met or when you ask."),
          claudeActions.map(function(a, i) {
            return React.createElement("div", { key: i, style: Object.assign({}, s.card, { marginBottom: 8, borderLeft: "3px solid " + C.indigo, opacity: 0.85 }) },
              React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                React.createElement("div", { style: { flex: 1 } },
                  React.createElement("div", { style: { fontWeight: 600, fontSize: 14, marginBottom: 4 } }, a.action),
                  React.createElement("div", { style: { fontSize: 12, color: C.textSec, lineHeight: 1.5 } }, a.why)
                ),
                React.createElement("div", { style: { display: "flex", gap: 6, marginLeft: 16, flexShrink: 0 } },
                  React.createElement(Badge, { type: impact(a.impact) }, a.impact),
                  React.createElement(Badge, { type: "purple" }, a.category)
                )
              )
            );
          })
        )
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // MAIN DASHBOARD
    // ═══════════════════════════════════════════════════════════════

    function Dashboard() {
      const [tab, setTab] = useState("overview");

      const tabContent = {
        overview: React.createElement(Overview),
        audit: React.createElement(SiteAudit),
        technical: React.createElement(Technical),
        keywords: React.createElement(Keywords),
        content: React.createElement(ContentPlan),
        local: React.createElement(LocalSEO),
        plan: React.createElement(ActionPlan),
      };

      return React.createElement("div", { style: { maxWidth: 1060, margin: "0 auto", padding: "20px 24px 60px" } },
        // Header
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid " + C.border, marginBottom: 20 } },
          React.createElement("div", null,
            React.createElement("h1", { style: { fontSize: 20, fontWeight: 700, letterSpacing: -0.3 } }, "trevattdesign.com"),
            React.createElement("div", { style: { fontSize: 13, color: C.textSec, marginTop: 2 } }, "SEO Command Centre \\u2014 Last updated " + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }))
          ),
          React.createElement("div", { style: { fontSize: 11, color: C.textMut } }, "Trevatt Design")
        ),

        // Tabs
        React.createElement("div", { style: { display: "flex", gap: 2, background: C.borderLight, borderRadius: 8, padding: 3, marginBottom: 20, overflowX: "auto" } },
          TABS.map(function(t) {
            var active = tab === t.id;
            return React.createElement("button", {
              key: t.id,
              onClick: function() { setTab(t.id); },
              style: {
                flex: "0 0 auto", padding: "8px 16px", border: "none", borderRadius: 6,
                background: active ? C.card : "transparent",
                color: active ? C.text : C.textSec,
                fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }
            }, t.label);
          })
        ),

        // Content
        tabContent[tab]
      );
    }

    ReactDOM.render(React.createElement(Dashboard), document.getElementById("root"));
  </` + `script>
</body>
</html>`;

    return new Response(HTML, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  },
};
