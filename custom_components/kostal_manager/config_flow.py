# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 91cc387a5ea13943d1e0f5c3b6b5019fde537efc4cab3ce8da49e2035c23fd3b
"""Einrichtung (Kostal-Konfiguration wählen, Strings festlegen) und Optionen."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)

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
    DOMAIN,
    EXPERIMENTAL_FEATURES,
    KOSTAL_DOMAIN,
    MIN_KSEM_INTERVAL,
    VERSION,
)
from .discovery import map_kostal


def _strings_schema(strings: list[int], battery_input: int) -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_STRINGS, default=[str(s) for s in strings]): SelectSelector(
                SelectSelectorConfig(
                    options=["1", "2", "3"],
                    multiple=True,
                    mode=SelectSelectorMode.LIST,
                    translation_key="string_select",
                )
            ),
            vol.Required(CONF_BATTERY_INPUT, default=str(battery_input)): SelectSelector(
                SelectSelectorConfig(
                    options=["0", "1", "2", "3"],
                    mode=SelectSelectorMode.DROPDOWN,
                    translation_key="battery_input_select",
                )
            ),
        }
    )


def _clean_strings(user_input: dict[str, Any]) -> dict[str, Any]:
    battery = int(user_input[CONF_BATTERY_INPUT])
    strings = sorted({int(s) for s in user_input[CONF_STRINGS]} - {battery})
    return {CONF_STRINGS: strings, CONF_BATTERY_INPUT: battery}


def _ksem_schema(get: Any) -> vol.Schema:
    """Felder für den KSEM (Adresse leer = kein KSEM)."""
    return vol.Schema(
        {
            vol.Optional(CONF_KSEM_HOST, description={"suggested_value": get(CONF_KSEM_HOST)}): str,
            vol.Required(CONF_KSEM_PORT, default=int(get(CONF_KSEM_PORT, DEFAULT_KSEM_PORT))): NumberSelector(
                NumberSelectorConfig(min=1, max=65535, mode=NumberSelectorMode.BOX)
            ),
            vol.Required(CONF_KSEM_UNIT, default=int(get(CONF_KSEM_UNIT, DEFAULT_KSEM_UNIT))): NumberSelector(
                NumberSelectorConfig(min=0, max=255, mode=NumberSelectorMode.BOX)
            ),
            vol.Required(CONF_KSEM_INTERVAL, default=int(get(CONF_KSEM_INTERVAL, DEFAULT_KSEM_INTERVAL))): NumberSelector(
                NumberSelectorConfig(min=MIN_KSEM_INTERVAL, max=300, unit_of_measurement="s", mode=NumberSelectorMode.BOX)
            ),
        }
    )


def _clean_ksem(user_input: dict[str, Any]) -> dict[str, Any]:
    """Leere Adresse entfernt den KSEM, Zahlen werden zu int."""
    out: dict[str, Any] = {}
    host = str(user_input.get(CONF_KSEM_HOST) or "").strip()
    if host:
        out[CONF_KSEM_HOST] = host
    for key, low, high in (
        (CONF_KSEM_PORT, 1, 65535),
        (CONF_KSEM_UNIT, 0, 255),
        (CONF_KSEM_INTERVAL, MIN_KSEM_INTERVAL, 300),
    ):
        if key in user_input:
            out[key] = min(high, max(low, int(user_input[key])))
    return out


class PlentiConfigFlow(ConfigFlow, domain=DOMAIN):
    """Einrichtung."""

    VERSION = 1

    def __init__(self) -> None:
        self._kostal_entry_id: str | None = None
        self._data: dict[str, Any] = {}

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        entries = self.hass.config_entries.async_entries(KOSTAL_DOMAIN)
        if not entries:
            return self.async_abort(reason="no_kostal")
        if user_input is None and len(entries) > 1:
            return self.async_show_form(
                step_id="user",
                data_schema=vol.Schema(
                    {
                        vol.Required(CONF_KOSTAL_ENTRY): SelectSelector(
                            SelectSelectorConfig(
                                options=[{"value": e.entry_id, "label": e.title} for e in entries],
                                mode=SelectSelectorMode.DROPDOWN,
                            )
                        )
                    }
                ),
            )
        self._kostal_entry_id = user_input[CONF_KOSTAL_ENTRY] if user_input else entries[0].entry_id
        await self.async_set_unique_id(self._kostal_entry_id)
        self._abort_if_unique_id_configured()
        return await self.async_step_strings()

    async def async_step_strings(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        assert self._kostal_entry_id is not None
        if user_input is not None:
            self._data = {CONF_KOSTAL_ENTRY: self._kostal_entry_id, **_clean_strings(user_input)}
            return await self.async_step_ksem()
        mapping = map_kostal(self.hass, self._kostal_entry_id)
        present = [n for n in (1, 2, 3) if f"dc{n}_power" in mapping]
        preselect = [n for n in present if n != DEFAULT_BATTERY_INPUT] or list(DEFAULT_STRINGS)
        return self.async_show_form(
            step_id="strings",
            data_schema=_strings_schema(preselect, DEFAULT_BATTERY_INPUT),
            description_placeholders={"found": str(len(mapping))},
        )

    async def async_step_ksem(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Optional: KSEM (hat eine eigene Adresse, nicht die des Wechselrichters)."""
        assert self._kostal_entry_id is not None
        if user_input is not None:
            data = {**self._data, **_clean_ksem(user_input)}
            title = self.hass.config_entries.async_get_entry(self._kostal_entry_id)
            return self.async_create_entry(title=f"Kostal Manager ({title.title})" if title else "Kostal Manager", data=data)
        return self.async_show_form(step_id="ksem", data_schema=_ksem_schema(lambda k, d=None: d))

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return PlentiOptionsFlow()


