# Entscheidungsprotokoll

Version 0.1 · 06.11.2026

| ID | Datum | Status | Entscheidung / Grundlage |
| --- | --- | --- | --- |
| D01 | 06.11.2026 | F | Referenzgerät Lenovo Tab TB311FU; Android-/Browserversion noch offen. |
| D02 | 06.11.2026 | F | Selbstständige Bedienung nach kurzer Einführung. |
| D03 | 06.11.2026 | F | Einstieg: Armband anlegen, danach Tablet mit SMARTwearable zeigen. |
| D04 | 06.11.2026 | F | Internet als vorhanden angenommen. |
| D05 | 06.11.2026 | V | Vorbereitete Demo zusätzlich offline nutzbar. |
| D06 | 06.11.2026 | F | Klare einfache Übersicht, Vertiefung über Details. |
| D07 | 06.11.2026 | F | Repository https://github.com/martinbia/SMARTwearable. |
| D08 | 06.11.2026 | F | Aufteilung Heute, Details, sieben Tage, Mein Armband, Interviewsteuerung bestätigt. |
| D09 | 06.11.2026 | F | Zwei Heute-Darstellungen: Kennzahlenkarten und grafischer Tagesverlauf mit gleichen Daten. |
| D10 | 06.11.2026 | F | Nur hypothetische Aktivitäten und simulierte Mess-/Gerätezustände. |
| D11 | 06.11.2026 | V | Fester Demo-Zeitpunkt 09.11.2026, 14:30, für sieben Tage nach Austritt am 02.11. |
| D12 | 06.11.2026 | V | Zahlen, Szenarien, Textvorschläge und Prüfschwellen dieses Pakets als erster Entwurf. |
| D13 | 06.11.2026 | V | Bereitstellung über GitHub Pages mit automatisiertem Workflow. |
| D14 | 06.11.2026 | A | Datenquellen Puls, Hauttemperatur, Bewegung; noch keine bestätigte Gerätekonfiguration. |
| D15 | 06.11.2026 | F | Auftraggeber beauftragt Umsetzung des Pakets und aller Vorschläge vorläufig für die erste Iteration; endgültige Designfreigabe bleibt nach Tablet-Test. Pull Request erstellen, nicht automatisch mergen. |
| D16 | 06.11.2026 | V | Statische Anwendung ohne Laufzeitabhängigkeiten; Daten, Berechnungen, Texte und Darstellung getrennt. Tatsächlicher Prüfstand in IMPLEMENTATION_STATUS.md. |

## Offene Punkte

| ID | Frage | Auswirkung und Vorgehen |
| --- | --- | --- |
| O01 | Bedeutet IMC tatsächlich IMU? Welches Wearable? | Für reine Demo nicht blockierend; keine echten Sensorfähigkeiten behaupten. |
| O02 | Android-/Browserversion und reale Ansichtsgrösse? | Beim Tablet-Test dokumentieren, keine Kompatibilität vorab bestätigen. |
| O03 | Detaillierte Gestaltung und N01–N15 freigegeben? | Vorschläge in erster Iteration prüfbar machen. |
| O04 | Reicht ein Sitzungsspeicher für Einstellungen? | Vorerst V: Sitzung, keine Interviewdaten speichern. |
| O05 | Codex-Umgebung und Pages eingerichtet? | Separat prüfen; Repository-Rechte allein belegen dies nicht. |

## Änderungsregeln

Neue Vereinbarungen mit Datum und stabiler ID ergänzen. Bestehende Beschlüsse nicht rückwirkend als bestätigt ausgeben. Umsetzungsvorschläge können ausdrücklich zur vorläufigen Umsetzung beauftragt werden; Status und endgültige Designfreigabe bleiben nachvollziehbar getrennt.

Bei Änderung immer betroffene funktionale Anforderungen, UX, Demodaten, Prüfkriterien und Interviewaufgaben gemeinsam prüfen. Implementierungsstand erst mit Commit-/PR-Bezug und tatsächlichen Prüfergebnissen ergänzen.

## Beschlüsse GUI v0.2 (08.11.2026)

Diese neueren Beschlüsse ersetzen bei Widerspruch ältere Entscheidungen, ohne die Historie zu löschen.

| ID | Status | Beschluss |
| --- | --- | --- |
| D17 | F | C2 als Startseite mit grafischem Wochenstand, Zielband und Bestwoche; ersetzt bisherigen Heute-Einstieg/A-B. |
| D18 | F | D1 als Tagesaufschlüsselung einer ausgewählten Woche. |
| D19 | F | W2 als Wochenvergleich mit drei gleichzeitig sichtbaren Messgrössen; Auswahlreiter entfallen. |
| D20 | F | Jede Woche direkt antippbar; öffnet genau diese Woche nach Tagen. Jeder vorhandene Tag öffnet Tagesverlauf. |
| D21 | F | Startseite-Button auf allen Unterseiten rot mit weisser Schrift. |
| D22 | F | Puls: Min/Max und während Schritten bzw. sonstiger Bewegung; Mittelwerte je Kategorie vorläufig wie besprochen. |
| D23 | F | Status ausdrücklich „Armband-Akku“. Kleiner Kopf statt grossem Banner. |
| D24 | F | Aktuelles lokales Datum beim Appstart; ersetzt festen Datumsanker D11. |
| D25 | F | Umsetzung beauftragt, Spezifikationen zuerst aktualisieren, neuer PR ohne automatisches Merge. |
| D26 | A | Sechs Wochen; Ziel100/Band90–110 nur illustrative Demoparameter. |
| D27 | A | Sitzung friert Datum/Uhrzeit ein; kein obligatorischer Info-Startdialog. |

