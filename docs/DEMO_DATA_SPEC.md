# Demodaten und simulierte Gerätezustände

Version 0.1 · 06.11.2026 · Sämtliche Zahlen und Schemaentscheidungen sind VORSCHLÄGE für die Demo, keine medizinischen Referenzwerte.

## Zeit und Beispielgeschichte

Fester Demo-Zeitpunkt: 09.11.2026, 14:30 Uhr, Europe/Zurich. Damit umfasst 03.–09.11. sieben Tage zu Hause nach dem fiktiven Austritt am 02.11. aus der Ernst-Journey. Die Verlegung von Demo-Heute gegenüber SMARTcoach (06.11.) ist eine ausdrücklich vorgeschlagene Anpassung. Es werden keine zusätzlichen medizinischen Ereignisse erfunden. Die Oberfläche kann auf den Namen verzichten.

Kein Datum aus der Systemuhr ableiten. Zeitstempel mit Zeitzonenoffset speichern; heute nur bis 14:30 auswerten. Letzte erfolgreiche Übertragung 14:32 bei Datenstand 14:30 wäre unmöglich zum Demo-Zeitpunkt; solche Kombinationen bei der Validierung ausschliessen.

## Datenstruktur (V)

- demo: schemaVersion, datasetVersion, timezone, demoNow, defaultVariant, defaultScenarioId, defaultDeviceScenarioId.
- day: date, observationStart, observationEnd, activityIntervals, coverageIntervals, gapIntervals, estimatedSteps, estimatedDistanceM, pulseSamples, skinTemperatureSamples.
- activityInterval: id, start, end, kind=movement, source=derived_demo.
- coverageInterval: start, end, quality=valid. Gemeint ist Messabdeckung im ausgewerteten Zeitfenster, nicht nachgewiesene ganztägige Tragedauer.
- gapInterval: start, end, reason (no_signal oder not_worn_demo). Grund nur anzeigen, wenn im Szenario vorgegeben, sonst „Datenlücke“.
- Messprobe: timestamp, value, unit, quality; gültige Einheiten bpm bzw. °C. Kein Messwert ist ein echter Patientendatensatz.
- Gerätestatus: batteryPercent, charging, estimatedRuntimeHours (null möglich), estimateBasis, connected, lastSuccessfulTransfer, dataThrough, nextPlannedTransfer, pendingFrom, pendingTo, remainingStorageHours (null möglich), transferState.
- Selbstberichte: für v0.1 nicht erforderlich; bei späterer Ergänzung eigener source=self_report_demo, nie als automatisch erkannt markieren.

## Basisszenario S01: sieben Tage

Beobachtungsfenster abgeschlossene Tage 08:00–20:00 (720 min); heute 08:00–14:30 (390 min). Fehlende Zeit ausserhalb des Fensters wird nicht als gemessene Ruhe interpretiert. Heute ist ausdrücklich ein unvollständiger Tag.

| Datum | Bewegungsintervalle | Minuten | Abschnitte | Schritte geschätzt | Strecke geschätzt | Messabdeckung |
| --- | --- | --- | --- | --- | --- | --- |
| 03.11. | 09:00–09:05; 11:00–11:04; 14:00–14:04; 17:00–17:05 | 18 | 4 | 800 | 320 m | 720/720 min |
| 04.11. | 09:00–09:05; 11:00–11:05; 13:00–13:04; 15:00–15:04; 18:00–18:04 | 22 | 5 | 1000 | 400 m | 720/720 min |
| 05.11. | 09:00–09:04; 12:00–12:04; 17:00–17:04 | 12 | 3 | 550 | 220 m | 720/720 min |
| 06.11. | 09:00–09:05; 11:00–11:05; 13:00–13:04; 16:00–16:05; 18:00–18:05 | 24 | 5 | 1100 | 440 m | 720/720 min |
| 07.11. | 09:00–09:05; 11:00–11:05; 16:00–16:05; 18:00–18:05 | 20 | 4 | 900 | 360 m | 600/720 min; Lücke 13:00–15:00 |
| 08.11. | 09:00–09:05; 11:00–11:05; 13:00–13:05; 15:00–15:05; 17:00–17:05; 19:00–19:05 | 30 | 6 | 1400 | 560 m | 720/720 min |
| 09.11. | 08:40–08:46; 10:15–10:20; 11:35–11:42; 13:50–13:56 | 24 | 4 | 1100 | 440 m | 390/390 min, bisher |

Schritte und Strecke sind unabhängige vorgegebene Demowerte, keine validierte Ableitung aus Bewegungsminuten. Die hier verwendeten 0,4 m je Schritt sind eine reine Beispieldatenbeziehung, keine angenommene individuelle Schrittlänge.

## Berechnungsregeln

- Intervalle halb offen [start, end), ohne Überlappung, auf Beobachtungsfenster und gültige Messabdeckung begrenzt.
- Bewegungsminuten = Summe gültiger Intervalllängen in Sekunden / 60; Anzeige auf ganze Minuten runden. Keine zusätzlichen versteckten Summen je Variante.
- Abschnittsanzahl = Zahl definierter Intervalle; keine automatische Zusammenfassung getrennter Intervalle.
- Datenlücke = Zeit ohne gültige Abdeckung; nicht addieren zu bewegungsarmer Zeit.
- Längster Abschnitt = maximale Intervalllänge, nur Detailoption.
- Bewegungsarme Zeit = gültige Abdeckung minus Bewegungsintervalle, keine Gleichsetzung mit Sitzen oder Schlaf.
- Messabdeckung = gültige Minuten / Länge des Beobachtungsfensters; keine Prozentangabe ohne Bezugszeitraum.
- Puls: einfacher Mittelwert gültiger, gleichmässig verteilter Proben im gewählten Zeitraum; bei unregelmässigen Proben stattdessen zeitgewichtet oder keine Mittelwertanzeige. Minimum/Maximum nur über gültige Proben. Lücken nicht interpolieren.
- Fehlende Messwerte null, niemals 0 einsetzen. Abgeleitete Werte ebenfalls null, wenn Datengrundlage fehlt.

