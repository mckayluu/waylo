/* Waylo embed. Paste before </body>:
   <script src="https://waylo-j5hv.onrender.com/waylo.js" data-site="default" async></script>
   Options: data-site (workspace id), data-mode="launcher"(default)|"sidebar"|"track",
   data-position="right"|"left", data-color="#A81B48", data-open="true"
   (polite auto-open: ~2.5s delay, once per tab session; mobile teaser). */
(function () {
  if (window.__waylo) return; window.__waylo = true;
  var s = document.currentScript || document.querySelector('script[src*="/waylo.js"]');
  if (!s) return;
  var origin = new URL(s.src, location.href).origin;
  var A = function (k, d) { var v = s.getAttribute("data-" + k); return v == null || v === "" ? d : v; };
  var site = A("site", "default");
  var mode = A("sidebar", "") === "true" ? "sidebar" : A("mode", "launcher");
  var left = A("position", "right") === "left", color = A("color", "#A81B48");
  var KEY = "waylo_vid", vid;
  try { vid = localStorage.getItem(KEY); } catch (e) {}
  if (!vid) { vid = "v_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); try { localStorage.setItem(KEY, vid); } catch (e) {} }
  var last = "", pv = null;
  function send(o) {
    var body = JSON.stringify(o);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(origin + "/api/track", new Blob([body], { type: "text/plain" }))) return;
      fetch(origin + "/api/track", { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "text/plain" } });
    } catch (e) {}
  }
  function now() { return Date.now(); }
  // Engagement for the current pageview: visible time, max scroll depth, key clicks. Flushed on hide / exit / SPA nav.
  function flush() {
    if (!pv) return; if (pv.since) { pv.ms += now() - pv.since; pv.since = document.visibilityState === "visible" ? now() : 0; }
    var sig = pv.ms + ":" + pv.scroll + ":" + pv.clicks.length; if (sig === pv.sent) return; pv.sent = sig;
    send({ type: "engage", visitorId: vid, site: site, pv: pv.id, duration: pv.ms, scroll: pv.scroll, clicks: pv.clicks });
  }
  function depth() {
    if (!pv) return; var d = document.documentElement, b = document.body || d;
    var h = Math.max(d.scrollHeight, b.scrollHeight) - window.innerHeight; var y = window.scrollY || d.scrollTop || 0;
    var p = h <= 0 ? 100 : Math.min(100, Math.round(((y + 0) / h) * 100)); if (p > pv.scroll) pv.scroll = p;
  }
  function track() {
    var path = location.pathname + location.search;
    if (path === last) return; last = path; flush();
    pv = { id: "p" + Math.random().toString(36).slice(2, 10) + now().toString(36), ms: 0, since: document.visibilityState === "visible" ? now() : 0, scroll: 0, clicks: [], start: now(), sent: "" };
    var q = new URLSearchParams(location.search), utm = { source: q.get("utm_source") || undefined, medium: q.get("utm_medium") || undefined, campaign: q.get("utm_campaign") || undefined };
    send({ visitorId: vid, site: site, path: path, title: document.title, referrer: document.referrer || undefined, pv: pv.id, host: location.hostname, utm: utm });
    setTimeout(depth, 300);
  }
  var KEYRE = /pric|plan|demo|trial|sign ?up|get started|start|contact|talk|book|buy|subscribe|quote|download|register|request/i;
  document.addEventListener("click", function (e) {
    if (!pv || pv.clicks.length >= 20) return;
    var el = e.target && e.target.closest ? e.target.closest("[data-waylo-track],a,button,input[type=submit],[role=button]") : null; if (!el) return;
    if (el.closest("#waylo-root,[data-waylo-ui]")) return;
    var href = el.getAttribute("href") || "", label = (el.getAttribute("data-waylo-track") || el.getAttribute("aria-label") || el.innerText || el.value || el.title || "").replace(/\s+/g, " ").trim().slice(0, 80);
    var key = el.hasAttribute("data-waylo-track") || /^(mailto|tel):/i.test(href) || el.tagName !== "A" || KEYRE.test(label) || KEYRE.test(href);
    if (!key) return;
    pv.clicks.push({ label: label || href || el.tagName.toLowerCase(), href: href ? href.slice(0, 300) : undefined, at: now() - pv.start });
    if (/^(mailto|tel):/i.test(href) || (el.tagName === "A" && el.host && el.host !== location.host)) flush();
  }, true);
  var st; window.addEventListener("scroll", function () { if (st) return; st = setTimeout(function () { st = 0; depth(); }, 250); }, { passive: true });
  document.addEventListener("visibilitychange", function () { if (!pv) return; if (document.visibilityState === "hidden") flush(); else pv.since = now(); });
  window.addEventListener("pagehide", flush);
  ["pushState", "replaceState"].forEach(function (k) { var o = history[k]; history[k] = function () { var r = o.apply(this, arguments); setTimeout(track, 0); return r; }; });
  window.addEventListener("popstate", track);
  if (document.readyState === "complete") track(); else window.addEventListener("load", track);
  var api = window.Waylo = { visitorId: vid, site: site, track: track, open: function () {}, close: function () {}, toggle: function () {} };
  if (mode === "track") return;
  function isMobile() { return window.matchMedia && window.matchMedia("(max-width: 640px)").matches; }
  function reducedMotion() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function mount() {
    var src = origin + "/widget?vid=" + encodeURIComponent(vid) + "&site=" + encodeURIComponent(site) + "&embed=" + encodeURIComponent(mode);
    var f = document.createElement("iframe"); f.title = "Waylo chat"; f.setAttribute("allow", "clipboard-write");
    var side = left ? "left" : "right";
    if (mode === "sidebar") {
      f.src = src;
      f.style.cssText = "position:fixed;top:0;" + side + ":0;width:400px;max-width:100vw;height:100vh;border:0;box-shadow:-8px 0 24px rgba(28,25,23,.12);z-index:2147483647;background:#fafaf9";
      document.body.appendChild(f); return;
    }
    var open = false, loaded = false, teaser = null, autoTimer = 0;
    var dismissedKey = "waylo_dismissed:" + site;
    function wasDismissed() { try { return sessionStorage.getItem(dismissedKey) === "1"; } catch (e) { return false; } }
    function rememberDismissed() { try { sessionStorage.setItem(dismissedKey, "1"); } catch (e) {} }
    function hideTeaser() { if (teaser && teaser.parentNode) teaser.parentNode.removeChild(teaser); teaser = null; }
    function showTeaser(cfg) {
      if (teaser || open || wasDismissed()) return;
      teaser = document.createElement("div");
      teaser.setAttribute("data-waylo-ui", "");
      teaser.setAttribute("role", "dialog");
      teaser.setAttribute("aria-label", "Chat suggestion");
      var fade = reducedMotion() ? "opacity:1;" : "opacity:0;transform:translateY(8px);transition:opacity .25s ease,transform .25s ease;";
      teaser.style.cssText = "position:fixed;bottom:92px;" + side + ":20px;max-width:min(260px,calc(100vw - 100px));z-index:2147483646;" + fade;
      var accent = (cfg && cfg.accent) || color;
      var initial = String((cfg && (cfg.botName || cfg.siteName)) || "W").replace(/^\s+/, "").charAt(0).toUpperCase() || "W";
      teaser.innerHTML = '<div style="display:flex;align-items:flex-start;gap:8px;padding:10px 10px 10px 12px;background:#fff;color:#1c1917;border:1px solid #e7e5e4;border-radius:16px;box-shadow:0 12px 32px rgba(28,25,23,.18);font:14px/1.35 ui-sans-serif,system-ui,sans-serif;">'
        + '<span style="flex:none;width:28px;height:28px;border-radius:50%;background:' + accent + ';color:#fff;display:flex;align-items:center;justify-content:center;font:700 13px/1 ui-sans-serif,system-ui,sans-serif;">' + initial + "</span>"
        + '<button type="button" data-waylo-open style="flex:1;margin:0;padding:2px 0 0;border:0;background:none;text-align:left;cursor:pointer;font:inherit;color:inherit;">What can I help you find?</button>'
        + '<button type="button" data-waylo-dismiss aria-label="Dismiss" style="flex:none;width:28px;height:28px;margin:0;border:0;border-radius:50%;background:transparent;color:#78716c;cursor:pointer;font:18px/1 sans-serif;">×</button>'
        + "</div>";
      teaser.addEventListener("click", function (e) {
        var t = e.target && e.target.closest ? e.target.closest("[data-waylo-open],[data-waylo-dismiss]") : null;
        if (!t) return;
        if (t.hasAttribute("data-waylo-dismiss")) { hideTeaser(); rememberDismissed(); }
        else set(true, { manual: true });
      });
      document.body.appendChild(teaser);
      if (!reducedMotion()) requestAnimationFrame(function () { teaser.style.opacity = "1"; teaser.style.transform = "translateY(0)"; });
    }
    f.style.cssText = "position:fixed;bottom:92px;" + side + ":20px;width:400px;max-width:calc(100vw - 24px);height:640px;max-height:calc(100vh - 116px);border:0;border-radius:16px;box-shadow:0 20px 50px rgba(28,25,23,.25);z-index:2147483646;background:#fafaf9;display:none";
    var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Chat with us"); b.setAttribute("data-waylo-ui", "");
    b.style.cssText = "position:fixed;bottom:20px;" + side + ":20px;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;background:" + color + ";color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.25);z-index:2147483647;display:flex;align-items:center;justify-content:center;" + (reducedMotion() ? "" : "transition:transform .15s");
    var chat = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
    var x = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    b.innerHTML = chat;
    b.onmouseenter = function () { if (!reducedMotion()) b.style.transform = "scale(1.06)"; }; b.onmouseleave = function () { b.style.transform = ""; };
    function notifyOpened() { try { if (f.contentWindow) f.contentWindow.postMessage("waylo:opened", origin); } catch (e) {} }
    function set(v, opts) {
      opts = opts || {};
      open = v;
      if (v) { hideTeaser(); if (autoTimer) { clearTimeout(autoTimer); autoTimer = 0; } }
      if (v && !loaded) { f.src = src; loaded = true; f.addEventListener("load", notifyOpened); }
      else if (v) notifyOpened();
      if (!v && opts.user) rememberDismissed();
      f.style.display = v ? "block" : "none";
      b.innerHTML = v ? x : chat;
      b.setAttribute("aria-expanded", String(v));
    }
    b.onclick = function () { if (open) set(false, { user: true }); else set(true, { manual: true }); };
    api.open = function () { set(true, { manual: true }); };
    api.close = function () { set(false, { user: true }); };
    api.toggle = function () { if (open) set(false, { user: true }); else set(true, { manual: true }); };
    window.addEventListener("message", function (e) { if (e.origin === origin && e.data === "waylo:close") set(false, { user: true }); });
    document.body.appendChild(f); document.body.appendChild(b);
    var attrOpen = A("open", "") === "true";
    var wantAuto = attrOpen;
    var autoCfg = null;
    try {
      fetch(origin + "/api/branding?site=" + encodeURIComponent(site))
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (cfg) {
          autoCfg = cfg;
          if (typeof cfg.openOnLoad === "boolean") wantAuto = cfg.openOnLoad;
        })
        .catch(function () {});
    } catch (e) {}
    autoTimer = setTimeout(function () {
      autoTimer = 0;
      if (!wantAuto || wasDismissed() || open) return;
      if (isMobile()) showTeaser(autoCfg);
      else set(true, { auto: true });
    }, 2500);
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
