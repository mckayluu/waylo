/* Waylo embed: tracks pageviews and (optionally) docks the Waylo sidebar.
   <script src="https://YOUR-WAYLO/waylo.js" data-sidebar="true" async></script> */
(function () {
  if (window.__waylo) return; window.__waylo = true;
  var s = document.currentScript || document.querySelector('script[src*="waylo.js"]');
  var origin = new URL(s.src).origin;
  var KEY = "waylo_vid", vid;
  try { vid = localStorage.getItem(KEY); } catch (e) {}
  if (!vid) { vid = "v_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); try { localStorage.setItem(KEY, vid); } catch (e) {} }
  var last = "";
  function track() {
    var path = location.pathname + location.search;
    if (path === last) return; last = path;
    var body = JSON.stringify({ visitorId: vid, path: path, title: document.title, referrer: document.referrer || undefined });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon(origin + "/api/track", new Blob([body], { type: "text/plain" }));
      else fetch(origin + "/api/track", { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "text/plain" } });
    } catch (e) {}
  }
  // SPA support
  ["pushState", "replaceState"].forEach(function (k) { var o = history[k]; history[k] = function () { var r = o.apply(this, arguments); setTimeout(track, 0); return r; }; });
  window.addEventListener("popstate", track);
  if (document.readyState === "complete") track(); else window.addEventListener("load", track);
  window.Waylo = { visitorId: vid, track: track };
  if (s.getAttribute("data-sidebar") === "true") {
    var f = document.createElement("iframe");
    f.src = origin + "/widget?vid=" + encodeURIComponent(vid); f.title = "Waylo";
    f.style.cssText = "position:fixed;top:0;right:0;width:400px;max-width:100vw;height:100vh;border:0;border-left:1px solid #e7e5e4;box-shadow:-8px 0 24px rgba(28,25,23,.08);z-index:2147483647;background:#fafaf9";
    (document.body || document.documentElement).appendChild(f);
  }
})();
