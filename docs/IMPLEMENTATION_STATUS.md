# Implementierungs- und Prüfstand

## Einstiegsseite und Einstellungen v0.9 – umgesetzt, Folgekorrekturen im PR #12

09.11.2026 · F31–F33/D48/N22–N23. Die neue Einstiegsseite mit sechs lokalen Bildern, fiktiven Demo-Informationsfeldern, 20-Sekunden-Countdown und sofortigem Wechsel zu den verpflichtenden Einstellungen ist in PR #11 umgesetzt und gemergt. Das grüne SMARTwearable-Farbschema wird verwendet. Auf der Einstellungsseite bleibt die volle Bildfolge über ein kleines Armbandbild und eine aufklappbare statische Galerie erreichbar. Die Folgekorrekturen in PR #12 rücken den Inhalt im Einstieg näher an die Wortmarke und stellen die Galerie im Hochformat explizit auf drei Spalten um. Speicherung, Pflichtauswahl, C2/D1/W2, Daten und weitere Navigation bleiben erhalten. Lokal bestanden: Syntaxcheck, 16 Node-Tests, Build (19 lokale Assets), Python-Syntax und `git diff --check`. [GitHub Actions Lauf #48](https://github.com/martinbia/SMARTwearable/actions/runs/42712796122) bestand Syntax, Tests, Build und den Chromium-Smoke-Test; geprüft wurden Einstieg, 20-Sekunden-Wechsel, reduzierte Bewegung, Offline-Bilder, gespeicherte Einstellungen, die vier Viewports, schmale/Zoom-Ansicht sowie übrige Hauptansichten. [Screenshots und Animationsvorschau](https://github.com/martinbia/SMARTwearable/actions/runs/42712796122/artifacts/13716292889); Einstiegs- und Einstellungsbilder im Hoch- und Querformat sowie die Ansichten 1280×640, 1180×620, 1024×560 und 820×1020 CSS-Pixel wurden visuell kontrolliert. Lenovo Tab TB311FU bleibt praktisch zu prüfen.

## Stop-Motion und Appstart v0.8 – umgesetzt, PR #10 gemergt