class PlentiOptionsFlow(OptionsFlow):
    """Optionen: Strings, dann Experimentelles."""

    def __init__(self) -> None:
        self._pending: dict[str, Any] = {}

    def _get(self, key: str, default: Any = None) -> Any:
        if key in self.config_entry.options:
            return self.config_entry.options[key]
        return self.config_entry.data.get(key, default)

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._pending.update(_clean_strings(user_input))
            return await self.async_step_ksem()
        update = None
        manager = getattr(self.config_entry, "runtime_data", None)
        if manager is not None:
            update = manager.update.result
        info = "–"
        if update and update.get("update_available"):
            info = f"⚠ {update['latest']} verfügbar"
        elif update and update.get("latest"):
            info = "aktuell"
        elif update and update.get("check_failed"):
            info = "Prüfung nicht möglich"
        return self.async_show_form(
            step_id="init",
            data_schema=_strings_schema(
                list(self._get(CONF_STRINGS, DEFAULT_STRINGS)),
                int(self._get(CONF_BATTERY_INPUT, DEFAULT_BATTERY_INPUT)),
            ),
            description_placeholders={"version": VERSION, "update_info": info},
        )

    async def async_step_ksem(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._pending.update(_clean_ksem(user_input))
            if CONF_KSEM_HOST not in self._pending:
                self._pending[CONF_KSEM_HOST] = ""
            return await self.async_step_experimental()
        return self.async_show_form(step_id="ksem", data_schema=_ksem_schema(self._get))

    async def async_step_experimental(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            data = {**self._pending, **user_input}
            for key in list(data):
                if data[key] is None or (data[key] == "" and key != CONF_KSEM_HOST):
                    data.pop(key)
            return self.async_create_entry(title="", data=data)
        schema: dict[Any, Any] = {
            vol.Required(CONF_EXPERIMENTAL, default=bool(self._get(CONF_EXPERIMENTAL, False))): bool,
        }
        for feature in EXPERIMENTAL_FEATURES:
            schema[vol.Required(CONF_EXP_PREFIX + feature, default=bool(self._get(CONF_EXP_PREFIX + feature, False)))] = bool
        return self.async_show_form(step_id="experimental", data_schema=vol.Schema(schema), errors=errors)
