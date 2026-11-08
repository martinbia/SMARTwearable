# Demodaten v0.2

08.11.2026 · Alle Werte fiktiv, keine Referenzwerte oder bestätigte Wearable-Leistung.

## Sitzung und Kalender

Datum UND lokale Uhrzeit werden beim Appstart einmal vom Gerät gelesen. Keine UTC-Konvertierung zur Auswahl des lokalen Tages. Kalenderwochen Montag–Sonntag; Datumsarithmetik mit lokalen Mittagsdaten (keine Addition von 24h-Millisekunden über Sommerzeit). Sechs Wochen: laufende plus fünf abgeschlossene. Zukünftige Tage enthalten keine Messwerte. Reset behält den Sitzungszeitanker; Neustart liest neu.

Annahme: Beobachtungsfenster 08–20 Uhr, heute höchstens bis Appstart-Uhrzeit. Vor 08 Uhr „noch keine Daten“. Kopfzeile bleibt aktuelles Datum, Detailüberschrift bezeichnet ausgewählten historischen Zeitraum. Das ersetzt das feste Demo-Heute 09.11.2026 vollständig.

## Basisszenario und Wochenwerte

Abgeschlossene fünf Wochen enthalten 90, 100, 85, 110, 95 Aktivitätsminuten; Schritte 4000, 4500, 3900, 5000, 4300. Tagessummen werden deterministisch ganzzahlig auf sieben Tage verteilt. Jüngste abgeschlossene Woche: Minuten 12/15/10/18/8/20/12 (=95), Schritte 500/650/450/800/350/950/600 (=4300). Andere Wochen proportional mit grösstem Rest verteilen, sodass Summen exakt stimmen.

Laufende Woche als vollständige Rohvorlage: Minuten 20/25/20/15/10/12/8, Schritte 900/1100/850/650/450/600/400. Nur Tage bis Heute und nur Samples bis Datenstand anzeigen. An einem Donnerstag nach 14:30 daher beispielsweise 80 Minuten/3500 Schritte. Es ist ausdrücklich NICHT an jedem Wochentag derselbe Stand 80.

## Gemeinsame Datenbasis

Pro Tag vier deterministische Bewegungsintervalle, disjunkt in „Schritte“ und „sonstige Bewegung“ klassifiziert. Allgemeine Aktivität = Vereinigung beider Arten, keine doppelte Addition. Schritte als ganzzahlige Ereignisse in Schrittintervallen hinterlegen; keine vermeintlichen Schritte während sonstiger Aktivität. Kategorien sind nur Demo-Annahmen.

Pulsproben gleichmässig je Minute; Werte deterministisch je Bewegungsart und Tagesindex. Tagesminimum/-maximum/-mittel sowie Kategorie-Mittelwerte ausschliesslich aus gültigen verfügbaren Proben berechnen. Wochenmittel über alle gültigen Proben, NICHT als ungewichteter Mittelwert der Tagesmittel. Wochenextrema aus gültigen Rohwerten. Fehlende Kategorie -> null, niemals 0 Schläge/min. Kein Pulsziel und keine Wertung „höher ist besser“.

S03 und bekannte Lücken entfernen betroffene Bewegungs-, Schritt- und Vitalproben; nichts interpolieren. Bei gemessener bewegungsarmer Zeit keine Aktivitätskategorie behaupten. Hauttemperatur bleibt simulierter Hautwert. Strecke = Schritte × 0,4 m ausschliesslich fiktive Beispieldatenbeziehung.

## Zielbereich und Bestwert

Annahme: Aktivitätsziel 100, Band 90–110 Minuten, in allen sechs Wochen gleich. Kein klinischer Sicherheitsbereich. Persönliche Bestwoche aus vollständig erfassten abgeschlossenen Wochen; laufende Woche bleibt ausgeschlossen. Wochen mit Lücken erscheinen als unvollständig und sind keine Bestwertkandidaten. Diagrammachse bei Aktivität/Schritten bei null und gross genug für alle Werte; Zielband nur bei Aktivität.

## Gerätesimulation

G01 aktuell, 62 %, 48 h Restlaufzeit, 72 h Speicher. G02 15 %/8 h; G03 lädt/35 %/Laufzeit unbekannt. G04 getrennt/lokale Aufzeichnung, G05 ausstehend, G06 läuft, G07 Fehler; deren Datenstand liegt bis zu vier Stunden hinter dem Sitzungsstand. G08 Speicher4 h; G09 Laufzeit/Speicher unbekannt. Zeitangaben werden relativ zur Sitzung gewählt, nicht fix auf 14:30.

Alle Tages-/Wochenwerte und Kurven sind auf denselben Datenstand begrenzt. Übertragung simuliert Auffüllen bis Sitzungsstand, G07 bleibt fehlgeschlagen. Laden endet fiktiv bei100 %/77 h, unabhängig von Speicher und Übertragung. Unbekannte Zeiten nicht aus Prozenten errechnen. Historische Tage sind vom heutigen Übertragungsrückstand unabhängig.

## Scenarios

S01 Basistag. S02 ruhigerer heutiger Tag (8 Minuten/400 Schritte als Rohvorlage, vor Datenstand gegebenenfalls weniger). S03 heutige Lücke10–12 Uhr; zusätzlich Mittwochs-Beispiellücke13–14 Uhr in der laufenden Woche, sobald sie vergangen ist. Lückengrund wählbar: Signal fehlt/nicht getragen. Keine automatische Übungserkennung.
