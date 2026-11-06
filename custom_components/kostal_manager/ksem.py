# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): dcc3ee1bce244cdb0aa47742987af5c29e2ef60f48392b8e0a793e3e9e981881
"""Minimaler Modbus-TCP-Leser (Funktion 0x03) für den KOSTAL Smart Energy Meter (G1/G2).

Registerangaben stammen aus der Interface-Beschreibung MODBUS des KSEM (Stand 03/2025,
SW 2.6.0). Nur lesen. Unverschlüsselt (Port 502); TLS (Port 802) wird nicht unterstützt.
Es werden nur dokumentierte Registerblöcke gelesen, weil nicht belegte Register mit
"ILLEGAL_DATA_ADDRESS" beantwortet werden.
"""
from __future__ import annotations

import asyncio
import logging
import struct
from typing import Any

_LOGGER = logging.getLogger(__name__)

# (Start, Anzahl) der dokumentierten Blöcke
BLOCKS: dict[str, tuple[int, int]] = {
    "power_total": (0, 4),  # P+ (0), P- (2), je uint32, 0,1 W
    "freq": (26, 2),  # uint32, 0,001 Hz
    "l1_power": (40, 4),
    "l1_iu": (60, 4),  # Strom (60), Spannung (62), uint32, 0,001 A / V
    "l2_power": (80, 4),
    "l2_iu": (100, 4),
    "l3_power": (120, 4),
    "l3_iu": (140, 4),
    "energy": (512, 8),  # Wirkenergie + (512), - (516), je uint64, 0,1 Wh
}


class KsemError(Exception):
    """Fehler bei der Modbus-Kommunikation."""


def _u32(regs: list[int], i: int) -> int:
    return (regs[i] << 16) | regs[i + 1]


def _u64(regs: list[int], i: int) -> int:
    return (regs[i] << 48) | (regs[i + 1] << 32) | (regs[i + 2] << 16) | regs[i + 3]


class KsemClient:
    """Einfacher, wiederverwendbarer Modbus-TCP-Client."""

    def __init__(self, host: str, port: int, unit: int, timeout: float = 5.0) -> None:
        self.host = host
        self.port = port
        self.unit = unit
        self.timeout = timeout
        self._reader: asyncio.StreamReader | None = None
        self._writer: asyncio.StreamWriter | None = None
        self._tid = 0
        self._lock = asyncio.Lock()

    async def close(self) -> None:
        if self._writer is not None:
            self._writer.close()
            try:
                await self._writer.wait_closed()
            except OSError:
                pass
        self._reader = self._writer = None

    async def _connect(self) -> None:
        if self._writer is not None and not self._writer.is_closing():
            return
        try:
            self._reader, self._writer = await asyncio.wait_for(
                asyncio.open_connection(self.host, self.port), self.timeout
            )
        except (OSError, asyncio.TimeoutError) as err:
            self._reader = self._writer = None
            raise KsemError("connect") from err

    async def read_registers(self, start: int, count: int) -> list[int]:
        """Liest `count` Halteregister ab `start` (Funktion 0x03)."""
        async with self._lock:
            await self._connect()
            assert self._reader is not None and self._writer is not None
            self._tid = (self._tid + 1) & 0xFFFF
            request = struct.pack(">HHHBBHH", self._tid, 0, 6, self.unit, 3, start, count)
            try:
                self._writer.write(request)
                await self._writer.drain()
                header = await asyncio.wait_for(self._reader.readexactly(7), self.timeout)
                tid, proto, length, _unit = struct.unpack(">HHHB", header)
                body = await asyncio.wait_for(self._reader.readexactly(length - 1), self.timeout)
            except (OSError, asyncio.TimeoutError, asyncio.IncompleteReadError) as err:
                await self.close()
                raise KsemError("io") from err
            if tid != self._tid or proto != 0:
                await self.close()
                raise KsemError("protocol")
            func = body[0]
            if func & 0x80:
                raise KsemError(f"modbus_exception_{body[1] if len(body) > 1 else 0}")
            if func != 3 or body[1] != count * 2 or len(body) != 2 + count * 2:
                await self.close()
                raise KsemError("protocol")
            return list(struct.unpack(f">{count}H", body[2:]))

    async def read_all(self) -> dict[str, Any]:
        """Liest alle Blöcke. Ein fehlerhafter Block lässt nur seine Werte weg.

        Schlägt die Verbindung selbst fehl, wird KsemError ausgelöst.
        """
        raw: dict[str, list[int]] = {}
        errors = 0
        for name, (start, count) in BLOCKS.items():
            try:
                raw[name] = await self.read_registers(start, count)
            except KsemError as err:
                if str(err) in ("connect", "io"):
                    raise
                errors += 1
                _LOGGER.debug("KSEM-Block %s nicht lesbar: %s", name, err)
        if not raw:
            raise KsemError("no_data")
        return decode(raw)


def decode(raw: dict[str, list[int]]) -> dict[str, Any]:
    """Rechnet Rohregister in Einheiten um. Fehlende Blöcke ergeben fehlende Werte."""
    out: dict[str, Any] = {}
    if "power_total" in raw:
        p = raw["power_total"]
        imp, exp = _u32(p, 0) / 10, _u32(p, 2) / 10
        out["power_import"] = imp
        out["power_export"] = exp
        out["power"] = imp - exp  # + = Bezug, - = Einspeisung
    if "freq" in raw:
        out["frequency"] = _u32(raw["freq"], 0) / 1000
    for n in (1, 2, 3):
        pw = raw.get(f"l{n}_power")
        if pw:
            out[f"power_l{n}"] = (_u32(pw, 0) - _u32(pw, 2)) / 10
        iu = raw.get(f"l{n}_iu")
        if iu:
            out[f"current_l{n}"] = _u32(iu, 0) / 1000
            out[f"voltage_l{n}"] = _u32(iu, 2) / 1000
    if "energy" in raw:
        e = raw["energy"]
        out["energy_import"] = _u64(e, 0) / 10 / 1000  # kWh
        out["energy_export"] = _u64(e, 4) / 10 / 1000
    return out
