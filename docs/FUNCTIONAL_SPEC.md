# Funktionale Spezifikation

Version 0.4 · 08.11.2026. F = festgelegt, A = dokumentierte technische Annahme, V = Vorschlag. IDs bleiben erhalten, ersetzte Anforderungen werden explizit benannt.

| ID | Funktion / Änderung | Status | Prüfkriterium |
| --- | --- | --- | --- |
| F01 | C2 als grafische Wochen-Startseite ersetzt numerischen Heute-Einstieg | F | Nur Aktivität: Wochenstand, Zielbereich und aktivste abgeschlossene Woche sichtbar; Schritte/Puls ausschliesslich in Details. |
| F02 | A/B-Vergleich ersetzt durch ausgewählte C2/D1/W2 | F | Keine alten A/B-Umschalter; gemeinsam berechnete Daten in allen Ansichten. |
| F03 | Tagesdetails Schritte/Strecke/Puls/Hauttemperatur erhalten und nach Bewegungsart erweitern | F | Kontext-Rückweg, Kategorieintervalle und Messwertherkunft vorhanden. |
| F04 | D1 Montag–Sonntag für ausgewählte Woche | F | Alle vorhandenen Tage auswählbar; Zukunft ohne Nullwerte. |
| F05 | Armbandstatus, Restlaufzeit und Übertragung | F | Datenstand, letzte und geplante Übertragung getrennt, nur simuliert. |
| F06 | Interviewsteuerung für Szenarien und Reset | F | Szenarien erreichbar, keine A/B-Auswahl mehr. |
| F07 | Kompakter Status ausdrücklich Armband-Akku | F | Kein unbeschrifteter Akku, kein grosser Kopf-Banner. |
| F08 | Herkunft / Beispieldaten erklären | V, beauftragt | Dauerhafter kleiner Infozugang, keine echte Messung suggerieren. |
| F09 | Datenlücken und Messabdeckung | V, beauftragt | Lücken aus allen Messwertberechnungen ausschliessen und kennzeichnen. |
| F10 | Gerätezustände simulieren | V, beauftragt | Neun Zustände und unbekannte Restlaufzeiten vorhanden. |
| F11 | Lade-/Übertragungssimulation | V, beauftragt | Vor/nach Übertragung konsistente Summen und Kurven; keine echte Geräteverbindung. |
| F12 | Reproduzierbarer Reset aktualisiert | F | C2, aktuelle Woche, S01/G01; Appstart-Zeitanker unverändert. |
| F13 | Installierbare PWA | F | Manifest, Scope, lokale Icons; reale Lenovo-Installation separat prüfen. |
| F14 | Vorbereitete Offline-Nutzung | V, beauftragt | Alle neuen Module mitgecacht, Neustart und Navigation offline. |
| F15 | Unbekannt/fehlend ohne erfundene Null | V, beauftragt | Nicht getragen, fehlende Kategorie und Zukunft korrekt unterscheiden. |
| F16 | Lokales Datum beim Appstart | F | Kein festes Demo-Datum; Montag–Sonntag korrekt über Monats-/Jahres-/Sommerzeitgrenzen. |
| F17 | Zielband und Bestwoche | F, Parameter A | Bereich 90–110 / Ziel 100 nur Demo; Bestwert aus abgeschlossenen vollständig erfassten Wochen. |
| F18 | W2 sechs Wochen gleichzeitig | F, Anzahl A | Aktivität, Schritte, Puls mit unabhängigen Skalen; keine Messgrössenreiter. |
| F19 | Woche direkt antippbar | F | Jeder Wochenbalken/-datum/-puls öffnet passende D1; kein zusätzlicher Klick zur Bestätigung. |
| F20 | Puls erweitert | F | Min/Max/Mean aus gültigen Proben; Mittelwerte bei Schritten und sonstiger Bewegung gesondert. |
| F21 | Roter Startseite-Button auf allen Unterseiten | F | Weiss auf Rot, gleich positioniert; Rückkehr nach C2. |
| F22 | Kompakte Startseite Variante 2 | F | Keine Schritte-/Pulskarten; kompakte gemeinsame Kopfzeile; Woche nach Tagen, Wochenvergleich und Mein Armband direkt erreichbar. |
| F23 | Kompakter Detailrahmen | F | W2/D1/Tag ohne Marken-/Heute-Banner; Navigation, Titel, Armbandstatus und Info gemeinsam, rote Startseite erhalten. |
| F24 | Diagramme im Vordergrund | F | W2 drei, D1 vier kompakte Messreihen; Tag mit zwei ausgerichteten Bewegungsspuren und Pulsverlauf. Schritte/Puls und direkte Navigation bleiben erhalten. |
| F25 | Zusätzliche Tagesangaben aufklappbar | F | Strecke, Hauttemperatur, Bewegungsabschnitte und Puls-Rohwerte vollständig über Weitere Angaben erreichbar; beim Einstieg geschlossen. |


Annahmen: Zustand nur während der Sitzung; Neuladen beginnt neu. Erstinformation über ständig verfügbares Info statt Pflichtdialog. Appstart-Datum und -Uhrzeit werden für das Interview eingefroren. Reale Uhrzeit begrenzt heutige Beispieldaten; Beginn vor 08 Uhr zeigt keine Daten statt erfundener früher Messwerte. Kategorien sind hypothetische Klassifikation.
