# Implementierungs- und Prüfstand

Stand 06.11.2026 · Anwendung 0.1.0 · Branch feat/tablet-pwa-v01

Vorschläge sind aufgrund des ausdrücklichen Implementierungsauftrags vorläufig umgesetzt. Ihr Status als Designvorschlag bleibt erhalten. Kein klinischer Einsatz, keine echten Messdaten, keine bestätigte Veröffentlichung.

## Zuordnung

| Anforderungen | Umsetzung | Nachweis / Grenze |
| --- | --- | --- |
| F01, F02, F04 | Tagesansichten A/B und sieben Tage mit gemeinsamen Selektoren | Modelltests und UI-Ereignistest |
| F03, F08, F15 | Schritt-/Streckenangaben, Puls-/Temperaturverlauf, Herkunft und fehlende Werte | UI-Ereignistest und Chromium-Navigation; Tablet-Sichtprüfung offen |
| F05, F07, F09, F10 | Gerätestatus, Datenstandfilter, Lücken und neun Gerätezustände | Modelltests; keine echte Geräteverbindung |
| F06, F11, F12 | Interviewsteuerung, deterministische Simulation, vollständiges Reset | UI-Ereignistest einschliesslich zehn Aufgabenrunden |
| F13 | Manifest, lokale Icons, relativer Scope und Startpfad | Manifest-/Buildprüfung; reale Installation offen |
| F14 | Vollständiger lokaler Asset-Cache mit Unterpfad und Update-Mechanismus | Cache-Harness und echter Chromium-Offline-Neustart erfolgreich; Tablet-Kaltstart offen |
| N01–N07 | Flexible Layouts, grosse Bedienelemente, semantisches HTML und Textalternativen | Im Code vorgesehen; reale Lesbarkeit, Zoom, Kontraste und Layout noch prüfen |
| N08 | Lokale statische Anwendung ohne externe Datenabfragen | Keine Reaktionszeitmessung am Tablet |
| N09, N10, N12, N13, N15 | Neutrale Texte, getrennte Daten/Logik/Darstellung, Demo-Version, keine Personen/Tracker | Codeprüfung; Präferenz und Verständnis im Interview offen |
| N11 | Zehn automatisierte UI-Aufgabenrunden | Ereignis-/HTML-Harness, kein echter Touch-Browser |
| N14 | Offline-Vorbereitung | Cache-Harness und Chromium-Offline-Neustart; Tabletprüfung offen |

## Ausgeführte Prüfungen

