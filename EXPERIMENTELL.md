# Experimentelle Funktionen – Kostal Manager

Stand: 2026-11-06 · Version: 1.0.0b2

Diese Funktionen sind **ungeprüft** und standardmäßig ausgeblendet.
Einschalten: Optionen → „Experimentelle Funktionen anzeigen“, in der Karte Editor → „Experimentell“.

Hinweis zur Einstufung: Diese Version ist die erste Veröffentlichung. Alles wurde nur gegen Testdaten und simulierte Schnittstellen geprüft, nichts an einer echten Anlage. Eine Funktion gilt erst als geprüft, wenn der Autor ihre Funktion an echter Hardware bestätigt hat.

## Offen (noch zu prüfen)

| Funktion | Schlüssel | Seit | Warum experimentell | Was zu prüfen ist | Status |
|---|---|---|---|---|---|
| 7-Tage-Balkendiagramm in der Statistik | `history7` | 1.0.0b1 | Neu gebaut, nur gegen einen simulierten Verlauf und Browsertests geprüft, nicht gegen die echte Langzeitstatistik. | 1. Hauptschalter und Schalter „7-Tage-Balkendiagramm“ an, `show_experimental` in der Karte an. 2. Statistik-Tab öffnen: sieben Balken mit Wochentagen erscheinen. 3. Werte mit dem Energie-Dashboard von Home Assistant vergleichen (Solar, Verbrauch, Netzbezug, Einspeisung). 4. Tage ohne Daten müssen als „–“ erscheinen, nicht als 0. | offen |
| Eigene Seite „Kostal Manager“ in der Seitenleiste | `panel` | 1.0.0b1 | Neu gebaut, nur gegen eine nachgebildete Home-Assistant-Umgebung geprüft, nicht in einem echten Frontend. | 1. Hauptschalter und Schalter „Eigene Seite in der Seitenleiste“ an, Optionen speichern. 2. Browser neu laden (Strg+F5): Menüpunkt „Kostal Manager“ in der Seitenleiste. 3. Seite öffnen: Karte wird als Vollbild angezeigt, auf dem Handy öffnet der Menüknopf die Seitenleiste. 4. Schalter ausschalten und Optionen speichern: der Menüpunkt verschwindet nach Neustart. | offen |
| Geschätzter Batteriewirkungsgrad | `efficiency` | 1.0.0b1 | Eigene Näherung (Entladen geteilt durch Geladen seit Beginn). Die Zähler der Kostal-Integration sind nicht gegengeprüft. | 1. Sensor „Batteriewirkungsgrad (geschätzt)“ prüfen. 2. Plausibel sind etwa 85 bis 97 Prozent. 3. Abweichungen mit den Gesamtzählern der Kostal-Integration vergleichen. | offen |

## Nicht experimentell, aber ungeprüft

Der Kern (Zuordnung der Kostal-Entitäten, Strings, Übersicht, Statistik, Einstellungen) ist **nicht** als experimentell geführt, damit die Karte ohne Zusatzschalter nutzbar ist. Er ist trotzdem an keiner echten Anlage getestet. Das ist eine bewusste Ausnahme von `07` Abschnitt 2 und braucht Thorstens Entscheidung (siehe Antwort zur Version).

### KSEM über Modbus TCP (auf Wunsch von Thorsten nicht experimentell)

Der KSEM wird gelesen, sobald eine Adresse eingetragen ist (Kategorie „KSEM“ und Sensoren `ksem_*`). Thorsten hat entschieden, dass diese Funktion nicht experimentell geführt wird. Sie ist trotzdem **nicht an einem echten KSEM geprüft**: nur gegen einen simulierten Modbus-Server getestet, Register stammen aus der Schnittstellenbeschreibung, die Unit-ID ist ungeklärt (Standard 1).

Zu prüfen: 1. Modbus TCP am KSEM aktivieren (Port 502, ohne TLS). 2. Adresse in den Optionen eintragen. 3. Kategorie „KSEM“: Netzleistung, Frequenz, Spannung, Strom und Zähler mit dem Display oder der Weboberfläche des KSEM vergleichen. 4. Bei „modbus_exception_…“ eine andere Unit-ID probieren und das Ergebnis melden.

## Geprüft (Historie)

| Funktion | Geprüft am | In Version | Bestätigt von |
|---|---|---|---|
| – | – | – | – |
