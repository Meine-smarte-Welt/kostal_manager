# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): fca108f6a9ac20a8aa39568a1f13080e269305d817d22c66350739e871d91271
"""Konstanten für den Kostal Manager."""
from __future__ import annotations

DOMAIN = "kostal_manager"
VERSION = "1.0.0b2"
GITHUB_REPO = "Meine-smarte-Welt/kostal_manager"  # Vorschlag, vor Veröffentlichung bestätigen
KOSTAL_DOMAIN = "kostal_plenticore"
CARD_FILE = "kostal-manager-card.js"
PANEL_FILE = "kostal-manager-panel.js"
PANEL_URL_PATH = "kostal-manager"
PANEL_ELEMENT = "kostal-manager-panel"
URL_BASE = f"/{DOMAIN}_files"

# Konfiguration (config_entry.data / options)
CONF_KOSTAL_ENTRY = "kostal_entry_id"
CONF_STRINGS = "strings"
CONF_BATTERY_INPUT = "battery_input"
CONF_EXPERIMENTAL = "experimental_enabled"
CONF_EXP_PREFIX = "exp_"
CONF_KSEM_HOST = "ksem_host"
CONF_KSEM_PORT = "ksem_port"
CONF_KSEM_UNIT = "ksem_unit"
CONF_KSEM_INTERVAL = "ksem_interval"

DEFAULT_STRINGS = [1, 2]
DEFAULT_BATTERY_INPUT = 3
DEFAULT_KSEM_PORT = 502
DEFAULT_KSEM_UNIT = 1
DEFAULT_KSEM_INTERVAL = 10
MIN_KSEM_INTERVAL = 5

FLUSH_DELAY = 0.5

# Experimentelle Funktionen (Registry, schlüsselgleich zur Karte)
EXPERIMENTAL_FEATURES: dict[str, dict[str, str]] = {
    "efficiency": {"since": "1.0.0b1", "icon": "mdi:percent-circle"},
    "history7": {"since": "1.0.0b1", "icon": "mdi:chart-bar"},
    "panel": {"since": "1.0.0b1", "icon": "mdi:view-dashboard"},
}

ACTIONS = ("refresh", "enable_sensors", "set_number", "set_switch")

PERIODS = ("day", "month", "year", "total")

# Normalisierter Entitätsname der offiziellen Integration -> interner Schlüssel.
# Normalisiert = klein, alles außer a-z0-9 wird zu "_".
_POWER = {
    "solar_power": "W",
    "grid_power": "W",
    "home_power": "W",
    "home_power_from_pv": "W",
    "home_power_from_battery": "W",
    "home_power_from_grid": "W",
    "ac_power": "W",
    "pv_to_battery_power": "W",
    "battery_power": "W",
    "dc1_power": "W",
    "dc2_power": "W",
    "dc3_power": "W",
    "dc1_voltage": "V",
    "dc2_voltage": "V",
    "dc3_voltage": "V",
    "dc1_current": "A",
    "dc2_current": "A",
    "dc3_current": "A",
    "battery_soc": "%",
    "battery_cycles": "",
    "inverter_state": "",
    "energy_manager_state": "",
    "active_errors": "",
}
_PERIOD_BASE = {
    "autarky": "%",
    "own_consumption_rate": "%",
    "home_consumption": "kWh",
    "home_consumption_from_battery": "kWh",
    "home_consumption_from_grid": "kWh",
    "home_consumption_from_pv": "kWh",
    "energy_pv1": "kWh",
    "energy_pv2": "kWh",
    "energy_pv3": "kWh",
    "energy_yield": "kWh",
    "energy_discharge_to_grid": "kWh",
    "battery_charge_from_grid": "kWh",
    "battery_charge_from_pv": "kWh",
    "battery_discharge": "kWh",
    "energy_to_grid": "kWh",
}
KEY_UNITS: dict[str, str] = dict(_POWER)
for _base, _unit in _PERIOD_BASE.items():
    for _p in PERIODS:
        KEY_UNITS[f"{_base}_{_p}"] = _unit

# Einstellwerte (schreibbar, werden nur alle 5 Minuten aktualisiert)
SETTING_KEYS = {
    "battery_min_soc": "number",
    "battery_min_home_consumption": "number",
    "battery_strategy": "switch",
}
