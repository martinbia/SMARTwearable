# Nichtfunktionale Anforderungen

Version 0.1 · 06.11.2026

Qualitätsziele stammen aus den Projektvorgaben. Alle hier vorgeschlagenen Zahlenwerte sind VORSCHLÄGE, keine bereits freigegebenen Norm- oder Gerätebehauptungen. P1 = für erste Interviewversion wichtig, P2 = ergänzend.

| ID | Anforderung | Begründung | Priorität | Prüfkriterium (V) | Status |
| --- | --- | --- | --- | --- | --- |
| N01 | Gute Lesbarkeit | Selbstständige Bedienung | P1 | Fliesstext mindestens 20 CSS-Pixel, Beschriftungen mindestens 18; keine abgeschnittenen Zahlen am Tablet. | V |
| N02 | Gut treffbare Touch-Flächen | Unterschiedliche Motorik | P1 | Aktionen mindestens 48 × 48 CSS-Pixel; benachbarte Aktionen mindestens 8 CSS-Pixel Abstand. | V |
| N03 | Deutliche Kontraste | Zugänglichkeit | P1 | Textkontrast mindestens 4,5:1; wesentliche grafische Elemente mindestens 3:1; Farbe immer mit Text/Symbol. | V |
| N04 | Vergrösserbare Inhalte | Unterschiedlicher Sehbedarf | P1 | Bei 200 % Vergrösserung kein Informationsverlust und keine überlagerten Bedienelemente. | V |
| N05 | Hoch- und Querformat | Bestätigter Tablet-Kontext | P1 | Drehung erhält Datum, Variante und Szenario; kein horizontales Scrollen der Seite. | F, Prüfkriterium V |
| N06 | Einfache Informationshierarchie | Übersicht mit Vertiefung | P1 | Heute enthält drei zentrale Informationsbereiche plus kompakten Status; Zusatzkennzahlen in Details. | F, Prüfkriterium V |
| N07 | Klare Orientierung | Selbstständigkeit | P1 | Jede Detailansicht mit Titel und beschriftetem Zurückweg; Armband und Woche höchstens zwei Aktionen ab Heute. | V |
| N08 | Schnelle Reaktion | Flüssige Interviews | P1 | Lokale Navigation nach Vorbereitung in unter 300 ms sichtbar; erste Interaktion nach vorbereitetem Kaltstart unter 3 s am Tablet. | V |
| N09 | Respektvolle Sprache | Autonomie, keine Bewertung | P1 | Textprüfung: keine Ranglisten, Strafsymbole, pauschalen Ziele, Heilungs- oder Leistungsurteile. | F, Prüfkriterium V |
| N10 | Eindeutige Datenbedeutung | Fehlinterpretationen verhindern | P1 | Zeitraum, Einheit und Demo-Hinweis sichtbar; fehlende Messung von wenig Bewegung unterscheidbar. | F, Prüfkriterium V |
| N11 | Interviewstabilität | Reproduzierbarkeit | P1 | Zehn vollständige Aufgabenrunden ohne Fehler; Reset erzeugt denselben Startzustand. | V |
| N12 | Austauschbare Inhalte | Iterative Forschung | P1 | Texte und Daten zentral änderbar; Varianten teilen dieselbe Berechnungslogik. | V |
| N13 | Datensparsamkeit | Öffentliche Demo | P1 | Keine echten Personen, Tracker, externen Schrift-/Diagrammdienste oder Interviewdatenübermittlung. | F, Prüfkriterium V |
| N14 | Offline-Verfügbarkeit | Reserve bei Netzausfall | P2 | Vorbereitete PWA im Flugmodus neu starten und alle Aufgaben ausführen. | V |
| N15 | Nachvollziehbare Version | Gemeinsame Arbeit | P1 | Demo-Version im Interviewbereich; Anforderungen und dokumentierter Implementierungsstand stimmen überein. | V |

Prüfungen auf Desktop und simulierten Ansichtsgrössen ersetzen nicht die reale Prüfung auf Lenovo Tab TB311FU. Android-/Browserversion und tatsächliche CSS-Ansichtsgrösse beim Tablet-Test notieren; aus der Modellnummer nicht ableiten.
