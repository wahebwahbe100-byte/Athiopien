# Umgesetzte Kundenwünsche – Stand August 2026

Die folgenden Erweiterungen wurden in den bestehenden statischen Prototyp integriert, ohne die vorhandene Karten- und Galerie-Funktion zu entfernen.

## Global
- Sprachmenü: Hebräisch mit Israel-Flagge (`IL`) abgesichert; Türkisch (`Türkçe`, `TR`) ergänzt.
- Merkliste: Herz rechts oben in der Hauptnavigation mit Zähler und aufklappbarer Merkliste.
- Angebotsbanner: dezente Animation (Shine/Pulse) plus wechselnde Hinweise zu Angeboten und Frühplanung.
- Reisearten: `Seniorenreisen` sowie `Hochzeits- & Verlobungsreisen` sind in Navigation, Filter und Reisebaukasten ergänzt, auf der Startseite als eigene Reisearten-Karten sichtbar und besitzen eigene Detailseiten mit Reisebeispielen.
- Videoberatung: als sichtbare Beratungsart auf der Kontaktseite ergänzt; Reise-Detailseiten besitzen einen direkten Videoberatungs-Button.

## Reise-Detailseiten
- Reiseeigene Bildergalerie bleibt als visueller Header erhalten.
- Optionaler Video-Header: wird automatisch genutzt, sobald im Reisedatensatz `video` oder `heroVideo` gesetzt ist.
- Fixierte Reise-Navigation: Überblick, Termine / Preise, Reiseablauf / Karte, Leistungen, Hinweise.
- Aktions-Dropdown: Buchen, Anfrage, Terminanfrage.
- Hero-Aktionen: getrennte Buttons `Buchen`, `Anfragen`, `Videoberatung`.
- Überblick: `Highlights Ihrer Reise` links und `Details Ihrer Reise` rechts.
- Detailblock: Reiseart, Teilnehmer, Reiseleitung, KI-Sprachunterstützung, Transport, Unterbringung, Buchungsnummer, Preis ohne Flug / Flug auf Anfrage, Merkliste und Teilen.
- Terminübersicht: EZZ-Spalte, getrennte Buttons `Buchen` und `Anfragen`.
- Jahresfilter als Checkboxen 2026–2030; insbesondere 2027 / 2028 / 2029 / 2030 für langfristige Planung.
- Ampelsystem mit Legende:
  - Grün: Mindestteilnehmerzahl erreicht – Reise findet statt.
  - Gelb: Mit Ihnen wird die Mindestteilnehmerzahl erreicht.
  - Orange: Schnell buchen – nur noch wenige Plätze verfügbar.
- Unter der Terminübersicht: `Termin vorschlagen`.

## Daten, die später ohne Layout-Umbau ergänzt werden können
Die Erweiterung liest zusätzliche Felder direkt aus einem Reisedatensatz, wenn sie vorhanden sind:
- `gallery`: Array mit Reisebildern
- `video` oder `heroVideo`: Video-URL/Pfad
- `highlights`: Array der Reisehighlights
- `tripType`: z. B. `Gruppenreise`
- `minParticipants`, `maxParticipants`
- `guideLanguage`, `germanGuideNote`, `aiLanguageNote`
- `transport`: Array, z. B. `["plane", "car", "boat"]`
- `accommodation`
- `bookingNumber`
- `ezz`
- `dates`: Array mit Terminobjekten (`label` oder `start`/`end`, `price`, `ezz`, `status`, `year`)

Statuswerte in `dates.status` können z. B. `green`, `yellow` oder `orange` sein.

## Neue Dateien
- `Reisearten/reiseart-senioren.html`
- `Reisearten/reiseart-hochzeit-verlobung.html`
- `aj-client-enhancements.css`
- `aj-client-enhancements.js`
- `REISE-DATEN-VORLAGE.json`


## Anpassungen v8 – Kundenfeedback
- Individualreisen-Menü: Fotografie, Familienreisen, Seniorenreisen, Hochzeits- & Verlobungsreisen, Rundreisen, Spezialreisen (z.B. VIP).
- Gruppenreisen / Region: Zentraläthiopien entfernt, Westäthiopien ergänzt.
- Gruppenreisen / Thema: „Kultur & Begegnungen“ entfernt; Fotografie, Kurzreisen, UNESCO-Welterbe, Camping-Reisen und Familienreisen ergänzt.
- Seniorenreisen und Hochzeits-/Verlobungsreisen werden nicht mehr automatisch in Region, Thema und Dauer eingefügt.
- Merkliste/Herz im Header optisch ruhiger gestaltet.
- Reise-Tracker direkt unter dem Mainheader positioniert.
- Header bleibt beim Scrollen stabil und wird nicht mehr klein geschoben.
- Rotierende/Laufleisten-Animation im oberen Promo-Bereich deaktiviert.
- Reise-Detailkopf und Bilderbereich deutlich verkleinert.
- „Finden Sie Ihre Route“-Hero deutlich verkleinert.
- Reise-Untermenü „Überblick“ scrollt sicher innerhalb derselben Detailseite.
- Jahresfilter bei Termine/Preise blendet Zeilen zuverlässig ein/aus.
- Verfügbarkeit um „leider ausgebucht“ ergänzt.