## Vitaldaten-Startwerte (V)

Für Heute gleichmässige Pulsproben alle fünf Minuten von 08:00 bis 14:30: ausserhalb Bewegung deterministisches wiederholtes Muster [72,74,73,75], innerhalb Bewegungsintervallen [86,90,94,88]; Auswahl über fortlaufenden Probenindex. Hauttemperatur stündlich 08:00–14:00: [32.4,32.6,32.5,32.8,32.7,32.9,32.6] °C. Keine Normwertbewertung. Für ältere Tage dürfen Vitaldaten ausdrücklich „nicht als Demo hinterlegt“ sein. Keine zufällige Neuerzeugung beim Ansichtswechsel.

## Aktivitätsszenarien

| ID | Änderung für Heute | Erwartung |
| --- | --- | --- |
| S01 | Basistabelle | 24 min, 4 Abschnitte |
| S02 | Nur 08:40–08:44 und 13:50–13:54; Schritte 400, Strecke 160 m | 8 min, 2 Abschnitte; neutraler ruhigerer Tag |
| S03 | S01 plus Lücke 10:00–12:00; enthaltene Bewegung entfernen; Schritte 550, Strecke 220 m | 12 min, 2 Abschnitte, 270/390 min Abdeckung |

Szenariowechsel muss Messproben in Lücken entfernen. Ruhigerer Tag beweist keine Verschlechterung. Fester Demo-Heute bleibt unverändert; die Wochentabelle übernimmt die geänderten Heute-Werte.

## Gerätezustände (unabhängig von Aktivitätsvarianten)

Basis G01: Akku 62 %, geschätzt 48 h, verbunden, letzte Übertragung 14:30, Daten bis 14:30, nächste geplant 18:00, keine ausstehenden Daten, Speicher geschätzt 72 h. Schätzbasis: vorgegebener fiktiver Betriebsmodus, kein reales Akkumodell.

| ID | Abweichung von G01 | Darstellung/Handlung |
| --- | --- | --- |
| G02 | Akku 15 %, geschätzt 8 h | „Bitte heute laden“ |
| G03 | Akku 35 %, charging=true, Laufzeit null | „Wird geladen – Restlaufzeit noch nicht abschätzbar“ |
| G04 | Nicht verbunden; letzte Übertragung 10:20; Daten bis 10:15; lokal 10:15–14:30 ausstehend | „Zeichnet weiter auf dem Armband auf (Demo)“ |
| G05 | Verbunden, Übertragung ausstehend; Zeitangaben wie G04 | „Neue Daten noch nicht übertragen“ |
| G06 | Wie G05, Zustand läuft | „Datenübertragung läuft (Demo)“ |
| G07 | Wie G05, Zustand fehlgeschlagen | „Übertragung erneut simulieren“ im Interviewbereich |
| G08 | Speicher noch geschätzt 4 h | „Bitte bis 18:30 Uhr übertragen“; unabhängig von Akku |
| G09 | Restlaufzeit und Speicherzeit null | „Noch nicht abschätzbar“ |

Nichttragen/Messsignal sind Aktivitäts-Datenqualitätszustände, keine blossen Verbindungszustände. S03 verwendet „Messsignal fehlt“; ein zusätzlicher Grund „nicht getragen (Demo)“ darf dieselbe Lücke erläutern.

Wichtig: Bei Datenstand 10:15 dürfen Tageswerte nur bis 10:15 aus dem Datensatz berechnet werden. Der lokal noch nicht übertragene Rest bleibt unsichtbar. Nach simulierter erfolgreicher Übertragung bis 14:30 werden vollständige Werte sichtbar. Datenstand bei historischen Tagen entsprechend begrenzen. Anzeige, Status und berechnete Summen müssen dieselbe Grenze verwenden.

Vorläufige Implementierung: Schritte und Strecke liegen nur als Gesamtsummen vor. Bei Teilübertragung deshalb „nicht verfügbar“ anzeigen; keine proportionalen Teilsummen erfinden. Bei Datenstand 10:15 zeigt S01 nur den abgeschlossenen Abschnitt 08:40–08:46 (6 Minuten). Nach kompletter Übertragung wieder 24 Minuten. Erfolgreiche Übertragung wird durchgängig zum festen Demo-Zeitpunkt 14:30 simuliert.

Ende der Ladesimulation als zusätzlicher fiktiver Zustand: 100 % Batterie, geschätzte Laufzeit 77 Stunden. Speicher- und Übertragungszustand bleiben dabei unverändert.

## Plausibilitätsprüfungen

Minuten und Abschnitte aus Tabelle nachrechnen; Bewegung liegt innerhalb gültiger Abdeckung. Heute-Vergangenheit endet bei demoNow. Zeitstempel lastSuccessfulTransfer und dataThrough sind nicht zukünftig; dataThrough höchstens lastSuccessfulTransfer. Restlaufzeit und Speicherzeit nicht aus Akku-Prozent allein berechnen. Diese Prüfungen sind vor Veröffentlichung erforderlich.