- `npm run check`: Syntaxprüfung erfolgreich.
- `npm test`: 10 Tests erfolgreich. Sieben-Tage-Summen, Abschnittszahlen, Messabdeckung, Datenlücken, A/B-Identität, Datenstandbegrenzung, Lade-/Übertragungszustände, Navigation und Reset geprüft.
- UI-Test führt die tatsächlichen App-Ereignishandler und HTML-Erzeugung mit einer minimalen DOM-Testumgebung aus. Zehn Aufgabenrunden plus erfolgreiche/fehlgeschlagene zeitverzögerte Übertragung durchlaufen.
- Build-/Service-Worker-Test validiert alle Cache-Dateien, relativen Manifest-Scope, Offline-Navigationsfallback unter `/SMARTwearable/`, Cache-Treffer und Begrenzung des Service-Worker-Pfads.
- `npm run build`: erfolgreich; zehn lokale Assets und generierter Service Worker.
- Lokaler Chromium/Playwright-Start durch die Laufzeitumgebung blockiert: `socket() failed: Operation not permitted`. Deshalb echten Chromium-Smoke-Test zusätzlich in GitHub Actions eingerichtet.
- GitHub-Lauf [42271218564](https://github.com/martinbia/SMARTwearable/actions/runs/42271218564) erfolgreich: echter Chromium-Test unter `/SMARTwearable/`, Navigation/Details/Tagesauswahl, A/B, S03, Übertragung von 6 auf 24 Minuten, Reset und Offline-Neuladen mit anschliessender Navigation. Keine JavaScript-Laufzeitfehler.
- Browser-Layoutprüfungen bei 820 × 1180, 1180 × 820 und 400 × 800 CSS-Pixeln ohne horizontalen Seitenüberlauf; dies sind simulierte Ansichtsgrössen, keine bestätigten Lenovo-Abmessungen. Screenshots für A/Hochformat und B/Querformat in CI erzeugt und visuell geprüft.
- Ein beim ersten Cache-Aufbau fälschlich sichtbarer Update-Hinweis wurde anschliessend korrigiert; der Browser-Smoke-Test enthält dafür eine zusätzliche Assertion. Installierbarkeit im realen Android-Browser und echtes Geräteverhalten bleiben offen.

## Dokumentierte technische Detailentscheidungen

- Vanilla JavaScript, CSS und statischer Build ohne npm-Abhängigkeiten. Gleiche Selektoren für A/B und Woche.
- Einstellungsspeicher nur im Arbeitsspeicher der geöffneten Sitzung. Neuladen startet wie Reset; keine Interviewantworten.
- Bei Teilübertragung keine anteilige Schätzung aus aggregierten Schritt-/Streckenwerten. Solange keine Zeitreihe vorliegt, „nicht verfügbar“ zeigen. Puls und Temperatur auf Datenstand begrenzt.
- Nach Ende einer Ladesimulation: fiktiv 100 % / 77 Stunden, ohne Speicherkapazität oder Datenübertragung zu verändern. Reiner zusätzlicher Demo-Endzustand, kein Akkumodell.
- Bei erfolgreicher Übertragung setzt die Demo Speicherzeit auf 72 Stunden, Datenstand und Übertragung auf 14:30. Fehlerszenario G07 bleibt fehlgeschlagen.
- Kein direkter Variantenwechsel auf Patientenansichten; A/B wird im Interviewbereich gewählt.

## Vor dem ersten Interview auf Lenovo Tab TB311FU prüfen

1. Android-/Browserversion, reale CSS-Ansichtsgrösse und PWA-Version notieren.
2. HTTPS-Veröffentlichung und Start unter `/SMARTwearable/` prüfen; alle Ressourcen ohne Fehler.
3. Installation, eigener App-Name/Icon und Standalone-Start testen.
4. Hoch-/Querformat und 200-%-Vergrösserung: Inhalte erreichbar, kein horizontaler Seitenüberlauf, Auswahl bleibt erhalten.
5. Schrift, Kontraste, Touch-Flächen und Zurückwege mit tatsächlicher Bedienung prüfen.
6. A/B, sieben Tage, historischen Tag, alle drei Aktivitätsszenarien und alle Gerätezustände durchspielen.
7. G05: vor Übertragung 6 Bewegungsminuten, danach 24; keine Werte aus dem noch nicht übertragenen Zeitraum. G07 bleibt Fehler; Reset bricht ausstehende Simulation ab.
8. S03: 12 Minuten, zwei Abschnitte, Messabdeckung 270/390 Minuten; Lücke nicht als Ruhe zeigen.
9. Offline-Bereitschaft abwarten, Flugmodus einschalten, App vollständig schliessen und neu öffnen; Navigation und Szenarien prüfen.
10. Update-Hinweis bei einer späteren Version und anschliessendes Zurücksetzen prüfen.
11. Reaktionszeiten messen und zehn reale Aufgabenrunden durchführen. UI-Harness ersetzt das nicht.

## Veröffentlichung bleibt getrennt

Workflow ist vorbereitet. Pull Request nicht automatisch mergen. Pages-Quelle nach Übernahme auf GitHub Actions stellen, erfolgreichen Deployment-Lauf abwarten und URL tatsächlich prüfen. Eine erwartete URL gilt nicht als veröffentlichte oder getestete Anwendung.
