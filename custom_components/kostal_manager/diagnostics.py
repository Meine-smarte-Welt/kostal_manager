# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): d3d37529643ec39e696d243ad9947ad253cd4c09f9dd08db3b3267522a042c09
"""Anonymisierter Diagnose-Download (keine Adressen, keine Entity-IDs)."""
from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import VERSION


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any]:
    m = entry.runtime_data
    snap = m.snapshot()
    return {
        "version": VERSION,
        "strings": snap["config"],
        "kostal_entities_found": snap["found"],
        "kostal_entities_disabled": len(snap["disabled"]),
        "values_with_data": sorted(k for k, v in snap["values"].items() if v["ok"]),
        "experimental": {k: v["enabled"] for k, v in snap["experimental"]["features"].items()},
        "ksem": None
        if snap["ksem"] is None
        else {"configured": snap["ksem"]["configured"], "available": snap["ksem"]["available"], "error": snap["ksem"]["error"]},
        "update": {k: snap["app"].get(k) for k in ("latest", "update_available", "check_failed")},
    }
