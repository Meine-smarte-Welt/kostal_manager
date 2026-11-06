# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): bc5656aed0e95b241eea4218487968c92786b69346ffe2818a3f13d1c147cced
"""Kostal Manager: Karte und abgeleitete Sensoren auf Basis der offiziellen Kostal-Integration."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CARD_FILE, DOMAIN, URL_BASE, VERSION
from .manager import Manager

_LOGGER = logging.getLogger(__name__)
PLATFORMS = ["sensor"]

type PlentiConfigEntry = ConfigEntry[Manager]


async def _register_card(hass: HomeAssistant) -> None:
    """Statischen Pfad und Lovelace-Ressource einmalig eintragen."""
    if hass.data.get(f"{DOMAIN}_card_registered"):
        return
    hass.data[f"{DOMAIN}_card_registered"] = True
    www = Path(__file__).parent / "www"
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, str(www), False)]
        )
    except RuntimeError:
        _LOGGER.debug("Statischer Pfad war bereits registriert")
    url = f"{URL_BASE}/{CARD_FILE}?v={VERSION}"
    try:
        lovelace = hass.data.get("lovelace")
        resources = getattr(lovelace, "resources", None)
        if resources is None or getattr(lovelace, "mode", "storage") != "storage":
            _LOGGER.info("Lovelace im YAML-Modus: Ressource %s bitte manuell eintragen", url)
            return
        await resources.async_load()
        existing = [r for r in resources.async_items() if str(r.get("url", "")).startswith(f"{URL_BASE}/{CARD_FILE}")]
        if existing:
            if existing[0].get("url") != url:
                await resources.async_update_item(existing[0]["id"], {"res_type": "module", "url": url})
        else:
            await resources.async_create_item({"res_type": "module", "url": url})
    except Exception:  # noqa: BLE001 - Ressource ist Komfort, nie Setup-Abbruch
        _LOGGER.warning("Lovelace-Ressource konnte nicht eingetragen werden, bitte manuell: %s", url)


async def async_setup_entry(hass: HomeAssistant, entry: PlentiConfigEntry) -> bool:
    from . import websocket_api

    kostal_id = entry.data.get("kostal_entry_id")
    if not kostal_id or hass.config_entries.async_get_entry(kostal_id) is None:
        _LOGGER.error("Die verknüpfte Kostal-Plenticore-Konfiguration existiert nicht mehr")
        return False
    manager = Manager(hass, entry)
    await manager.async_setup()
    entry.runtime_data = manager
    websocket_api.async_register(hass)
    await _register_card(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_options_updated))
    return True


async def _options_updated(hass: HomeAssistant, entry: PlentiConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: PlentiConfigEntry) -> bool:
    ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if ok:
        await entry.runtime_data.async_shutdown()
    return ok


async def async_remove_config_entry_device(hass, entry, device_entry) -> bool:  # noqa: ANN001
    return True

