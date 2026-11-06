// SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 826ab92938f9c3198f96fc9aff1de4880d5a6197e8e705c6c516c4b45b7e5779
/* Kostal Manager Card – Meine smarte Welt */
const CARD_VERSION = "1.0.0b2";
/* Symbol wird wie die Karte aus dem Ordner /kostal_manager_files/ ausgeliefert (const.py: URL_BASE) */
const ICON_URL = "/kostal_manager_files/kostal-manager-icon.png";
const CARD_TAG = "kostal-manager-card";
const EDITOR_TAG = "kostal-manager-card-editor";
const WS = "kostal_manager";
const RELEASES_URL = "https://github.com/Meine-smarte-Welt/kostal_manager/releases";

/* ---------- Registry: Kategorien (an einer Stelle) ---------- */
const TAB_ORDER = ["overview", "strings", "battery", "stats", "ksem", "settings"];
const TAB_META = {
  overview: { icon: "mdi:solar-power-variant", label: "tab_overview" },
  strings: { icon: "mdi:solar-panel-large", label: "tab_strings" },
  battery: { icon: "mdi:battery-70", label: "tab_battery" },
  stats: { icon: "mdi:chart-donut", label: "tab_stats" },
  ksem: { icon: "mdi:meter-electric", label: "tab_ksem" },
  settings: { icon: "mdi:cog", label: "tab_settings" },
};
/* Experimentelle Funktionen – schlüsselgleich zu const.py (EXPERIMENTAL_FEATURES) */
const EXPERIMENTAL = {
  efficiency: { since: "1.0.0b1", icon: "mdi:percent-circle", label: "exp_efficiency" },
  history7: { since: "1.0.0b1", icon: "mdi:chart-bar", label: "exp_history7" },
  panel: { since: "1.0.0b1", icon: "mdi:view-dashboard", label: "exp_panel" },
};
const CATEGORY_ICON_COLOR_KEYS = Object.fromEntries(TAB_ORDER.map((k) => [k, `color_icon_${k}`]));

