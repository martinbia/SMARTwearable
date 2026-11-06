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
