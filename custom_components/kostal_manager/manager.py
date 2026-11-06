# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 29c3d347db32cacfafb3a04da7409328041fb3b5abcdb6895a2b2c88bc5117ba
"""Zentrale Datenhaltung: Zuordnung, Zustände, abgeleitete Werte, KSEM."""
from __future__ import annotations

import asyncio
import logging
from collections.abc import Callable
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_call_later, async_track_state_change_event

from .const import (
    CONF_BATTERY_INPUT,
    CONF_EXP_PREFIX,
    CONF_EXPERIMENTAL,
    CONF_KOSTAL_ENTRY,
    CONF_KSEM_HOST,
    CONF_KSEM_INTERVAL,
    CONF_KSEM_PORT,
    CONF_KSEM_UNIT,
    CONF_STRINGS,
    DEFAULT_BATTERY_INPUT,
    DEFAULT_KSEM_INTERVAL,
    DEFAULT_KSEM_PORT,
    DEFAULT_KSEM_UNIT,
    DEFAULT_STRINGS,
    EXPERIMENTAL_FEATURES,
    FLUSH_DELAY,
    KEY_UNITS,
    MIN_KSEM_INTERVAL,
    PERIODS,
    SETTING_KEYS,
    VERSION,
)
from .discovery import Mapped, map_kostal
from .ksem import KsemClient, KsemError
from .update_check import UpdateChecker

_LOGGER = logging.getLogger(__name__)


def _num(state: Any) -> float | None:
    """Zustand als Zahl, sonst None."""
    if state is None or state.state in (STATE_UNKNOWN, STATE_UNAVAILABLE, "", None):
        return None
    try:
        return float(state.state)
    except (TypeError, ValueError):
        return None


