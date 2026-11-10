# SMARTwearable – Projektauftrag

Version 0.7 · 09.11.2026

## Ziel (F)

Eine installierbare Tablet-PWA demonstriert fiktive Aktivitätsdaten eines Armbands. Patienten nach Hüftoperation zu Hause beurteilen Verständlichkeit, Nutzen und gewünschte Detailtiefe. Das Mock-up untersucht Präferenzen; es weist weder medizinischen Nutzen noch Sensorleistung nach.

## Nutzungskontext (F)

Die interviewte Person legt ein Armband an und erhält nach kurzer Einführung das Lenovo Tab TB311FU mit SMARTwearable. Danach bedient sie die PWA selbstständig. Das angelegte Armband ist im Mock-up nicht technisch verbunden; dies wird vorab erklärt. Internet wird als vorhanden angenommen. Offline-Funktion nach Vorbereitung ist VORSCHLAG.

## Bestätigter Umfang v0.4 (F)

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

Ab v0.4: W2/D1/Tag mit gemeinsamem kompaktem Detailrahmen und Diagrammfokus gemäss UX_SPEC. Startseite v0.3 und Demodaten bleiben erhalten.

Ab v0.5: verpflichtende Präferenz-Ersteinrichtung vor C2, drei rein simulierte Einstellungen zu Pulshinweisen, Aktivitätserinnerung und Sichtbarkeit für Gesundheitsfachpersonen. Einstellungen sind über C2 erneut änderbar und lokal persistent. Es gibt keine tatsächlichen Warnungen, Vibrationen, Datenfreigaben oder neuen Messwertfunktionen. Aktivitäts-, Schritt-, Puls- und Temperaturdaten bleiben unverändert.

Ab v0.7/v0.8: Bei jedem vollständigen PWA-Neustart erscheint zuerst die eigenständige Einstiegsseite mit sechs lokalen, KI-generierten Stop-Motion-Bildern; nach 20 Sekunden oder auf Wunsch sofort folgt die Einstellungsseite. Gültige gespeicherte Präferenzen bleiben erhalten und vorausgewählt. Die Person kann sie unverändert bestätigen oder ändern. Die Bildfolge illustriert beispielhaft das Anlegen eines Armbands und ist weder verifiziertes Produktfoto noch verbindliche Anleitung; sie behauptet keine Verbindung, Messung oder Gesundheit.

Ab v0.9: Einstiegsseite nach Referenzlayout, jedoch im bestehenden grünen Farbschema. Die Informationskarten zeigen die fiktiven Demo-Texte „Wasserdicht – Sie können das Armband auch beim Duschen tragen.“ und „Möglichst den ganzen Tag tragen – So erhalten Sie ein vollständigeres Bild Ihrer Aktivitäten im Alltag.“ Die Duscheignung ist ausschliesslich eine Annahme für das fiktive Demo-Armband (D49), keine belegte Eigenschaft eines realen Produkts. Die volle Bildfolge ist bei späterer Präferenzbearbeitung statisch aufklappbar erreichbar. Interne Seitenwechsel zeigen den Einstieg nicht erneut.
