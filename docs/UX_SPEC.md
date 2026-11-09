# Ansichten und Bedienkonzept

Version 0.5 · 09.11.2026 · C2, D1 und W2 FESTGELEGT; Detailparameter als Annahmen gekennzeichnet.

## Präferenz-Ersteinrichtung v0.5

Beim ersten Aufruf ohne vollständige Präferenzen erscheint vor C2 die Seite „Ihr Armband – Ihre Einstellungen“. Sie erklärt, dass die Person selbst über Hinweise und Sichtbarkeit entscheidet und die Optionen später ändern kann. Ein klarer Demo-Hinweis sagt, dass keine echten Warnungen, Vibrationen oder Datenfreigaben stattfinden.

Drei getrennte Gruppen mit grossen, gleichwertigen Auswahlflächen, ohne vorausgewählte Antwort:

1. „Pulshinweise“: ungewöhnlich hoher oder niedriger Puls; Ja/Nein ist ein gemeinsamer Schalter.
2. „Aktivitätserinnerung“: Vibration bei längerer geringer Bewegung; Ja/Nein, neutral formuliert, ohne Intervall oder Aktivitätsschwelle.
3. „Wer darf meine Gesundheitsinformationen sehen?“: „Nur ich“ / „Auch meine Gesundheitsfachpersonen“.

„Einstellungen übernehmen und weiter“ bleibt bis zu einer Auswahl in allen drei Gruppen deaktiviert. Nach dem Speichern öffnet sich die unveränderte C2-Startseite. Konfiguration und Gesundheits-/Demodaten bleiben getrennt.

Im C2-Fussbereich erscheinen drei einzelne Einstellungszugänge „Pulshinweise“, „Aktivitätserinnerung“ und „Datenfreigabe“ mit kurzem gespeicherten Status. Antippen öffnet dieselbe Einstellungsansicht; der zugehörige Bereich erhält den Fokus, alle anderen bleiben sichtbar/erreichbar. Eine Änderung wird erst mit „Änderungen übernehmen“ gespeichert. „Änderungen verwerfen“ führt ohne Speicherung zu C2 zurück. Der gewählte Vorschlag platziert die Zugänge im vorhandenen Fussbereich; zentrale Aktivitätsgrafik und drei Hauptaktionen bleiben bestehen. Bei Unterschreitung der N17-Höhenanforderung ist eine alternative Platzierung vor einer Layoutänderung gesondert freizugeben.

Die Interviewsteuerung enthält zusätzlich „Ersteinrichtung zurücksetzen“. Diese Aktion löscht nur die drei Präferenzen und startet die Pflichtseite erneut. Der separate bisherige „Demo zurücksetzen“-Vorgang behält sein Verhalten.

## Gemeinsamer Rahmen

Auf der Startseite gemeinsame kompakte Kopfzeile: kleiner App-Name mit Info/Beispieldaten und ausdrücklich „Armband-Akku … % · Daten bis …“. Darunter aktueller lokaler Wochentag und Datum vom Appstart. Wochenvergleich, Woche nach Tagen und Tagesverlauf erhalten ab v0.4 einen gemeinsamen kompakten Detailrahmen ohne separate App-Marken-/Heute-Zeile. Geräte-/Info-/Interviewseiten behalten ihren bisherigen Rahmen. Kein grosser Titelbanner. Info bleibt jederzeit erreichbar; ein obligatorischer Startdialog wurde nicht beschlossen.

Auf ALLEN Unterseiten ein roter Button mit weisser Schrift „← Startseite“, einschliesslich Geräte-, Info-, Tages- und Interviewansicht. Zusätzliche kontextbezogene Rückwege sind neutral/teal. Rot bezeichnet hier Navigation, keine Bewertung der Aktivität.

## C2 – Startseite

Gemeinsame Grafik mit drei horizontalen Reihen und gemeinsamer Null-/Minutenskala: aktuelle Woche bisher, persönliches Wochenziel, aktivste abgeschlossene Woche. Beim Wochenziel schraffiertes Toleranzband. Vorläufige Demowerte: Ziel 100, Bereich 90–110 Bewegungsminuten; kein medizinisch definierter Grenzbereich. Bestwoche nur unter abgeschlossenen Wochen mit vollständiger Messabdeckung bestimmen; wenn keine vorliegt, nicht verfügbar.

