const MAINTENANCE_MODE = false;

const isLocal =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname === "";

if (
    MAINTENANCE_MODE &&
    !isLocal &&
    !location.pathname.endsWith("maintenance.html")
) {
    location.replace("/maintenance.html");
}


(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get("forceDesktop") === "1") return;

  function isMobileDevice() {
    const ua = navigator.userAgent || navigator.vendor || window.opera || "";
    const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|CriOS|Fennec|Silk/i.test(ua);
    const iPadDesktopUA =
      navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return mobileUA || iPadDesktopUA;
  }

  if (!isMobileDevice()) return;

  document.documentElement.classList.add("desktop-only");

  // Inject CSS once
  if (!document.getElementById("desktop-only-styles")) {
    const style = document.createElement("style");
    style.id = "desktop-only-styles";
    style.textContent = `
      html.desktop-only,
      html.desktop-only body {
        overflow: hidden !important;
        height: 100% !important;
      }

      html.desktop-only body > *:not(#desktop-only-screen) {
        display: none !important;
      }

      #desktop-only-screen {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: grid;
        place-items: center;
        padding: 2rem;
        background: #d8d3cd;
        color: #111;
        font-family: sans-serif;
        text-align: center;
      }

      .desktop-only__eyebrow {
        opacity: 0.7;
        font-family: "Corinthia", cursive;
        font-style: normal;
        font-size: 5vw;
        white-space: nowrap;
        font-weight: 700;
        color: var(--secondary-ac);
        text-align: center;
        vertical-align: middle;
        letter-spacing: 0;
      }

      .desktop-only__title {
        font-family: "Vina Sans", sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 1.75rem;
        margin-bottom: 1rem;
        margin-top: -1rem;
        font-size: 12.5vw;
        white-space: nowrap; /* Prevents the text from wrapping to a new line */
        font-weight: 700;
        color: rgba(158, 158, 158, 0.25);
        text-align: center;
        vertical-align: middle;
        transform: scaleY(1.25);
        // letter-spacing: 10%;
      }

      .desktop-only__text {
        max-width: 28ch;
        margin: 0 auto;
        line-height: 1.75;
        font-family: 'Press Start 2P', cursive;
        font-size: 1.75vw; 
        font-weight: 700;
        text-align: center;
        vertical-align: middle;
        letter-spacing: 1px;
        margin-top: 5%;
      }
    `;
    document.head.appendChild(style);
  }

  function showDesktopOnlyScreen() {
    if (document.getElementById("desktop-only-screen")) return;

    const screen = document.createElement("div");
    screen.id = "desktop-only-screen";
    screen.setAttribute("role", "dialog");
    screen.setAttribute("aria-modal", "true");
    screen.setAttribute("aria-labelledby", "desktop-only-title");

    screen.innerHTML = `
    <div class="bg"></div>
      <div class="desktop-only__inner">
        <p class="desktop-only__eyebrow">Error</p>
        <h1 id="desktop-only-title" class="desktop-only__title">
          Desktop Only
        </h1>
        <p class="desktop-only__text">
          I built this only for desktop screens.
          Please open it on a computer!
        </p>
      </div>
    `;

    (document.body || document.documentElement).appendChild(screen);

    document.addEventListener(
      "touchmove",
      (e) => e.preventDefault(),
      { passive: false }
    );
  }

  if (document.body) {
    showDesktopOnlyScreen();
  } else {
    document.addEventListener("DOMContentLoaded", showDesktopOnlyScreen);
  }
})();
