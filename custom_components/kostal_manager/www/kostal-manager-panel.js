// SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): bb380ef9b5660df4c09e85f0dacd02e4a7d6155e5eb6ddf62efd8f3405d052dd
/* Kostal Manager Seite (Seitenleiste) – Meine smarte Welt */
const PANEL_TAG = "kostal-manager-panel";
const CARD_TAG = "kostal-manager-card";
const BASE = "/kostal_manager_files/kostal-manager-card.js";
/* Dieselbe Versionskennung wie die Seite selbst, damit Karte und Seite dieselbe Moduldatei teilen */
const VER = new URL(import.meta.url).searchParams.get("v");
const ICON_URL = "/kostal_manager_files/kostal-manager-icon.png";
const CARD_URL = VER ? `${BASE}?v=${encodeURIComponent(VER)}` : BASE;

const STYLE = `
:host { display:block; min-height:100%; background:var(--primary-background-color); color:var(--primary-text-color); }
.bar { display:flex; align-items:center; gap:8px; height:56px; padding:0 16px; box-sizing:border-box; background:var(--app-header-background-color, var(--primary-color)); color:var(--app-header-text-color, #fff); position:sticky; top:0; z-index:2; }
.bar img { width:32px; height:32px; flex:none; }
.bar .t { font-size:20px; font-weight:500; }
.bar button { display:none; border:0; background:none; color:inherit; cursor:pointer; padding:4px; border-radius:50%; }
:host([narrow]) .bar button { display:inline-flex; }
.bar ha-icon { --mdc-icon-size:24px; }
main { max-width:1000px; margin:0 auto; padding:16px; box-sizing:border-box; }
.err { padding:12px; border-radius:8px; background:var(--error-color, #db4437); color:#fff; }
`;

class KostalManagerPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._card = null;
    this._built = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (this._card) this._card.hass = hass;
  }
  get hass() { return this._hass; }

  set narrow(value) {
    this._narrow = !!value;
    if (this._narrow) this.setAttribute("narrow", ""); else this.removeAttribute("narrow");
  }
  get narrow() { return !!this._narrow; }

  set route(_value) { /* nicht benötigt */ }
  set panel(_value) { /* nicht benötigt */ }

  connectedCallback() {
    if (!this._built) this._build();
  }

  async _build() {
    this._built = true;
    this.shadowRoot.innerHTML = `<style>${STYLE}</style>
      <div class="bar"><button type="button" aria-label="Menu"><ha-icon icon="mdi:menu"></ha-icon></button><img src="${ICON_URL}" alt=""><span class="t">Kostal Manager</span></div>
      <main></main>`;
    this.shadowRoot.querySelector(".bar button").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
    });
    const main = this.shadowRoot.querySelector("main");
    try {
      await import(CARD_URL);
      await customElements.whenDefined(CARD_TAG);
    } catch (e) {
      main.innerHTML = `<div class="err">Kostal Manager: Karte konnte nicht geladen werden.</div>`;
      return;
    }
    const card = document.createElement(CARD_TAG);
    card.setConfig({ type: `custom:${CARD_TAG}`, title: "Kostal Manager", show_title: false, show_experimental: true });
    if (this._hass) card.hass = this._hass;
    this._card = card;
    main.appendChild(card);
  }
}

if (!customElements.get(PANEL_TAG)) customElements.define(PANEL_TAG, KostalManagerPanel);
