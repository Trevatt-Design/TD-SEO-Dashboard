export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SEO Audit — trevattdesign.com</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
<style>
  body { background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .ring-transition { transition: stroke-dashoffset 0.8s ease; }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const { useState } = React;

const SEO_DATA = {
  site: "trevattdesign.com",
  auditDate: "2026-04-09",
  overall: 78,
  previousScore: 52,
  sections: [
    {
      title: "Heading Structure (H1 Tags)",
      score: 95, prev: 30,
      items: [
        { page: "Home", url: "/", status: "fixed", note: "H1 added: 'Award-winning London digital agency'" },
        { page: "Services", url: "/services/", status: "fixed", note: "H1 with scramble-text animation" },
        { page: "About", url: "/about/", status: "fixed", note: "H1: 'London Design Studio'" },
        { page: "Contact", url: "/contact/", status: "review", note: "Verify H1 present" },
        { page: "Logos", url: "/logos/", status: "review", note: "Needs audit" },
      ],
    },
    {
      title: "Structured Data (Schema)",
      score: 95, prev: 10,
      items: [
        { page: "Site-wide", url: "*", status: "fixed", note: "LocalBusiness via functions.php" },
        { page: "Services", url: "/services/", status: "fixed", note: "WebPage + ItemList of Service entries" },
        { page: "About", url: "/about/", status: "fixed", note: "AboutPage schema" },
        { page: "Contact", url: "/contact/", status: "fixed", note: "ContactPage schema" },
        { page: "Portfolio", url: "/work/*", status: "todo", note: "CreativeWork schema on case studies" },
        { page: "Blog posts", url: "/latest/*", status: "todo", note: "Article schema on blog posts" },
      ],
    },
    {
      title: "Meta & Content",
      score: 70, prev: 65,
      items: [
        { page: "All pages", url: "*", status: "ok", note: "AIOSEO plugin managing titles & descriptions" },
        { page: "Blog posts", url: "/latest/*", status: "review", note: "Check meta descriptions unique per post" },
        { page: "Portfolio", url: "/work/*", status: "review", note: "Check meta descriptions unique per case study" },
      ],
    },
    {
      title: "Technical SEO",
      score: 65, prev: 60,
      items: [
        { page: "MIME types", url: "functions.php", status: "fixed", note: "JSON, CSV, TXT, XML, SVG, WebP, fonts allowed" },
        { page: "Sitemap", url: "/sitemap.xml", status: "ok", note: "AIOSEO sitemap active" },
        { page: "robots.txt", url: "/robots.txt", status: "review", note: "Verify crawl directives" },
        { page: "Page speed", url: "*", status: "review", note: "LiteSpeed Cache active, run PageSpeed audit" },
        { page: "Mobile", url: "*", status: "review", note: "Needs Google Search Console check" },
      ],
    },
    {
      title: "Tooling & Workflow",
      score: 90, prev: 20,
      items: [
        { page: "Elementor Utils", url: "memory", status: "fixed", note: "TD utility script for browser console edits" },
        { page: "Edit routing", url: "memory", status: "fixed", note: "MCP vs Elementor JS decision tree documented" },
        { page: "Site structure", url: "memory", status: "fixed", note: "All page IDs, post types, config indexed" },
        { page: "Schema approach", url: "functions.php", status: "fixed", note: "Site-wide via PHP, page-specific via widgets" },
      ],
    },
  ],
};

const statusConfig = {
  fixed: { label: "Done", bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  ok:    { label: "OK", bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  review:{ label: "Review", bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  todo:  { label: "To Do", bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
};

function Badge({ status }) {
  const c = statusConfig[status] || statusConfig.todo;
  return React.createElement("span", {
    style: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "2px 10px",
      borderRadius: "9999px", fontSize: "12px", fontWeight: 500, background: c.bg, color: c.text }
  },
    React.createElement("span", { style: { width: 6, height: 6, borderRadius: "50%", background: c.dot } }),
    c.label
  );
}

function ScoreRing({ score, prev, size = 80 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const delta = score - prev;
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", position: "relative", width: size, height: size + 20 } },
    React.createElement("svg", { width: size, height: size, style: { transform: "rotate(-90deg)" } },
      React.createElement("circle", { cx: size/2, cy: size/2, r, fill: "none", stroke: "#e5e7eb", strokeWidth: 6 }),
      React.createElement("circle", { cx: size/2, cy: size/2, r, fill: "none", stroke: color, strokeWidth: 6,
        strokeDasharray: circ, strokeDashoffset: offset, strokeLinecap: "round", className: "ring-transition" })
    ),
    React.createElement("span", { style: { position: "absolute", top: size/2 - 10, fontSize: size > 60 ? 22 : 16,
      fontWeight: 700, color } }, score),
    delta !== 0 && React.createElement("span", { style: { fontSize: 11, fontWeight: 500,
      color: delta > 0 ? "#059669" : "#ef4444", marginTop: 2 } },
      (delta > 0 ? "+" : "") + delta)
  );
}

function Section({ section, isOpen, toggle }) {
  const doneCount = section.items.filter(i => i.status === "fixed" || i.status === "ok").length;
  return React.createElement("div", { style: { border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", background: "#fff" } },
    React.createElement("button", { onClick: toggle, style: { width: "100%", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer" } },
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } },
        React.createElement(ScoreRing, { score: section.score, prev: section.prev, size: 52 }),
        React.createElement("div", { style: { textAlign: "left", marginLeft: 8 } },
          React.createElement("h3", { style: { margin: 0, fontSize: 15, fontWeight: 600, color: "#1e293b" } }, section.title),
          React.createElement("p", { style: { margin: "2px 0 0", fontSize: 12, color: "#94a3b8" } },
            doneCount + "/" + section.items.length + " complete")
        )
      ),
      React.createElement("span", { style: { fontSize: 18, color: "#94a3b8", transform: isOpen ? "rotate(180deg)" : "none",
        transition: "transform 0.2s" } }, "\\u25BC")
    ),
    isOpen && React.createElement("div", { style: { borderTop: "1px solid #f1f5f9" } },
      section.items.map(function(item, i) {
        return React.createElement("div", { key: i, style: { display: "flex", alignItems: "flex-start", gap: 12,
          padding: "12px 20px", borderBottom: "1px solid #f8fafc" } },
          React.createElement(Badge, { status: item.status }),
          React.createElement("div", null,
            React.createElement("span", { style: { fontSize: 14, fontWeight: 500, color: "#334155" } }, item.page),
            React.createElement("span", { style: { fontSize: 12, color: "#94a3b8", marginLeft: 8 } }, item.url),
            React.createElement("p", { style: { margin: "3px 0 0", fontSize: 12, color: "#64748b" } }, item.note)
          )
        );
      })
    )
  );
}

function Dashboard() {
  const [openSections, setOpenSections] = useState({ 0: true });
  const toggle = function(i) { setOpenSections(function(s) { var n = Object.assign({}, s); n[i] = !n[i]; return n; }); };

  const allItems = SEO_DATA.sections.reduce(function(acc, s) { return acc.concat(s.items); }, []);
  const counts = { fixed: 0, ok: 0, review: 0, todo: 0 };
  allItems.forEach(function(item) { counts[item.status] = (counts[item.status] || 0) + 1; });

  return React.createElement("div", { style: { maxWidth: 720, margin: "0 auto", padding: 24 } },
    React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 } },
      React.createElement("div", null,
        React.createElement("h1", { style: { margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a" } },
          "SEO Audit \\u2014 " + SEO_DATA.site),
        React.createElement("p", { style: { margin: "4px 0 0", fontSize: 14, color: "#94a3b8" } },
          "Updated " + SEO_DATA.auditDate)
      ),
      React.createElement(ScoreRing, { score: SEO_DATA.overall, prev: SEO_DATA.previousScore, size: 80 })
    ),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 } },
      Object.keys(counts).map(function(status) {
        var c = statusConfig[status];
        return React.createElement("div", { key: status, style: { borderRadius: 8, padding: "12px 16px", background: c.bg } },
          React.createElement("div", { style: { fontSize: 24, fontWeight: 700, color: c.text } }, counts[status]),
          React.createElement("div", { style: { fontSize: 12, fontWeight: 500, color: c.text, opacity: 0.75 } }, c.label)
        );
      })
    ),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
      SEO_DATA.sections.map(function(section, i) {
        return React.createElement(Section, { key: i, section: section, isOpen: !!openSections[i],
          toggle: function() { toggle(i); } });
      })
    ),
    React.createElement("p", { style: { textAlign: "center", fontSize: 12, color: "#cbd5e1", marginTop: 24 } },
      "Trevatt Design SEO Dashboard \\u2014 Deployed via Cloudflare Workers")
  );
}

ReactDOM.render(React.createElement(Dashboard), document.getElementById("root"));
</${"script"}>
</body>
</html>`;