/* ---------- Farben ---------- */
const COLOR_CONFIG_KEYS = {
  tab_active: { cssVar: "--plm-color-tab-active", fallback: "var(--primary-color, #03a9f4)" },
  success: { cssVar: "--plm-color-success", fallback: "var(--success-color, #43a047)" },
  warning: { cssVar: "--plm-color-warning", fallback: "var(--warning-color, #ff9800)" },
  error: { cssVar: "--plm-color-error", fallback: "var(--error-color, #db4437)" },
  info: { cssVar: "--plm-color-info", fallback: "var(--info-color, #039be5)" },
  row_icon: { cssVar: "--plm-color-row-icon", fallback: "var(--secondary-text-color, #727272)" },
  live_banner: { cssVar: "--plm-color-live-banner", fallback: "var(--state-icon-active-color, #03a9f4)" },
  solar: { cssVar: "--plm-color-solar", fallback: "#f5a623" },
  battery: { cssVar: "--plm-color-battery", fallback: "#43a047" },
  grid: { cssVar: "--plm-color-grid", fallback: "#7e57c2" },
  home: { cssVar: "--plm-color-home", fallback: "#039be5" },
};
const SAFE_COLOR_RE = /^[a-zA-Z0-9#(),.%\-\s]+$/;
function sanitizeColor(v) {
  const t = String(v || "").trim();
  return t && SAFE_COLOR_RE.test(t) ? t : "";
}

/* ---------- Sprachen ---------- */
const I18N = {
  de: {
    tab_overview: "Übersicht", tab_strings: "Strings", tab_battery: "Batterie", tab_stats: "Statistik",
    tab_ksem: "KSEM", tab_settings: "Einstellungen",
    exp_efficiency: "Batteriewirkungsgrad (geschätzt)", exp_history7: "7-Tage-Balkendiagramm", exp_panel: "Eigene Seite in der Seitenleiste",
    h7_title: "Letzte 7 Tage", h7_none: "Für das Diagramm fehlen Energiezähler. Aktiviere die Kostal-Sensoren (Einstellungen).", h7_empty: "Noch keine Verlaufsdaten für diesen Wert.", h7_loading: "Lade Verlauf …", h7_error: "Verlauf konnte nicht geladen werden.",
    h7_solar: "Solar", h7_home: "Verbrauch", h7_grid_in: "Netzbezug", h7_grid_out: "Einspeisung", h7_ksem_in: "KSEM Bezug", h7_ksem_out: "KSEM Einspeisung", h7_sum: "Summe", h7_avg: "Ø pro Tag",
    experimental: "Experimentell", experimental_hint: "Ungeprüft. Noch nicht an echter Hardware bestätigt.",
    loading: "Lade Daten …", err_not_found: "Kostal Manager ist nicht eingerichtet.", err_conn: "Keine Verbindung zum Backend.",
    no_data: "Noch keine Werte. Die Sensoren der Kostal-Integration sind meist deaktiviert.",
    enable_sensors: "Deaktivierte Sensoren aktivieren", enable_confirm: "Wirklich aktivieren?", enabled_n: "{n} Sensoren aktiviert. Die Werte erscheinen nach dem nächsten Abruf.",
    solar: "Solar", grid: "Netz", home: "Haus", battery: "Batterie", grid_import: "Bezug", grid_export: "Einspeisung",
    charging: "Laden", discharging: "Entladen", idle: "Bereit", soc: "Ladestand", cycles: "Ladezyklen",
    ac_power: "AC-Leistung", inverter_state: "Zustand Wechselrichter", em_state: "Energiemanager", errors: "Aktive Fehler",
    home_from: "Hausverbrauch aus", from_pv: "Solar", from_battery: "Batterie", from_grid: "Netz",
    autarky: "Autarkie", own_rate: "Eigenverbrauch", pv_share: "PV-Anteil",
    power: "Leistung", voltage: "Spannung", current: "Strom",
    string_n: "String {n}", string_battery: "Batterie-Eingang", string_not_selected: "nicht gewählt", string_sum: "Summe gewählter Strings",
    string_battery_hint: "Dieser Eingang gehört zur Batterie und zählt nicht als PV-String.",
    strings_change: "Strings wählst Du in Home Assistant unter Einstellungen → Geräte & Dienste → Kostal Manager → Konfigurieren.",
    no_value: "kein Wert", info: "Informationen", energy: "Energie", role: "Rolle", role_pv: "PV-String", selected: "In Summen enthalten", yes: "Ja", no: "Nein",
    p_day: "Heute", p_month: "Monat", p_year: "Jahr", p_total: "Gesamt",
    st_source: "Woher kommt der Strom?", st_ratios: "Kennzahlen", st_energy: "Energiebilanz", st_strings: "Erzeugung je String", st_battery: "Batterie-Energie",
    st_solar: "Solarproduktion", st_feedin: "Einspeisung", st_import: "Netzbezug", st_balance: "Netzbilanz", st_consumption: "Hausverbrauch",
    st_chg_pv: "Geladen aus Solar", st_chg_grid: "Geladen aus Netz", st_discharge: "Entladen",
    st_efficiency: "Wirkungsgrad (geschätzt)", st_efficiency_hint: "Entladen geteilt durch Geladen seit Beginn. Näherungswert.",
    bat_power: "Batterieleistung",
    ksem_title: "KSEM Zähler", ksem_need_host: "Trage in den Optionen der Integration die Adresse des KSEM ein und aktiviere Modbus TCP am Gerät.",
    ksem_error: "Verbindung zum KSEM fehlgeschlagen", ksem_power: "Netzleistung", ksem_freq: "Netzfrequenz", ksem_phase: "Phase {n}",
    ksem_import: "Zähler Bezug", ksem_export: "Zähler Einspeisung", ksem_wait: "Warte auf erste Messung …",
    app_version: "App-Version", integration: "Integration", card: "Karte", latest: "Neueste Version", checked: "Zuletzt geprüft",
    check_now: "Jetzt prüfen", view_release: "Release ansehen", up_to_date: "Aktuell", update_available: "Neue Version verfügbar",
    update_hint: "Aktualisiere über HACS und starte Home Assistant neu. Danach Browser neu laden (Strg+F5).",
    mismatch_hint: "Karte und Integration haben unterschiedliche Versionen. Browser-Cache leeren (Strg+F5).",
    check_failed: "Prüfung nicht möglich", never: "noch nie",
    connection: "Verbindung", found: "Gefundene Kostal-Sensoren", disabled_n: "davon deaktiviert",
    plant_settings: "Anlageneinstellungen", plant_hint: "Diese Werte liefert die Kostal-Integration nur etwa alle 5 Minuten.",
    battery_min_soc: "Minimaler Ladestand", battery_min_home_consumption: "Min. Hausverbrauch für Entladung", battery_strategy: "Automatische Batteriestrategie",
    save: "Speichern", saved: "Gespeichert", failed: "Fehlgeschlagen", settings_none: "Keine Anlageneinstellungen verfügbar.",
    experimental_group: "Experimentelle Funktionen", exp_off_hint: "Aktivieren in den Optionen der Integration und im Karteneditor.",
    events: "Ereignisse", events_none: "Keine Ereignisse seit dem Laden.", close: "Schließen", read_only: "Nur Lesen",
    admin_only: "Nur Administratoren können das ändern.",
  },
  en: {
    tab_overview: "Overview", tab_strings: "Strings", tab_battery: "Battery", tab_stats: "Statistics",
    tab_ksem: "KSEM", tab_settings: "Settings",
    exp_efficiency: "Battery efficiency (estimated)", exp_history7: "7-day bar chart", exp_panel: "Own page in the sidebar",
    h7_title: "Last 7 days", h7_none: "The chart needs energy counters. Enable the Kostal sensors (Settings).", h7_empty: "No history yet for this value.", h7_loading: "Loading history …", h7_error: "History could not be loaded.",
    h7_solar: "Solar", h7_home: "Consumption", h7_grid_in: "Grid import", h7_grid_out: "Feed-in", h7_ksem_in: "KSEM import", h7_ksem_out: "KSEM feed-in", h7_sum: "Total", h7_avg: "Avg. per day",
    experimental: "Experimental", experimental_hint: "Untested. Not yet confirmed on real hardware.",
    loading: "Loading data …", err_not_found: "Kostal Manager is not set up.", err_conn: "No connection to the backend.",
    no_data: "No values yet. The sensors of the Kostal integration are usually disabled.",
    enable_sensors: "Enable disabled sensors", enable_confirm: "Really enable?", enabled_n: "{n} sensors enabled. Values appear after the next poll.",
    solar: "Solar", grid: "Grid", home: "Home", battery: "Battery", grid_import: "Import", grid_export: "Feed-in",
    charging: "Charging", discharging: "Discharging", idle: "Idle", soc: "State of charge", cycles: "Charge cycles",
    ac_power: "AC power", inverter_state: "Inverter state", em_state: "Energy manager", errors: "Active errors",
    home_from: "Home consumption from", from_pv: "Solar", from_battery: "Battery", from_grid: "Grid",
    autarky: "Autarky", own_rate: "Self-consumption", pv_share: "PV share",
    power: "Power", voltage: "Voltage", current: "Current",
    string_n: "String {n}", string_battery: "Battery input", string_not_selected: "not selected", string_sum: "Sum of selected strings",
    string_battery_hint: "This input belongs to the battery and does not count as a PV string.",
    strings_change: "Choose strings in Home Assistant under Settings → Devices & services → Kostal Manager → Configure.",
    no_value: "no value", info: "Information", energy: "Energy", role: "Role", role_pv: "PV string", selected: "Included in sums", yes: "Yes", no: "No",
    p_day: "Today", p_month: "Month", p_year: "Year", p_total: "Total",
    st_source: "Where does the power come from?", st_ratios: "Key figures", st_energy: "Energy balance", st_strings: "Production per string", st_battery: "Battery energy",
    st_solar: "Solar production", st_feedin: "Feed-in", st_import: "Grid import", st_balance: "Grid balance", st_consumption: "Home consumption",
    st_chg_pv: "Charged from solar", st_chg_grid: "Charged from grid", st_discharge: "Discharged",
    st_efficiency: "Efficiency (estimated)", st_efficiency_hint: "Discharged divided by charged since the start. Approximation.",
    bat_power: "Battery power",
    ksem_title: "KSEM meter", ksem_need_host: "Enter the KSEM address in the integration options and enable Modbus TCP on the device.",
    ksem_error: "Connection to the KSEM failed", ksem_power: "Grid power", ksem_freq: "Grid frequency", ksem_phase: "Phase {n}",
    ksem_import: "Import counter", ksem_export: "Export counter", ksem_wait: "Waiting for first reading …",
    app_version: "App version", integration: "Integration", card: "Card", latest: "Latest version", checked: "Last checked",
    check_now: "Check now", view_release: "View release", up_to_date: "Up to date", update_available: "New version available",
    update_hint: "Update via HACS and restart Home Assistant. Then reload the browser (Ctrl+F5).",
    mismatch_hint: "Card and integration have different versions. Clear the browser cache (Ctrl+F5).",
    check_failed: "Check not possible", never: "never",
    connection: "Connection", found: "Kostal sensors found", disabled_n: "of them disabled",
    plant_settings: "Plant settings", plant_hint: "The Kostal integration only updates these values about every 5 minutes.",
    battery_min_soc: "Minimum state of charge", battery_min_home_consumption: "Min. home consumption for discharge", battery_strategy: "Automatic battery strategy",
    save: "Save", saved: "Saved", failed: "Failed", settings_none: "No plant settings available.",
    experimental_group: "Experimental features", exp_off_hint: "Enable in the integration options and in the card editor.",
    events: "Events", events_none: "No events since loading.", close: "Close", read_only: "Read only",
    admin_only: "Only administrators can change this.",
  },
  nl: {
    tab_overview: "Overzicht", tab_strings: "Strings", tab_battery: "Batterij", tab_stats: "Statistiek",
    tab_ksem: "KSEM", tab_settings: "Instellingen",
    exp_efficiency: "Batterijrendement (geschat)", exp_history7: "Staafdiagram van 7 dagen", exp_panel: "Eigen pagina in de zijbalk",
    h7_title: "Laatste 7 dagen", h7_none: "Voor het diagram ontbreken energietellers. Schakel de Kostal-sensoren in (Instellingen).", h7_empty: "Nog geen verloop voor deze waarde.", h7_loading: "Verloop laden …", h7_error: "Verloop kon niet worden geladen.",
    h7_solar: "Zon", h7_home: "Verbruik", h7_grid_in: "Netafname", h7_grid_out: "Teruglevering", h7_ksem_in: "KSEM afname", h7_ksem_out: "KSEM teruglevering", h7_sum: "Totaal", h7_avg: "Gem. per dag",
    experimental: "Experimenteel", experimental_hint: "Niet getest. Nog niet bevestigd op echte hardware.",
    loading: "Gegevens laden …", err_not_found: "Kostal Manager is niet ingesteld.", err_conn: "Geen verbinding met de backend.",
    no_data: "Nog geen waarden. De sensoren van de Kostal-integratie zijn meestal uitgeschakeld.",
    enable_sensors: "Uitgeschakelde sensoren inschakelen", enable_confirm: "Echt inschakelen?", enabled_n: "{n} sensoren ingeschakeld. Waarden verschijnen na de volgende poll.",
    solar: "Zon", grid: "Net", home: "Huis", battery: "Batterij", grid_import: "Afname", grid_export: "Teruglevering",
    charging: "Laden", discharging: "Ontladen", idle: "Gereed", soc: "Laadtoestand", cycles: "Laadcycli",
    ac_power: "AC-vermogen", inverter_state: "Status omvormer", em_state: "Energiemanager", errors: "Actieve fouten",
    home_from: "Huisverbruik uit", from_pv: "Zon", from_battery: "Batterij", from_grid: "Net",
    autarky: "Autarkie", own_rate: "Eigenverbruik", pv_share: "PV-aandeel",
    power: "Vermogen", voltage: "Spanning", current: "Stroom",
    string_n: "String {n}", string_battery: "Batterij-ingang", string_not_selected: "niet gekozen", string_sum: "Som gekozen strings",
    string_battery_hint: "Deze ingang hoort bij de batterij en telt niet als PV-string.",
    strings_change: "Kies strings in Home Assistant onder Instellingen → Apparaten & services → Kostal Manager → Configureren.",
    no_value: "geen waarde", info: "Informatie", energy: "Energie", role: "Rol", role_pv: "PV-string", selected: "Opgenomen in sommen", yes: "Ja", no: "Nee",
    p_day: "Vandaag", p_month: "Maand", p_year: "Jaar", p_total: "Totaal",
    st_source: "Waar komt de stroom vandaan?", st_ratios: "Kengetallen", st_energy: "Energiebalans", st_strings: "Opwek per string", st_battery: "Batterij-energie",
    st_solar: "Zonneproductie", st_feedin: "Teruglevering", st_import: "Netafname", st_balance: "Netsaldo", st_consumption: "Huisverbruik",
    st_chg_pv: "Geladen uit zon", st_chg_grid: "Geladen uit net", st_discharge: "Ontladen",
    st_efficiency: "Rendement (geschat)", st_efficiency_hint: "Ontladen gedeeld door geladen sinds het begin. Benadering.",
    bat_power: "Batterijvermogen",
    ksem_title: "KSEM-meter", ksem_need_host: "Voer in de opties van de integratie het KSEM-adres in en schakel Modbus TCP op het apparaat in.",
    ksem_error: "Verbinding met de KSEM mislukt", ksem_power: "Netvermogen", ksem_freq: "Netfrequentie", ksem_phase: "Fase {n}",
    ksem_import: "Teller afname", ksem_export: "Teller teruglevering", ksem_wait: "Wachten op eerste meting …",
    app_version: "App-versie", integration: "Integratie", card: "Kaart", latest: "Nieuwste versie", checked: "Laatst gecontroleerd",
    check_now: "Nu controleren", view_release: "Release bekijken", up_to_date: "Actueel", update_available: "Nieuwe versie beschikbaar",
    update_hint: "Werk bij via HACS en herstart Home Assistant. Laad daarna de browser opnieuw (Ctrl+F5).",
    mismatch_hint: "Kaart en integratie hebben verschillende versies. Wis de browsercache (Ctrl+F5).",
    check_failed: "Controle niet mogelijk", never: "nooit",
    connection: "Verbinding", found: "Gevonden Kostal-sensoren", disabled_n: "waarvan uitgeschakeld",
    plant_settings: "Installatie-instellingen", plant_hint: "De Kostal-integratie ververst deze waarden slechts ongeveer elke 5 minuten.",
    battery_min_soc: "Minimale laadtoestand", battery_min_home_consumption: "Min. huisverbruik voor ontladen", battery_strategy: "Automatische batterijstrategie",
    save: "Opslaan", saved: "Opgeslagen", failed: "Mislukt", settings_none: "Geen installatie-instellingen beschikbaar.",
    experimental_group: "Experimentele functies", exp_off_hint: "Inschakelen in de opties van de integratie en in de kaarteditor.",
    events: "Gebeurtenissen", events_none: "Geen gebeurtenissen sinds laden.", close: "Sluiten", read_only: "Alleen lezen",
    admin_only: "Alleen beheerders kunnen dit wijzigen.",
  },
};

/* Sprach-Tag nie blind kürzen (Schriftvarianten wie sr-Latn bleiben erhalten) */
function normLang(tag) {
  const t = String(tag || "en").replace("_", "-");
  if (/^[a-z]{2,3}-(Latn|Cyrl|Hans|Hant)$/i.test(t)) {
    const [l, s] = t.split("-");
    return `${l.toLowerCase()}-${s[0].toUpperCase()}${s.slice(1).toLowerCase()}`;
  }
  return t.split("-")[0].toLowerCase();
}
function tr(lang, key, vars) {
  let s = (I18N[lang] && I18N[lang][key]) ?? I18N.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}
function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function num(o) {
  return o && o.ok !== false && typeof o.v === "number" && Number.isFinite(o.v) ? o.v : null;
}

const DEFAULTS = {
  title: "Kostal Manager",
  show_title: true,
  default_tab: "overview",
  zoom: 100,
  read_only: false,
  show_experimental: false,
  stats_period: "day",
  ...Object.fromEntries(TAB_ORDER.map((k) => [`show_${k}`, true])),
};

const STYLE = `
:host { display:block; container-type:inline-size; container-name:plm; --plm-radius:8px; }
* { box-sizing:border-box; }
ha-card { padding:12px; overflow:hidden; }
.title { font-size:1.2em; font-weight:500; margin:0 0 8px; display:flex; align-items:center; gap:8px; }
.title img { width:1.6em; height:1.6em; flex:none; }
.zoomwrap { transform-origin:top left; }
.tabs { display:flex; gap:2px; border-bottom:1px solid var(--divider-color); margin-bottom:12px; overflow:hidden; }
.tab { flex:0 1 auto; display:flex; align-items:center; gap:6px; padding:8px 10px; cursor:pointer; border:0; background:none; color:var(--secondary-text-color); font:inherit; border-bottom:2px solid transparent; white-space:nowrap; position:relative; }
.tab ha-icon { --mdc-icon-size:20px; color:var(--plm-icon, var(--plm-color-row-icon, var(--secondary-text-color))); }
.tab.active { color:var(--primary-text-color); border-bottom-color:var(--plm-color-tab-active, var(--primary-color, #03a9f4)); }
.tab .badge { position:absolute; top:2px; right:0; min-width:14px; height:14px; border-radius:7px; font-size:10px; line-height:14px; text-align:center; color:#fff; background:var(--plm-color-warning, var(--warning-color,#ff9800)); padding:0 3px; }
@container plm (max-width: 480px) { .tab span.lbl { display:none; } .tab { flex:1 1 0; min-width:0; justify-content:center; padding:8px 4px; } }
.tabs.compact .tab span.lbl { display:none; }
.tabs.compact .tab { flex:1 1 0; min-width:0; justify-content:center; padding:8px 4px; }
.seg.wrap { display:flex; flex-wrap:wrap; }
.h7 { display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:6px; height:160px; margin-bottom:8px; }
.h7col { display:flex; flex-direction:column; min-width:0; }
.h7val { font-size:.75em; color:var(--secondary-text-color); height:1.3em; text-align:center; white-space:nowrap; }
.h7bar { position:relative; flex:1; }
.h7bar i { position:absolute; bottom:0; left:12%; right:12%; background:var(--c); opacity:.55; border-radius:6px 6px 0 0; min-height:2px; }
.h7col.today .h7bar i { opacity:1; }
.h7day { font-size:.75em; margin-top:4px; text-align:center; color:var(--secondary-text-color); }
.h7col.today .h7day { color:var(--primary-text-color); font-weight:500; }
@container plm (max-width: 360px) { .h7val { font-size:.65em; } }
.banner { padding:8px 10px; border-radius:var(--plm-radius); margin-bottom:10px; color:#fff; font-size:.9em; }
.banner.error { background:var(--plm-color-error, var(--error-color,#db4437)); }
.banner.warning { background:var(--plm-color-warning, var(--warning-color,#ff9800)); }
.banner.info { background:var(--plm-color-live-banner, var(--state-icon-active-color,#03a9f4)); }
.hint { color:var(--secondary-text-color); font-size:.9em; padding:6px 0; }
.section-title { font-weight:500; margin:14px 0 6px; display:flex; align-items:center; gap:8px; }
.exp-badge { font-size:10px; font-weight:600; text-transform:uppercase; padding:1px 6px; border-radius:8px; color:#fff; background:var(--plm-color-warning, var(--warning-color,#ff9800)); letter-spacing:.3px; }
.flow { position:relative; width:100%; max-width:480px; margin:0 auto 8px; aspect-ratio:5/2.7; }
.flow svg { position:absolute; inset:0; width:100%; height:100%; }
.flow .line { stroke:var(--divider-color); stroke-width:3; fill:none; vector-effect:non-scaling-stroke; }
.flow .live { stroke:var(--c, var(--primary-color)); stroke-width:3; fill:none; stroke-dasharray:6 8; vector-effect:non-scaling-stroke; animation:dash 1s linear infinite; }
@keyframes dash { to { stroke-dashoffset:-14; } }
@media (prefers-reduced-motion: reduce) { .flow .live { animation:none; } }
.node { position:absolute; transform:translate(-50%,-32px); display:flex; flex-direction:column; align-items:center; gap:2px; text-align:center; }
.node .circle { width:64px; height:64px; border-radius:50%; border:3px solid var(--c, var(--divider-color)); display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--card-background-color, #fff); }
.node ha-icon { --mdc-icon-size:22px; color:var(--c, var(--secondary-text-color)); }
.node .val { font-weight:600; font-size:.85em; line-height:1.1; }
.node .sub { font-size:.75em; color:var(--secondary-text-color); white-space:nowrap; }
.tiles { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:8px; margin:8px 0; }
.tile { border:1px solid var(--divider-color); border-radius:var(--plm-radius); padding:8px 10px; }
.tile .k { color:var(--secondary-text-color); font-size:.8em; }
.tile .v { font-size:1.15em; font-weight:600; margin-top:2px; }
.bar { height:8px; background:var(--divider-color); border-radius:4px; overflow:hidden; margin-top:6px; }
.bar > i { display:block; height:100%; background:var(--c, var(--primary-color)); border-radius:4px; }
.stack { display:flex; height:14px; border-radius:7px; overflow:hidden; background:var(--divider-color); margin:6px 0; }
.stack > i { display:block; height:100%; background:var(--c); }
.legend { display:flex; flex-wrap:wrap; gap:4px 12px; font-size:.85em; }
.legend span::before { content:""; display:inline-block; width:10px; height:10px; border-radius:50%; background:var(--c); margin-right:5px; }
.row { display:flex; align-items:center; gap:10px; padding:10px 4px; border-bottom:1px solid var(--divider-color); cursor:pointer; }
.row.dim { opacity:.55; }
.row .ico { position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center; color:var(--plm-icon, var(--plm-color-row-icon, var(--secondary-text-color))); }
.row .dot { position:absolute; right:0; bottom:2px; width:9px; height:9px; border-radius:50%; background:var(--c, var(--divider-color)); border:2px solid var(--card-background-color,#fff); }
.row .main { flex:1; min-width:0; }
.row .name { font-weight:500; display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
.row .sub { color:var(--secondary-text-color); font-size:.85em; }
.pill { border:1px solid var(--c, var(--divider-color)); color:var(--c, var(--primary-text-color)); border-radius:12px; padding:2px 9px; font-size:.85em; font-weight:600; white-space:nowrap; }
.seg { display:inline-flex; border:1px solid var(--divider-color); border-radius:var(--plm-radius); overflow:hidden; margin-bottom:8px; }
.seg button { border:0; background:none; padding:6px 12px; font:inherit; color:var(--secondary-text-color); cursor:pointer; }
.seg button.on { background:var(--plm-color-tab-active, var(--primary-color)); color:#fff; }
.card2 { border:1px solid var(--divider-color); border-radius:var(--plm-radius); padding:10px 12px; margin-bottom:10px; }
.card2 h4 { margin:0 0 8px; font-weight:500; display:flex; align-items:center; gap:8px; }
.donutwrap { display:flex; gap:14px; align-items:center; flex-wrap:wrap; }
.donut { width:120px; height:120px; flex:none; }
.donut text { fill:var(--primary-text-color); font-size:14px; font-weight:600; text-anchor:middle; }
.donut text.s { font-size:8px; font-weight:400; fill:var(--secondary-text-color); }
.gauges { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:8px; }
.gauge { text-align:center; }
.gauge svg { width:100%; max-width:110px; }
.gauge text { fill:var(--primary-text-color); font-size:15px; font-weight:600; text-anchor:middle; }
.gauge .lbl { font-size:.8em; color:var(--secondary-text-color); }
.hbar { display:grid; grid-template-columns:minmax(90px,30%) 1fr auto; align-items:center; gap:8px; margin:6px 0; font-size:.9em; }
.hbar .bar { margin:0; height:10px; }
.settings-accordion { border:1px solid var(--divider-color); border-radius:8px; margin-bottom:8px; }
.settings-accordion.update { border-color:var(--plm-color-warning, var(--warning-color,#ff9800)); }
.settings-accordion.danger { border-color:var(--plm-color-error, var(--error-color,#db4437)); }
.settings-accordion-summary { display:flex; align-items:center; gap:10px; padding:10px 12px; cursor:pointer; list-style:none; }
.settings-accordion-summary::-webkit-details-marker { display:none; }
.settings-accordion-summary::after { content:""; width:7px; height:7px; border-right:2px solid var(--secondary-text-color); border-bottom:2px solid var(--secondary-text-color); transform:rotate(45deg); transition:transform .15s; margin-left:4px; }
details[open] > .settings-accordion-summary::after { transform:rotate(-135deg); }
.grow { flex:1; }
.meta { color:var(--secondary-text-color); font-size:.85em; }
.settings-accordion-body { padding:4px 12px 12px; }
.settings-line { display:flex; justify-content:space-between; gap:12px; padding:5px 0; border-bottom:1px dashed var(--divider-color); }
.settings-line:last-child { border-bottom:0; }
.settings-line .l { color:var(--secondary-text-color); }
.settings-line .r { font-weight:600; text-align:right; }
.btn { border:1px solid var(--divider-color); background:none; color:var(--primary-text-color); border-radius:6px; padding:6px 12px; font:inherit; cursor:pointer; margin:4px 6px 4px 0; }
.btn.primary { background:var(--plm-color-tab-active, var(--primary-color)); border-color:transparent; color:#fff; }
.btn.danger { background:var(--plm-color-error, var(--error-color,#db4437)); border-color:transparent; color:#fff; }
.btn.small { padding:3px 8px; font-size:.85em; }
.btn:disabled { opacity:.5; cursor:default; }
.inp { font:inherit; padding:5px 8px; border-radius:6px; border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); width:90px; }
.ok { color:var(--plm-color-success, var(--success-color,#43a047)); }
.warn { color:var(--plm-color-warning, var(--warning-color,#ff9800)); }
.err { color:var(--plm-color-error, var(--error-color,#db4437)); }
.backdrop { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:9; display:flex; align-items:center; justify-content:center; }
.popup { width:min(440px, 94vw); max-height:86vh; overflow:auto; background:var(--card-background-color,#fff); color:var(--primary-text-color); border-radius:12px; padding:14px; }
.popup .head { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.popup .head .t { flex:1; font-size:1.1em; font-weight:500; }
.toast { position:fixed; left:50%; bottom:24px; transform:translateX(-50%); z-index:10; background:var(--primary-text-color); color:var(--card-background-color); padding:8px 16px; border-radius:8px; }
.toast.error { background:var(--plm-color-error, var(--error-color,#db4437)); color:#fff; }
`;

class PlenticoreManagerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULTS };
    this._snap = null;
    this._err = null;
    this._acc = {};
    this._tab = null;
    this._popup = null;
    this._confirm = null;
    this._events = [];
    this._toast = null;
    this._unsub = null;
    this._sig = "";
    this._period = null;
  }

  static getConfigElement() { return document.createElement(EDITOR_TAG); }
  static getStubConfig() { return { type: `custom:${CARD_TAG}` }; }
  getCardSize() { return 8; }

  setConfig(config) {
    this._config = { ...DEFAULTS, ...config };
    if (this._config.title === undefined) this._config.title = DEFAULTS.title;
    this._period = this._period || this._config.stats_period;
    this._applyColors();
    this._sig = "";
    this._render();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) this._connect();
    const lang = normLang(hass.language);
    if (lang !== this._lang) { this._lang = lang; this._sig = ""; this._render(); }
  }

  connectedCallback() {
    if (this._hass && !this._unsub) this._connect();
    if (typeof ResizeObserver !== "undefined" && !this._ro) {
      this._ro = new ResizeObserver(() => this._fitTabs());
      this._ro.observe(this);
    }
  }
  disconnectedCallback() {
    this._disconnect();
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
  }

  /* Tab-Leiste ohne Scrollbalken: passen die Beschriftungen nicht, bleiben nur die Symbole */
  _fitTabs() {
    const t = this.shadowRoot && this.shadowRoot.querySelector(".tabs");
    if (!t) return;
    t.classList.remove("compact");
    if (t.scrollWidth > t.clientWidth + 1) t.classList.add("compact");
  }

  _disconnect() {
    if (this._unsub) { try { this._unsub(); } catch (e) { /* ignorieren */ } this._unsub = null; }
  }

  async _connect() {
    if (!this._hass || this._unsub || this._connecting) return;
    this._connecting = true;
    try {
      const msg = { type: `${WS}/subscribe` };
      if (this._config.entry_id) msg.entry_id = this._config.entry_id;
      this._unsub = await this._hass.connection.subscribeMessage((ev) => {
        if (ev && ev.event === "snapshot") { this._snap = ev.data; this._err = null; this._render(); }
      }, msg);
    } catch (e) {
      this._err = e && e.code === "not_found" ? "err_not_found" : "err_conn";
      this._render();
    } finally { this._connecting = false; }
  }

  _applyColors() {
    for (const [name, def] of Object.entries(COLOR_CONFIG_KEYS)) {
      const v = sanitizeColor(this._config[`color_${name}`]);
      if (v) this.style.setProperty(def.cssVar, v); else this.style.removeProperty(def.cssVar);
    }
    for (const [tab, key] of Object.entries(CATEGORY_ICON_COLOR_KEYS)) {
      const v = sanitizeColor(this._config[key]);
      if (v) this.style.setProperty(`--plm-icon-${tab}`, v); else this.style.removeProperty(`--plm-icon-${tab}`);
    }
  }

  _t(key, vars) { return tr(this._lang || "en", key, vars); }

  /* ---------- Formatierung ---------- */
  _n(v, d = 1) {
    return new Intl.NumberFormat(this._lang && this._lang.startsWith("sr") ? "en" : (this._lang || "en"),
      { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(v);
  }
  _fmt(o, unit) {
    const v = typeof o === "number" ? o : num(o);
    if (v === null) return "–";
    const u = unit ?? (o && o.u) ?? "";
    if (u === "W") return Math.abs(v) >= 1000 ? `${this._n(v / 1000, 2)} kW` : `${this._n(v, 0)} W`;
    if (u === "kWh") return Math.abs(v) >= 1000 ? `${this._n(v, 0)} kWh` : `${this._n(v, 1)} kWh`;
    if (u === "%") return `${this._n(v, 1)} %`;
    return `${this._n(v, 2)}${u ? " " + u : ""}`;
  }

  /* ---------- Sichtbarkeit ---------- */
  _expOn(feature) {
    const e = this._snap && this._snap.experimental;
    return !!(this._config.show_experimental && e && e.enabled && e.features && e.features[feature] && e.features[feature].enabled);
  }
  _visibleTabs() {
    let tabs = TAB_ORDER.filter((k) => this._config[`show_${k}`] !== false);
    tabs = tabs.filter((k) => !TAB_META[k].experimental || this._expOn(TAB_META[k].experimental));
    if (!tabs.length) tabs = ["overview"];
    return tabs;
  }
  _currentTab(tabs) {
    if (this._tab && tabs.includes(this._tab)) return this._tab;
    return tabs.includes(this._config.default_tab) ? this._config.default_tab : tabs[0];
  }

  /* ---------- Rendern ---------- */
  _render() {
    if (!this.shadowRoot) return;
    const tabs = this._visibleTabs();
    const tab = this._currentTab(tabs);
    const sig = JSON.stringify([this._snap, this._err, tab, this._popup, this._confirm, this._period, this._lang, this._toast, this._events.length, this._config, this._hist, this._histMetric]);
    if (sig === this._sig) return;
    this._sig = sig;
    const keep = this._captureUi();
    const s = this._snap;
    let body = "";
    if (this._err) body = `<div class="banner error">${esc(this._t(this._err))}</div>`;
    else if (!s) body = `<div class="hint">${esc(this._t("loading"))}</div>`;
    else body = this._renderBody(tab);
    const upd = s && s.app && (s.app.update_available || s.version !== CARD_VERSION);
    const tabsHtml = tabs.length > 1 ? `<div class="tabs" role="tablist">${tabs.map((k) => {
      const m = TAB_META[k];
      const badge = k === "settings" && upd ? `<span class="badge">↑</span>` : "";
      return `<button class="tab ${k === tab ? "active" : ""}" data-tab="${k}" title="${esc(this._t(m.label))}" style="${this._config[CATEGORY_ICON_COLOR_KEYS[k]] ? "" : ""}--plm-icon:var(--plm-icon-${k}, var(--plm-color-row-icon, var(--secondary-text-color)))"><ha-icon icon="${m.icon}"></ha-icon><span class="lbl">${esc(this._t(m.label))}</span>${badge}</button>`;
    }).join("")}</div>` : "";
    const title = this._config.show_title !== false && this._config.title ? `<div class="title"><img src="${ICON_URL}" alt="">${esc(this._config.title)}</div>` : "";
    const zoom = Math.min(150, Math.max(50, Number(this._config.zoom) || 100));
    const zs = zoom !== 100 ? `style="transform:scale(${zoom / 100});width:${10000 / zoom}%"` : "";
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><ha-card><div class="zoomwrap" ${zs}>${title}${tabsHtml}<div class="content">${body}</div></div></ha-card>${this._popupHtml()}${this._toast ? `<div class="toast ${this._toast.error ? "error" : ""}">${esc(this._toast.text)}</div>` : ""}`;
    this._bind();
    this._fitTabs();
    this._restoreUi(keep);
  }

  _captureUi() {
    const root = this.shadowRoot;
    const out = { scroll: {}, focus: null };
    root.querySelectorAll("[data-scroll]").forEach((el) => { out.scroll[el.dataset.scroll] = el.scrollTop; });
    const a = root.activeElement;
    if (a && a.dataset && a.dataset.fk) out.focus = { fk: a.dataset.fk, start: a.selectionStart, end: a.selectionEnd };
    return out;
  }
  _restoreUi(k) {
    const root = this.shadowRoot;
    for (const [key, top] of Object.entries(k.scroll)) { const el = root.querySelector(`[data-scroll="${key}"]`); if (el) el.scrollTop = top; }
    if (k.focus) {
      const el = root.querySelector(`[data-fk="${k.focus.fk}"]`);
      if (el) { el.focus(); try { el.setSelectionRange(k.focus.start, k.focus.end); } catch (e) { /* kein Textfeld */ } }
    }
  }

  _renderBody(tab) {
    const s = this._snap;
    const fn = { overview: "_tabOverview", strings: "_tabStrings", battery: "_tabBattery", stats: "_tabStats", ksem: "_tabKsem", settings: "_tabSettings" }[tab];
    const notice = tab !== "settings" && s.found === 0 ? `<div class="banner warning">${esc(this._t("no_data"))}</div>` : "";
    return notice + this[fn]();
  }

  /* ---------- Hilfen ---------- */
  _acd(k, icon, title, meta, inner, open, cls = "") {
    const isOpen = this._acc[k] !== undefined ? this._acc[k] : !!open;
    return `<details class="settings-accordion ${cls}" data-k="${esc(k)}" ${isOpen ? "open" : ""}><summary class="settings-accordion-summary"><ha-icon icon="${esc(icon)}"></ha-icon><span class="grow">${esc(title)}</span>${meta ? `<span class="meta">${meta}</span>` : ""}</summary><div class="settings-accordion-body">${inner}</div></details>`;
  }
  _line(l, r) { return `<div class="settings-line"><span class="l">${esc(l)}</span><span class="r">${r}</span></div>`; }
  _expBadge() { return `<span class="exp-badge" title="${esc(this._t("experimental_hint"))}">${esc(this._t("experimental"))}</span>`; }
  _tile(k, v, color) { return `<div class="tile"${color ? ` style="--c:${color}"` : ""}><div class="k">${esc(k)}</div><div class="v">${v}</div></div>`; }
  _col(name) { const d = COLOR_CONFIG_KEYS[name]; return `var(${d.cssVar}, ${d.fallback})`; }

  /* ---------- Übersicht ---------- */
  _tabOverview() {
    const s = this._snap, v = s.values || {};
    const solar = s.derived.solar_power_strings ?? num(v.solar_power);
    const grid = num(v.grid_power), bat = num(v.battery_power), home = num(v.home_power), soc = num(v.battery_soc);
    const nodes = [];
    const cSolar = this._col("solar"), cBat = this._col("battery"), cGrid = this._col("grid"), cHome = this._col("home");
    const node = (x, y, icon, c, val, sub) => `<div class="node" style="left:${x}%;top:${y}%;--c:${c}"><div class="circle"><ha-icon icon="${icon}"></ha-icon><span class="val">${val}</span></div><span class="sub">${esc(sub)}</span></div>`;
    const lines = [];
    const flow = (x1, y1, x2, y2, active, c) => {
      lines.push(`<line class="line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
      if (active) lines.push(`<line class="live" style="--c:${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
    };
    if (home !== null || solar !== null || grid !== null || bat !== null) {
      nodes.push(node(50, 68, "mdi:home", cHome, home !== null ? this._fmt(home, "W") : "–", this._t("home")));
    }
    if (solar !== null) {
      nodes.push(node(50, 17, "mdi:solar-power-variant", cSolar, this._fmt(solar, "W"), this._t("solar")));
      flow(50, 32, 50, 53, solar > 5, cSolar);
    }
    if (grid !== null) {
      nodes.push(node(12, 68, "mdi:transmission-tower", cGrid, this._fmt(Math.abs(grid), "W"), grid > 5 ? this._t("grid_import") : grid < -5 ? this._t("grid_export") : this._t("grid")));
      grid > 5 ? flow(22, 68, 41, 68, true, cGrid) : grid < -5 ? flow(41, 68, 22, 68, true, cGrid) : flow(22, 68, 41, 68, false, cGrid);
    }
    if (bat !== null) {
      const sub = soc !== null ? `${this._n(soc, 0)} % · ${bat > 5 ? this._t("discharging") : bat < -5 ? this._t("charging") : this._t("idle")}` : this._t("battery");
      nodes.push(node(88, 68, soc !== null && soc < 20 ? "mdi:battery-20" : "mdi:battery-70", cBat, this._fmt(Math.abs(bat), "W"), sub));
      bat > 5 ? flow(79, 68, 59, 68, true, cBat) : bat < -5 ? flow(59, 68, 79, 68, true, cBat) : flow(59, 68, 79, 68, false, cBat);
    }
    const diagram = nodes.length ? `<div class="flow"><svg viewBox="0 0 100 100" preserveAspectRatio="none">${lines.join("")}</svg>${nodes.join("")}</div>` : "";
    // Hausverbrauch aus
    const hp = num(v.home_power_from_pv), hb = num(v.home_power_from_battery), hg = num(v.home_power_from_grid);
    const parts = [[this._t("from_pv"), hp, cSolar], [this._t("from_battery"), hb, cBat], [this._t("from_grid"), hg, cGrid]].filter((p) => p[1] !== null && p[1] > 0);
    const total = parts.reduce((a, p) => a + p[1], 0);
    const stack = total > 0 ? `<div class="card2"><h4>${esc(this._t("home_from"))}</h4><div class="stack">${parts.map((p) => `<i style="--c:${p[2]};width:${(p[1] / total) * 100}%"></i>`).join("")}</div><div class="legend">${parts.map((p) => `<span style="--c:${p[2]}">${esc(p[0])} ${esc(this._fmt(p[1], "W"))}</span>`).join("")}</div></div>` : "";
    const tiles = [];
    const ac = num(v.ac_power); if (ac !== null) tiles.push(this._tile(this._t("ac_power"), this._fmt(ac, "W")));
    const au = num(v.autarky_day); if (au !== null) tiles.push(this._tile(`${this._t("autarky")} · ${this._t("p_day")}`, this._fmt(au, "%")));
    const oc = num(v.own_consumption_rate_day); if (oc !== null) tiles.push(this._tile(`${this._t("own_rate")} · ${this._t("p_day")}`, this._fmt(oc, "%")));
    const st = v.inverter_state; if (st && st.ok) tiles.push(this._tile(this._t("inverter_state"), esc(st.v)));
    const em = v.energy_manager_state; if (em && em.ok) tiles.push(this._tile(this._t("em_state"), esc(em.v)));
    const er = v.active_errors; if (er && er.ok && Number(er.v) > 0) tiles.push(this._tile(this._t("errors"), `<span class="err">${esc(er.v)}</span>`));
    return `${diagram}${stack}<div class="tiles">${tiles.join("")}</div>`;
  }

  /* ---------- Strings ---------- */
  _tabStrings() {
    const s = this._snap;
    const rows = [];
    const sum = s.derived.solar_power_strings;
    for (const st of s.strings) {
      const has = st.present && [st.power, st.voltage, st.current].some((o) => num(o) !== null);
      if (!has) continue;
      const bat = st.role === "battery";
      const dim = !bat && !st.selected;
      const color = bat ? this._col("battery") : this._col("solar");
      const sub = [num(st.voltage) !== null ? this._fmt(st.voltage, "V") : "", num(st.current) !== null ? this._fmt(st.current, "A") : ""].filter(Boolean).join(" · ");
      rows.push(`<div class="row ${dim ? "dim" : ""}" data-pop="string:${st.n}" role="button" tabindex="0"><div class="ico" style="--c:${color}"><ha-icon icon="${bat ? "mdi:battery-charging" : "mdi:solar-panel-large"}"></ha-icon><span class="dot" style="--c:${num(st.power) > 0 ? color : "var(--divider-color)"}"></span></div><div class="main"><div class="name">${esc(this._t("string_n", { n: st.n }))}${bat ? `<span class="pill" style="--c:${color}">${esc(this._t("string_battery"))}</span>` : ""}${dim ? `<span class="pill">${esc(this._t("string_not_selected"))}</span>` : ""}</div><div class="sub">${esc(sub)}</div></div><span class="pill" style="--c:${color}">${esc(num(st.power) !== null ? this._fmt(st.power, "W") : this._t("no_value"))}</span></div>`);
    }
    if (!rows.length) return `<div class="hint">${esc(this._t("no_data"))}</div>${this._enableBtn()}`;
    const head = sum !== null && sum !== undefined ? `<div class="tiles">${this._tile(this._t("string_sum"), this._fmt(sum, "W"), this._col("solar"))}</div>` : "";
    return `${head}${rows.join("")}<div class="hint">${esc(this._t("strings_change"))}</div>`;
  }

  /* ---------- Batterie ---------- */
  _tabBattery() {
    const s = this._snap, v = s.values;
    const soc = num(v.battery_soc), pw = num(v.battery_power), cyc = num(v.battery_cycles);
    const cBat = this._col("battery");
    const tiles = [];
    if (soc !== null) tiles.push(`<div class="tile" style="--c:${soc < 15 ? this._col("error") : soc < 30 ? this._col("warning") : cBat}"><div class="k">${esc(this._t("soc"))}</div><div class="v">${esc(this._fmt(soc, "%"))}</div><div class="bar"><i style="width:${Math.min(100, Math.max(0, soc))}%"></i></div></div>`);
    if (pw !== null) tiles.push(this._tile(this._t("bat_power"), `${esc(this._fmt(Math.abs(pw), "W"))} <span class="meta">${esc(pw > 5 ? this._t("discharging") : pw < -5 ? this._t("charging") : this._t("idle"))}</span>`, cBat));
    if (cyc !== null) tiles.push(this._tile(this._t("cycles"), esc(this._n(cyc, 0))));
    let out = tiles.length ? `<div class="tiles">${tiles.join("")}</div>` : `<div class="hint">${esc(this._t("no_data"))}</div>`;
    return out;
  }

  /* ---------- Statistik ---------- */
  _donut(parts, centerText, centerSub) {
    const total = parts.reduce((a, p) => a + p.v, 0);
    if (total <= 0) return "";
    const R = 42, C = 2 * Math.PI * R;
    let off = 0;
    const segs = parts.map((p) => {
      const len = (p.v / total) * C;
      const seg = `<circle cx="60" cy="60" r="${R}" fill="none" stroke="${p.c}" stroke-width="16" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 60 60)"/>`;
      off += len; return seg;
    }).join("");
    return `<svg class="donut" viewBox="0 0 120 120" role="img" aria-label="${esc(centerText)}"><circle cx="60" cy="60" r="${R}" fill="none" stroke="var(--divider-color)" stroke-width="16"/>${segs}<text x="60" y="62">${esc(centerText)}</text><text class="s" x="60" y="76">${esc(centerSub)}</text></svg>`;
  }
  _gauge(label, value, color) {
    const R = 36, C = Math.PI * R, v = Math.min(100, Math.max(0, value));
    return `<div class="gauge"><svg viewBox="0 0 100 62"><path d="M14 52 A36 36 0 0 1 86 52" fill="none" stroke="var(--divider-color)" stroke-width="10" stroke-linecap="round"/><path d="M14 52 A36 36 0 0 1 86 52" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${(v / 100) * C} ${C}"/><text x="50" y="50">${esc(this._n(value, 0))} %</text></svg><div class="lbl">${esc(label)}</div></div>`;
  }
  _hbar(label, value, max, color, unit = "kWh") {
    return `<div class="hbar"><span>${esc(label)}</span><div class="bar" style="--c:${color}"><i style="width:${max > 0 ? Math.min(100, (Math.abs(value) / max) * 100) : 0}%"></i></div><b>${esc(this._fmt(value, unit))}</b></div>`;
  }
  _tabStats() {
    const s = this._snap, v = s.values, d = s.derived;
    const p = this._period || "day";
    const seg = `<div class="seg">${["day", "month", "year", "total"].map((k) => `<button data-period="${k}" class="${k === p ? "on" : ""}">${esc(this._t("p_" + k))}</button>`).join("")}</div>`;
    const cS = this._col("solar"), cB = this._col("battery"), cG = this._col("grid"), cH = this._col("home");
    const g = (k) => num(v[`${k}_${p}`]);
    const cards = [];
    // 1 Herkunft
    const fp = g("home_consumption_from_pv"), fb = g("home_consumption_from_battery"), fg = g("home_consumption_from_grid"), hc = g("home_consumption");
    const src = [[this._t("from_pv"), fp, cS], [this._t("from_battery"), fb, cB], [this._t("from_grid"), fg, cG]].filter((x) => x[1] !== null && x[1] > 0);
    if (src.length) {
      const tot = src.reduce((a, x) => a + x[1], 0);
      cards.push(`<div class="card2"><h4><ha-icon icon="mdi:chart-donut"></ha-icon>${esc(this._t("st_source"))}</h4><div class="donutwrap">${this._donut(src.map((x) => ({ v: x[1], c: x[2] })), this._fmt(hc ?? tot, "kWh"), this._t("st_consumption"))}<div class="legend" style="flex-direction:column">${src.map((x) => `<span style="--c:${x[2]}">${esc(x[0])}: <b>${esc(this._fmt(x[1], "kWh"))}</b> (${esc(this._n((x[1] / tot) * 100, 0))} %)</span>`).join("")}</div></div></div>`);
    }
    // 2 Kennzahlen
    const gauges = [];
    const au = g("autarky"), oc = g("own_consumption_rate"), share = d[`pv_share_${p}`];
    if (au !== null) gauges.push(this._gauge(this._t("autarky"), au, cB));
    if (oc !== null) gauges.push(this._gauge(this._t("own_rate"), oc, cS));
    if (share !== null && share !== undefined) gauges.push(this._gauge(this._t("pv_share"), share, cH));
    if (gauges.length) cards.push(`<div class="card2"><h4><ha-icon icon="mdi:speedometer"></ha-icon>${esc(this._t("st_ratios"))}</h4><div class="gauges">${gauges.join("")}</div></div>`);
    // 3 Energiebilanz
    const solar = d[`solar_energy_${p}`], feed = g("energy_to_grid"), bal = d[`grid_balance_${p}`];
    const eb = [[this._t("st_solar"), solar, cS], [this._t("st_consumption"), hc, cH], [this._t("st_import"), fg, cG], [this._t("st_feedin"), feed, cG]].filter((x) => x[1] !== null && x[1] !== undefined);
    if (eb.length) {
      const mx = Math.max(...eb.map((x) => x[1]));
      cards.push(`<div class="card2"><h4><ha-icon icon="mdi:scale-balance"></ha-icon>${esc(this._t("st_energy"))}</h4>${eb.map((x) => this._hbar(x[0], x[1], mx, x[2])).join("")}${bal !== null && bal !== undefined ? this._line(this._t("st_balance"), `<span class="${bal >= 0 ? "ok" : "warn"}">${esc((bal > 0 ? "+" : "") + this._fmt(bal, "kWh"))}</span>`) : ""}</div>`);
    }
    // 4 je String
    const per = s.strings.filter((x) => x.role === "pv" && x.selected && num(x[p]) !== null);
    if (per.length) {
      const mx = Math.max(...per.map((x) => num(x[p])));
      cards.push(`<div class="card2"><h4><ha-icon icon="mdi:solar-panel-large"></ha-icon>${esc(this._t("st_strings"))}</h4>${per.map((x) => this._hbar(this._t("string_n", { n: x.n }), num(x[p]), mx, cS)).join("")}</div>`);
    }
    // 5 Batterie
    const cpv = g("battery_charge_from_pv"), cgr = g("battery_charge_from_grid"), dis = g("battery_discharge");
    const bb = [[this._t("st_chg_pv"), cpv, cS], [this._t("st_chg_grid"), cgr, cG], [this._t("st_discharge"), dis, cB]].filter((x) => x[1] !== null);
    const eff = this._expOn("efficiency") ? d.battery_efficiency_estimated : null;
    if (bb.length || (eff !== null && eff !== undefined)) {
      const mx = Math.max(...bb.map((x) => x[1]), 0);
      cards.push(`<div class="card2"><h4><ha-icon icon="mdi:battery-charging"></ha-icon>${esc(this._t("st_battery"))}</h4>${bb.map((x) => this._hbar(x[0], x[1], mx, x[2])).join("")}${eff !== null && eff !== undefined ? `<div class="section-title" style="margin-top:8px">${esc(this._t("st_efficiency"))}${this._expBadge()}</div><div class="settings-line"><span class="l">${esc(this._t("st_efficiency_hint"))}</span><span class="r">${esc(this._fmt(eff, "%"))}</span></div>` : ""}</div>`);
    }
    const chart = this._expOn("history7") ? this._histChart() : "";
    return `${seg}${cards.length ? cards.join("") : `<div class="hint">${esc(this._t("no_data"))}</div>${this._enableBtn()}`}${chart}`;
  }

  /* ---------- 7-Tage-Diagramm (experimentell) ---------- */
  _histFetch() {
    const src = this._snap && this._snap.history;
    const ids = src ? Object.values(src) : [];
    if (!ids.length || !this._hass || typeof this._hass.callWS !== "function") return;
    const key = ids.join(",");
    const h = this._hist;
    if (h && h.key === key && (h.loading || Date.now() - h.ts < 300000)) return;
    const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 6);
    this._hist = { key, loading: true, ts: Date.now(), data: h && h.key === key ? h.data : null, error: false };
    this._hass.callWS({ type: "recorder/statistics_during_period", start_time: start.toISOString(), statistic_ids: ids, period: "day", types: ["change"], units: { energy: "kWh" } })
      .then((res) => { this._hist = { key, loading: false, ts: Date.now(), data: this._histBuild(res, src, start), error: false }; this._render(); })
      .catch(() => { this._hist = { key, loading: false, ts: Date.now(), data: null, error: true }; this._render(); });
  }
  _histBuild(res, src, start) {
    const days = [];
    for (let i = 0; i < 7; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(d.getTime()); }
    const series = {};
    for (const [metric, id] of Object.entries(src)) {
      const perDay = new Map();
      for (const r of (res && res[id]) || []) {
        const d = new Date(r.start); d.setHours(0, 0, 0, 0);
        if (typeof r.change === "number" && Number.isFinite(r.change)) perDay.set(d.getTime(), r.change);
      }
      series[metric] = days.map((t) => (perDay.has(t) ? perDay.get(t) : null));
    }
    return { days, series };
  }
  _histChart() {
    const src = this._snap.history, h = this._hist;
    const head = `<div class="section-title"><ha-icon icon="mdi:chart-bar"></ha-icon>${esc(this._t("h7_title"))}${this._expBadge()}</div>`;
    const order = ["solar", "home", "grid_in", "grid_out", "ksem_in", "ksem_out"];
    const avail = order.filter((m) => src && src[m]);
    if (!avail.length) return `${head}<div class="hint">${esc(this._t("h7_none"))}</div>`;
    this._histFetch();
    const metric = avail.includes(this._histMetric) ? this._histMetric : avail[0];
    const chips = avail.length > 1 ? `<div class="seg wrap">${avail.map((m) => `<button data-hmetric="${m}" class="${m === metric ? "on" : ""}">${esc(this._t("h7_" + m))}</button>`).join("")}</div>` : "";
    const cur = this._hist;
    if (!cur || (cur.loading && !cur.data)) return `${head}${chips}<div class="hint">${esc(this._t("h7_loading"))}</div>`;
    if (cur.error || !cur.data) return `${head}${chips}<div class="hint">${esc(this._t("h7_error"))}</div>`;
    const vals = cur.data.series[metric] || [];
    const real = vals.filter((v) => v !== null);
    if (!real.length) return `${head}${chips}<div class="hint">${esc(this._t("h7_empty"))}</div>`;
    const mx = Math.max(...real, 0.001);
    const col = { solar: this._col("solar"), home: this._col("home"), grid_in: this._col("grid"), grid_out: this._col("success"), ksem_in: this._col("grid"), ksem_out: this._col("success") }[metric];
    let dayFmt;
    try { dayFmt = new Intl.DateTimeFormat(this._lang && this._lang.startsWith("sr") ? "en" : (this._lang || "en"), { weekday: "short" }); } catch (e) { dayFmt = new Intl.DateTimeFormat("en", { weekday: "short" }); }
    const bars = vals.map((v, i) => {
      const wd = dayFmt.format(new Date(cur.data.days[i]));
      const pct = v === null ? 0 : Math.max(2, (v / mx) * 100);
      const label = v === null ? "–" : this._n(v, Math.abs(v) >= 100 ? 0 : 1);
      return `<div class="h7col ${i === 6 ? "today" : ""}" title="${esc(wd)}: ${esc(v === null ? "–" : this._fmt(v, "kWh"))}"><div class="h7val">${esc(label)}</div><div class="h7bar">${v === null ? "" : `<i style="height:${pct}%;--c:${col}"></i>`}</div><div class="h7day">${esc(wd)}</div></div>`;
    }).join("");
    const sum = real.reduce((a, b) => a + b, 0);
    return `${head}${chips}<div class="card2"><div class="h7">${bars}</div>${this._line(this._t("h7_sum"), esc(this._fmt(sum, "kWh")))}${this._line(this._t("h7_avg"), esc(this._fmt(sum / real.length, "kWh")))}</div>`;
  }

  /* ---------- KSEM (experimentell) ---------- */
  _tabKsem() {
    const k = this._snap.ksem;
    const head = `<div class="section-title"><ha-icon icon="mdi:meter-electric"></ha-icon>${esc(this._t("ksem_title"))}</div>`;
    if (!k || !k.configured) return `${head}<div class="hint">${esc(this._t("ksem_need_host"))}</div>`;
    if (k.error && !k.available) return `${head}<div class="banner error">${esc(this._t("ksem_error"))}: ${esc(k.error)}</div>`;
    const val = k.values || {};
    if (!k.available || !Object.keys(val).length) return `${head}<div class="hint">${esc(this._t("ksem_wait"))}</div>`;
    const tiles = [];
    if (val.power !== undefined) tiles.push(this._tile(this._t("ksem_power"), `${esc(this._fmt(Math.abs(val.power), "W"))} <span class="meta">${esc(val.power > 5 ? this._t("grid_import") : val.power < -5 ? this._t("grid_export") : "")}</span>`, this._col("grid")));
    if (val.frequency !== undefined) tiles.push(this._tile(this._t("ksem_freq"), esc(`${this._n(val.frequency, 3)} Hz`)));
    const phases = [1, 2, 3].filter((n) => ["voltage", "current", "power"].some((x) => val[`${x}_l${n}`] !== undefined)).map((n) => {
      const l = [];
      if (val[`power_l${n}`] !== undefined) l.push(this._line(this._t("power"), esc(this._fmt(val[`power_l${n}`], "W"))));
      if (val[`voltage_l${n}`] !== undefined) l.push(this._line(this._t("voltage"), esc(this._fmt(val[`voltage_l${n}`], "V"))));
      if (val[`current_l${n}`] !== undefined) l.push(this._line(this._t("current"), esc(this._fmt(val[`current_l${n}`], "A"))));
      return `<div class="card2"><h4>${esc(this._t("ksem_phase", { n }))}</h4>${l.join("")}</div>`;
    });
    const cnt = [];
    if (val.energy_import !== undefined) cnt.push(this._line(this._t("ksem_import"), esc(this._fmt(val.energy_import, "kWh"))));
    if (val.energy_export !== undefined) cnt.push(this._line(this._t("ksem_export"), esc(this._fmt(val.energy_export, "kWh"))));
    return `${head}<div class="tiles">${tiles.join("")}</div>${phases.join("")}${cnt.length ? `<div class="card2">${cnt.join("")}</div>` : ""}`;
  }

  /* ---------- Einstellungen ---------- */
  _enableBtn() {
    const s = this._snap;
    if (this._config.read_only || !s || !s.disabled || !s.disabled.length) return "";
    const armed = this._confirm === "enable";
    return `<button class="btn ${armed ? "danger" : "primary"}" data-act="enable_sensors">${esc(armed ? this._t("enable_confirm") : `${this._t("enable_sensors")} (${s.disabled.length})`)}</button>`;
  }
  _tabSettings() {
    const s = this._snap, app = s.app || {};
    const upd = app.update_available, mismatch = s.version !== CARD_VERSION;
    const rel = app.release_url && String(app.release_url).startsWith("https://github.com/") ? app.release_url : RELEASES_URL;
    let status = `<span class="ok">${esc(this._t("up_to_date"))}</span>`;
    if (app.check_failed) status = `<span class="err">${esc(this._t("check_failed"))}</span>`;
    else if (upd) status = `<span class="warn">${esc(this._t("update_available"))}</span>`;
    const checked = app.checked_at ? new Date(app.checked_at).toLocaleString(this._lang) : this._t("never");
    const ver = this._line(this._t("integration"), esc(s.version)) + this._line(this._t("card"), esc(CARD_VERSION)) + this._line(this._t("latest"), esc(app.latest || "–")) + this._line(this._t("checked"), esc(checked)) +
      (upd ? `<div class="hint warn">${esc(this._t("update_hint"))}</div>` : "") + (mismatch ? `<div class="hint warn">${esc(this._t("mismatch_hint"))}</div>` : "") +
      `<div>${this._config.read_only ? "" : `<button class="btn" data-act="refresh">${esc(this._t("check_now"))}</button>`}<a class="btn" style="text-decoration:none;display:inline-block" href="${esc(rel)}" target="_blank" rel="noopener noreferrer">${esc(this._t("view_release"))}</a></div>`;
    const out = [this._acd("version", "mdi:information-outline", this._t("app_version"), status, ver, true, upd || mismatch ? "update" : "")];
    // Verbindung
    const conn = this._line(this._t("found"), esc(s.found)) + this._line(this._t("disabled_n"), esc(s.disabled.length)) +
      this._line(this._t("tab_strings"), esc(s.config.strings.map((n) => this._t("string_n", { n })).join(", "))) + this._line(this._t("string_battery"), esc(s.config.battery_input ? this._t("string_n", { n: s.config.battery_input }) : "–")) + this._enableBtn();
    out.push(this._acd("conn", "mdi:lan-connect", this._t("connection"), "", conn, true));
    // Anlageneinstellungen
    const keys = Object.keys(s.settings || {});
    let ps = `<div class="hint">${esc(this._t("plant_hint"))}</div>`;
    if (!keys.length) ps += `<div class="hint">${esc(this._t("settings_none"))}</div>`;
    for (const key of keys) {
      const it = s.settings[key];
      const label = this._t(key);
      if (it.domain === "number") {
        ps += `<div class="settings-line"><span class="l">${esc(label)}</span><span class="r">${this._config.read_only ? esc(`${it.value ?? "–"} ${it.unit || ""}`) : `<input class="inp" type="number" data-fk="num:${esc(key)}" data-num="${esc(key)}" value="${esc(it.value ?? "")}" min="${esc(it.min ?? "")}" max="${esc(it.max ?? "")}" step="${esc(it.step ?? 1)}"> ${esc(it.unit || "")} <button class="btn small" data-save="${esc(key)}">${esc(this._t("save"))}</button>`}</span></div>`;
      } else {
        ps += `<div class="settings-line"><span class="l">${esc(label)}</span><span class="r">${this._config.read_only ? esc(it.value ? this._t("yes") : this._t("no")) : `<button class="btn small ${it.value ? "primary" : ""}" data-switch="${esc(key)}">${esc(it.value ? this._t("yes") : this._t("no"))}</button>`}</span></div>`;
      }
    }
    out.push(this._acd("plant", "mdi:tune", this._t("plant_settings"), keys.length ? String(keys.length) : "", ps, false));
    // Experimentell (nur sichtbar, wenn in der Karte eingeschaltet)
    const ex = s.experimental;
    if (this._config.show_experimental) {
      let inner = "";
      if (!ex.enabled) inner = `<div class="hint">${esc(this._t("exp_off_hint"))}</div>`;
      else for (const [key, f] of Object.entries(ex.features)) inner += this._line(this._t(EXPERIMENTAL[key] ? EXPERIMENTAL[key].label : key), f.enabled ? `<span class="ok">✓</span>` : `<span class="meta">–</span>`);
      out.push(this._acd("exp", "mdi:flask-outline", this._t("experimental_group"), String(ex.count), inner, false));
    }
    // Ereignisse
    out.push(this._acd("events", "mdi:history", this._t("events"), String(this._events.length), this._events.length ? this._events.map((e) => this._line(e.t, esc(e.text))).join("") : `<div class="hint">${esc(this._t("events_none"))}</div>`, false));
    return out.join("");
  }

  /* ---------- Popup ---------- */
  _popupHtml() {
    if (!this._popup || !this._snap) return "";
    const [kind, id] = this._popup.split(":");
    if (kind !== "string") return "";
    const st = this._snap.strings.find((x) => x.n === Number(id));
    if (!st) return "";
    const bat = st.role === "battery";
    const info = this._line(this._t("role"), esc(bat ? this._t("string_battery") : this._t("role_pv"))) +
      (!bat ? this._line(this._t("selected"), esc(st.selected ? this._t("yes") : this._t("no"))) : "") +
      this._line(this._t("power"), esc(this._fmt(st.power))) + this._line(this._t("voltage"), esc(this._fmt(st.voltage))) + this._line(this._t("current"), esc(this._fmt(st.current))) +
      (bat ? `<div class="hint">${esc(this._t("string_battery_hint"))}</div>` : "");
    const en = ["day", "month", "year", "total"].map((p) => num(st[p]) !== null ? this._line(this._t("p_" + p), esc(this._fmt(st[p]))) : "").join("");
    return `<div class="backdrop" data-close="1"><div class="popup" role="dialog" aria-modal="true" data-scroll="popup"><div class="head"><ha-icon icon="${bat ? "mdi:battery-charging" : "mdi:solar-panel-large"}"></ha-icon><span class="t">${esc(this._t("string_n", { n: st.n }))}</span><button class="btn small" data-close-btn="1" aria-label="${esc(this._t("close"))}">✕</button></div>${this._acd("p-info", "mdi:information-outline", this._t("info"), "", info, true)}${en ? this._acd("p-energy", "mdi:lightning-bolt", this._t("energy"), "", en, !bat) : ""}</div></div>`;
  }

  /* ---------- Ereignisse ---------- */
  _bind() {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-tab]").forEach((el) => el.addEventListener("click", () => { this._tab = el.dataset.tab; this._confirm = null; this._render(); }));
    root.querySelectorAll("[data-hmetric]").forEach((el) => el.addEventListener("click", () => { this._histMetric = el.dataset.hmetric; this._render(); }));
    root.querySelectorAll("[data-period]").forEach((el) => el.addEventListener("click", () => { this._period = el.dataset.period; this._render(); }));
    root.querySelectorAll("details[data-k]").forEach((el) => el.addEventListener("toggle", () => { this._acc[el.dataset.k] = el.open; }));
    root.querySelectorAll("[data-pop]").forEach((el) => {
      el.addEventListener("click", () => { this._popup = el.dataset.pop; this._render(); });
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._popup = el.dataset.pop; this._render(); } });
    });
    const bd = root.querySelector(".backdrop");
    if (bd) {
      bd.addEventListener("click", (e) => { if (e.target === bd) { this._popup = null; this._render(); } });
      root.querySelector("[data-close-btn]").addEventListener("click", () => { this._popup = null; this._render(); });
      if (!this._escBound) {
        this._escBound = (e) => { if (e.key === "Escape" && this._popup) { this._popup = null; this._render(); } };
        window.addEventListener("keydown", this._escBound);
      }
    }
    root.querySelectorAll("[data-act]").forEach((el) => el.addEventListener("click", () => this._act(el.dataset.act)));
    root.querySelectorAll("[data-save]").forEach((el) => el.addEventListener("click", () => {
      const key = el.dataset.save, inp = root.querySelector(`[data-num="${key}"]`);
      this._call("set_number", { setting: key, value: Number(inp.value) });
    }));
    root.querySelectorAll("[data-switch]").forEach((el) => el.addEventListener("click", () => {
      const key = el.dataset.switch, it = this._snap.settings[key];
      this._call("set_switch", { setting: key, value: !it.value });
    }));
  }

  _act(name) {
    if (name === "enable_sensors") {
      if (this._confirm !== "enable") { this._confirm = "enable"; this._render(); return; }
      this._confirm = null;
    }
    this._call(name, {});
  }

  async _call(action, extra) {
    if (this._config.read_only) return;
    const msg = { type: `${WS}/action`, action, ...extra };
    if (this._config.entry_id) msg.entry_id = this._config.entry_id;
    try {
      const res = await this._hass.callWS(msg);
      const text = action === "enable_sensors" ? this._t("enabled_n", { n: res && res.enabled != null ? res.enabled : 0 }) : this._t("saved");
      this._notify(text, false);
    } catch (e) {
      this._notify(e && e.code === "unauthorized" ? this._t("admin_only") : `${this._t("failed")}${e && e.message ? ": " + e.message : ""}`, true);
    }
  }
  _notify(text, error) {
    this._events.unshift({ t: new Date().toLocaleTimeString(this._lang), text });
    this._events = this._events.slice(0, 30);
    this._toast = { text, error };
    this._render();
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { this._toast = null; this._render(); }, 5000);
  }
}

