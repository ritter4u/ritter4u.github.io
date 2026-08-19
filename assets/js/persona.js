(function () {
  var host = window.location.hostname.toLowerCase();
  var persona = host === "kris.tine.im" ? "kris" : "valen";
  document.documentElement.dataset.persona = persona;

  document.addEventListener("DOMContentLoaded", function () {
    document.body.dataset.persona = persona;
    document.querySelectorAll("[data-host-label]").forEach(function (element) {
      element.textContent = host === "ritter4u.github.io" ? "legacy / ritter4u.github.io" : host;
    });
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && host !== "ritter4u.github.io") {
      canonical.href = window.location.origin + window.location.pathname;
    }
  });
})();
