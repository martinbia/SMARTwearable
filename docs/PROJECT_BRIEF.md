# SMARTwearable – Projektauftrag

Version 0.3 · 08.11.2026

## Ziel (F)

Eine installierbare Tablet-PWA demonstriert fiktive Aktivitätsdaten eines Armbands. Patienten nach Hüftoperation zu Hause beurteilen Verständlichkeit, Nutzen und gewünschte Detailtiefe. Das Mock-up untersucht Präferenzen; es weist weder medizinischen Nutzen noch Sensorleistung nach.

## Nutzungskontext (F)

Die interviewte Person legt ein Armband an und erhält nach kurzer Einführung das Lenovo Tab TB311FU mit SMARTwearable. Danach bedient sie die PWA selbstständig. Das angelegte Armband ist im Mock-up nicht technisch verbunden; dies wird vorab erklärt. Internet wird als vorhanden angenommen. Offline-Funktion nach Vorbereitung ist VORSCHLAG.

## Bestätigter Umfang v0.3 (F)

Startseite Variante 2: nur Aktivität mit aktuellem Wochenstand, Ziel mit Toleranzband und persönlicher Bestwoche; kompakt für die zwischen den Android-Systemleisten verfügbare Fläche. Schritte/Puls ausschliesslich in Details. D1: ausgewählte Kalenderwoche nach Tagen mit Aktivität, Schritten und erweitertem Puls. W2: mehrere Wochen, alle drei Messgrössen gleichzeitig (Annahme: sechs Wochen). Woche/Tag unmittelbar antippbar. Roter Startseite-Button auf Unterseiten, kompakter Armband-Akkustatus, aktuelles lokales Datum vom Appstart. Ursprünglicher Heute-A/B-Vergleich ersetzt. Alle Daten bleiben erfunden.

## Grundlagen und abgeleitete Bedürfnisse

Die übernommene Konzeptdokumentation nennt Persona1_Hildegard.pdf, Persona2_Edgar.pdf und SMARTcoach_Patientenjourney_v0.2.md als Grundlagen. Die Originale sind nicht Teil dieses öffentlichen Pakets und wurden bei dieser GUI-Implementierung nicht erneut geprüft. Die folgenden Bedürfnisse wurden aus der vorhandenen Projektdokumentation übernommen.

| Grundlage | Im Entwurf berücksichtigtes Bedürfnis |
| --- | --- |
| Hildegard | Alltag und soziale Teilhabe erhalten; Unsicherheit nach Sturz beachten |
| Edgar | Selbstbestimmung bewahren; Bevormundung und Leistungsdruck vermeiden |
| Fiktive Journey Ernst Baumann | Orientierung zu Hause, Therapiegespräche vorbereiten, persönliche Ziele respektieren |

Diese qualitativen Grundlagen sind keine repräsentative Bedarfserhebung. Konkrete Tablet-Erfahrung, bevorzugte Kennzahlen und Schriftgrössen sind zu prüfen. Das Mock-up enthält nur die hier zusammengefassten Bedürfnisse und neu erfundene Daten.

## Nicht im ersten Umfang

Chatbot, Sprache, medizinische Dokumentenansicht, echte Sensorerkennung, Therapieempfehlungen, Sturzerkennung, Konten, echter Datenversand, integrierte Interviewaufzeichnung.

## Geräteannahmen und spätere Optionen

Puls, Hauttemperatur und Bewegungssensorik sind hypothetische Datenquellen. „IMC“ wurde noch nicht als IMU bestätigt. Es ist kein konkretes Wearable ausgewählt. Fitbit und Polar-H10-Apps dienen nur als Inspiration für Informationsarten; daraus werden keine Gerätefähigkeiten oder proprietären Scores übernommen.

Nach der ersten Iteration diskutierbar: Schlafdauer, Herzfrequenzvariabilität bei geeigneten Schlagintervalldaten, Aktivitätsverteilung, Unterbrechungen bewegungsarmer Phasen, Tragedauer und freiwillige Selbstberichte. Gangqualität, Symmetrie, Körperhaltung und Übungserkennung erfordern gesonderte technische und fachliche Klärung. Keine dieser Optionen ist beauftragt.