/* ---------- Editor ---------- */
class PlenticoreManagerCardEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); this._config = { ...DEFAULTS }; this._snap = null; this._unsub = null; }
  setConfig(c) { this._config = { ...DEFAULTS, ...c }; this._render(); }
  set hass(h) { const f = !this._hass; this._hass = h; if (f) { this._sub(); this._render(); } else if (this._form) this._form.hass = h; }
  disconnectedCallback() { if (this._unsub) { try { this._unsub(); } catch (e) { /* ignorieren */ } this._unsub = null; } }
  async _sub() {
    try {
      this._unsub = await this._hass.connection.subscribeMessage((ev) => {
        if (ev && ev.event === "snapshot") { this._snap = ev.data; this._renderInfo(); }
      }, { type: `${WS}/subscribe` });
    } catch (e) { /* Info bleibt leer */ }
  }
  _schema() {
    const bool = (name) => ({ name, selector: { boolean: {} } });
    const groups = [
      { name: "", type: "expandable", title: "Kategorien", expanded: true, flatten: true, schema: [
        ...TAB_ORDER.map((k) => bool(`show_${k}`)),
        { name: "default_tab", selector: { select: { mode: "dropdown", options: TAB_ORDER.map((k) => ({ value: k, label: I18N.de[TAB_META[k].label] })) } } },
      ] },
      { name: "", type: "expandable", title: "Darstellung", flatten: true, schema: [
        { name: "title", selector: { text: {} } }, bool("show_title"),
        { name: "stats_period", selector: { select: { mode: "dropdown", options: ["day", "month", "year", "total"].map((p) => ({ value: p, label: I18N.de["p_" + p] })) } } },
        { name: "zoom", selector: { number: { min: 50, max: 150, step: 5, mode: "box", unit_of_measurement: "%" } } },
      ] },
      { name: "", type: "expandable", title: "Bearbeiten", flatten: true, schema: [bool("read_only")] },
      { name: "", type: "expandable", title: "Experimentell", flatten: true, schema: [bool("show_experimental")] },
    ];
    return groups;
  }
  _label(s) {
    const L = {
      title: "Titel", show_title: "Titel anzeigen", default_tab: "Starttab", zoom: "Zoom", read_only: "Nur Lesen (keine Bedienelemente)",
      stats_period: "Standardzeitraum der Statistik", show_experimental: "Experimentelle Funktionen anzeigen (ungeprüft)",
    };
    if (s.name.startsWith("show_") && TAB_META[s.name.slice(5)]) return `Kategorie „${I18N.de[TAB_META[s.name.slice(5)].label]}“ anzeigen`;
    return L[s.name] || s.name;
  }
  _render() {
    if (!this._hass) return;
    if (!this._form) {
      this.shadowRoot.innerHTML = `<style>
        .info { padding:8px 10px; border:1px solid var(--divider-color); border-radius:8px; margin-bottom:12px; font-size:.9em; }
        .info.warn { border-color:var(--warning-color,#ff9800); }
        details.colors { border:1px solid var(--divider-color); border-radius:8px; margin-top:12px; padding:8px 12px; }
        details.colors summary { cursor:pointer; font-weight:500; }
        .crow { display:flex; align-items:center; gap:8px; margin:6px 0; }
        .crow span { flex:1; } .crow input[type=text] { width:150px; } .crow button { margin-top:8px; }
      </style><div class="info" id="info"></div><div id="formwrap"></div><div id="colors"></div>`;
      this._form = document.createElement("ha-form");
      this._form.addEventListener("value-changed", (e) => {
        e.stopPropagation();
        const cfg = { ...this._config, ...e.detail.value };
        if (cfg.title === undefined) cfg.title = "";
        this._config = cfg; this._fire(cfg);
      });
      this.shadowRoot.getElementById("formwrap").appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = this._config;
    this._form.schema = this._schema();
    this._form.computeLabel = (s) => this._label(s);
    this._renderInfo();
    this._renderColors();
  }
  _renderInfo() {
    const el = this.shadowRoot && this.shadowRoot.getElementById("info");
    if (!el) return;
    const s = this._snap;
    const lang = normLang(this._hass && this._hass.language);
    const t = (k) => tr(lang, k);
    let text = `${t("card")} ${CARD_VERSION}`;
    let warn = false;
    if (s) {
      text += ` · ${t("integration")} ${s.version}`;
      if (s.app && s.app.update_available) { text += ` · ${t("update_available")}: ${s.app.latest}`; warn = true; }
      else if (s.app && s.app.check_failed) text += ` · ${t("check_failed")}`;
      else text += ` · ${t("up_to_date")}`;
      if (s.version !== CARD_VERSION) { text += ` · ${t("mismatch_hint")}`; warn = true; }
    }
    el.className = `info ${warn ? "warn" : ""}`;
    el.textContent = text;
  }
  _renderColors() {
    const host = this.shadowRoot.getElementById("colors");
    const names = { tab_active: "Aktiver Tab", success: "Erfolg", warning: "Warnung", error: "Fehler", info: "Info", row_icon: "Zeilensymbole", live_banner: "Banner", solar: "Solar", battery: "Batterie", grid: "Netz", home: "Haus" };
    const open = host.querySelector("details") ? host.querySelector("details").open : false;
    const rows = Object.entries(names).map(([k, label]) => `<div class="crow"><span>${label}</span><input type="color" data-ck="color_${k}" value="${/^#[0-9a-f]{6}$/i.test(this._config[`color_${k}`] || "") ? this._config[`color_${k}`] : "#808080"}"><input type="text" data-ck="color_${k}" data-fk="c_${k}" value="${(this._config[`color_${k}`] || "").replace(/"/g, "")}" placeholder="Theme"></div>`).join("");
    host.innerHTML = `<details class="colors" ${open ? "open" : ""}><summary>Farben</summary>${rows}<button data-reset="1">Alle Farben zurücksetzen</button></details>`;
    host.querySelectorAll("input[data-ck]").forEach((el) => el.addEventListener("change", () => {
      const v = sanitizeColor(el.value);
      const cfg = { ...this._config }; if (v) cfg[el.dataset.ck] = v; else delete cfg[el.dataset.ck];
      this._config = cfg; this._fire(cfg); this._renderColors();
    }));
    host.querySelector("[data-reset]").addEventListener("click", () => {
      const cfg = { ...this._config }; for (const k of Object.keys(cfg)) if (k.startsWith("color_")) delete cfg[k];
      this._config = cfg; this._fire(cfg); this._renderColors();
    });
  }
  _fire(cfg) { this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true })); }
}

if (!customElements.get(CARD_TAG)) customElements.define(CARD_TAG, PlenticoreManagerCard);
if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, PlenticoreManagerCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === CARD_TAG)) {
  window.customCards.push({ type: CARD_TAG, name: "Kostal Manager", description: "Kostal Plenticore: Fluss, Strings, Batterie, Statistik", preview: false });
}
console.info(`%c KOSTAL-MANAGER %c ${CARD_VERSION} `, "color:#fff;background:#f5a623;font-weight:700", "color:#f5a623;background:#222");
