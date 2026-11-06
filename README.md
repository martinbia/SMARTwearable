# SMARTwearable

Installierbares Tablet-Mock-up für qualitative Interviews nach einer Hüftoperation. Ausschliesslich fiktive Daten; das angelegte Armband wird nicht ausgelesen.

## Erste Version 0.1.0

- Heute mit zwei Darstellungen derselben Bewegungsdaten: Kennzahlenkarten und Tagesverlauf.
- Details zu Schritten, geschätzter Strecke, Puls und Hauttemperatur.
- Sieben Tage mit Tagesauswahl und erkennbaren Datenlücken.
- Armbandstatus mit Akku, geschätzter Laufzeit, Datenstand, Verbindung und Übertragungsbedarf.
- Interviewsteuerung mit drei Aktivitätsszenarien, neun Gerätezuständen, Lade-/Übertragungssimulation und Reset.
- Vorbereiteter Offline-Cache und PWA-Manifest mit eigenen Icons; keine externen Laufzeitabhängigkeiten.

Die Details sind vorläufig umgesetzt. Eine endgültige Designfreigabe erfolgt nach dem Tablet-Test. Einstieg in die gemeinsamen Dokumente: [README_START_HIER.md](README_START_HIER.md). Tatsächlicher Prüfstand: [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md).

## Lokal prüfen und bauen

Node.js 24; keine npm-Installation erforderlich:

```sh
npm run check
npm test
npm run build
python3 -m http.server 8000 --directory dist
```

Optionaler echter Browser-Smoke-Test (zusätzliche reine Testabhängigkeit): `python3 -m pip install playwright==1.56.0`, `python3 -m playwright install chromium`, dann `python3 tests/browser_smoke.py`. GitHub Actions führt diesen Test automatisch aus.

Danach `http://localhost:8000/` öffnen. Für Service Worker HTTPS oder localhost verwenden. Der Build erzeugt ausschliesslich in `dist/` die auszuliefernden Dateien, einschliesslich inhaltsabhängig versioniertem Offline-Cache. Nicht direkt `public/index.html` als Datei öffnen.

## Veröffentlichung

1. Pull Request prüfen und nach `main` übernehmen.
2. Repository → Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Actions für das Repository zulassen; falls erforderlich die Bereitstellung in der Umgebung `github-pages` freigeben.
4. Workflow **Check and deploy PWA** erfolgreich abschliessen lassen, gegebenenfalls manuell auf `main` starten.
5. Erwartete, noch nicht bestätigte Adresse: https://martinbia.github.io/SMARTwearable/

Pull Requests führen Prüfungen aus, veröffentlichen aber nicht. Der Hauptbranch und manuelle Starts auf `main` können nach bestandenen Prüfungen veröffentlichen. Es sind keine benutzerdefinierten Secrets vorgesehen. Die Initialisierung von `main` enthält nur dieses Projektgerüst; die Anwendung kommt über den Pull Request.

## Tablet vorbereiten

Veröffentlichte URL im Browser des Lenovo Tab TB311FU öffnen. Nach vollständiger Vorbereitung im Browsermenü „App installieren“ bzw. „Zum Startbildschirm hinzufügen“ verwenden; die konkrete Bezeichnung hängt vom Browser ab. In Interviewsteuerung Offline-Bereitschaft kontrollieren. Vor Interviews im Flugmodus einen Kaltstart durchführen und danach die gewünschte Netzverbindung wiederherstellen.

Ein Update wird bei erkannter neuer Service-Worker-Version angeboten und erst nach „Neue Version laden“ aktiviert; ein laufendes Interview kann bis dahin in der bisherigen Version bleiben. Nach einem Update startet die Demo wieder im Grundzustand. Es werden keine Interviewantworten gespeichert. Die Version steht im Interviewbereich.

Die Aktivitätsszenarien sind deterministisch, Demo-Heute ist 09.11.2026 um 14:30 Uhr (Europe/Zurich). Eine fehlende Übertragung begrenzt alle angezeigten Messwerte. Schritt- und Streckensummen sind bei Teilübertragung „nicht verfügbar“, da keine erfundenen zeitaufgelösten Schrittwerte existieren.
