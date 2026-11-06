# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 2a72f198fa66a2288121649586565222cdc820efa3e37cfdb223141b69af694b
"""Versionsabfrage gegen GitHub (beim Start und danach alle 12 Stunden)."""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Callable

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.event import async_track_time_interval

from .const import GITHUB_REPO, VERSION

_LOGGER = logging.getLogger(__name__)
INTERVAL = timedelta(hours=12)


def _parse(version: str) -> Any:
    from packaging.version import InvalidVersion, Version

    try:
        return Version(version.lstrip("vV"))
    except InvalidVersion:
        return None


def is_newer(latest: str, current: str) -> bool:
    """True, wenn `latest` höher als `current` ist (Beta < Release)."""
    a, b = _parse(latest), _parse(current)
    return bool(a is not None and b is not None and a > b)


class UpdateChecker:
    """Fragt GitHub ab und hält das Ergebnis."""

    def __init__(self, hass: HomeAssistant, on_change: Callable[[], None]) -> None:
        self.hass = hass
        self._on_change = on_change
        self.result: dict[str, Any] = {
            "current": VERSION,
            "latest": None,
            "release_url": f"https://github.com/{GITHUB_REPO}/releases",
            "update_available": False,
            "checked_at": None,
            "check_failed": False,
        }

    @callback
    def async_start(self, entry: Any) -> None:
        entry.async_on_unload(
            async_track_time_interval(self.hass, self._tick, INTERVAL)
        )
        self.hass.async_create_task(self.async_check())

    async def _tick(self, _now: datetime) -> None:
        await self.async_check()

    async def async_check(self) -> None:
        session = async_get_clientsession(self.hass)
        prerelease = any(t in VERSION for t in ("a", "b", "rc"))
        base = f"https://api.github.com/repos/{GITHUB_REPO}"
        try:
            if prerelease:
                url = f"{base}/releases?per_page=5"
            else:
                url = f"{base}/releases/latest"
            async with session.get(url, timeout=15, headers={"Accept": "application/vnd.github+json"}) as resp:
                if resp.status != 200:
                    raise ValueError(resp.status)
                data = await resp.json()
            releases = data if isinstance(data, list) else [data]
            best = None
            for rel in releases:
                tag = str(rel.get("tag_name", ""))
                ver = _parse(tag)
                if ver is not None and (best is None or ver > best[0]):
                    best = (ver, tag, str(rel.get("html_url", "")))
            if best is None:
                raise ValueError("no release")
            latest = best[1].lstrip("vV")
            url = best[2] if best[2].startswith("https://github.com/") else f"https://github.com/{GITHUB_REPO}/releases"
            self.result.update(
                latest=latest,
                release_url=url,
                update_available=is_newer(latest, VERSION),
                check_failed=False,
            )
        except Exception as err:  # noqa: BLE001 - jede Störung bedeutet nur "Prüfung nicht möglich"
            _LOGGER.debug("Versionsprüfung nicht möglich: %s", type(err).__name__)
            self.result["check_failed"] = True
        self.result["checked_at"] = datetime.now(timezone.utc).isoformat()
        self._on_change()
