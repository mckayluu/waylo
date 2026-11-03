/* Waylo embed. Paste before </body>:
   <script src="https://waylo-j5hv.onrender.com/waylo.js" data-site="default" async></script>
   Options: data-site (workspace id), data-mode="launcher"(default)|"sidebar"|"track",
   data-position="right"|"left", data-color="#0f766e", data-open="true". */
(function () {
  if (window.__waylo) return; window.__waylo = true;
  var s = document.currentScript || document.querySelector('script[src*="/waylo.js"]');
  if (!s) return;
  var origin = new URL(s.src, location.href).origin;
  var A = function (k, d) { var v = s.getAttribute("data-" + k); return v == null || v === "" ? d : v; };
  var site = A("site", "default");
  var mode = A("sidebar", "") === "true" ? "sidebar" : A("mode", "launcher");
  var left = A("position", "right") === "left", color = A("color", "#0f766e");
  var KEY = "waylo_vid", vid;
  try { vid = localStorage.getItem(KEY); } catch (e) {}
  if (!vid) { vid = "v_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); try { localStorage.setItem(KEY, vid); } catch (e) {} }
  var last = "";
  function track() {
    var path = location.pathname + location.search;
    if (path === last) return; last = path;
    var body = JSON.stringify({ visitorId: vid, site: site, path: path, title: document.title, referrer: document.referrer || undefined });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon(origin + "/api/track", new Blob([body], { type: "text/plain" }));
      else fetch(origin + "/api/track", { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "text/plain" } });
    } catch (e) {}
  }
  ["pushState", "replaceState"].forEach(function (k) { var o = history[k]; history[k] = function () { var r = o.apply(this, arguments); setTimeout(track, 0); return r; }; });
  window.addEventListener("popstate", track);
  if (document.readyState === "complete") track(); else window.addEventListener("load", track);
  var api = window.Waylo = { visitorId: vid, site: site, track: track, open: function () {}, close: function () {}, toggle: function () {} };
  if (mode === "track") return;
  function mount() {
    var src = origin + "/widget?vid=" + encodeURIComponent(vid) + "&site=" + encodeURIComponent(site);
    var f = document.createElement("iframe"); f.title = "Waylo chat"; f.setAttribute("allow", "clipboard-write");
    var side = left ? "left" : "right";
    if (mode === "sidebar") {
      f.src = src;
      f.style.cssText = "position:fixed;top:0;" + side + ":0;width:400px;max-width:100vw;height:100vh;border:0;box-shadow:-8px 0 24px rgba(28,25,23,.12);z-index:2147483647;background:#fafaf9";
      document.body.appendChild(f); return;
    }
    var open = false, loaded = false;
    f.style.cssText = "position:fixed;bottom:92px;" + side + ":20px;width:400px;max-width:calc(100vw - 24px);height:640px;max-height:calc(100vh - 116px);border:0;border-radius:16px;box-shadow:0 20px 50px rgba(28,25,23,.25);z-index:2147483646;background:#fafaf9;display:none";
    var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Chat with us");
    b.style.cssText = "position:fixed;bottom:20px;" + side + ":20px;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;background:" + color + ";color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.25);z-index:2147483647;display:flex;align-items:center;justify-content:center;transition:transform .15s";
    var chat = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
    var x = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    b.innerHTML = chat;
    b.onmouseenter = function () { b.style.transform = "scale(1.06)"; }; b.onmouseleave = function () { b.style.transform = ""; };
    function set(v) { open = v; if (v && !loaded) { f.src = src; loaded = true; } f.style.display = v ? "block" : "none"; b.innerHTML = v ? x : chat; b.setAttribute("aria-expanded", String(v)); }
    b.onclick = function () { set(!open); };
    api.open = function () { set(true); }; api.close = function () { set(false); }; api.toggle = function () { set(!open); };
    window.addEventListener("message", function (e) { if (e.origin === origin && e.data === "waylo:close") set(false); });
    document.body.appendChild(f); document.body.appendChild(b);
    if (A("open", "") === "true") set(true);
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
