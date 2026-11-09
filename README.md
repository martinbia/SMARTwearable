# SMARTwearable

Tablet-PWA-Mock-up für qualitative Interviews nach Hüftoperation. Version 0.6.0 verwendet die ausgewählten Konzepte C2, D1 und W2, eine verpflichtende Präferenzseite bei jedem vollständigen App-Neustart sowie eine illustrative Stop-Motion-Sequenz aus sechs lokalen Bildern. Ausschliesslich fiktive Daten, keine technische Verbindung zum angelegten Armband. Die KI-generierten Bilder sind keine verifizierten Produktfotos oder verbindliche Anlegeanleitung.

## Ansichten

- **C2 Startseite:** grafischer Wochenstand, Ziel100 mit schraffiertem Beispielbereich90–110 Bewegungsminuten, aktivste vollständige abgeschlossene Woche; ausschliesslich Aktivität; Schritte/Puls in Details.
- **D1 Woche nach Tagen:** Aktivität, Schritte, Pulsminimum/-maximum, Tagesmittel sowie Puls-Mittelwerte bei Schritten und sonstiger Bewegung.
- **W2 Wochenvergleich:** sechs Wochen, alle drei Messgrössen gleichzeitig. Jeder Balken, Wochenkopf und Pulsbereich öffnet direkt die betreffende Woche nach Tagen. Vorhandene Tage öffnen den Tagesverlauf.
- **Tagesverlauf:** Bewegungsabschnitte nach Art, Schrittzahl/Strecke, lückenbewusster Pulsverlauf, Kategorie-Puls und Hauttemperatur.
- **Armband/Interview/Info:** Gerätestatus, Szenarien, Lade-/Übertragungssimulation, Reset und jederzeit zugängliche Erklärung.

Alle Unterseiten mit rotem Startseite-Button. Kopfzeile kompakt, Datum gut sichtbar, Status ausdrücklich **Armband-Akku**. Alte A/B-Auswahl und Messgrössenreiter im Wochenvergleich entfallen.

## Datum und Daten

Beim Appstart liest die PWA das lokale Datum und die Uhrzeit des Tablets. Dieser Zeitanker bleibt für die Sitzung erhalten. Reset verändert ihn nicht; ein neuer Appstart liest neu. Kein festes Demo-Datum. Zukünftige Tage sind „Noch nicht“, keine Nullmessungen. Vor08Uhr gibt es für heute noch keine Messdaten.

Daten werden deterministisch relativ zum Sitzungsdatum erzeugt. Am beispielhaften Donnerstag nach14:30: bisher80 Bewegungsminuten und3500 Schritte. An anderen Tagen/Uhrzeiten andere konsistente Summen. Zielband und Sensor-Kategorien sind hypothetische Demonstration, keine medizinischen Vorgaben oder zugesicherten Hardwarefunktionen.

Wochen-/Tages-/Kategorie-Puls aus derselben verfügbaren Minutenzeitreihe, keine Mittelwertsummen. Messlücken werden entfernt, nicht als Ruhe interpretiert. Ein Übertragungsrückstand begrenzt sämtliche aktuellen Werte. Persönliche Bestwoche berücksichtigt nur abgeschlossene vollständig erfasste Wochen.

## Prüfen und bauen

Node.js24; keine npm-Laufzeitabhängigkeiten:

```sh
npm run check
npm test
npm run build
python3 -m http.server 8000 --directory dist
```

Danach http://localhost:8000/ öffnen; keine file://-Nutzung. Build nach dist/, einschliesslich inhaltsabhängig versioniertem Service Worker. Relative URLs funktionieren unter /SMARTwearable/.

Echter Browser-Test: `python3 -m pip install playwright==1.56.0`, `python3 -m playwright install chromium`, dann `python3 tests/browser_smoke.py`. GitHub Actions führt dies automatisch aus. Der Test setzt eine Testuhr; der Produktcode besitzt keine fest kodierte Demo-Uhr.

## Übergabe und Veröffentlichung

Gemeinsame Dokumente: [README_START_HIER.md](README_START_HIER.md). Tatsächlicher Prüfstand und offene Tablet-Checks: [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md).

Änderungen als Pull Request, kein automatisches Merge. Nach Übernahme in main veröffentlicht der vorhandene Workflow, sofern Settings → Pages → Source **GitHub Actions** aktiviert ist. Bei Bedarf Workflow manuell auf main starten. Keine zusätzlichen Secrets vorgesehen. PR-Prüfungen veröffentlichen nicht.

Erwartete Adresse: https://martinbia.github.io/SMARTwearable/. Veröffentlichung dieses Änderungsstandes erst nach Merge/erfolgreichem Deployment bestätigen.

## Lenovo-Test

PWA online vollständig öffnen, Installation über Browsermenü testen. Hoch-/Querformat, Schriftvergrösserung, rote Rückwege, Woche→Tag→Woche und echte Touch-Ziele prüfen. Vor Interviews Offline-Bereitschaft abwarten, Flugmodus einschalten, App schliessen und neu starten. Ein Update wird erst durch „Neue Version laden“ aktiviert; dabei startet die Sitzung neu. Keine Interviewantworten gespeichert.

## Kompakte Startseite v0.3

Ausgewählte Variante 2: kompakte gemeinsame Kopfzeile, nur Aktivität im Wochenvergleich, drei direkt sichtbare Hauptaktionen. Die verfügbare App-Höhe wird über dynamische Viewport-Einheiten genutzt; Android-Status-/App-Leisten bleiben Systemflächen. Kein erzwungenes Vollbild und keine künstlich nachgezeichneten Systemleisten. Bei starker Vergrösserung oder kleinen Fenstern vertikales Scrollen zulassen. Vorläufige Testflächen und noch nötige Lenovo-Messung siehe N17 und IMPLEMENTATION_STATUS.md.

## Kompakte Messdetails v0.4

W2/D1/Tag ohne zusätzliche App-Marken-/Heute-Zeile: rote Startseite, kontextbezogener Rückweg, Titel und Armbandstatus in gemeinsamer Werkzeugzeile. Kompakte Messreihen mit gemeinsamen Skalen. Im Tagesverlauf zeitlich ausgerichtete Bewegungsspuren und Puls; Weitere Angaben öffnet Hauttemperatur, Strecke, Abschnitte und Rohwerte. Startseite v0.3 und gemeinsame Demodaten unverändert. Neue Anforderungen F23–F25/N18 und Entscheidungen D32–D36; reale Tablet-Abnahme weiterhin nötig.

## Persönliche Einstellungen v0.5

Beim ersten Start wählt die Person ohne vorausgewählte Antworten ihre Präferenzen für Pulshinweise, Aktivitätserinnerung per Vibration und Sichtbarkeit für Gesundheitsfachpersonen. Die Auswahl ist ausschliesslich eine lokale Mock-up-Einstellung. Sie löst keine realen Warnungen, Vibrationen oder Datenübertragungen aus. C2 bietet drei Zugänge zum Ändern; Interviewsteuerung kann die Ersteinrichtung getrennt vom Demo-Reset zurücksetzen. Details: F26–F30 und `docs/UX_SPEC.md`.
