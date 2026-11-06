# Codex-Startauftrag

Version 0.1 · 06.11.2026

Den folgenden Auftrag zusammen mit dem gesamten Paket in einer Codex-Aufgabe für das Repository martinbia/SMARTwearable verwenden. Dieser Auftrag wird erst durch ausdrückliches Absenden ausgeführt. Er beauftragt Vorschläge als vorläufige Umsetzung, nicht als endgültige Designfreigabe.

---

Arbeite im GitHub-Repository https://github.com/martinbia/SMARTwearable.

Erstelle die erste klickbare, installierbare Tablet-PWA SMARTwearable auf Grundlage des beigefügten Markdown-Pakets Version 0.1. Die darin als VORSCHLAG gekennzeichneten Details darfst du für diese erste Iteration vorläufig umsetzen. Behalte ihre Kennzeichnung in der Dokumentation bei; erfinde keine Freigaben.

## 1. Bestand und Dokumentenimport

- Untersuche zuerst Repository, Branch, bestehende AGENTS.md und vorhandene Anwendung. Überschreibe keine fremden Änderungen und keine bestehende AGENTS.md unbesehen; führe kompatible Anweisungen zusammen.
- Importiere README_START_HIER.md, CODEX_START.md, AGENTS.md und docs/ aus dem Paket in die entsprechenden relativen Repository-Pfade. Vermeide einen zusätzlichen Paketordner im Root.
- Lies alle Spezifikationen. Es sind keine Original-Persona-PDFs für den Build erforderlich. Die zusammengefassten Bedürfnisse reichen als Grundlage; keine weiteren privaten Unterlagen beschaffen.

## 2. Durchgängige erste Version

- Implementiere F01–F15 aus FUNCTIONAL_SPEC.md einschliesslich der vorgeschlagenen Simulationsfunktionen und vorbereiteter Offline-Nutzung.
- Heute mit zwei vergleichbaren Varianten A/B, Details, sieben Tage, Mein Armband und getrennte Interviewsteuerung.
- Nutze die Daten und Berechnungsregeln aus DEMO_DATA_SPEC.md. Erzeuge deterministische Daten; keine neuen Zufallswerte bei Navigation.
- Der Datenstand begrenzt alle angezeigten Summen und Kurven. Nicht übertragene Daten dürfen vor simulierter Übertragung nicht als aktuell sichtbar sein.
- Keine echten Sensoren, API-Schlüssel, Logins, Tracker, Interviewdaten oder medizinischen Auswertungen.
- Wähle eine möglichst einfache wartbare statische Architektur. Daten, Texte und Berechnungen von Darstellung trennen; keine unnötigen Abhängigkeiten.
- Berücksichtige N01–N15. Nicht am Referenzgerät geprüfte Kriterien ausdrücklich offen lassen.

## 3. PWA und GitHub Pages

- Ressourcen, Manifest, Icons, Start-URL und Service Worker müssen unter dem Repository-Unterpfad /SMARTwearable/ funktionieren.
- Hoch-/Querformat, eigenständiger PWA-Start und Cache-Aktualisierung berücksichtigen. Externe CDN-Ressourcen vermeiden.
- Richte einen GitHub-Actions-Workflow für Build/Prüfung und GitHub Pages ein. PR-Prüfung soll keine Veröffentlichung auslösen; Deployment nach Übernahme in main und bei manuellem Start vorsehen.
- Dokumentiere notwendige manuelle Repository-Einstellungen und unterscheide vorbereiteten Workflow von tatsächlich erfolgreicher Veröffentlichung.
- Keine administrativen Einstellungen ohne vorhandene Berechtigung vortäuschen; wenn nicht ausführbar, genaue verbleibende Schritte nennen.

## 4. Sinnvolle Prüfungen

- Demodaten rechnerisch validieren: Intervalllängen, Abschnittszahl, Lücken, Zeitgrenzen und Datenstandfilter.
- Variantenidentität prüfen: gleiches Datum/Szenario ergibt gleiche Werte in A/B.
- Navigation, Tagesauswahl, Szenariowechsel und vollständiges Reset prüfen.
- Responsives Layout, Unterpfad-Aufruf und vorbereiteten Offline-Neustart prüfen, soweit die Umgebung es erlaubt.
- Dokumentiere ausgeführte Prüfungen mit Ergebnissen und separat ausstehende Tests auf Lenovo Tab TB311FU. Fehlende Testmöglichkeiten nicht als Erfolg ausgeben.

## 5. Abschluss und Übergabe

- Aktualisiere README und Spezifikationen mit dem tatsächlichen Implementierungsstand, ohne Designvorschläge zu bestätigten Entscheidungen zu erklären.
- Erstelle einen Pull Request mit verständlicher Beschreibung und Prüfergebnissen. Nicht automatisch mergen.
- Nenne die noch nötigen Schritte für Übernahme, Pages-Einrichtung und Tablet-Test.
- Gib die veröffentlichte Adresse nur dann als funktionierend an, wenn sie tatsächlich geprüft wurde; andernfalls als erwartete Adresse kennzeichnen.
- Arbeite innerhalb dieses Auftrags selbstständig. Stelle nur Fragen, wenn ein tatsächlicher Blocker nicht durch eine dokumentierte reversible Annahme lösbar ist.