Weiter offen: echtes Wearable/Klassifikationsverfahren, reale Lenovo-Prüfungen und fachlich vereinbarte Ziele. Sensorgrenzen und Zielband sind keine bestätigten medizinischen Parameter. Umsetzung und Veröffentlichung separat in IMPLEMENTATION_STATUS.md nachweisen.

## Beschlüsse Präferenzen v0.5 (09.11.2026)

| ID | Status | Beschluss |
| --- | --- | --- |
| D37 | F | Vor C2 ist beim erstmaligen Aufruf ohne vollständige Auswahl eine verpflichtende Ersteinrichtung mit drei Präferenzen erforderlich. Sie kann später erneut geöffnet und bearbeitet werden. Dies ersetzt D27 ausschliesslich bezüglich des Einstiegs; ein Info-/Demostartdialog wird dadurch nicht eingeführt. |
| D38 | F | Die drei Präferenzen betreffen gemeinsame hohe/niedrige Pulshinweise, Aktivitätserinnerung per Vibration und gewünschte Sichtbarkeit für Gesundheitsfachpersonen. Keine reale Überwachung, Vibration, Freigabe oder Übertragung. |
| D39 | A | Keine Vorauswahl. Erst weiter nach drei Antworten. Änderungen werden ausdrücklich übernommen; Abbruch verwirft den Entwurf. |
| D40 | A | Gültige Präferenzen lokal im Browserprofil speichern; ungültige oder fehlende Felder führen zurück zur Ersteinrichtung. Keine Konten, Server oder echten Gesundheitsdaten. |
| D41 | V | Drei einzeln beschriftete Zugänge mit Status im C2-Fussbereich; im ersten Entwurf vorhandene C2-Hauptgrafik und Hauptaktionen erhalten. Grössen-/Layoutprüfung N17 entscheidet, ob diese Platzierung praktikabel ist. |
| D42 | F | „Ersteinrichtung zurücksetzen“ löscht nur die drei Präferenzen und zeigt die Pflichtseite erneut; der bestehende Interview-Reset für Demo- und Geräteszenarien bleibt getrennt erhalten. |

Offen (O): medizinisch begründete Pulsgrenzen, fachlich begründete Zeit-/Aktivitätsschwelle, Wearable-Anbindung, reale Berechtigungs- und Freigabeverfahren. Bis zu einer gesonderten Entscheidung bleiben alle drei Einstellungen reine Präferenzen im Mock-up. Die verwendeten Texte und konkrete Platzierung bleiben bis zum Tablet-Test gestalterische Arbeitsvorschläge.

## Beschlüsse GUI v0.3 (08.11.2026)

| ID | Status | Beschluss |
| --- | --- | --- |
| D28 | F | Variante 2 mit Aktivität als einziger Messgrösse auf der Startseite ausgewählt und Umsetzung beauftragt. Ersetzt Schritte-/Pulskarten aus v0.2. |
| D29 | F | Schritte und Puls bleiben über Tages-/Wochendetails zugänglich; Zielband, Bestwoche und aktuelles Datum bleiben erhalten. |
| D30 | F | Kopfbereich weiter reduzieren; Hauptnavigation innerhalb der zwischen Android-Systemleisten verfügbaren Fläche sichtbar. Keine Systemleisten simulieren. |
| D31 | A | Browser-Prüfflächen N17 als vorläufige Abnahmekriterien; reale Lenovo-App-Höhe noch unbekannt. Vergrösserung/kleine Fenster dürfen vertikal scrollen, damit Inhalte zugänglich bleiben. |

Änderungen als neuer Pull Request auf dem inzwischen gemergten Stand von PR #2; kein automatisches Merge.

## Beschlüsse GUI v0.4 (08.11.2026)

| ID | Status | Beschluss |
| --- | --- | --- |
| D32 | F | Drei gezeigte kompakte Detailentwürfe zur Umsetzung freigegeben: W2, D1 und einzelner Tagesverlauf. |
| D33 | F | Separate SMARTwearable-/Heute-Zeile auf diesen drei Seiten entfällt; gemeinsame Navigation/Titelzeile und mehr Fläche für Messgrafiken. |
| D34 | F | Tageszusatzangaben aufklappbar; Min/Max und Puls während beider Bewegungsarten unmittelbar sichtbar. |
| D35 | F | Zufriedenstellende Startseite v0.3 unverändert erhalten; fiktive Daten und deren Berechnungen ebenfalls erhalten. |
| D36 | A | N18-Prüfflächen und konkrete Layoutmasse vorläufig; reales Tablet mit Systemleisten und Schriftvergrösserung noch prüfen. |