09.11.2026 · F32/D47/N22. Sechs bereitgestellte lokale PNG-Bilder ersetzen die vereinfachte SVG-Animation. Einmalige Hervorhebung aller Frames alle 700 ms, danach bleibt die Reihe ruhig sichtbar. Startlogik und Formulardaten blieben erhalten. Anwendungsversion 0.6.0. Lokal bestanden: Syntaxcheck, 16 Node-Tests, Build mit 19 lokalen Assets, Python-Syntax und `git diff --check`. [GitHub Actions Lauf #41](https://github.com/martinbia/SMARTwearable/actions/runs/42683033868) bestand Syntax, Tests, Build und Chromium-Prüfung einschliesslich Zoom, Viewports, Speicherung, reduced-motion und Offline-Bildern. [Screenshots und Animationsvorschau](https://github.com/martinbia/SMARTwearable/actions/runs/42683033868/artifacts/13703766449). Lenovo Tab TB311FU bleibt praktisch zu prüfen.

## Animation und Neustart v0.7 – umgesetzt, PR #9 gemergt

09.11.2026 · F31/F32, N22, D44–D46. Jeder neue Dokumentstart zeigt die Einstellungsseite mit erhaltenen/vorausgewählten Optionen; interner Routenwechsel bleibt unberührt. Die zuerst umgesetzte Inline SVG/CSS-Animation, Einmalstart, statisches Endbild, Wiederholung und reduzierte Bewegung wurden geprüft. Nach Behebung der Höhenüberschreitung bei 1024×560 und einer Überlagerung im Hochformat war GitHub Actions Lauf #38 erfolgreich. [Screenshots und Animationsvideo des früheren SVG-Stands](https://github.com/martinbia/SMARTwearable/actions/runs/42676300510/artifacts/13700890755). PR #9 ist inzwischen gemergt; dessen Animation wird durch v0.8 ersetzt.

09.11.2026 · Anwendung 0.5.0 · D43/N21: Präferenz-Ersteinrichtung/-bearbeitung kompakter gesetzt. Im Querformat Pulshinweise/Aktivitätserinnerung nebeneinander, Datenfreigabe volle Breite; Kopfzeile, Einführung und Demo-Hinweis verkleinert, Seitenränder reduziert. Ersteinrichtung bleibt nicht überspringbar; im Editiermodus bleibt der rote Startseite-Button erhalten. Keine Änderungen an Speicherung, Präferenzregeln, übrigen Ansichten oder Demo-Daten/Berechnungen. [PR #8](https://github.com/martinbia/SMARTwearable/pull/8) wurde inzwischen gemergt.

## Prüfungen v0.6

- Lokal erfolgreich: `npm run check`, 16 Node-Tests, `npm run build` (13 lokale Assets), Python-Syntaxprüfung und `git diff --check`.
- [GitHub Actions Lauf #32](https://github.com/martinbia/SMARTwearable/actions/runs/42669169131) erfolgreich: Check, Tests, Build und echter Chromium-Smoke-Test. Deployment im PR bestimmungsgemäss übersprungen.
- Browser prüft die drei Einrichtungsentscheidungen ohne Vorauswahl, deaktivierte Bestätigung davor und fehlenden Startseite-Button im Setup; im gespeicherten Bearbeitungszustand ist Startseite vorhanden. Alle acht Antwortkombinationen und bestehende Änderungs-/Abbruchwege weiterhin geprüft.
- Einrichtung ohne horizontalen oder vertikalen Überlauf in 1280×640, 1180×620 und 1024×560; 820×1020 bleibt gut lesbar. Touch-Flächen mindestens 48×48 CSS-Pixel. 200-%-Zoom ohne horizontalen Überlauf; bei schmaler 640×320 CSS-Fläche einspaltig mit per Scroll erreichbarer Bestätigung. Weitere bestehende Ansichten wurden im selben Browser-Smoke-Test durchlaufen.
- Screenshots von Einrichtung und Bearbeitung in Quer- und Hochformat sowie der drei Querformat-Prüfflächen wurden visuell kontrolliert: Gruppen, Texte und Bestätigung sind erkennbar; keine abgeschnittenen Texte oder Überlagerung. [Screenshots als Workflow-Artefakt](https://github.com/martinbia/SMARTwearable/actions/runs/42669169131/artifacts/13697673335).
- Chromium konnte lokal nicht starten (Laufzeitbeschränkung `socket() failed: Operation not permitted`); der erfolgreiche echte Browserlauf erfolgte auf GitHub Actions.

PR #8 und PR #9 sind gemergt. Die Foto-Sequenz v0.8 wird separat angeboten.

## Noch am Lenovo prüfen

- Einrichtungs- und Bearbeitungsmodus im Chrome-PWA-Modus mit Systemleisten; reale verfügbare CSS-Breite/-Höhe dokumentieren.
- Quer-/Hochformat, Touchziele, Lesbarkeit bei Android-Schriftvergrösserung und tatsächlichem 200-%-Zoom; bei Platzmangel muss die Bestätigung durch Scrollen erreichbar bleiben.
- Prüfen, dass Einrichtung nicht übersprungen werden kann und der Bearbeitungsmodus über Startseite zurückkehrt.
- Animation einmal im Chrome-PWA-Modus ansehen, Wiederholung antippen, App neu starten und mit Android „Animationen entfernen“/reduzierter Bewegung prüfen.
- Bestehende Auswahlmöglichkeiten, Speichern/Abbrechen, Zurücksetzen und Abgrenzung vom Demo-Reset auf dem Tablet stichprobenartig bestätigen.

09.11.2026 · Anwendung 0.5.0 · Neue Ersteinrichtung vor C2 (F26–F30 / D37–D42). Der Codepfad zeigt ohne vollständige lokale Präferenzen die verpflichtende Auswahl; C2 bleibt nach Abschluss in seiner Grafik und Hauptnavigation erhalten. Einstellungen sind lokal änderbar und getrennt vom Demo-Reset. Alle Warnungen, Vibrationen und Datenfreigaben bleiben inaktiv und simuliert. Demodaten und Berechnungen nicht geändert.

## Lokale Prüfungen v0.5

Erfolgreich: Syntaxprüfung, 16 Node-Tests, statischer PWA-Build mit 13 lokalen Assets und content-versioniertem Offline-Cache, Python-Syntaxprüfung und `git diff --check`. Der neue Modul-Cache sowie Lesen/Schreiben/Löschen, ungültige Daten und blockierter Speicher werden durch Tests abgedeckt.

[GitHub-Prüflauf #29](https://github.com/martinbia/SMARTwearable/actions/runs/42602214131) für Commit `8362d5850115bc5863ffc6d0d53bc459fa4324b3` erfolgreich: Syntax, 16 Tests, Build, Chromium-Installation und vollständiger Browser-Smoke-Test. Die Deployment-Stufe wurde im PR erwartungsgemäss übersprungen. [Screenshots der Ersteinrichtung und Ansichten als Workflow-Artefakt](https://github.com/martinbia/SMARTwearable/actions/runs/42602214131/artifacts/13666276843).

- Alle acht Kombinationen der drei Antworten wurden gespeichert. Fehlende und ungültige Konfigurationen starten erneut ohne Vorauswahl; Weiter bleibt bis zu drei Antworten deaktiviert.
- Ändern, Speichern und Abbrechen geprüft. Ein Abbruch überschreibt die bisherige Präferenz nicht. Nach Neuladen bleiben Einstellungen im selben Browserprofil erhalten.
- Ersteinrichtungs-Reset löscht nur Präferenzen; der vorhandene Demo-Reset setzt weiterhin Szenario/Daten zurück und erhält Präferenzen.
- C2-Prüfflächen N17 (1280×640, 1180×620, 1024×560, 820×1020) ohne horizontalen oder vertikalen Überlauf; drei bisherige Hauptaktionen bleiben sichtbar und bedienbar. Einstellungszugänge mindestens 48×48 CSS-Pixel.
- Einstellungsansicht bei 200-%-CSS-Zoom und schmaler Ansicht 400×800 ohne horizontalen Überlauf; die Bestätigung bleibt durch Scrollen erreichbar. Offline-Neuladen mit vorhandener Konfiguration erfolgreich.
- Bestehende D1/W2/Tages-/Geräte-/Demo-Routen im selben Browserlauf weiterhin durchlaufen. Ein pixelgenauer Vergleich gegen freigegebene Referenz-Screenshots wurde nicht ausgeführt; Screenshots liegen im CI-Artefakt.

## Noch am Lenovo prüfen

- Ersteinrichtung vor C2; keine Vorauswahl, Bestätigung erst nach drei Entscheidungen, späteren Appstart mit gespeichertem Zustand prüfen.
- Die drei Einstellungen unabhängig ändern, übernehmen und abbrechen; prüfen, dass der Status auf C2 stimmt.
- Ersteinrichtung getrennt vom Demo-Reset zurücksetzen; Demo-/Geräteszenario bleibt bei Präferenz-Reset erhalten und Präferenzen bei Demo-Reset.
- Lesbarkeit, Hoch-/Querformat, Android-Schriftvergrösserung, Touchziele und Erreichbarkeit der drei Einstellungszugänge zwischen den Systemleisten prüfen.
- Offline-Kaltstart und erneutes Laden mit bestehender Konfiguration prüfen.
- Verstehen, dass dies keine echten Warnungen, Vibration oder Datenübertragung auslöst.

---

# Historischer Implementierungs- und Prüfstand v0.4

08.11.2026 · Anwendung 0.4.0 · [Pull Request #4](https://github.com/martinbia/SMARTwearable/pull/4) wurde während der abschliessenden Prüfungen auf GitHub manuell gemergt. Der übernommene Implementierungsstand ist erfolgreich geprüft. Die nachträgliche Prüfdokumentation wird separat als Dokumentations-PR vorgelegt; kein automatisches Merge.

## Änderung v0.4

F23–F25 / D32–D36: kompakte W2/D1/Tagesdetails ohne zusätzliche Marken-/Heute-Zeile. Eine gemeinsame Navigations-/Titelzeile mit roter Startseite, neutralem Rückweg, Armband-Akku und Info. Messgrafiken im Vordergrund; Tagesbewegung und Puls auf gemeinsamer verfügbarer Zeitachse. Weitere Angaben zeigt Hauttemperatur, Strecke, Abschnitte und Rohwerte. Startseite und Datenselektoren erhalten.

## Prüfstand v0.4

Lokal erfolgreich: Syntax, 13 automatisierte Tests, statischer Build, Python-Syntax und git diff --check. Quellvergleich bestätigt unveränderte Startseiten-Funktion und sämtliche Daten-/Modellberechnungen; nur Versionskennung in data.js geändert.

[GitHub-Prüflauf #20](https://github.com/martinbia/SMARTwearable/actions/runs/42506949798) für Implementierungscommit 8f253168b7d4636679cb799f75b72d0ea2c3fbfa erfolgreich: Syntax, 13 Tests, Build und echter Chromium-Test. Deployment im PR übersprungen.

- W2/D1/Tag ohne vertikalen/horizontalen Seitenüberlauf in 1280×640, 1180×620, 1024×640 und 820×1020 verfügbaren CSS-Pixeln. Werkzeugzeile und Messgrafiken sichtbar, Toolbar-Touch-Ziele mindestens 48×48 Pixel. Bei Umbruch/Zoom bleibt Scrollen zugelassen.
- Eine Titel-/Navigationszeile ohne Marken-/Heute-Banner. Rote Startseite-Buttons und direkter Kontext-Rückweg erhalten; zehn vollständige Aufgabenrunden erfolgreich.
- Aktivität/Puls verwenden identische Zeitgrenzen und geometrisch ausgerichtete Plotflächen; Zeitbeschriftungen mit Abstand. Intervalllängen und Pulsgruppen entsprechen gültigen Proben, Lücken werden nicht verbunden, frühe leere Tage erzeugen keine Kurven.
- Weitere Angaben zunächst geschlossen; Hauttemperatur und Puls-Rohwerte nach Öffnen erreichbar. Datenlücken-Hinweis aufklappbar; hypothetischer Grund und Zeitraum erhalten.
- Startseite bleibt nur Aktivität; bisherige N17-Prüfflächen ohne Scrollen weiter erfolgreich. Weitere Bildschirmgrössen, 200-%-CSS-Zoom, Gerätesimulation/Reset, vorbereiteter Offline-Neustart und Navigation unter /SMARTwearable/ erfolgreich.
- Browser-Screenshots der drei Ansichten stichprobenartig visuell geprüft. N18-Prüfflächen sind Annahmen und ersetzen keine reale Lenovo-Abnahme. Android-Schriftvergrösserung und PWA-Update bleiben echte Gerätetests.

Die Designbilder illustrierten andere einzelne Datums-/Tageswerte. Übernommen wurde ihre Anordnung, nicht ein widersprüchlicher zweiter Datensatz. Bewegungsminuten, Schritte und Puls weiterhin ausschliesslich aus denselben gemeinsamen Demoproben. Keine klinischen Grenzen oder Wearable-Fähigkeiten neu festgelegt.

## Noch am Lenovo prüfen

- W2/D1/Tag im Chrome-PWA-Modus mit Status-/App-Leisten: Graphiken und Werkzeugzeile sichtbar, Beschriftungen und Touch-Flächen lesbar.
- Hoch-/Querformat, echte Android-Schriftvergrösserung; bei Platzmangel vertikal scrollen können, keine Überlagerungen.
- W2 → gewählte vergangene Woche → Tag → dieselbe Woche, Wochenpfeile und roter Startseite-Button.
- Unvollständige Woche, zukünftige Tage, Datenlücken, Min/Max und Kategorie-Puls verständlich; allgemeine Bewegung nicht auf Gehen reduzieren.
- Weitere Angaben öffnen/schliessen, Hauttemperatur/Strecke/Rohwerte vollständig erreichbar.
- Update von 0.3.0 auf 0.4.0, Offline-Kaltstart, reale Performance und Installation/Standalone.

---

## Historischer Prüfstand v0.3 (PR #3 inzwischen übernommen)

### Umsetzung v0.3

08.11.2026 · Anwendung 0.3.0 · Branch feat/compact-activity-home. [Pull Request #3](https://github.com/martinbia/SMARTwearable/pull/3), ohne automatisches Merge.

## Änderung v0.3

F22 / D28–D31: ausgewählte Variante 2, nur Aktivität auf der Startseite. Schritte/Puls bleiben in D1/W2/Tagesdetails. Kompakter gemeinsamer Kopfbereich, Wochengrafik, drei Hauptaktionen und kleine Fusszeile. Dynamische Viewport-Höhe nutzt die verfügbare App-Fläche; keine Nachbildung oder doppelte Subtraktion der Android-Leisten. Zoom/kleine Fenster dürfen vertikal scrollen, Inhalte bleiben erreichbar.

## Prüfstand v0.3

Lokal erfolgreich: Syntaxprüfung, elf automatisierte Node-Tests, statischer PWA-Build, Python-Syntax und git diff --check.

[GitHub-Prüflauf #12](https://github.com/martinbia/SMARTwearable/actions/runs/42503352150) für Implementierungscommit b19115670872dceb1b29ab5e3398931baaf76af2 erfolgreich: Syntax, elf Tests, Build und echter Chromium-Browsertest. Deployment im PR übersprungen.

- Startseite enthält keine Schritte-/Pulswerte und keine entsprechenden Karten; in Tages-/Wochendetails bleiben sie vorhanden.
- Startseite ohne horizontalen UND vertikalen Überlauf bei 1280×640, 1180×620, 1024×560 und 820×1020 CSS-Pixeln. Grafiklink, Kopfbereich, alle drei Hauptaktionen und Footer innerhalb des Viewports; Touch-Ziele mindestens 48×48 Pixel. Screenshots visuell geprüft.
- Vorhandene Navigation, rote Startseite-Buttons, Datenlücken, Puls-Kategorien, Kalender und zehn vollständige Aufgabenrunden erfolgreich; Übertragungs-/Fehlersimulation und Reset erhalten.
- Weitere Ansichtsgrössen, 200-%-CSS-Zoom, Service Worker, vorbereiteter Offline-Neustart und Navigation unter /SMARTwearable/ erfolgreich.

Vorläufige Prüfflächen N17 sind keine bestätigten Lenovo-Abmessungen. Browser-Zoom ist keine reale Android-Schriftvergrösserung. Ein eventuell angebotener Versionsupdate-Hinweis darf zusätzlich Platz benötigen und Scrollen auslösen. Kein Verbergen von Hinweisen zugunsten der Ein-Bildschirm-Darstellung.

## Am Lenovo vor Interview noch prüfen

- Tatsächlich verfügbare CSS-Breite/-Höhe im Chrome-PWA-Modus mit oberer Statusleiste und unterer App-Leiste notieren; Normal-Schrift: Startseite inklusive aller drei Aktionen ohne Scrollen.
- Hoch-/Querformat und sichtbare/automatisch ausblendende Systemleisten; keine überdeckten Buttons.
- Android-Schriftvergrösserung und 200-%-Zoom: vertikales Scrollen erlaubt, alle Inhalte erreichbar.
- Touch-Treffbarkeit, Lesbarkeit und Verstehen von allgemeiner Aktivität; Schritte/Puls in den Details auffinden.
- Update von 0.2.0 auf 0.3.0, Installation/Standalone und vorbereiteter Offline-Kaltstart.
- Laufzeit, Lade-/Übertragungssimulation und reale Reaktionszeiten prüfen. Nur fiktive Messwerte.

---

## Historischer Prüfstand v0.2 (bereits über PR #2 übernommen)

### Umsetzung v0.2

08.11.2026 · Anwendung 0.2.0 · Branch feat/gui-c2-d1-w2. [Pull Request #2](https://github.com/martinbia/SMARTwearable/pull/2), kein automatisches Merge und keine Veröffentlichung dieses Stands vor Merge.

## Implementierung

F01/F02 durch C2/D1/W2 ersetzt, F03–F15 erhalten/angepasst. F16–F21 implementiert: lokales Appstart-Datum, Zielband, sechs Wochen, direktes Öffnen einer Woche, Puls-Min/Max und Kategorien, roter Startseite-Button auf allen Unterseiten. Aktueller Stand aus gemeinsamen Datenselektoren, nicht aus unabhängigen Grafikzahlen.

## Lokal ausgeführte Prüfungen

- Syntaxprüfung erfolgreich, statischer Build erfolgreich (12 lokale Assets plus Service Worker).
- Elf automatisierte Tests erfolgreich: Kalender-/Jahres-/Monats-/Sommerzeitgrenzen, lokale Gerätezeitzonen gegen UTC, alle Wochentage, zukünftige Tage ohne falsche Nullmessungen, exakte Tages-/Wochensummen, Bestwochenfilter, Puls-Min/Max/Mittel und Kategorie-Puls, Datenlücken und Übertragungsgrenzen, direkte Navigationszustände, zehn UI-Aufgabenrunden, Lade-/Fehlersimulation und Reset.
- Cache-Harness prüft neue Kalender-/Grafikmodule, Unterpfad und Offline-Fallback.
- Chromium lokal versucht; Laufzeit blockiert Prozessstart mit „socket() failed: Operation not permitted“. Echte Browserprüfung deshalb im PR-Workflow auf GitHub. Erfolgreiches Ergebnis unten separat nachgewiesen.

## Erfolgreiche GitHub-Browserprüfung

[Workflow-Lauf #9](https://github.com/martinbia/SMARTwearable/actions/runs/42498755828) prüft Implementierungscommit `ecc8264d327b79d17760ec8651ae3d32109fc885`: Syntax, elf Node-Tests, Build und echter Chromium-Browsertest erfolgreich. Deployment im Pull Request bestimmungsgemäss übersprungen.

- C2 → W2 → genau ausgewählte vergangene Woche → Tag → dieselbe Woche; zehn vollständige Wiederholungen ohne Browserfehler.
- Aktuelles lokales Datum mit kontrollierter Testuhr, Armband-Akkubeschriftung, Min/Max und Kategorie-Puls, Zukunft ohne Nullmessungen, Datenlücken und rote Startseite-Buttons.
- Übertragungsrückstand, erfolgreiche/fehlgeschlagene Übertragung, Lückenszenario und Reset.
- 1280×900, 820×1180, 1180×820 und 400×800 CSS-Pixel; kein horizontaler Seitenüberlauf. Balkengrundlinien in D1 und W2 bei breiten und Tablet-Hochformatansichten gleich ausgerichtet. 200-%-CSS-Zoom in Chromium ohne horizontalen Seitenüberlauf.
- Service-Worker-Bereitschaft, Offline-Neuladen und nachfolgende Navigation unter /SMARTwearable/. Kein unbeabsichtigter Update-Dialog bei Erstinstallation.
- Browser-Screenshots von C2, W2, D1 aktuell und historisch visuell geprüft. Reale Android-Schriftvergrösserung, Installation, Update und Verständlichkeit müssen weiterhin am Tablet geprüft werden.

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
