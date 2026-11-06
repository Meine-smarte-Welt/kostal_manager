# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 99cfe3fd941dbcd8b969c6aeafa4c1de2fef5d93aea9706bb1a292f2afd9a978
"""WebSocket-API: subscribe (alle), action (nur Admin)."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import ACTIONS, DOMAIN

_LOGGER = logging.getLogger(__name__)


def _manager(hass: HomeAssistant, entry_id: str | None):
    entries = [e for e in hass.config_entries.async_entries(DOMAIN) if hasattr(e, "runtime_data")]
    if entry_id:
        entries = [e for e in entries if e.entry_id == entry_id]
    return entries[0].runtime_data if entries else None


@callback
def async_register(hass: HomeAssistant) -> None:
    if hass.data.get(f"{DOMAIN}_ws"):
        return
    hass.data[f"{DOMAIN}_ws"] = True
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_action)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/subscribe", vol.Optional("entry_id"): str}
)
@callback
def ws_subscribe(hass: HomeAssistant, connection: Any, msg: dict[str, Any]) -> None:
    manager = _manager(hass, msg.get("entry_id"))
    if manager is None:
        connection.send_error(msg["id"], "not_found", "Kostal Manager nicht eingerichtet")
        return

    @callback
    def _push() -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], {"event": "snapshot", "data": manager.snapshot()})
        )

    remove = manager.add_listener(_push)
    connection.subscriptions[msg["id"]] = remove
    connection.send_result(msg["id"])
    _push()


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/action",
        vol.Optional("entry_id"): str,
        vol.Required("action"): vol.In(ACTIONS),
        vol.Optional("setting"): str,
        vol.Optional("value"): vol.Any(bool, int, float),
    }
)
@websocket_api.async_response
async def ws_action(hass: HomeAssistant, connection: Any, msg: dict[str, Any]) -> None:
    manager = _manager(hass, msg.get("entry_id"))
    if manager is None:
        connection.send_error(msg["id"], "not_found", "Kostal Manager nicht eingerichtet")
        return
    try:
        result = await manager.async_action(
            msg["action"], {k: msg[k] for k in ("setting", "value") if k in msg}
        )
    except ValueError as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    except Exception:  # noqa: BLE001
        _LOGGER.exception("Aktion %s fehlgeschlagen", msg["action"])
        connection.send_error(msg["id"], "failed", "action failed")
        return
    connection.send_result(msg["id"], result)
