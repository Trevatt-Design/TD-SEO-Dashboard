export const DASHBOARD_UI = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SEO Dashboard</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --surface-2: #1a1a26;
    --surface-3: #22222f;
    --border: #2a2a3a;
    --border-light: #333346;
    --text: #e8e8ef;
    --text-dim: #8888a0;
    --text-faint: #55556a;
    --accent: #6366f1;
    --accent-dim: #4f46e5;
    --green: #22c55e;
    --green-bg: rgba(34,197,94,0.1);
    --green-border: rgba(34,197,94,0.2);
    --amber: #f59e0b;
    --amber-bg: rgba(245,158,11,0.1);
    --amber-border: rgba(245,158,11,0.2);
    --red: #ef4444;
    --red-bg: rgba(239,68,68,0.1);
    --red-border: rgba(239,68,68,0.2);
    --radius: 10px;
    --radius-sm: 6px;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Layout ─────────────────────────── */
  .shell { max-width: 960px; margin: 0 auto; padding: 24px 20px 60px; }

  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 0 24px; border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
  }
  .header h1 { font-size: 20px; font-weight: 600; letter-spacing: -0.3px; }
  .header .meta { font-size: 13px; color: var(--text-dim); margin-top: 2px; }
  .header .live-dot {
    display: inline-block; width: 7px; height: 7px; border-radius: 50%;
    background: var(--green); margin-right: 6px; animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
  }

  .refresh-btn {
    background: var(--surface-2); border: 1px solid var(--border);
    color: var(--text-dim); padding: 8px 16px; border-radius: var(--radius-sm);
    font-size: 13px; cursor: pointer; transition: all 0.15s;
  }
  .refresh-btn:hover { background: var(--surface-3); color: var(--text); border-color: var(--border-light); }
  .refresh-btn.loading { opacity: 0.5; pointer-events: none; }

  /* ── Tabs ────────────────────────────── */
  .tabs {
    display: flex; gap: 2px; background: var(--surface);
    border-radius: var(--radius); padding: 3px; margin-bottom: 24px;
    border: 1px solid var(--border);
  }
  .tab {
    flex: 1; padding: 10px 16px; border: none; background: transparent;
    color: var(--text-dim); font-size: 13px; font-weight: 500; cursor: pointer;
    border-radius: 7px; transition: all 0.15s;
  }
  .tab:hover { color: var(--text); background: var(--surface-2); }
  .tab.active { background: var(--accent); color: #fff; }

  /* ── Score gauge ─────────────────────── */
  .gauge-wrap {
    display: flex; align-items: center; justify-content: center;
    gap: 48px; padding: 32px 0 36px;
  }
  .gauge { position: relative; width: 160px; height: 160px; }
  .gauge svg { transform: rotate(-90deg); }
  .gauge-label {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    text-align: center;
  }
  .gauge-score { font-size: 42px; font-weight: 700; letter-spacing: -2px; }
  .gauge-sub { font-size: 12px; color: var(--text-dim); margin-top: -4px; }

  .cat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .cat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px; cursor: pointer;
    transition: all 0.15s;
  }
  .cat-card:hover { border-color: var(--border-light); background: var(--surface-2); }
  .cat-card .cat-name { font-size: 12px; color: var(--text-dim); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .cat-card .cat-score { font-size: 28px; font-weight: 700; margin: 6px 0 4px; }
  .cat-card .cat-bar {
    height: 3px; border-radius: 2px; background: var(--surface-3);
    overflow: hidden; margin-top: 8px;
  }
  .cat-card .cat-bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }

  .summary-strip {
    display: flex; gap: 16px; justify-content: center;
    margin: 24px 0 0; padding: 16px; background: var(--surface);
    border: 1px solid var(--border); border-radius: var(--radius);
  }
  .summary-item { text-align: center; min-width: 80px; }
  .summary-count { font-size: 22px; font-weight: 700; }
  .summary-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px; }

  /* ── Audit detail ────────────────────── */
  .section { margin-bottom: 16px; }
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); cursor: pointer; transition: all 0.15s;
  }
  .section-header:hover { background: var(--surface-2); }
  .section-header.open { border-radius: var(--radius) var(--radius) 0 0; border-bottom-color: transparent; }
  .section-title { font-size: 14px; font-weight: 600; }
  .section-meta { display: flex; align-items: center; gap: 12px; }
  .section-score { font-size: 14px; font-weight: 700; }
  .section-chevron { font-size: 12px; color: var(--text-dim); transition: transform 0.2s; }
  .section-chevron.open { transform: rotate(180deg); }

  .section-body {
    border: 1px solid var(--border); border-top: none;
    border-radius: 0 0 var(--radius) var(--radius);
    overflow: hidden;
  }

  .check-row {
    display: grid; grid-template-columns: 100px 1fr auto;
    align-items: start; gap: 12px; padding: 12px 18px;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .check-row:last-child { border-bottom: none; }
  .check-page { font-weight: 500; color: var(--text-dim); font-size: 12px; }
  .check-finding { color: var(--text); }
  .check-value { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11px; color: var(--text-faint); margin-top: 4px; white-space: pre-wrap; max-height: 60px; overflow: hidden; }

  /* ── Badges ──────────────────────────── */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 99px; font-size: 11px;
    font-weight: 600; letter-spacing: 0.3px; white-space: nowrap;
  }
  .badge-pass { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
  .badge-warn { background: var(--amber-bg); color: var(--amber); border: 1px solid var(--amber-border); }
  .badge-fail { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-border); }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
  .badge-pass .badge-dot { background: var(--green); }
  .badge-warn .badge-dot { background: var(--amber); }
  .badge-fail .badge-dot { background: var(--red); }

  /* ── Plan ────────────────────────────── */
  .plan-filters {
    display: flex; gap: 8px; margin-bottom: 16px;
  }
  .filter-btn {
    padding: 6px 14px; border-radius: 99px; border: 1px solid var(--border);
    background: transparent; color: var(--text-dim); font-size: 12px;
    font-weight: 500; cursor: pointer; transition: all 0.15s;
  }
  .filter-btn:hover { border-color: var(--border-light); color: var(--text); }
  .filter-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

  .plan-item {
    display: grid; grid-template-columns: 1fr auto auto;
    gap: 16px; align-items: start; padding: 16px 18px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); margin-bottom: 8px;
    transition: all 0.15s;
  }
  .plan-item:hover { border-color: var(--border-light); }
  .plan-action { font-size: 14px; font-weight: 500; }
  .plan-context { font-size: 12px; color: var(--text-dim); margin-top: 4px; }
  .plan-tags { display: flex; gap: 6px; align-items: center; }
  .tag {
    padding: 2px 8px; border-radius: 4px; font-size: 10px;
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .tag-high { background: var(--red-bg); color: var(--red); }
  .tag-medium { background: var(--amber-bg); color: var(--amber); }
  .tag-low { background: var(--green-bg); color: var(--green); }

  /* ── Loading ─────────────────────────── */
  .loading-wrap {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 0; gap: 16px;
  }
  .spinner {
    width: 32px; height: 32px; border: 3px solid var(--surface-3);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 14px; color: var(--text-dim); }

  /* ── Error ───────────────────────────── */
  .error-wrap {
    padding: 40px; text-align: center; background: var(--red-bg);
    border: 1px solid var(--red-border); border-radius: var(--radius);
  }
  .error-wrap h2 { color: var(--red); font-size: 16px; margin-bottom: 8px; }
  .error-wrap p { color: var(--text-dim); font-size: 13px; }

  /* ── Responsive ──────────────────────── */
  @media (max-width: 640px) {
    .cat-cards { grid-template-columns: repeat(2, 1fr); }
    .check-row { grid-template-columns: 80px 1fr; }
    .check-row > :last-child { grid-column: 1 / -1; }
    .gauge-wrap { flex-direction: column; gap: 24px; }
    .plan-item { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"><\/script>
<script type="text/babel">
const { useState, useEffect, useCallback } = React;

// ── Score colour ─────────────────────
function scoreColor(s) {
  if (s >= 80) return 'var(--green)';
  if (s >= 50) return 'var(--amber)';
  return 'var(--red)';
}

// ── Gauge ────────────────────────────
function Gauge({ score, size = 160, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return React.createElement('div', { className: 'gauge', style: { width: size, height: size } },
    React.createElement('svg', { width: size, height: size },
      React.createElement('circle', { cx: size/2, cy: size/2, r, fill: 'none', stroke: 'var(--surface-3)', strokeWidth: stroke }),
      React.createElement('circle', { cx: size/2, cy: size/2, r, fill: 'none', stroke: color, strokeWidth: stroke,
        strokeDasharray: circ, strokeDashoffset: offset, strokeLinecap: 'round',
        style: { transition: 'stroke-dashoffset 1s ease' } })
    ),
    React.createElement('div', { className: 'gauge-label' },
      React.createElement('div', { className: 'gauge-score', style: { color } }, score),
      React.createElement('div', { className: 'gauge-sub' }, 'overall')
    )
  );
}

// ── Badge ────────────────────────────
function Badge({ status }) {
  const labels = { pass: 'Pass', warn: 'Warning', fail: 'Fail', error: 'Error' };
  const cls = status === 'error' ? 'fail' : status;
  return React.createElement('span', { className: 'badge badge-' + cls },
    React.createElement('span', { className: 'badge-dot' }),
    labels[status] || status
  );
}

// ── Overview Tab ─────────────────────
function OverviewTab({ data }) {
  const cats = Object.entries(data.categoryScores);
  const counts = { pass: 0, warn: 0, fail: 0 };
  data.checks.forEach(function(c) {
    if (c.status === 'pass') counts.pass++;
    else if (c.status === 'warn') counts.warn++;
    else counts.fail++;
  });

  return React.createElement('div', null,
    React.createElement('div', { className: 'gauge-wrap' },
      React.createElement(Gauge, { score: data.overallScore }),
      React.createElement('div', { className: 'cat-cards' },
        cats.map(function(entry) {
          var cat = entry[0], info = entry[1];
          var color = scoreColor(info.score);
          return React.createElement('div', { key: cat, className: 'cat-card' },
            React.createElement('div', { className: 'cat-name' }, cat),
            React.createElement('div', { className: 'cat-score', style: { color: color } }, info.score),
            React.createElement('div', { style: { fontSize: 11, color: 'var(--text-faint)' } },
              info.pass + '/' + info.total + ' passing'),
            React.createElement('div', { className: 'cat-bar' },
              React.createElement('div', { className: 'cat-bar-fill',
                style: { width: info.score + '%', background: color } })
            )
          );
        })
      )
    ),
    React.createElement('div', { className: 'summary-strip' },
      React.createElement('div', { className: 'summary-item' },
        React.createElement('div', { className: 'summary-count', style: { color: 'var(--green)' } }, counts.pass),
        React.createElement('div', { className: 'summary-label' }, 'Passing')
      ),
      React.createElement('div', { className: 'summary-item' },
        React.createElement('div', { className: 'summary-count', style: { color: 'var(--amber)' } }, counts.warn),
        React.createElement('div', { className: 'summary-label' }, 'Warnings')
      ),
      React.createElement('div', { className: 'summary-item' },
        React.createElement('div', { className: 'summary-count', style: { color: 'var(--red)' } }, counts.fail),
        React.createElement('div', { className: 'summary-label' }, 'Failing')
      ),
      React.createElement('div', { className: 'summary-item' },
        React.createElement('div', { className: 'summary-count', style: { color: 'var(--text-dim)' } }, data.meta.totalChecks),
        React.createElement('div', { className: 'summary-label' }, 'Total checks')
      )
    )
  );
}

// ── Audit Tab ────────────────────────
function AuditTab({ data }) {
  var grouped = {};
  data.checks.forEach(function(c) {
    if (!grouped[c.category]) grouped[c.category] = [];
    grouped[c.category].push(c);
  });

  var initial = {};
  Object.keys(grouped).forEach(function(k, i) { if (i === 0) initial[k] = true; });
  var openRef = useState(initial);
  var open = openRef[0], setOpen = openRef[1];

  function toggle(cat) {
    setOpen(function(prev) {
      var next = Object.assign({}, prev);
      next[cat] = !next[cat];
      return next;
    });
  }

  return React.createElement('div', null,
    Object.entries(grouped).map(function(entry) {
      var cat = entry[0], checks = entry[1];
      var score = data.categoryScores[cat].score;
      var isOpen = !!open[cat];
      return React.createElement('div', { key: cat, className: 'section' },
        React.createElement('div', {
          className: 'section-header' + (isOpen ? ' open' : ''),
          onClick: function() { toggle(cat); }
        },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
            React.createElement('span', { className: 'section-score', style: { color: scoreColor(score) } }, score),
            React.createElement('span', { className: 'section-title' }, cat)
          ),
          React.createElement('div', { className: 'section-meta' },
            React.createElement('span', { style: { fontSize: 12, color: 'var(--text-faint)' } },
              checks.filter(function(c) { return c.status === 'pass'; }).length + '/' + checks.length + ' pass'),
            React.createElement('span', { className: 'section-chevron' + (isOpen ? ' open' : '') }, '\\u25BC')
          )
        ),
        isOpen && React.createElement('div', { className: 'section-body' },
          checks.map(function(check, i) {
            return React.createElement('div', { key: i, className: 'check-row' },
              React.createElement('div', null,
                React.createElement('div', { className: 'check-page' }, check.page),
                React.createElement(Badge, { status: check.status })
              ),
              React.createElement('div', null,
                React.createElement('div', { className: 'check-finding' }, check.name + ': ' + check.finding),
                check.value && React.createElement('div', { className: 'check-value' }, check.value)
              ),
              React.createElement('div', { style: { fontSize: 12, color: 'var(--text-faint)', textAlign: 'right', minWidth: 40 } },
                check.score + '%')
            );
          })
        )
      );
    })
  );
}

// ── Plan Tab ─────────────────────────
function PlanTab({ data }) {
  var filterRef = useState('all');
  var filter = filterRef[0], setFilter = filterRef[1];

  var items = data.improvements;
  if (filter !== 'all') {
    items = items.filter(function(item) { return item.impact === filter; });
  }

  var highCount = data.improvements.filter(function(i) { return i.impact === 'high'; }).length;
  var medCount = data.improvements.filter(function(i) { return i.impact === 'medium'; }).length;
  var lowCount = data.improvements.filter(function(i) { return i.impact === 'low'; }).length;

  return React.createElement('div', null,
    React.createElement('div', { style: { marginBottom: 20 } },
      React.createElement('h2', { style: { fontSize: 16, fontWeight: 600, marginBottom: 4 } }, 'Improvement Plan'),
      React.createElement('p', { style: { fontSize: 13, color: 'var(--text-dim)' } },
        data.improvements.length + ' actions identified, sorted by impact')
    ),
    React.createElement('div', { className: 'plan-filters' },
      ['all', 'high', 'medium', 'low'].map(function(f) {
        var label = f === 'all' ? 'All (' + data.improvements.length + ')'
          : f === 'high' ? 'High impact (' + highCount + ')'
          : f === 'medium' ? 'Medium (' + medCount + ')'
          : 'Low (' + lowCount + ')';
        return React.createElement('button', {
          key: f, className: 'filter-btn' + (filter === f ? ' active' : ''),
          onClick: function() { setFilter(f); }
        }, label);
      })
    ),
    items.length === 0
      ? React.createElement('div', { style: { padding: 40, textAlign: 'center', color: 'var(--text-dim)' } },
          'No actions in this category')
      : items.map(function(item, i) {
          return React.createElement('div', { key: i, className: 'plan-item' },
            React.createElement('div', null,
              React.createElement('div', { className: 'plan-action' }, item.action),
              React.createElement('div', { className: 'plan-context' },
                item.page + ' \\u2014 ' + item.finding)
            ),
            React.createElement('div', { className: 'plan-tags' },
              React.createElement('span', { className: 'tag tag-' + item.impact }, item.impact),
              React.createElement('span', { className: 'tag',
                style: { background: 'var(--surface-3)', color: 'var(--text-dim)' } },
                item.effort + ' effort')
            ),
            React.createElement(Badge, { status: item.status })
          );
        })
  );
}

// ── Main App ─────────────────────────
function App() {
  var stateRef = useState(null);
  var data = stateRef[0], setData = stateRef[1];
  var errRef = useState(null);
  var error = errRef[0], setError = errRef[1];
  var loadRef = useState(true);
  var loading = loadRef[0], setLoading = loadRef[1];
  var tabRef = useState('overview');
  var tab = tabRef[0], setTab = tabRef[1];

  var runAudit = useCallback(function() {
    setLoading(true);
    setError(null);
    fetch('/api/audit')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.error) throw new Error(d.error);
        setData(d);
        setLoading(false);
        document.title = 'SEO \\u2014 ' + d.domain + ' (' + d.overallScore + ')';
      })
      .catch(function(e) { setError(e.message); setLoading(false); });
  }, []);

  useEffect(function() { runAudit(); }, [runAudit]);

  if (loading) {
    return React.createElement('div', { className: 'shell' },
      React.createElement('div', { className: 'loading-wrap' },
        React.createElement('div', { className: 'spinner' }),
        React.createElement('div', { className: 'loading-text' }, 'Running live audit\\u2026')
      )
    );
  }

  if (error) {
    return React.createElement('div', { className: 'shell' },
      React.createElement('div', { className: 'error-wrap' },
        React.createElement('h2', null, 'Audit failed'),
        React.createElement('p', null, error),
        React.createElement('button', { className: 'refresh-btn', onClick: runAudit,
          style: { marginTop: 16 } }, 'Try again')
      )
    );
  }

  if (!data) return null;

  var tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'audit', label: 'Audit' },
    { id: 'plan', label: 'Plan (' + data.improvements.length + ')' },
  ];

  return React.createElement('div', { className: 'shell' },
    React.createElement('div', { className: 'header' },
      React.createElement('div', null,
        React.createElement('h1', null, data.domain),
        React.createElement('div', { className: 'meta' },
          React.createElement('span', { className: 'live-dot' }),
          'Live audit \\u2014 ' + new Date(data.auditDate).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }),
          ' \\u2014 ' + data.meta.totalChecks + ' checks'
        )
      ),
      React.createElement('button', {
        className: 'refresh-btn' + (loading ? ' loading' : ''),
        onClick: runAudit
      }, loading ? 'Auditing\\u2026' : 'Re-run audit')
    ),
    React.createElement('div', { className: 'tabs' },
      tabs.map(function(t) {
        return React.createElement('button', {
          key: t.id, className: 'tab' + (tab === t.id ? ' active' : ''),
          onClick: function() { setTab(t.id); }
        }, t.label);
      })
    ),
    tab === 'overview' && React.createElement(OverviewTab, { data: data }),
    tab === 'audit' && React.createElement(AuditTab, { data: data }),
    tab === 'plan' && React.createElement(PlanTab, { data: data })
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
<\/script>
</body>
</html>`;
