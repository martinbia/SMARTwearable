# SMARTwearable – Arbeitsregeln

Version 0.1 · 06.11.2026

## Projekt

Klickbares PWA-Mock-up für qualitative Interviews mit Patienten nach Hüftoperation zu Hause. Referenzgerät Lenovo Tab TB311FU. Design und Anforderungen werden im ChatGPT-Projekt diskutiert; Codex übernimmt die beauftragte Implementierung.

## Vor jeder Bearbeitung

- README_START_HIER.md und die betroffenen Dateien unter docs/ lesen.
- Vorhandene Implementierung, Repository-Anweisungen und Änderungen anderer Bearbeiter respektieren.
- FESTGELEGT, VORSCHLAG, ANNAHME und OFFEN unterscheiden. Vorschläge nicht eigenmächtig als bestätigt umetikettieren.
- Routineentscheidungen innerhalb eines erteilten Implementierungsauftrags selbstständig treffen und dokumentieren. Nicht für jede reversible technische Entscheidung nachfragen.

## Produktregeln

- Nur fiktive Daten; keine echten Personen, Wearable-Anbindungen, Konten, Analytik oder Cloud-APIs.
- C2-Wochenstart priorisieren, D1-Tagesaufschlüsselung und W2-Wochenvergleich ergänzen. Einfache Übersicht, Details bei Bedarf.
- Selbstständigkeit respektieren. Keine Diagnose, Heilungsprozente, pauschalen Aktivitätsziele oder Belastungsfreigaben.
- Messwerte, Ableitungen, Selbstberichte und Gerätestatus unterscheiden.
- Datenlücken sind keine Ruhephasen. Hauttemperatur nicht als Körperkerntemperatur bezeichnen.
- Dieselben Beispieldaten und Berechnungen für alle Darstellungsvarianten verwenden.
- Keine vertraulichen Originalunterlagen ins öffentliche Repository übernehmen.

## Umsetzung und Dokumentation

- Inhalte und Demodaten von Darstellung und Navigation trennen.
- GitHub-Pages-Unterpfad /SMARTwearable/ für Ressourcen, Navigation, Manifest und Service Worker berücksichtigen.
- Alle produktrelevanten Änderungen mit stabilen Anforderungs-IDs verknüpfen; betroffene Dokumente mitpflegen.
- Gemessene Ergebnisse von noch ausstehenden Prüfungen unterscheiden. Tabletprüfung nicht durch einen Desktoptest als erledigt darstellen.
- Keine automatische Synchronisation zwischen ChatGPT-Projekt und GitHub behaupten.
- Keine echten Interviewantworten speichern oder übertragen.

## Ab Version 0.2

C2/D1/W2 ersetzen A/B. Aktuelles lokales Appstart-Datum statt fester Demotag. Alle Unterseiten mit rotem Startseite-Button. Die Beschlüsse D17–D27 und Spezifikationen v0.2 haben Vorrang gegenüber dem historischen CODEX_START.md v0.1. Keine echten Sensoren oder medizinischen Ziele.

## Ab Version 0.3

Startseite Variante 2 zeigt nur Aktivität. Schritte und Puls bleiben in Details. D28–D31 und N17 regeln kompakte Darstellung mit sichtbaren Aktionen innerhalb der tatsächlich verfügbaren App-Fläche; bei Vergrösserung Inhalte nicht abschneiden.

## Ab Version 0.4

W2/D1/Tagesverlauf erhalten kompakte gemeinsame Navigations-/Titelzeile ohne Marken-/Heute-Banner. D32–D36 und F23–F25/N18 gelten; Startseite v0.3 unverändert. Daten und Berechnungen aus gemeinsamen Selektoren erhalten.
## GUI-Bestandsschutz (GUI-Freeze) – verbindlich ab 09.11.2026

**Grundregel:** Die bestehende GUI ist bei Funktionsentwicklungen zu erhalten. Nur der im aktuellen Auftrag **ausdrücklich bezeichnete GUI-Bereich** darf soweit nötig verändert oder ergänzt werden. Für alle anderen Ansichten und Elemente gilt Bestandsschutz – auch dann, wenn Codex eine Änderung für eine gestalterische Verbesserung halten würde.

### Ohne ausdrückliche GUI-Freigabe untersagt

- Bestehende Positionen, Grössen, Abstände, Ränder, Farben, Schriftarten/-grössen, Icons, Bilder, Animationen, Beschriftungen oder die Informationshierarchie ändern.
- Navigation, Menüs, Buttons, Kopf-/Fusszeilen, responsive Layouts oder andere nicht beauftragte Ansichten umgestalten.
- Globale CSS-Anpassungen, Design-Refactoring, Vereinheitlichungen oder sonstige „Nebenbei-Optimierungen“ durchführen, wenn sie das Erscheinungsbild ausserhalb des Auftrags verändern.
- Freigegebene Designreferenzen oder Vergleichs-Screenshots eigenmächtig ersetzen oder neu als Sollzustand festlegen.