Variante 2 (Aktivität allein) ist FESTGELEGT und ersetzt die bisherigen Schritte-/Pulskarten. Allgemeine Aktivität umfasst Schrittbewegung UND sonstige Bewegung. Auf der Startseite nur Aktivität als Messgrösse zeigen, mit neutralem Bewegungssymbol statt Geh-/Herzsymbol. Schritte und Puls bleiben in D1, W2 und Tagesdetails erreichbar. Antippen der Wochengrafik öffnet die aktuelle D1-Woche.

Kompakte Überschrift „Aktivität diese Woche“ und Wochenzeitraum in einer Zeile, darunter drei Vergleichsreihen. Unter der Grafik kurzer Hinweis auf Bewegungsminuten, fiktiven Zielbereich und laufende/unvollständige Woche; ausführliche Erklärung über Info. Drei gut sichtbare Aktionen: „Woche nach Tagen“, „Wochen vergleichen“ und „Mein Armband“. Kleine Fusszeile mit Fiktiv-Hinweis, Info und Interviewsteuerung.

Die tatsächlich verfügbare App-Höhe zwischen Android-Statusleiste und Taskleiste verwenden. Keine Systemleisten nachzeichnen oder deren angenommene Höhe nochmals abziehen; diese gehören Android. Bei Standard-Schriftgrösse soll die Startseite ohne Scrollen in reduzierten Tablet-Ansichten passen. D1/W2/Tag nutzen ab v0.4 ebenfalls einen kompakten Detailrahmen; bei zu wenig Platz bleibt Scrollen erlaubt. Bei starker Schriftvergrösserung oder sehr kleinem Fenster Inhalte durch Scrollen erreichbar halten, nicht abschneiden oder hinter fixen Buttons verbergen. Keine Vollbildberechtigung verlangen.

## D1 – ausgewählte Woche nach Tagen

Montag bis Sonntag mit datumsrichtigen Beschriftungen. Aktivität und Schritte als Grafik, Tagespuls mit Minimum/Maximum und optionalem Mittelwert. Separate Darstellung des mittleren Pulses während Schrittbewegung sowie während sonstiger Bewegung. Unabhängige Einheiten und Skalen; keine addierten Pulszahlen. Erläutern: Pulsgruppen enthalten nur Messungen während der jeweiligen Bewegungsart.

Tipp auf beliebigen vorhandenen Tag öffnet dessen Tagesverlauf. Zukünftige Tage ohne Balken und ohne Nullwert: „Noch nicht“. Heute „bisher“. Datenlücke schraffiert und textlich erläutert, keine Ruhebehauptung. Vergangene Woche zeigt sieben tatsächliche Demo-Tage. Titel in der gemeinsamen Navigationszeile bezeichnet die ausgewählte Woche; keine zusätzliche grosse Heute-Zeile. Lokales Appstart-Datum bleibt die Datengrundlage.

## W2 – Wochenvergleich

Sechs Wochen gleichzeitig; drei untereinander angeordnete Diagramme für Aktivitätsminuten, Schritte und Pulsminimum/-maximum. Keine Auswahlreiter Aktivität/Schritte/Puls, da alles gleichzeitig dargestellt wird. Aktivität/Schritte beginnen bei null. Nur Aktivität enthält Wochenziel mit Toleranzband und Bestwochenmarkierung; Puls ohne Ziel und Leistungswertung.

Tipp auf Wochenbalken, Datum oder Pulsbereich öffnet unmittelbar D1 für DIESE Woche, ohne zusätzlichen Bestätigungsbutton. Aktuelle Woche als unvollständig kenntlich; fehlende zukünftige Tage nicht als Null behandeln. Wochen mit Datenlücken kennzeichnen. Detail-Rückweg behält den gewählten Wochenkontext.

## Tagesverlauf, Geräte und Interviews

