# Implementierungs- und Prüfstand v0.2

08.11.2026 · Anwendung0.2.0 · Branch feat/gui-c2-d1-w2. Neuer Pull Request, kein automatisches Merge und keine Veröffentlichung dieses Stands vor Merge.

## Implementierung

F01/F02 durch C2/D1/W2 ersetzt, F03–F15 erhalten/angepasst. F16–F21 implementiert: lokales Appstart-Datum, Zielband, sechs Wochen, direktes Öffnen einer Woche, Puls-Min/Max und Kategorien, roter Startseite-Button auf allen Unterseiten. Aktueller Stand aus gemeinsamen Datenselektoren, nicht aus unabhängigen Grafikzahlen.

## Lokal ausgeführte Prüfungen

- Syntaxprüfung erfolgreich, statischer Build erfolgreich (12 lokale Assets plus Service Worker).
- Elf automatisierte Tests erfolgreich: Kalender-/Jahres-/Monats-/Sommerzeitgrenzen, lokale Gerätezeitzonen gegen UTC, alle Wochentage, zukünftige Tage ohne falsche Nullmessungen, exakte Tages-/Wochensummen, Bestwochenfilter, Puls-Min/Max/Mittel und Kategorie-Puls, Datenlücken und Übertragungsgrenzen, direkte Navigationszustände, zehn UI-Aufgabenrunden, Lade-/Fehlersimulation und Reset.
- Cache-Harness prüft neue Kalender-/Grafikmodule, Unterpfad und Offline-Fallback.
- Chromium lokal versucht; Laufzeit blockiert Prozessstart mit „socket() failed: Operation not permitted“. Echte Browserprüfung deshalb im PR-Workflow auf GitHub. Ergebnis nach erfolgreichem Lauf ergänzen; nicht durch lokale Modelltests ersetzen.

## Annahmen und verbleibende Grenzen

- Ziel100/Band90–110, sechs Wochen und Beispieldaten sind Demoparameter. Keine klinischen Grenzwerte.
- „Allgemeine Aktivität“ ist die Vereinigung disjunkter Schritt-/sonstiger Bewegungsintervalle; Kategorien sind hypothetische Erkennung.
- Puls während Bewegung zunächst als Mittelwert je Kategorie. Min/Max des Tages bleiben zusätzlich sichtbar. Alle Mittelwerte aus gleichabständigen verfügbaren Proben, Wochenmittel nicht aus Tagesmittelwerten mitteln.
- Datum/Uhrzeit der Sitzung eingefroren, auch über Mitternacht; Neustart erforderlich für neues Heute. Uhrzeit begrenzt Messwerte. Geräteaktionen simulieren bis zu diesem Sitzungsstand.
- Keine obligatorische Startbestätigung, stattdessen permanenter Infozugang; keine Interviewdaten, keine Logins, keine echte Hardware.
- Bei schmalen Bildschirmen Karten statt unlesbarer Matrix. Grafiken und Text zeigen dieselben Daten.
- Sensor, Android-/Browserversion, Messgenauigkeit und individuelles Ziel bleiben fachlich/technisch offen.

## Vor Interview am Lenovo Tab TB311FU

1. Installation/Standalone-Start, reales Datum und lokale Uhrzeit prüfen; vor08Uhr und an anderem Wochentag erneut starten.
2. C2→W2→vergangene Woche→Tag→Woche und roter Startseite-Button prüfen. Ausgewählte Woche darf beim Zurückgehen nicht wechseln.
3. Hoch-/Querformat, Schriftgrösse/200-%-Zoom, Touch-Flächen und Kontraste prüfen. Reaktionszeiten messen.
4. Aktuelle Woche als unvollständig, Zukunft ohne Nullbalken, Lückentag und S03 durchspielen.
5. Tages-/Wochenpulse und Kategorie-Mittelwerte erklären lassen; kein hoher Puls als Erfolg.
6. G05-Übertragung aktualisiert sämtliche Ansichten, G07 bleibt Fehler, Reset beendet laufende Simulation.
7. Offline-Bereitschaft abwarten, Flugmodus, echter Kaltstart und alle Navigationswege prüfen.
8. Update von0.1.0 zu0.2.0 und korrekte Neuladung prüfen. Reale Performance und Verständlichkeit wurden durch CI nicht nachgewiesen.
