# Nichtfunktionale Anforderungen

Version 0.5 · 09.11.2026

Qualitätsziele stammen aus den Projektvorgaben. Alle hier vorgeschlagenen Zahlenwerte sind VORSCHLÄGE, keine bereits freigegebenen Norm- oder Gerätebehauptungen. P1 = für erste Interviewversion wichtig, P2 = ergänzend.

| ID | Anforderung | Begründung | Priorität | Prüfkriterium (V) | Status |
| --- | --- | --- | --- | --- | --- |
| N01 | Gute Lesbarkeit | Selbstständige Bedienung | P1 | Fliesstext mindestens 20 CSS-Pixel, Beschriftungen mindestens 18; keine abgeschnittenen Zahlen am Tablet. | V |
| N02 | Gut treffbare Touch-Flächen | Unterschiedliche Motorik | P1 | Aktionen mindestens 48 × 48 CSS-Pixel; benachbarte Aktionen mindestens 8 CSS-Pixel Abstand. | V |
| N03 | Deutliche Kontraste | Zugänglichkeit | P1 | Textkontrast mindestens 4,5:1; wesentliche grafische Elemente mindestens 3:1; Farbe immer mit Text/Symbol. | V |
| N04 | Vergrösserbare Inhalte | Unterschiedlicher Sehbedarf | P1 | Bei 200 % Vergrösserung kein Informationsverlust und keine überlagerten Bedienelemente. | V |
| N05 | Hoch- und Querformat | Bestätigter Tablet-Kontext | P1 | Drehung erhält Datum, Variante und Szenario; kein horizontales Scrollen der Seite. | F, Prüfkriterium V |
| N06 | Einfache Informationshierarchie | Übersicht mit Vertiefung | P1 | Startseite zeigt ausschliesslich Aktivität als zentrale Wochengrafik; Schritte und Puls erst in Details. | F, Prüfkriterium V |
| N07 | Klare Orientierung | Selbstständigkeit | P1 | Jede Detailansicht mit Titel und beschriftetem Zurückweg; Armband, D1 und W2 höchstens zwei Aktionen ab C2; alle Unterseiten mit rotem Startseite-Button. | V |
| N08 | Schnelle Reaktion | Flüssige Interviews | P1 | Lokale Navigation nach Vorbereitung in unter 300 ms sichtbar; erste Interaktion nach vorbereitetem Kaltstart unter 3 s am Tablet. | V |
| N09 | Respektvolle Sprache | Autonomie, keine Bewertung | P1 | Textprüfung: keine Ranglisten, Strafsymbole, pauschalen Ziele, Heilungs- oder Leistungsurteile. | F, Prüfkriterium V |
| N10 | Eindeutige Datenbedeutung | Fehlinterpretationen verhindern | P1 | Zeitraum, Einheit und Demo-Hinweis sichtbar; fehlende Messung von wenig Bewegung unterscheidbar. | F, Prüfkriterium V |
| N11 | Interviewstabilität | Reproduzierbarkeit | P1 | Zehn vollständige Aufgabenrunden ohne Fehler; Reset erzeugt denselben Startzustand. | V |
| N12 | Austauschbare Inhalte | Iterative Forschung | P1 | Texte und Daten zentral änderbar; Varianten teilen dieselbe Berechnungslogik. | V |
| N13 | Datensparsamkeit | Öffentliche Demo | P1 | Keine echten Personen, Tracker, externen Schrift-/Diagrammdienste oder Interviewdatenübermittlung. | F, Prüfkriterium V |
| N14 | Offline-Verfügbarkeit | Reserve bei Netzausfall | P2 | Vorbereitete PWA im Flugmodus neu starten und alle Aufgaben ausführen. | V |
| N15 | Nachvollziehbare Version | Gemeinsame Arbeit | P1 | Demo-Version im Interviewbereich; Anforderungen und dokumentierter Implementierungsstand stimmen überein. | V |

Prüfungen auf Desktop und simulierten Ansichtsgrössen ersetzen nicht die reale Prüfung auf Lenovo Tab TB311FU. Android-/Browserversion und tatsächliche CSS-Ansichtsgrösse beim Tablet-Test notieren; aus der Modellnummer nicht ableiten.