Tagesverlauf enthält nach Bewegungsart unterscheidbare Abschnitte, Schritte, Pulszeitreihe ohne Linien über Datenlücken sowie Strecken-/Hauttemperaturdetails. „← Zur Woche“ erhält die ausgewählte Woche. Geräte-/Lade-/Übertragungssimulation bleibt erhalten. Interviewsteuerung stellt Szenarien und Reset bereit; bisherige Varianten A/B entfallen.

Die Einrichtungsseite ist eine neue, eigenständige Ansicht vor C2, keine zusätzliche Messansicht. Bei späterer Änderung ist die Rückkehr ohne Speichern möglich. Die rote Startseite führt bei bearbeitbaren Einstellungen zu C2; während der verpflichtenden Ersteinrichtung gibt es keinen Umgehungsweg.

Bei schmalen Ansichten dieselben Informationen in gut lesbaren Tages-/Wochenkarten statt zu kleiner sieben-/sechsspaltiger Grafiken zeigen. Kein horizontaler Seitenüberlauf. Tabellendetails bieten zusätzlich alle verfügbaren Werte in Textform.

## Kompakte Detailseiten v0.4 – FESTGELEGT

- Eine gemeinsame Werkzeug-/Titelzeile: roter Startseite-Button, kontextbezogener neutraler Rückweg, kleiner Titel des ausgewählten Zeitraums, Armband-Akku und Info. D1 enthält kompakte beschriftete Pfeile für vorige/nächste Woche (Grenzen deaktiviert). Keine zusätzliche SMARTwearable-Zeile, grosse Heute-Zeile oder zweite Titel-/Navigationsgruppe. Auf schmalen Ansichten darf die Zeile lesbar umbrechen.
- W2: sechs Wochen in Spalten, Aktivität/Schritte/Puls gleichzeitig in drei kompakten Reihen mit gemeinsamen Skalen je Messgrösse. Nur Aktivität mit Zielband und Bestwochenmarkierung. Tippen öffnet weiterhin genau die gewählte Woche.
- D1: sieben Tage in Spalten, kompakte Reihen für Aktivität, Schritte, Min/Max/Mean und die beiden Kategorie-Pulsmittel. Heute bisher, Zukunft ohne Messwerte. Datenlücken mit Schraffur und kurzem erklärendem Hinweis. Tag öffnet Verlauf.
- Tag: zwei zeitlich ausgerichtete Bewegungsspuren für Schrittbewegung und sonstige Bewegung; darunter grosser Pulsverlauf mit Min/Max/Mean und beiden Kategorie-Mitteln. Bei heutigem Tag endet die gemeinsame Zeitskala am verfügbaren Datenstand, historische Tage am Beobachtungsende. Keine Linie über Datenlücken. Hauttemperatur, Strecke, Abschnitte und Rohwerte in einer zunächst geschlossenen Gruppe „Weitere Angaben“.
- Kleine Metadaten-/Fusszeile statt langer Einleitungen. Fiktiv-Hinweis, unvollständige Woche und Datenlücken bleiben lesbar. Ausführliche Erklärung über Info und Weitere Angaben.
- Die Startseite v0.3 bleibt unverändert. Die Zahlen/Datumsbeispiele der Designbilder sind Illustrationen; der vorhandene gemeinsame Demodatensatz bleibt massgeblich. Kein Import eines abweichenden Bild-Datensatzes.

## Präferenzseite – kompakter Layoutvorschlag v0.6

Status: **zur Umsetzung beauftragter Vorschlag (D43)**. Nur die bestehende Ersteinrichtungs-/Einstellungsseite wird visuell angepasst; Inhalte und Verhalten der Präferenzen bleiben nach F26–F30 unverändert.

- In breiten Ansichten liegen „Pulshinweise“ und „Aktivitätserinnerung“ in der ersten Rasterzeile nebeneinander; „Datenfreigabe“ nutzt darunter die volle Breite. Die beiden Antworten jeder Gruppe stehen nebeneinander, soweit sie lesbar bleiben.
- Kopfzeile: Im Bearbeitungsmodus stehen der rote „Startseite“-Button und die Überschrift in einer Zeile. Bei der verpflichtenden Ersteinrichtung erscheint kein Startseite-Button. Der kurze Einführungstext umfasst höchstens zwei Zeilen.
- Der grosse grüne Demonstrationskasten entfällt. Ein kompakter neutraler Hinweis lautet: „Demo mit Beispieldaten – keine echten Warnungen, Vibrationen oder Datenübertragungen.“
- Seitenränder werden auf ungefähr 16–24 CSS-Pixel reduziert. Auswahl- und Bestätigungsflächen bleiben mindestens 48×48 CSS-Pixel.
- In schmalen Ansichten darf das Raster einspaltig werden und scrollen. Zoom darf Inhalte umbrechen lassen; nichts wird abgeschnitten oder überlagert.
- Alle anderen Ansichten, Einstellungen, Speicherung, Demo-Daten und Berechnungen bleiben unverändert.