class Manager:
    """Ein Manager je Config Entry."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.kostal: dict[str, Mapped] = {}
        self.ksem_values: dict[str, Any] = {}
        self.ksem_available = False
        self.ksem_error: str | None = None
        self._ksem: KsemClient | None = None
        self._listeners: list[Callable[[], None]] = []
        self._flush_handle: Callable[[], None] | None = None
        self._unsub_states: Callable[[], None] | None = None
        self.update = UpdateChecker(hass, self._notify_now)

    # --- Optionen ------------------------------------------------------
    def opt(self, key: str, default: Any = None) -> Any:
        if key in self.entry.options:
            return self.entry.options[key]
        return self.entry.data.get(key, default)

    @property
    def kostal_entry_id(self) -> str:
        return self.entry.data[CONF_KOSTAL_ENTRY]

    @property
    def strings(self) -> list[int]:
        return sorted({int(s) for s in self.opt(CONF_STRINGS, DEFAULT_STRINGS) if int(s) in (1, 2, 3)})

    @property
    def battery_input(self) -> int:
        return int(self.opt(CONF_BATTERY_INPUT, DEFAULT_BATTERY_INPUT))

    def experimental_master(self) -> bool:
        return bool(self.opt(CONF_EXPERIMENTAL, False))

    def feature_active(self, feature: str) -> bool:
        """Experimentelle Funktion aktiv? Nur wenn Hauptschalter UND Einzelschalter an sind."""
        return self.experimental_master() and bool(self.opt(CONF_EXP_PREFIX + feature, False))

    # --- Lebenszyklus --------------------------------------------------
    async def async_setup(self) -> None:
        self.remap()
        self.update.async_start(self.entry)
        if self.feature_active("ksem"):
            self._start_ksem()

    def remap(self) -> None:
        """Zuordnung neu aufbauen und Zustandsüberwachung anpassen."""
        self.kostal = map_kostal(self.hass, self.kostal_entry_id)
        ids = [m.entity_id for m in self.kostal.values()]
        if self._unsub_states:
            self._unsub_states()
        self._unsub_states = (
            async_track_state_change_event(self.hass, ids, self._on_state) if ids else None
        )
        self.entry.async_on_unload(self._cleanup_states)

    @callback
    def _cleanup_states(self) -> None:
        if self._unsub_states:
            self._unsub_states()
            self._unsub_states = None

    async def async_shutdown(self) -> None:
        if self._flush_handle:
            self._flush_handle()
            self._flush_handle = None
        self._cleanup_states()
        if self._ksem:
            await self._ksem.close()

    # --- KSEM ----------------------------------------------------------
    def _start_ksem(self) -> None:
        host = str(self.opt(CONF_KSEM_HOST, "") or "").strip()
        if not host:
            self.ksem_error = "not_configured"
            return
        self._ksem = KsemClient(
            host,
            int(self.opt(CONF_KSEM_PORT, DEFAULT_KSEM_PORT)),
            int(self.opt(CONF_KSEM_UNIT, DEFAULT_KSEM_UNIT)),
        )
        interval = max(MIN_KSEM_INTERVAL, int(self.opt(CONF_KSEM_INTERVAL, DEFAULT_KSEM_INTERVAL)))
        self.entry.async_create_background_task(
            self.hass, self._ksem_loop(interval), f"{self.entry.entry_id}_ksem"
        )

    async def _ksem_loop(self, interval: int) -> None:
        assert self._ksem is not None
        failed_before = False
        while True:
            try:
                self.ksem_values = await self._ksem.read_all()
                self.ksem_available = True
                self.ksem_error = None
                failed_before = False
            except KsemError as err:
                self.ksem_available = False
                self.ksem_error = str(err)
                if not failed_before:
                    _LOGGER.warning("KSEM nicht lesbar (%s)", err)
                failed_before = True
            self._notify_now()
            await asyncio.sleep(interval)

    # --- Listener ------------------------------------------------------
    def add_listener(self, cb: Callable[[], None]) -> Callable[[], None]:
        self._listeners.append(cb)

        def _remove() -> None:
            if cb in self._listeners:
                self._listeners.remove(cb)

        return _remove

    @callback
    def _on_state(self, _event: Event) -> None:
        if self._flush_handle is not None:
            return

        @callback
        def _flush(_now: Any) -> None:
            self._flush_handle = None
            self._notify_now()

        self._flush_handle = async_call_later(self.hass, FLUSH_DELAY, _flush)

    @callback
    def _notify_now(self) -> None:
        for cb in list(self._listeners):
            try:
                cb()
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Listener-Fehler")

    # --- Werte ---------------------------------------------------------
    def _raw(self, key: str) -> Any:
        m = self.kostal.get(key)
        return self.hass.states.get(m.entity_id) if m and not m.disabled else None

    def num(self, key: str) -> float | None:
        return _num(self._raw(key))

    def value(self, key: str) -> dict[str, Any]:
        st = self._raw(key)
        unit = KEY_UNITS.get(key, "")
        if st is None or st.state in (STATE_UNKNOWN, STATE_UNAVAILABLE, "", None):
            return {"v": None, "u": unit, "ok": False}
        number = _num(st)
        return {"v": number if number is not None else st.state, "u": unit, "ok": True}

    def derived(self) -> dict[str, Any]:
        """Abgeleitete Werte. Fehlende Eingangswerte ergeben None (nicht 0)."""
        out: dict[str, Any] = {}
        sel = self.strings
        powers = [self.num(f"dc{n}_power") for n in sel]
        out["solar_power_strings"] = (
            sum(p for p in powers if p is not None) if any(p is not None for p in powers) else None
        )
        for p in PERIODS:
            vals = [self.num(f"energy_pv{n}_{p}") for n in sel]
            solar = sum(v for v in vals if v is not None) if any(v is not None for v in vals) else None
            out[f"solar_energy_{p}"] = solar
            home = self.num(f"home_consumption_{p}")
            from_pv = self.num(f"home_consumption_from_pv_{p}")
            out[f"pv_share_{p}"] = (
                round(from_pv / home * 100, 1) if home and from_pv is not None and home > 0 else None
            )
            to_grid = self.num(f"energy_to_grid_{p}")
            from_grid = self.num(f"home_consumption_from_grid_{p}")
            out[f"grid_balance_{p}"] = (
                round(to_grid - from_grid, 3) if to_grid is not None and from_grid is not None else None
            )
        if self.feature_active("efficiency"):
            dis = self.num("battery_discharge_total")
            cpv = self.num("battery_charge_from_pv_total")
            cgr = self.num("battery_charge_from_grid_total") or 0.0
            chg = (cpv or 0.0) + cgr
            out["battery_efficiency_estimated"] = (
                round(dis / chg * 100, 1) if dis is not None and cpv is not None and chg > 0 else None
            )
        return out

    def _strings_info(self) -> list[dict[str, Any]]:
        info = []
        for n in (1, 2, 3):
            role = "battery" if n == self.battery_input else "pv"
            present = f"dc{n}_power" in self.kostal
            entry: dict[str, Any] = {
                "n": n,
                "role": role,
                "selected": n in self.strings,
                "present": present,
                "power": self.value(f"dc{n}_power"),
                "voltage": self.value(f"dc{n}_voltage"),
                "current": self.value(f"dc{n}_current"),
            }
            for p in PERIODS:
                entry[p] = self.value(f"energy_pv{n}_{p}")
            info.append(entry)
        return info

    def _settings(self) -> dict[str, Any]:
        out: dict[str, Any] = {}
        for key, domain in SETTING_KEYS.items():
            m = self.kostal.get(key)
            if not m or m.disabled:
                continue
            st = self.hass.states.get(m.entity_id)
            if st is None or st.state in (STATE_UNKNOWN, STATE_UNAVAILABLE):
                continue
            item: dict[str, Any] = {"entity_id": m.entity_id, "domain": domain}
            if domain == "number":
                item.update(
                    value=_num(st),
                    min=st.attributes.get("min"),
                    max=st.attributes.get("max"),
                    step=st.attributes.get("step", 1),
                    unit=st.attributes.get("unit_of_measurement", ""),
                )
            else:
                item["value"] = st.state == "on"
            out[key] = item
        return out

    def _ksem_snapshot(self) -> dict[str, Any] | None:
        if not self.feature_active("ksem"):
            return None
        return {
            "configured": bool(str(self.opt(CONF_KSEM_HOST, "") or "").strip()),
            "available": self.ksem_available,
            "error": self.ksem_error,
            "values": dict(self.ksem_values) if self.ksem_available else {},
        }

    def snapshot(self) -> dict[str, Any]:
        values = {k: self.value(k) for k in KEY_UNITS if k in self.kostal and not self.kostal[k].disabled}
        disabled = sorted(k for k, m in self.kostal.items() if m.disabled and k in KEY_UNITS)
        present = sorted(k for k in KEY_UNITS if k in self.kostal)
        return {
            "version": VERSION,
            "app": dict(self.update.result),
            "config": {
                "strings": self.strings,
                "battery_input": self.battery_input,
            },
            "found": len(present),
            "disabled": disabled,
            "values": values,
            "derived": self.derived(),
            "strings": self._strings_info(),
            "settings": self._settings(),
            "ksem": self._ksem_snapshot(),
            "experimental": {
                "enabled": self.experimental_master(),
                "count": len(EXPERIMENTAL_FEATURES),
                "features": {
                    k: {**v, "enabled": self.feature_active(k)}
                    for k, v in EXPERIMENTAL_FEATURES.items()
                },
            },
        }

    # --- Aktionen ------------------------------------------------------
    async def async_action(self, action: str, data: dict[str, Any]) -> dict[str, Any]:
        """Admin-Aktionen. Nur Entitäten der Zuordnung sind erlaubt."""
        if action == "refresh":
            await self.update.async_check()
            self.remap()
            self._notify_now()
            return {}
        if action == "enable_sensors":
            ent_reg = er.async_get(self.hass)
            enabled = 0
            for key, m in self.kostal.items():
                if m.disabled and key in KEY_UNITS:
                    ent_reg.async_update_entity(m.entity_id, disabled_by=None)
                    enabled += 1
            return {"enabled": enabled}
        if action in ("set_number", "set_switch"):
            key = data.get("setting")
            item = self._settings().get(key) if isinstance(key, str) else None
            if item is None:
                raise ValueError("unknown_setting")
            if action == "set_number":
                if item["domain"] != "number":
                    raise ValueError("wrong_domain")
                value = float(data["value"])
                lo, hi = item.get("min"), item.get("max")
                if (lo is not None and value < lo) or (hi is not None and value > hi):
                    raise ValueError("out_of_range")
                await self.hass.services.async_call(
                    "number", "set_value", {"entity_id": item["entity_id"], "value": value}, blocking=True
                )
            else:
                if item["domain"] != "switch":
                    raise ValueError("wrong_domain")
                await self.hass.services.async_call(
                    "switch",
                    "turn_on" if bool(data["value"]) else "turn_off",
                    {"entity_id": item["entity_id"]},
                    blocking=True,
                )
            return {}
        raise ValueError("unknown_action")
