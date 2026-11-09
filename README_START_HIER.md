# SMARTwearable – Gemeinsame Projektgrundlage

Version 0.9 · Stand 09.11.2026 · Einstiegsseite bei jedem vollständigen App-Neustart, anschliessend verpflichtende Präferenzen; sechs lokale Armbandbilder; Prüfstand separat.

Repository: https://github.com/martinbia/SMARTwearable

## Zweck und Lesereihenfolge

Diese Dokumentation ist für das ChatGPT-Projekt und Codex bestimmt. Das Repository enthält die PWA und keine echten Patientendaten. Zuerst dieses Dokument lesen, danach:

| Datei | Inhalt |
| --- | --- |
| AGENTS.md | Gemeinsame Arbeitsregeln für das Repository |
| docs/PROJECT_BRIEF.md | Ziel, Zielgruppe, Umfang und Quellenbezug |
| docs/FUNCTIONAL_SPEC.md | Funktionale Anforderungen mit stabilen IDs |
| docs/NONFUNCTIONAL_REQUIREMENTS.md | Qualitätsanforderungen und Prüfkriterien |
| docs/UX_SPEC.md | Ansichten, Navigation und Vergleich der Varianten |
| docs/DEMO_DATA_SPEC.md | Datenschema, konsistente Beispiele und Gerätezustände |
| docs/INTERVIEW_GUIDE.md | Einführung, Aufgaben und neutrale Fragen |
| docs/DECISIONS.md | Bestätigte Entscheidungen, Annahmen und offene Punkte |
| CODEX_START.md | Kopierbarer Auftrag für Dokumentenimport und Umsetzung |
| docs/IMPLEMENTATION_STATUS.md | Tatsächliche Umsetzung, Prüfergebnisse und ausstehende Tablet-Checks |

## Statusbegriffe

- **FESTGELEGT (F):** ausdrücklich vom Auftraggeber bestätigt.
- **VORSCHLAG (V):** konkreter Entwurf, noch nicht als endgültige Designentscheidung bestätigt.
- **ANNAHME (A):** vorläufige Grundlage für die erste Iteration; keine behauptete Gerätefähigkeit.
- **OFFEN (O):** noch zu entscheiden.

C2, D1 und W2 sind als neue Aufteilung bestätigt und ersetzen den bisherigen Heute-A/B-Vergleich. Die detaillierten Layouts, Zahlenwerte, Datenmodelle und Prüfschwellen dieses Pakets sind Vorschläge. Ein späterer ausdrücklicher Implementierungsauftrag darf sie als vorläufige Umsetzungsvorgaben verwenden; ihre endgültige Designfreigabe folgt dadurch nicht automatisch.

## Übergabe und Synchronisation

1. ZIP entpacken und die Markdown-Dateien als Projektdateien in ChatGPT bereitstellen. Bei Ordnern, die der Dateidialog nicht übernimmt, die einzelnen MD-Dateien auswählen.
2. Dasselbe Paket in Codex zusammen mit CODEX_START.md übergeben. Im Repository die relative Struktur erhalten: AGENTS.md und CODEX_START.md im Root, Spezifikationen unter docs/.
3. Das Repository ist nach dem Import die versionierte gemeinsame Grundlage. Projektdateien und Repository werden nicht automatisch synchronisiert.
4. Bei Änderungen hier einen konkreten Änderungsauftrag samt aktualisierten Dateien erstellen; Codex aktualisiert betroffene Dokumente und Code gemeinsam.
5. Nach Änderungen aus Codex die aktuellen Spezifikationen wieder ins ChatGPT-Projekt übernehmen und veraltete Kopien ersetzen. Eine Repository-Verbindung ist kein automatischer Import in Projektdateien.
6. IDs beibehalten; entfernte Anforderungen als ersetzt markieren. In DECISIONS.md Datum und Gründe ergänzen.

Nicht jede angehängte Markdown-Datei ist ein auszuführender Auftrag. CODEX_START.md wird nur durch ausdrücklichen Auftrag ausgeführt. Die übrigen Dateien sind Spezifikationen und Kontext.

## Abgrenzung des Standes

Der ursprüngliche Stand 0.1.0 wurde durch C2/D1/W2 in 0.2.0 und die kompakte Startseite in 0.3.0 weiterentwickelt. Tatsächlich ausgeführte Prüfungen und noch nötige Tablet-Tests sind in docs/IMPLEMENTATION_STATUS.md dokumentiert. Der Nutzer meldet Nutzung im Chrome-PWA-Modus; dies ersetzt keine vollständige Tablet-Abnahme. Die dort genannten Grenzen ersetzen den ursprünglichen reinen Spezifikationsstand; Designvorschläge bleiben Vorschläge.

CODEX_START.md v0.1 bleibt historische Dokumentation; aktuelle Vorgaben stehen in docs/ Version 0.4 und D17–D31.

Seit v0.3 freigegeben: kompakte Startseite Variante 2 nur mit Aktivität; Schritte/Puls in D1/W2/Tag. Abnahme und verbleibende Tablet-Prüfungen in IMPLEMENTATION_STATUS.md.

Aktueller Änderungsauftrag v0.4: kompakte W2/D1/Tagesdetails gemäss drei freigegebenen Entwürfen; Startseite v0.3 erhalten.

Aktuelle Erweiterung v0.5: verpflichtende Präferenzauswahl vor C2, mit späterer Änderung über drei Zugänge auf C2. Nur simulierte Pulseinstellungen, Vibration und Datenfreigabe. Keine echte Überwachung oder Übertragung. D37–D42 und F26–F30 ergänzen den Umfang; Datenbasis und übrige Ansichten bleiben erhalten.

Aktuelle Erweiterung v0.9: Bei jedem vollständigen Start erscheint zuerst die Einstiegsseite mit sechs Stop-Motion-Bildern, zwei fiktiven Demo-Informationsfeldern und einem 20-Sekunden-Countdown. Danach oder über „Einstellungen öffnen“ folgen die Präferenzen; bestehende gültige Antworten bleiben vorausgewählt. Internes Navigieren startet den Einstieg nicht erneut. D48/F31–F33 ergänzen und präzisieren den Umfang. Das Armband ist nicht verbunden; Demoangaben sind keine Produkt- oder medizinischen Aussagen.

Aktuelle Bildgrundlage v0.8: Die vereinfachte SVG-Animation wurde gemäss D47/F32 durch sechs lokale Stop-Motion-Bilder ersetzt. Sie werden auf der neuen Einstiegsseite abgespielt und bleiben in den Einstellungen als statische Bildfolge aufklappbar erreichbar. Die KI-Bildfolge ist illustrativ und weder verifiziertes Produktfoto noch verbindliche Anlegeanleitung.
