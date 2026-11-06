# Experimentelle Funktionen – Kostal Manager

Stand: 2026-11-06 · Version: 1.0.0b1

Diese Funktionen sind **ungeprüft** und standardmäßig ausgeblendet.
Einschalten: Optionen → „Experimentelle Funktionen anzeigen“, in der Karte Editor → „Experimentell“.

Hinweis zur Einstufung: Diese Version ist die erste Veröffentlichung. Alles wurde nur gegen Testdaten und simulierte Schnittstellen geprüft, nichts an einer echten Anlage. Eine Funktion gilt erst als geprüft, wenn der Autor ihre Funktion an echter Hardware bestätigt hat.

## Offen (noch zu prüfen)

| Funktion | Schlüssel | Seit | Warum experimentell | Was zu prüfen ist | Status |
|---|---|---|---|---|---|
| KSEM über Modbus TCP (Kategorie „KSEM“ und Sensoren `ksem_*`) | `ksem` | 1.0.0b1 | Nur gegen einen simulierten Modbus-Server getestet. Register stammen aus der Schnittstellenbeschreibung, nicht von einem echten KSEM. Die Unit-ID ist ungeklärt (Standard 1). | 1. Modbus TCP am KSEM aktivieren (Port 502, ohne TLS). 2. Adresse in den Optionen eintragen. 3. Netzleistung mit der KSEM-Oberfläche vergleichen (Vorzeichen: + Bezug, − Einspeisung). 4. Zählerstände Bezug und Einspeisung vergleichen. 5. Bei Fehler „modbus_exception“ andere Unit-ID probieren und melden, welche funktioniert. | offen |
| Geschätzter Batteriewirkungsgrad | `efficiency` | 1.0.0b1 | Eigene Näherung (Entladen geteilt durch Geladen seit Beginn). Die Zähler der Kostal-Integration sind nicht gegengeprüft. | 1. Sensor „Batteriewirkungsgrad (geschätzt)“ prüfen. 2. Plausibel sind etwa 85 bis 97 Prozent. 3. Abweichungen mit den Gesamtzählern der Kostal-Integration vergleichen. | offen |

## Nicht experimentell, aber ungeprüft

Der Kern (Zuordnung der Kostal-Entitäten, Strings, Übersicht, Statistik, Einstellungen) ist **nicht** als experimentell geführt, damit die Karte ohne Zusatzschalter nutzbar ist. Er ist trotzdem an keiner echten Anlage getestet. Das ist eine bewusste Ausnahme von `07` Abschnitt 2 und braucht Thorstens Entscheidung (siehe Antwort zur Version).

## Geprüft (Historie)

| Funktion | Geprüft am | In Version | Bestätigt von |
|---|---|---|---|
| – | – | – | – |