Neuer Pull Request auf dem inzwischen gemergten Stand von PR #3. Kein automatisches Merge.

## Layout Präferenzseite v0.6 (09.11.2026)

| ID | Status | Beschluss |
| --- | --- | --- |
| D43 | zur Umsetzung beauftragter Vorschlag | Die bestehende Präferenzseite wird innerhalb ihres eigenen Layoutbereichs kompakter und im Querformat zweispaltig dargestellt: Pulshinweise und Aktivitätserinnerung nebeneinander, Datenfreigabe über beide Spalten. Kopfzeile, Hinweistext, Seitenränder und Bestätigungsbereich werden verdichtet. Erstmalige Einrichtung bleibt nicht überspringbar; der Startseite-Button erscheint nur beim Bearbeiten gespeicherter Einstellungen. Funktionen, Daten und übrige Ansichten sind Bestandsschutz. |

Die konkrete Umsetzung ist bis zur Sichtprüfung am Lenovo ein Vorschlag und wird durch den Auftrag nicht als endgültige Designentscheidung bestätigt.

## Appstart und Einstiegsanimation v0.7 (09.11.2026)

| ID | Status | Beschluss |
| --- | --- | --- |
| D44 | F | Jeder vollständige PWA-Dokumentstart beginnt bei der Präferenzseite. Gültige gespeicherte Antworten bleiben gespeichert und werden vorausgewählt; unveränderte Bestätigung führt zu C2. Interne Navigation löst keine erneute Einrichtung aus. Dies ersetzt D37s Regel „nur beim erstmaligen Aufruf ohne vollständige Auswahl“; die Ersteinrichtung bleibt verpflichtend, wenn Einstellungen fehlen/ungültig sind. |
| D45 | F | Variante 1, die kurze visuelle Einführung „Armband anlegen – Daumen hoch“, wird zur Umsetzung beauftragt. Das Bildzeichen bestätigt ausschliesslich das Anlegen im Mock-up und suggeriert keine Geräteverbindung/Messung. Die kompakte Einstellungsseite v0.6 bleibt erhalten. |
| D46 | V, durch D47 ersetzt | Frühere Ausführungsidee: vereinfachte SVG-Illustration im Kopfbereich. Diese wird nicht weiterverwendet. |
| D47 | F | Die vorhandene SVG/CSS-Animation wird durch die sechs im Auftrag bereitgestellten lokalen Stop-Motion-PNGs ersetzt. Im Querformat eine horizontale Reihe, im Hochformat zwei Reihen zu je drei Bildern. Hervorhebung wandert einmalig alle etwa 700 ms durch die Folge (ca. 4,2 s); danach bleibt Bild 6 betont. Bilder bleiben sichtbar, unverzerrt und unbeschnitten; Wiederholen-Schaltfläche und vollständige statische Reihe bei `prefers-reduced-motion`. Assets offline verfügbar. Layoutreferenz bestimmt nur die Bildreihen-Anordnung. Die KI-Bilder sind keine verifizierten Produktfotos oder Anlegeanleitung. Andere GUI und Einstellungen bleiben unverändert. |

## Einstiegsseite und Einstellungsseite v0.9 (09.11.2026)

| ID | Status | Beschluss |
| --- | --- | --- |
| D48 | zur Umsetzung beauftragter Vorschlag | Vor jeder vollständigen PWA-Sitzung eine Einstiegsseite mit sechs lokalen Anlegebildern, fiktiven Informationsfeldern, sichtbarem 20-Sekunden-Countdown und sofortigem Button „Einstellungen öffnen“ anzeigen. Danach die verpflichtenden Einstellungen öffnen. Bildanordnung aus den Referenzen übernehmen, aber bestehendes grünes SMARTwearable-Farbschema verwenden. Präferenzen und ihre Speicherung bleiben unverändert. Volle Bildsequenz in den Einstellungen nur noch aufklappbar erreichbar. „Wasserdicht“ und Ganztagstragen bleiben nicht verifizierte Demo-Platzhalter, keine realen Produkt-/Medizinbehauptungen. Alle weiteren Ansichten GUI-Freeze. |

D48 ersetzt für vollständige Appstarts D44s direkten Einstieg in die Einstellungsseite; D44s gespeicherte Antworten und Regel gegen erneuten Einstieg bei interner Navigation bleiben bestehen. D47 bleibt Quelle für die Bildassets, Darstellungsqualität und Animationsfolge; die Folge wird auf der Einstiegsseite abgespielt.

D44 ersetzt die frühere Einstiegsannahme aus D27 und die nur erstmalige Anzeige gemäss D37. Die Präferenzoptionen, lokale Speicherung und der getrennte Interview-Reset aus D38–D42 bleiben gültig.
