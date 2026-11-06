# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 07528969628289c73c18dbd7b0bee68e84210b34e7f7e76eba5886f8482d0d22
"""Zuordnung der Entitäten der offiziellen Kostal-Integration.

Es wird kein Präfix abgefragt: Die Entitäten werden über das Entitätsregister der
Kostal-Konfiguration gefunden. Gemessen wird nur, was die Zuordnung hergibt.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .const import KEY_UNITS, SETTING_KEYS

_NORM_RE = re.compile(r"[^a-z0-9]+")


def normalize(text: str | None) -> str:
    """Normalisiert einen Namen (klein, nur a-z0-9 und Unterstrich)."""
    return _NORM_RE.sub("_", (text or "").lower()).strip("_")


@dataclass
class Mapped:
    """Eine gefundene Entität."""

    key: str
    entity_id: str
    disabled: bool


def _candidates(
    entry: er.RegistryEntry, dev_reg: dr.DeviceRegistry
) -> list[str]:
    """Mögliche normalisierte Namen einer Registry-Entität (Name, Entity-ID ohne Geräteprefix)."""
    names: list[str] = []
    for raw in (entry.name, entry.original_name):
        if raw:
            names.append(normalize(raw))
    object_id = entry.entity_id.split(".", 1)[1]
    names.append(object_id)
    if entry.device_id:
        device = dev_reg.async_get(entry.device_id)
        if device:
            dname = normalize(device.name_by_user or device.name)
            if dname and object_id.startswith(dname + "_"):
                names.append(object_id[len(dname) + 1 :])
    # Dubletten entfernen, Reihenfolge behalten
    return list(dict.fromkeys(n for n in names if n))


def map_kostal(hass: HomeAssistant, kostal_entry_id: str) -> dict[str, Mapped]:
    """Findet alle bekannten Prozessdaten und Einstellwerte der Kostal-Integration."""
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    result: dict[str, Mapped] = {}
    for entry in er.async_entries_for_config_entry(ent_reg, kostal_entry_id):
        domain = entry.entity_id.split(".", 1)[0]
        for cand in _candidates(entry, dev_reg):
            key: str | None = None
            if domain == "sensor" and cand in KEY_UNITS:
                key = cand
            elif domain in ("number", "switch") and SETTING_KEYS.get(cand) == domain:
                key = cand
            elif domain == "select" and cand in ("battery_dynamic_soc", "battery_smart_control"):
                key = cand
            if key is None:
                continue
            current = result.get(key)
            # aktivierte Entität bevorzugen
            if current is None or (current.disabled and entry.disabled_by is None):
                result[key] = Mapped(key, entry.entity_id, entry.disabled_by is not None)
            break
    return result