N16 (F): gleiche Datenbasis und Einheiten in C2/D1/W2; Zeit-/Datenstandfilter auch für Kategorie-Puls anwenden. Prüfen: Tages-/Wochensummen, Min/Max und Mittelwerte aus gültigen Rohproben identisch. Keine Reiter ohne Funktion.

N17 (F, konkrete Grössen ANNAHME): Kompakte Startseite Variante 2 ohne vertikales/horizontales Scrollen bei Standard-Schrift in verfügbaren App-Ansichten 1280×640, 1180×620, 1024×560 und 820×1020 CSS-Pixel. Alle drei Hauptaktionen und Footer vollständig innerhalb des Viewports; keine überdeckten Inhalte. Dies sind Browser-Testfenster nach Abzug der Systemflächen, keine zugesicherten Lenovo-Gerätemasse. Bei 200-%-Zoom und kleinen Fenstern vertikales Scrollen als barrierearmer Rückfall zulassen. Reale verfügbare Höhe am Lenovo noch messen.

N18 (F, Grössen ANNAHME): W2/D1/Tag bei normaler Schrift in verfügbaren App-Flächen 1280×640, 1180×620, 1024×640 und 820×1020 CSS-Pixel prüfen. Primäre Grafiken samt Navigation und Legenden sichtbar; bei sehr geringer Höhe, vergrösserter Schrift oder aufgeklappten Rohwerten vertikales Scrollen erlauben. Kein horizontaler Seitenüberlauf und keine abgeschnittenen Werte. Werkzeugzeile möglichst einreihig, bei Platzmangel lesbar umbrechen; keine erzwungene Verkleinerung der Touch-Ziele. Numerische Skalen und Tageszeitachsen müssen mit Grafikwerten übereinstimmen. Keine von den Systemleisten verdeckten Bedienelemente. Reale Lenovo-Abnahme bleibt offen.

N19 (F, konkrete Prüfflächen A): Ersteinrichtung und Einstellungen sind mit Tastatur, Screenreader-Beschriftungen und Touch erreichbar. Auswahlfelder mindestens 48×48 CSS-Pixel; Ersteinrichtung darf vertikal scrollen, Bestätigung bleibt normal im Dokumentfluss erreichbar. Bei 200-%-Zoom kein horizontaler Seitenüberlauf und keine verdeckten Aktionen. Home bleibt bei N17-Prüfflächen ohne Scrollen bedienbar; keine Einstellungen dürfen zentrale Aktivitätsgrafik oder drei Hauptaktionen verdrängen/verdecken. Die drei neuen Home-Zugänge müssen vollständig sichtbar oder bei Platzmangel über eine ausdrücklich freizugebende Alternative zugänglich sein. Reale Lenovo-Prüfung bleibt offen.

N20 (F): Einstellungen dürfen nur die drei vereinbarten Präferenzen enthalten. Keine Messwerte, Namen, Kontaktdaten, Interviewantworten oder Kennungen werden in Browser-Speicher abgelegt oder übertragen. Storage-Schlüssel ist versionsgebunden; ungültige/fehlende Daten sicher wie nicht eingerichtet behandeln.

N21 (V, zur Umsetzung beauftragt): Die Präferenz-Ersteinrichtung/-bearbeitung nutzt die verfügbare Tabletbreite ohne unnötige Maximalbreite oder grosse Ränder. Bei 1280×640 und 1180×620 CSS-Pixeln sind bei Standardschrift alle drei Gruppen, der Demo-Hinweis und die Bestätigung ohne vertikales Scrollen sichtbar; 1024×560 wird ebenso angestrebt. Prüfflächen bezeichnen die verfügbare Browserfläche nach Systemleisten. Auswahl und Bestätigung mindestens 48×48 CSS-Pixel. Kein horizontaler Überlauf. Bei 820×1020 ist ein gut lesbares zweispaltiges Raster zulässig; unter 701 Pixeln sowie bei 200-%-Zoom darf einspaltig umgebrochen und vertikal gescrollt werden. Keine Überlagerung oder abgeschnittenen Texte. Der Einstieg ohne vollständige Einstellungen zeigt keinen Startseite-Button; beim Bearbeiten gespeicherter Einstellungen bleibt dieser sichtbar. Screenshotprüfung in Quer- und Hochformat. Reale Lenovo-Abnahme bleibt offen.