## Einstiegsanimation und Appstart v0.7

**FESTGELEGT:** Bei jedem vollständigen Neuladen/Öffnen des PWA-Dokuments zuerst „Ihr Armband – Ihre Einstellungen“ anzeigen, unabhängig davon, ob Präferenzen gespeichert sind. Vorhandene gültige Antworten sind vorausgewählt und können unverändert übernommen werden. Das Formular wird erst nach „Einstellungen übernehmen und weiter“ verlassen. Interne Seitenwechsel und die Rückkehr von Details nach C2 bleiben innerhalb der laufenden Sitzung; sie öffnen den Einstieg nicht erneut. Diese Regel ersetzt die bisherige Beschränkung der Pflichtseite auf den ersten Aufruf ohne Konfiguration (D37).

**FESTGELEGT:** Variante 1 „Armband anlegen – Daumen hoch“ wird zur Umsetzung beauftragt. Das Bildzeichen bedeutet nur, dass das Anlegen im Mock-up abgeschlossen ist. Es bestätigt weder Verbindung, Messung noch Gesundheitszustand. Die eigentliche Präferenzseite aus v0.6, besonders das kompakte zweispaltige Formular, bleibt erhalten.

**FESTGELEGT (D47):** Die bisherige vereinfachte SVG/CSS-Zeichnung wird vollständig durch sechs lokale PNG-Bildfelder aus `SMARTwearable_StopMotion_Variante1.zip` ersetzt. Überschrift und bisheriger Einführungstext bleiben vor der Bildfolge; darunter bleiben die drei bestehenden Einstellungsgruppen, der Demohinweis und die Bestätigung an ihrer bisherigen Stelle. Im Querformat erscheinen alle sechs Bilder in einer Reihe, im Hochformat in zwei Reihen mit je drei Bildern. Die Bilder behalten ihre Seitenverhältnisse (`object-fit: contain`), werden nicht beschnitten und erhalten nur leicht abgerundete Ecken. Kleine dezente Pfeile trennen die Bilder im Querformat. Ein kompakter Wiederholen-Button bleibt rechts in der Kopfzeile.

Beim Start sind alle sechs Bilder bereits sichtbar. Alle 700 ms wird das nächste Bild ruhig hervorgehoben; nach etwa 4,2 Sekunden endet die Folge ohne Schleife, Bild 6 bleibt markiert. Auf der später geöffneten Einstellungsseite erscheint die Folge zunächst statisch und kann wiederholt werden. `prefers-reduced-motion: reduce` zeigt sofort alle sechs Bilder unverändert und blendet die Wiederholung aus. Keine zusätzliche Erklärungskarte, Tonspur, Gerätekopplung oder Messung.

Bei geringer Höhe wird zuerst die Bildreihe verkleinert; alle Optionen und die Bestätigung bleiben mindestens 48×48 CSS-Pixel. Bei Bedarf darf vertikal gescrollt werden. Bei 200-%-Zoom und in den Prüfflächen 1280×640, 1180×620, 1024×560 und 820×1020 CSS-Pixeln dürfen keine Inhalte abgeschnitten werden; horizontales Seitenscrollen ist zu vermeiden. Alle sechs Bilder müssen nach vorbereiteter Offline-Nutzung verfügbar sein. Die übergebene Layoutreferenz dient nur der Anordnung. Die KI-generierten Bilder sind keine verifizierten Empatica-E4-Fotos und keine verbindliche Anleitung zum Anlegen. Bestehende Auswahlwerte, Formlogik, Startseiten, Navigation und andere Ansichten bleiben unverändert.
