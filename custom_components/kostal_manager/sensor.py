# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 9cecf8cc866b6db76ec71bb6934354988b20936330fd9956d1813ee46247d960
"""Abgeleitete Sensoren (und optional KSEM-Messwerte)."""
from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    PERCENTAGE,
    UnitOfElectricCurrent,
    UnitOfElectricPotential,
    UnitOfEnergy,
    UnitOfFrequency,
    UnitOfPower,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, PERIODS, VERSION
from .manager import Manager

MEAS = SensorStateClass.MEASUREMENT
TOTAL = SensorStateClass.TOTAL_INCREASING
POWER = SensorDeviceClass.POWER
ENERGY = SensorDeviceClass.ENERGY

# (Schlüssel, Quelle "derived"/"ksem", Einheit, Geräteklasse, Zustandsklasse, Symbol, Funktion)
DERIVED: list[tuple[str, str, Any, Any, Any, str, str | None]] = [
    ("solar_power_strings", "derived", UnitOfPower.WATT, POWER, MEAS, "mdi:solar-power-variant", None),
    *[
        (f"solar_energy_{p}", "derived", UnitOfEnergy.KILO_WATT_HOUR, ENERGY, TOTAL, "mdi:solar-power-variant", None)
        for p in PERIODS
    ],
    ("pv_share_day", "derived", PERCENTAGE, None, MEAS, "mdi:percent", None),
    ("pv_share_total", "derived", PERCENTAGE, None, MEAS, "mdi:percent", None),
    ("grid_balance_day", "derived", UnitOfEnergy.KILO_WATT_HOUR, SensorDeviceClass.ENERGY, None, "mdi:transmission-tower", None),
    ("battery_efficiency_estimated", "derived", PERCENTAGE, None, MEAS, "mdi:battery-heart-variant", "efficiency"),
]
KSEM: list[tuple[str, str, Any, Any, Any, str, str | None]] = [
    ("power", "ksem", UnitOfPower.WATT, POWER, MEAS, "mdi:meter-electric", "ksem"),
    ("frequency", "ksem", UnitOfFrequency.HERTZ, SensorDeviceClass.FREQUENCY, MEAS, "mdi:sine-wave", "ksem"),
    *[
        (f"voltage_l{n}", "ksem", UnitOfElectricPotential.VOLT, SensorDeviceClass.VOLTAGE, MEAS, "mdi:flash", "ksem")
        for n in (1, 2, 3)
    ],
    *[
        (f"current_l{n}", "ksem", UnitOfElectricCurrent.AMPERE, SensorDeviceClass.CURRENT, MEAS, "mdi:current-ac", "ksem")
        for n in (1, 2, 3)
    ],
    *[(f"power_l{n}", "ksem", UnitOfPower.WATT, POWER, MEAS, "mdi:meter-electric", "ksem") for n in (1, 2, 3)],
    ("energy_import", "ksem", UnitOfEnergy.KILO_WATT_HOUR, ENERGY, TOTAL, "mdi:transmission-tower-export", "ksem"),
    ("energy_export", "ksem", UnitOfEnergy.KILO_WATT_HOUR, ENERGY, TOTAL, "mdi:transmission-tower-import", "ksem"),
]


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    manager: Manager = entry.runtime_data
    entities: list[PlentiSensor] = []
    for spec in DERIVED + KSEM:
        feature = spec[6]
        if feature is not None and not manager.feature_active(feature):
            continue
        entities.append(PlentiSensor(manager, entry, spec))
    async_add_entities(entities)


class PlentiSensor(SensorEntity):
    """Ein berechneter Sensor. Ohne Eingangswert: nicht verfügbar statt 0."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, manager: Manager, entry: ConfigEntry, spec: tuple) -> None:
        key, source, unit, dev_class, state_class, icon, _feature = spec
        self._manager = manager
        self._key = key
        self._source = source
        self._attr_translation_key = f"{source}_{key}"
        self._attr_unique_id = f"{entry.entry_id}_{source}_{key}"
        self._attr_native_unit_of_measurement = unit
        self._attr_device_class = dev_class
        self._attr_state_class = state_class
        self._attr_icon = icon
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Kostal Manager",
            manufacturer="Meine smarte Welt",
            model="Karte und Sensoren",
            sw_version=VERSION,
        )

    @property
    def native_value(self) -> float | None:
        if self._source == "ksem":
            if not self._manager.ksem_available:
                return None
            value = self._manager.ksem_values.get(self._key)
        else:
            value = self._manager.derived().get(self._key)
            if value is None and self._key in ("pv_share_total",):
                value = self._manager.derived().get("pv_share_total")
        return None if value is None else round(float(value), 3)

    @property
    def available(self) -> bool:
        return self.native_value is not None

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._manager.add_listener(self.async_write_ha_state))
