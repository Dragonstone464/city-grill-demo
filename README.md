# City Grill Gummersbach – Demo

Interaktiver Next.js-Prototyp für eine mögliche neue Restaurant-Webseite.

## Voraussetzungen
- Node.js 20 oder neuer
- npm

## Lokal starten
```bash
npm install
npm run dev
```
Danach http://localhost:3000 öffnen.

## Enthalten
- Responsive Landingpage
- Demo-Speisekarte mit Kategorie-Filter
- Warenkorb mit Mengensteuerung
- Checkout-Demo mit Abholung/Lieferung und Formularfeldern
- Simulierte Bestellbestätigung

## Wichtige Hinweise vor einer Präsentation / Veröffentlichung
- Die Demo sendet keine Bestellungen an das Restaurant und löst keine Zahlungen aus.
- Preise und Produkttexte sind aus öffentlich sichtbaren Online-Menüs übernommen und müssen vom Restaurant bestätigt werden.
- Bilder sind generische illustrative Food-Fotos von Unsplash, keine verifizierten Fotos des City Grill. Vor einem kommerziellen Livegang Bildrechte/Lizenzen prüfen und möglichst vom Restaurant freigegebene Originalfotos verwenden.
- Liefergebiet, Mindestbestellwert, Lieferkosten, Öffnungszeiten, Zahlungsarten, Steuern/Allergene und Zusatzoptionen müssen mit dem Inhaber abgestimmt werden.
- Für Live-Betrieb sind Backend, Datenbank, sichere Bestellverarbeitung, E-Mail-/Küchenbenachrichtigung, Zahlungsanbieter-Integration, Datenschutz/Impressum und rechtliche Prüfung erforderlich.
- Die Marken- und Bildnutzung setzt die Zustimmung des Restaurants voraus.

## Empfohlene nächste Ausbaustufe
1. Produktvarianten/Extras (Fleischsorte, Sauce, Zutaten, Größe)
2. Admin-Dashboard für Speisekarte und Bestellungen
3. Backend + Datenbank (z. B. PostgreSQL)
4. Stripe Checkout / PayPal nach Händlerfreigabe
5. Bestellbenachrichtigung und Statusverwaltung
