(() => {
  const LINKEDIN_SVG = `<svg role="img" aria-label="LinkedIn" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"> <title>LinkedIn</title> <rect width="48" height="48" rx="14" fill="#0A66C2"/> <g transform="translate(12 12)"> <path fill="#ffffff" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> </g> </svg>`;
  const WHATSAPP_SVG = `<svg role="img" aria-label="WhatsApp" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"> <title>WhatsApp</title> <rect width="48" height="48" rx="14" fill="#25D366"/> <g transform="translate(12 12)"> <path fill="#ffffff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.58-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/> </g> </svg>`;
  const X_SVG = `<svg role="img" aria-label="X" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"> <title>X</title> <rect width="48" height="48" rx="14" fill="#000000"/> <g transform="translate(12 12)"> <path fill="#ffffff" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/> </g> </svg>`;
  const COPY_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="#111111" d="M8 7.5A2.5 2.5 0 0 1 10.5 5h6A2.5 2.5 0 0 1 19 7.5v8A2.5 2.5 0 0 1 16.5 18h-6A2.5 2.5 0 0 1 8 15.5v-8Zm2.5-.6a.6.6 0 0 0-.6.6v8a.6.6 0 0 0 .6.6h6a.6.6 0 0 0 .6-.6v-8a.6.6 0 0 0-.6-.6h-6ZM5 10.5A2.5 2.5 0 0 1 7.5 8h.9v1.9h-.9a.6.6 0 0 0-.6.6v8a.6.6 0 0 0 .6.6h6a.6.6 0 0 0 .6-.6v-.9H16v.9a2.5 2.5 0 0 1-2.5 2.5h-6A2.5 2.5 0 0 1 5 18.5v-8Z"/></svg>`;

  const UI_LABELS = {
    es: {
      main: "Compartir proyecto",
      whatsapp: "Compartir por WhatsApp",
      linkedin: "Compartir en LinkedIn",
      x: "Compartir en X",
      copy: "Copiar enlace",
      copied: "Enlace copiado",
      prompt: "Copiá este enlace:"
    },
    en: {
      main: "Share project",
      whatsapp: "Share on WhatsApp",
      linkedin: "Share on LinkedIn",
      x: "Share on X",
      copy: "Copy link",
      copied: "Link copied",
      prompt: "Copy this link:"
    },
    it: {
      main: "Condividi progetto",
      whatsapp: "Condividi su WhatsApp",
      linkedin: "Condividi su LinkedIn",
      x: "Condividi su X",
      copy: "Copia link",
      copied: "Link copiato",
      prompt: "Copia questo link:"
    }
  };

  class PatronesShareButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._onDocumentClick = this._onDocumentClick.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
      this._closeFromPointer = this._closeFromPointer.bind(this);
      this._openFromPointer = this._openFromPointer.bind(this);
      this._isPinnedOpen = false;
    }

    connectedCallback() {
      this.render();
      this.bindEvents();
      this.updateContent();
      this._langObserver = new MutationObserver(() => this.updateContent());
      this._langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    }

    disconnectedCallback() {
      document.removeEventListener("click", this._onDocumentClick);
      document.removeEventListener("keydown", this._onKeyDown);
      this.removeEventListener("mouseleave", this._closeFromPointer);
      this._langObserver?.disconnect();
    }

    get lang() {
      const lang = (document.documentElement.lang || "es").slice(0, 2).toLowerCase();
      return UI_LABELS[lang] ? lang : "es";
    }

    localizedAttribute(baseName) {
      return this.getAttribute(`${baseName}-${this.lang}`) || this.getAttribute(baseName) || "";
    }

    metaContent(selector) {
      return document.querySelector(selector)?.getAttribute("content") || "";
    }

    canonicalUrl() {
      return document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    }

    get shareUrl() {
      return this.getAttribute("share-url") || this.canonicalUrl();
    }

    get shareTitle() {
      return this.localizedAttribute("share-title") || this.metaContent('meta[property="og:title"]') || this.metaContent('meta[name="title"]') || document.title;
    }

    get shareText() {
      return this.localizedAttribute("share-text") || this.metaContent('meta[name="description"]') || this.metaContent('meta[property="og:description"]') || this.shareTitle;
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --pl-share-size: 44px;
            --pl-share-gap: 8px;
            --pl-share-radius: 13px;
            --pl-share-yellow: #ffd21d;
            --pl-share-dark: #090b0d;
            --pl-share-expanded-width: calc((var(--pl-share-size) * 5) + (var(--pl-share-gap) * 4));

            display: inline-block;
            position: relative;
            width: var(--pl-share-expanded-width);
            max-width: 100%;
            height: var(--pl-share-size);
            overflow: visible;
            vertical-align: middle;
            z-index: 1;
          }

          :host([size="sm"]) {
            --pl-share-size: 38px;
            --pl-share-gap: 7px;
          }

          :host([size="md"]) {
            --pl-share-size: 44px;
            --pl-share-gap: 8px;
          }

          :host([size="lg"]) {
            --pl-share-size: 52px;
            --pl-share-gap: 9px;
          }

          @media (max-width: 900px) {
            :host([size="md"]) {
              --pl-share-size: 36px;
              --pl-share-gap: 6px;
            }
          }

          @media (max-width: 520px) {
            :host([size="md"]) {
              --pl-share-size: 32px;
              --pl-share-gap: 5px;
            }
          }

          * { box-sizing: border-box; }

          .pl-share {
            position: absolute;
            left: 0;
            top: 0;
            width: var(--pl-share-size);
            height: var(--pl-share-size);
            overflow: visible;
            isolation: isolate;
            transform: none;
          }

          button, a { font: inherit; }

          .pl-share__main,
          .pl-share__item {
            position: absolute;
            inset: 0;
            width: var(--pl-share-size);
            height: var(--pl-share-size);
            min-width: var(--pl-share-size);
            min-height: var(--pl-share-size);
            display: grid;
            place-items: center;
            padding: 0;
            margin: 0;
            border: 0;
            border-radius: var(--pl-share-radius);
            text-decoration: none;
          }

          .pl-share__main {
            z-index: 5;
            overflow: hidden;
            cursor: pointer;
            color: var(--pl-share-yellow);
            background:
              radial-gradient(circle at 34% 18%, rgba(255,255,255,.16), transparent 28%),
              linear-gradient(135deg, #16191f 0%, #0a0c0f 52%, #050607 100%);
            box-shadow:
              0 14px 28px rgba(0,0,0,.34),
              0 0 0 1px rgba(255,210,29,.18),
              inset 0 0 0 1px rgba(255,255,255,.08);
            transition:
              transform .28s cubic-bezier(.2,.8,.2,1),
              box-shadow .28s ease,
              color .28s ease;
          }

          .pl-share__main::before {
            content: "";
            position: absolute;
            inset: -58%;
            z-index: 0;
            opacity: 0;
            pointer-events: none;
            background:
              linear-gradient(
                120deg,
                transparent 0 38%,
                rgba(255,255,255,.24) 47%,
                rgba(255,210,29,.18) 52%,
                transparent 62% 100%
              );
            transform: translateX(-48%) translateY(12%) rotate(-8deg);
          }

          .pl-share__main svg {
            position: relative;
            z-index: 2;
            width: 62%;
            height: 62%;
            fill: currentColor;
            pointer-events: none;
          }

          .pl-share__item {
            z-index: 3;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
            cursor: pointer;
            background: transparent;
            box-shadow:
              0 14px 28px rgba(0,0,0,.28),
              inset 0 0 0 1px rgba(255,255,255,.10);
            transform: translate(0, 0) scale(.68);
            transition:
              transform .34s cubic-bezier(.18,.86,.22,1),
              opacity .22s ease,
              box-shadow .22s ease,
              filter .22s ease;
          }

          .pl-share__item svg {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: inherit;
            pointer-events: none;
            overflow: visible;
          }

          .pl-share__copy { background: var(--pl-share-yellow); }

          .pl-share__copy svg {
            width: 62%;
            height: 62%;
            border-radius: 0;
          }

          .pl-share.is-open .pl-share__main,
          .pl-share__main:hover,
          .pl-share__main:focus-visible {
            transform: translateY(-1px) scale(1.045);
            color: #fff1a8;
            box-shadow:
              0 18px 34px rgba(0,0,0,.40),
              0 0 0 1px rgba(255,210,29,.32),
              0 0 30px rgba(255,210,29,.12),
              inset 0 0 0 1px rgba(255,255,255,.10);
          }

          .pl-share.is-open .pl-share__main::before,
          .pl-share__main:hover::before,
          .pl-share__main:focus-visible::before {
            opacity: 1;
            animation: plShareShine 1050ms cubic-bezier(.2,.8,.2,1);
          }

          .pl-share.is-open .pl-share__item {
            opacity: 1;
            pointer-events: auto;
          }

          .pl-share.is-open .pl-share__whatsapp {
            transform: translateX(calc((var(--pl-share-size) + var(--pl-share-gap)) * 1)) scale(1);
          }

          .pl-share.is-open .pl-share__linkedin {
            transform: translateX(calc((var(--pl-share-size) + var(--pl-share-gap)) * 3)) scale(1);
          }

          .pl-share.is-open .pl-share__copy {
            transform: translateX(calc((var(--pl-share-size) + var(--pl-share-gap)) * 4)) scale(1);
          }

          .pl-share.is-open .pl-share__x {
            transform: translateX(calc((var(--pl-share-size) + var(--pl-share-gap)) * 2)) scale(1);
          }

          .pl-share__item:hover,
          .pl-share__item:focus-visible {
            filter: saturate(1.08) contrast(1.04);
            box-shadow:
              0 18px 34px rgba(0,0,0,.36),
              inset 0 0 0 1px rgba(255,255,255,.18);
          }

          .pl-share__copy.is-copied { background: #d7ff72; }

          @keyframes plShareShine {
            0% { transform: translateX(-48%) translateY(12%) rotate(-8deg); }
            100% { transform: translateX(44%) translateY(-10%) rotate(-8deg); }
          }

          @media (prefers-reduced-motion: reduce) {
            .pl-share__main,
            .pl-share__main::before,
            .pl-share__item {
              transition: none;
              animation: none !important;
            }
          }
        </style>

        <div class="pl-share" part="container">
          <button class="pl-share__main" type="button" aria-expanded="false">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .38 1.47L8.9 9.25a3 3 0 1 0 0 5.5l6.48 3.78A3 3 0 1 0 16.4 17L9.92 13.2a3.2 3.2 0 0 0 0-2.4L16.4 7A3 3 0 0 0 18 8Z"/>
            </svg>
          </button>
          <a class="pl-share__item pl-share__whatsapp" href="#" target="_blank" rel="noopener noreferrer">${WHATSAPP_SVG}</a>
          <a class="pl-share__item pl-share__linkedin" href="#" target="_blank" rel="noopener noreferrer">${LINKEDIN_SVG}</a>
          <button class="pl-share__item pl-share__copy" type="button">${COPY_SVG}</button>
          <a class="pl-share__item pl-share__x" href="#" target="_blank" rel="noopener noreferrer">${X_SVG}</a>
        </div>
      `;
    }

    bindEvents() {
      const root = this.shadowRoot;
      this.container = root.querySelector(".pl-share");
      this.toggle = root.querySelector(".pl-share__main");
      this.whatsapp = root.querySelector(".pl-share__whatsapp");
      this.linkedin = root.querySelector(".pl-share__linkedin");
      this.x = root.querySelector(".pl-share__x");
      this.copy = root.querySelector(".pl-share__copy");
      this.items = root.querySelectorAll(".pl-share__item");

      this.setOpen(false);

      this.toggle.addEventListener("mouseenter", this._openFromPointer);
      this.addEventListener("mouseleave", this._closeFromPointer);
      this.addEventListener("focusin", () => this.setOpen(true));
      this.addEventListener("focusout", (event) => {
        window.setTimeout(() => {
          if (!this.shadowRoot.activeElement) this.setOpen(false);
        }, 0);
      });

      this.toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = this.container.classList.contains("is-open");
        this._isPinnedOpen = !isOpen || !this._isPinnedOpen;
        this.setOpen(this._isPinnedOpen);
      });

      this.copy.addEventListener("click", async (event) => {
        event.stopPropagation();
        const labels = UI_LABELS[this.lang];
        try {
          await navigator.clipboard.writeText(this.shareUrl);
          this.copy.classList.add("is-copied");
          this.copy.setAttribute("aria-label", labels.copied);
          window.setTimeout(() => {
            this.copy.classList.remove("is-copied");
            this.copy.setAttribute("aria-label", labels.copy);
          }, 1400);
        } catch {
          window.prompt(labels.prompt, this.shareUrl);
        }
      });

      document.addEventListener("click", this._onDocumentClick);
      document.addEventListener("keydown", this._onKeyDown);
    }

    updateContent() {
      const labels = UI_LABELS[this.lang];
      if (this.toggle) this.toggle.setAttribute("aria-label", labels.main);
      if (this.whatsapp) this.whatsapp.setAttribute("aria-label", labels.whatsapp);
      if (this.linkedin) this.linkedin.setAttribute("aria-label", labels.linkedin);
      if (this.x) this.x.setAttribute("aria-label", labels.x);
      if (this.copy && !this.copy.classList.contains("is-copied")) this.copy.setAttribute("aria-label", labels.copy);
      this.updateLinks();
    }

    updateLinks() {
      if (this.whatsapp) {
        this.whatsapp.href = `https://wa.me/?text=${encodeURIComponent(`${this.shareText} ${this.shareUrl}`)}`;
      }
      if (this.linkedin) {
        this.linkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.shareUrl)}`;
      }
      if (this.x) {
        this.x.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.shareText)}&url=${encodeURIComponent(this.shareUrl)}`;
      }
    }

    setOpen(isOpen) {
      if (!this.container) return;
      this.container.classList.toggle("is-open", isOpen);
      this.toggle?.setAttribute("aria-expanded", String(isOpen));
      this.items?.forEach((item) => { item.tabIndex = isOpen ? 0 : -1; });
    }

    _openFromPointer() { this.setOpen(true); }
    _closeFromPointer() {
      if (!this._isPinnedOpen) this.setOpen(false);
    }

    _onDocumentClick(event) {
      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      if (!path.includes(this) && !this.contains(event.target)) {
        this._isPinnedOpen = false;
        this.setOpen(false);
      }
    }

    _onKeyDown(event) {
      if (event.key === "Escape") {
        this._isPinnedOpen = false;
        this.setOpen(false);
      }
    }
  }

  if (!customElements.get("pl-share-button")) {
    customElements.define("pl-share-button", PatronesShareButton);
  }
})();
