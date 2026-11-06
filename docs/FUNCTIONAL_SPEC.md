# Funktionale Spezifikation

Version 0.1 · 06.11.2026 · F = festgelegt; V = Detailvorschlag.

Die Prüfkriterien konkretisieren den Entwurf und bleiben VORSCHLÄGE, vorläufig zur Umsetzung beauftragt. Der Implementierungs- und Prüfstand ist separat in IMPLEMENTATION_STATUS.md dokumentiert; Designfreigabe und technische Umsetzung bleiben getrennt.

| ID | Funktion | Status | Prüfkriterium |
| --- | --- | --- | --- |
| F01 | Start in Heute mit Bewegungsminuten, Bewegungsabschnitten und Tagesverlauf | F | Nach Öffnen wird Heute mit Datum und drei Informationsbereichen angezeigt. |
| F02 | Zwei Heute-Varianten auf derselben Datengrundlage anbieten | F | Variante A/B ändern weder Datum noch Szenario, Summen, Einheiten oder Datenstand. |
| F03 | Details zu Schritten, geschätzter Strecke, Puls und Hauttemperatur öffnen | F | Jeder Detailbereich ist erreichbar und bietet eine Rückkehr zur vorherigen Ansicht. |
| F04 | Sieben Tage darstellen und Tag auswählen | F | Alle sieben Datumswerte sind auswählbar; heute ist von abgeschlossenen Tagen unterscheidbar. |
| F05 | Armbandstatus und nächste Übertragung darstellen | F | Akku, geschätzte Laufzeit, letzte erfolgreiche Übertragung, Datenstand und geplante Übertragung sind getrennt bezeichnet. |
| F06 | Interviewsteuerung für Varianten, Szenarien und Reset | F | Funktionen sind in einem ausdrücklich benannten Interviewbereich erreichbar. |
| F07 | Kompakten Gerätestatus auf Hauptansichten anbieten | F | Akku und Datenstand sind direkt sichtbar; Antippen öffnet Armbanddetails. |
| F08 | Herkunft der Informationen erklären | V | Detailansicht benennt Messwert, Schätzung/Ableitung oder Selbstbericht; alles zusätzlich als Demo gekennzeichnet. |
| F09 | Datenlücken und Messabdeckung zeigen | V | Kein Signal und nicht getragen erscheinen als Datenlücke, niemals als null Aktivität. |
| F10 | Gerätezustände simulieren | V | Alle Zustände aus DEMO_DATA_SPEC sind in Interviewsteuerung auswählbar; Wechsel ist unmittelbar nachvollziehbar. |
| F11 | Übertragung und Laden nur simulieren | V | Aktion heisst „Übertragung simulieren“ bzw. „Laden simulieren“; kein Bluetooth- oder Netzwerkzugriff. |
| F12 | Demo reproduzierbar zurücksetzen | F | Reset stellt Basisszenario, Heute, Standardvariante A und geschlossene Details wieder her. |
| F13 | Installierbare PWA bereitstellen | F | Name SMARTwearable, eigenes Icon, eigenständiger Start auf dem Zieltablet; Installation tatsächlich prüfen. |
| F14 | Vorbereitete Demo offline weiterverwenden | V | Nach einmaliger vollständiger Vorbereitung funktionieren Kaltstart und alle Kernansichten ohne Netz. |
| F15 | Unbekannte Werte verständlich behandeln | V | Fehlende Angaben erscheinen als „nicht verfügbar“ bzw. „noch nicht abschätzbar“, nicht als 0. |

## Zustandsmodell (V)

Gemeinsamer Zustand: selectedDate, todayVariant, scenarioId, deviceScenarioId und currentView. Öffnen/Schliessen von Details verändert den Datensatz nicht. Datum und Variante bleiben bei Navigation erhalten. Szenariowechsel setzt Datum auf Demo-Heute, Variante bleibt erhalten; Reset setzt alles zurück.

Interviewsteuerung wird über einen beschrifteten Link geöffnet. Kein Login erforderlich: Die Trennung dient der Orientierung, nicht einer echten Rechteverwaltung. Reset fragt „Demo auf Anfang zurücksetzen?“; Abbruch verändert nichts. Vorläufig nur Sitzungsspeicher, kein Speichern von Interviewantworten.

## Simulierte Geräteaktionen (V)

„Übertragung simulieren“: ausstehend → läuft → erfolgreich; nach deterministischer kurzer Verzögerung Datenstand und letzte Übertragung aktualisieren, Messdaten unverändert lassen. Fehler-Szenario bleibt fehlgeschlagen und erlaubt erneuten Versuch. Explizit kennzeichnen, dass keine echten Daten übertragen werden.

„Laden simulieren“: Zustand wechselt auf lädt, ohne erfundene Echtzeit-Ladekurve. Separater Abschluss stellt den definierten geladenen Demo-Zustand her. Akku und Speicher bleiben unabhängige Grössen.