### Zulässiger Änderungsumfang

- Neue Funktionen im **beauftragten Bereich** implementieren und dort die dafür **ausdrücklich verlangten** GUI-Elemente hinzufügen.
- Bestehende Funktionen und übrige Ansichten dabei visuell und funktional erhalten; technische Änderungen möglichst ohne sichtbare Auswirkungen auf andere Bereiche realisieren.
- Ein Funktionsauftrag ist **keine pauschale Designfreigabe**. Auch für eine vermeintlich notwendige Änderung eines bisher bestehenden, nicht ausdrücklich freigegebenen GUI-Elements erst die konkrete Abweichung beschreiben, begründen und die Freigabe des Auftraggebers einholen. Falls möglich den übrigen Funktionsumfang unabhängig davon implementieren.
- Entdeckte Probleme an nicht beauftragten Ansichten (auch Darstellungs-, Responsivitäts- und Accessibility-Probleme) melden und eine gezielte Korrektur vorschlagen, **nicht ungefragt umsetzen**.

### Vor jedem Implementierungsauftrag

1. Betroffene Ansichten, Komponenten und Dateien sowie **nicht zu verändernde** Bereiche benennen.
2. Den aktuellen Stand anhand des Ausgangs-Commits, bestehender Designreferenzen und – sofern vorhanden – freigegebener Screenshots feststellen. Nicht vorhandene Referenzen nicht als freigegeben behaupten.
3. Die kleinstmögliche Änderung wählen. Bei einem Konflikt zwischen Funktion und Bestandsschutz **vor einer zusätzlichen GUI-Änderung** um Freigabe bitten.

### Prüfung und Abschlussbericht

1. Vor Abschluss die beauftragten Ansichten **und** die nicht betroffenen Ansichten auf unbeabsichtigte visuelle Veränderungen prüfen.
2. Vorhandene, ausdrücklich freigegebene Referenz-Screenshots bei konstantem Viewport/Browser vergleichen; animierte/dynamische Bereiche in reproduzierbare Zustände versetzen oder kenntlich ausklammern. Wenn kein visueller Vergleich möglich war, dies als **nicht geprüft** ausweisen.
3. Jede beabsichtigte GUI-Änderung, die betroffenen Ansichten und das Ergebnis des Vergleichs im Pull Request/Abschlussbericht dokumentieren. Nicht autorisierte Abweichungen zurücknehmen, statt sie zu rechtfertigen.
4. **Screenshot-Baselines nur nach ausdrücklicher GUI-Freigabe aktualisieren.** Ein grüner Funktionstest ersetzt keine visuelle Abnahme.
5. Änderungen zunächst auf einem Arbeitsbranch/PR zur Prüfung anbieten, sofern der Auftraggeber nicht ausdrücklich eine andere Vorgehensweise vorgibt.

**Vorrang:** Diese Regel schränkt die Freiheit bei reversiblen technischen Detailentscheidungen auf **nicht visuell wirksame** Änderungen ein. Projektspezifische fachliche, medizinische, Datenschutz- und Sicherheitsanforderungen gelten unverändert. Ein neuer Commit löst keinen Codex-Auftrag automatisch aus.

## Risikobasierte Tests und effiziente Nutzung

Nach jeder Codeänderung sind die betroffenen Funktionen angemessen zu testen.

Der Testumfang muss sich am Risiko und Umfang der Änderung orientieren:

1. **Kleine GUI-Änderungen:** Relevante automatisierte Tests und gezielte Kontrolle der betroffenen Ansicht. Keine vollständigen Browser-Regressionstests.
2. **Neue Funktionen:** Funktionstests sowie gezielte Browser-Tests der betroffenen Funktionen und Navigationswege.
3. **Änderungen an grundlegenden Komponenten:** Erweiterte Tests aller potenziell betroffenen Bereiche.
4. **Änderungen an Service Worker, Caching, Offline-Funktionen, Versionierung oder Deployment:** Umfassende Tests der relevanten PWA-Funktionen.
5. **Vor einer Studienfreigabe oder einem wichtigen Release:** Vollständige Regressionstests einschliesslich der relevanten Browser-, Offline- und Update-Szenarien.

### Grundsätze

- Bestehende automatisierte Tests nicht entfernen oder deaktivieren.
- Tests nicht allein zur Einsparung von Kontingent überspringen.
- Vorhandene Tests bevorzugt wiederverwenden.
- Keine unnötigen Browser-Durchläufe oder wiederholten Screenshots.
- Testfehler nachvollziehbar beheben.
- Am Ende jedes Auftrags kurz angeben, welche Tests durchgeführt und welche nicht durchgeführt wurden.
- Wenn ein Test aus technischen Gründen nicht möglich war, dies ausdrücklich mitteilen.

**Bestandsschutz:** Der bestehende GUI-Freeze und alle anderen Bestimmungen in `AGENTS.md` bleiben unverändert und dürfen durch die risikobasierte Testplanung nicht abgeschwächt werden.
