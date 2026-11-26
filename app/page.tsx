'use client';

import { useMemo, useState } from "react";
import { ShoppingBag, Plus, Minus, X, ArrowRight, MapPin, Clock3, Phone, CheckCircle2, Menu as MenuIcon, Flame, Bike, Store, CreditCard, ChevronRight } from "lucide-react";

type Item = { id: number; name: string; description: string; price: number; category: string; image: string; popular?: boolean };
type CartItem = { item: Item; qty: number; note: string };

const menu: Item[] = [
  { id: 1, name: "Hähnchen-Drehspieß Kebap", description: "Im Fladenbrot mit Salat, Rotkraut, Weißkraut, Zwiebeln, Tomaten und Sauce nach Wahl.", price: 10, category: "Döner", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85", popular: true },
  { id: 2, name: "Lahmacun Spezial", description: "Türkische Pizza mit Drehspießfleisch, frischem Salat und Sauce.", price: 10.5, category: "Döner", image: "https://static.lieferando.de/images/restaurants/de/O5R0QOR/products/3160318_citygrill_food_lamucunspezial.png", popular: true },
  { id: 3, name: "Drehspieß-Teller", description: "Mit Pommes frites, Salat und Sauce nach Wahl.", price: 15, category: "Döner", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85" },
  { id: 4, name: "Drehspieß Dürüm", description: "Gerollt mit Salat, Rotkraut, Weißkraut, Zwiebeln, Tomaten und Sauce.", price: 11, category: "Döner", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=85" },
  { id: 5, name: "City Grill Smash Burger", description: "Mit Salat, Gurken, Zwiebeln, Tomaten und Käse.", price: 8.5, category: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85", popular: true },
  { id: 6, name: "Cheeseburger", description: "Saftiges Patty mit Käse und würziger Burgersauce.", price: 6, category: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85" },
  { id: 7, name: "Pizza Drehspieß", description: "Mit Drehspießfleisch und Zwiebeln.", price: 11.55, category: "Pizza", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=85" },
  { id: 8, name: "Pizza Sucuk", description: "Mit Knoblauchwurst, Salami und Peperoni.", price: 11.55, category: "Pizza", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=85" },
  { id: 9, name: "Pide mit Drehspieß und Käse", description: "Türkisches Teigschiffchen mit Drehspießfleisch und Käse.", price: 12, category: "Pide", image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85" },
  { id: 10, name: "Falafeltasche", description: "Mit Falafel und frischem Salat.", price: 9, category: "Vegetarisch", image: "https://images.pexels.com/photos/6546020/pexels-photo-6546020.jpeg" },
  { id: 11, name: "Salat Anadolu", description: "Grüner Salat, Gurken, Oliven, Zwiebeln und Weichkäse.", price: 7.5, category: "Salate", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85" },
  { id: 12, name: "Chicken Nuggets (6 Stück)", description: "Knusprige Nuggets – ideal zum Teilen.", price: 7, category: "Snacks", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85" }
];

const categories = ["Alle", "Döner", "Pizza", "Burger", "Pide", "Vegetarisch", "Salate", "Snacks"];
const euro = (n: number) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export default function Home() {
  const [category, setCategory] = useState("Alle");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [payment, setPayment] = useState("Barzahlung bei Abholung");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", note: "" });
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const filtered = useMemo(() => category === "Alle" ? menu : menu.filter(x => x.category === category), [category]);
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const total = cart.reduce((s, x) => s + x.item.price * x.qty, 0);

  function add(item: Item) {
    setCart(prev => {
      const found = prev.find(x => x.item.id === item.id);
      return found ? prev.map(x => x.item.id === item.id ? { ...x, qty: x.qty + 1 } : x) : [...prev, { item, qty: 1, note: "" }];
    });
    setCartOpen(true);
  }
  function changeQty(id: number, delta: number) {
    setCart(prev => prev.map(x => x.item.id === id ? { ...x, qty: x.qty + delta } : x).filter(x => x.qty > 0));
  }
  async function submitDemo() {
    if (submitting || cart.length === 0) return;

    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      (fulfillment === "delivery" && !customer.address.trim())
    ) {
      setOrderError("Bitte fülle alle Pflichtfelder aus.");
      return;
    }

    setSubmitting(true);
    setOrderError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customer.name.trim(),
          customer_phone: customer.phone.trim(),
          order_type: fulfillment,
          delivery_address: fulfillment === "delivery" ? customer.address.trim() : null,
          total,
          items: cart.map(({ item, qty }) => ({
            name: item.name,
            quantity: qty,
            price: item.price,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Bestellung konnte nicht gespeichert werden.");
      }

      setOrderId(result.order_id || "");
      setSuccess(true);
      setCart([]);
    } catch (error) {
      setOrderError(
        error instanceof Error
          ? error.message
          : "Verbindungsfehler. Bitte versuche es erneut."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <div className="demo-strip"><span>DEMO-WEBSITE · KEINE ECHTEN BESTELLUNGEN ODER ZAHLUNGEN</span><span>Konzept für City Grill Gummersbach</span></div>
      <header className="header">
        <a href="#" className="brand"><span className="brand-mark">CG</span><span><b>CITY GRILL</b><small>GUMMERSBACH</small></span></a>
        <nav className={mobileNav ? "nav open" : "nav"}>
          <a href="#speisekarte" onClick={() => setMobileNav(false)}>Speisekarte</a><a href="#about" onClick={() => setMobileNav(false)}>Über uns</a><a href="#kontakt" onClick={() => setMobileNav(false)}>Kontakt</a>
        </nav>
        <div className="header-actions"><button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/> Warenkorb <span>{count}</span></button><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><MenuIcon/></button></div>
      </header>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="eyebrow"><span></span> DEIN GRILL · DEIN GESCHMACK</div>
          <h1>Frisch. Lecker.<br/><em>Direkt zu dir.</em></h1>
          <p>Von herzhaftem Döner bis knuspriger Pizza – entdecke deine Favoriten und bestelle ganz einfach online.</p>
          <div className="hero-buttons"><a className="primary-button" href="#speisekarte">Speisekarte entdecken <ArrowRight size={17}/></a><a className="text-button" href="#kontakt">So findest du uns</a></div>
          <div className="hero-meta"><span><Clock3 size={16}/> Frisch zubereitet</span><span><MapPin size={16}/> Gummersbach Mitte</span></div>
        </div>
        <div className="hero-stamp"><span>GUTER<br/>GESCHMACK</span><b>SEIT</b><strong>CG</strong></div>
      </section>

      <section className="benefits">
        <div><span className="benefit-icon"><Flame/></span><span><b>Frisch zubereitet</b><small>Mit Liebe gemacht</small></span></div>
        <div><span className="benefit-icon"><Bike/></span><span><b>Lieferung & Abholung</b><small>Nach Verfügbarkeit</small></span></div>
        <div><span className="benefit-icon"><CreditCard/></span><span><b>Einfach bestellen</b><small>In wenigen Klicks</small></span></div>
      </section>

      <section className="menu-section" id="speisekarte">
        <div className="section-heading"><div><div className="eyebrow dark"><span></span> AUS UNSERER KÜCHE</div><h2>Unsere <em>Speisekarte</em></h2><p>Finde deinen Favoriten. Frisch für dich zubereitet.</p></div><div className="menu-note">Alle Preise in Euro · Demo-Auswahl</div></div>
        <div className="category-row">{categories.map(c => <button key={c} className={category === c ? "category active" : "category"} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="menu-grid">{filtered.map(item => <article className="food-card" key={item.id}>
          <div className="food-image"><img src={item.image} alt={item.name} loading="lazy"/>{item.popular && <span className="popular-tag">BELIEBT</span>}<button className="add-round" onClick={() => add(item)} aria-label={`${item.name} hinzufügen`}><Plus/></button></div>
          <div className="food-info"><div className="food-category">{item.category}</div><h3>{item.name}</h3><p>{item.description}</p><div className="food-bottom"><b>{euro(item.price)}</b><button onClick={() => add(item)}>Hinzufügen <Plus size={14}/></button></div></div>
        </article>)}</div>
        <p className="fine-print">Hinweis: Dies ist eine unverbindliche Demo-Speisekarte. Gerichte, Beschreibungen, Preise und Produktbilder müssen vom Restaurant geprüft und freigegeben werden.</p>
      </section>

      <section className="story" id="about"><div className="story-image"><img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=85" alt="Frisch gegrillte Speisen"/></div><div className="story-copy"><div className="eyebrow dark"><span></span> CITY GRILL · GUMMERSBACH</div><h2>Guter Geschmack<br/>beginnt mit <em>Frische.</em></h2><p>Ob schnelle Mittagspause oder gemütlicher Abend: Entdecke herzhafte Klassiker und finde genau das Richtige für deinen Appetit.</p><a href="#speisekarte" className="under-link">Jetzt Gerichte entdecken <ArrowRight size={16}/></a></div></section>

      <section className="contact" id="kontakt"><div><div className="eyebrow"><span></span> BESUCH UNS</div><h2>Wir freuen uns<br/>auf dich.</h2></div><div className="contact-details"><p><MapPin/> Marktstraße 14, 51643 Gummersbach</p><p><Phone/> 02261 24454</p><p><Clock3/> Öffnungszeiten bitte vor dem Livegang bestätigen</p><a href="https://maps.google.com/?q=Marktstraße+14,+51643+Gummersbach" target="_blank" rel="noreferrer">Route planen <ArrowRight size={16}/></a></div></section>
      <footer><a href="#" className="brand footer-brand"><span className="brand-mark">CG</span><span><b>CITY GRILL</b><small>GUMMERSBACH</small></span></a><span>© {new Date().getFullYear()} City Grill · Designkonzept</span><span>Impressum · Datenschutz (vor Livegang ergänzen)</span></footer>

      {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><aside className="drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow dark">DEINE AUSWAHL</span><h2>Warenkorb <small>({count})</small></h2></div><button className="icon-button" onClick={() => setCartOpen(false)}><X/></button></div>
        {cart.length === 0 ? <div className="empty"><ShoppingBag size={34}/><h3>Dein Warenkorb ist leer</h3><p>Entdecke unsere Speisekarte und füge etwas Leckeres hinzu.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Speisekarte ansehen</button></div> : <>
          <div className="cart-lines">{cart.map(x => <div className="cart-line" key={x.item.id}><img src={x.item.image} alt=""/><div className="cart-line-main"><b>{x.item.name}</b><small>{euro(x.item.price)}</small><div className="qty"><button onClick={() => changeQty(x.item.id, -1)}><Minus size={13}/></button><span>{x.qty}</span><button onClick={() => changeQty(x.item.id, 1)}><Plus size={13}/></button></div></div><strong>{euro(x.item.price * x.qty)}</strong></div>)}</div>
          <div className="cart-summary"><div><span>Zwischensumme</span><b>{euro(total)}</b></div><small>Lieferkosten und Mindestbestellwert sind in dieser Demo noch nicht hinterlegt.</small><button className="primary-button full" onClick={() => {setCartOpen(false);setCheckoutOpen(true)}}>Zur Kasse <ArrowRight size={17}/></button></div>
        </>}</aside></div>}

      {checkoutOpen && <div className="overlay" onClick={() => setCheckoutOpen(false)}><section className="checkout-modal" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow dark">FAST GESCHAFFT</span><h2>Deine Bestellung</h2></div><button className="icon-button" onClick={() => setCheckoutOpen(false)}><X/></button></div>
        {success ? <div className="success"><CheckCircle2 size={48}/><h2>Bestellung gespeichert!</h2><p>Deine Bestellung wurde erfolgreich übermittelt. Bestellnummer: {orderId}</p><button className="primary-button" onClick={() => {setSuccess(false);setCheckoutOpen(false);setOrderId("");setOrderError("");setCustomer({name:"",phone:"",address:"",note:""})}}>Zurück zur Webseite</button></div> : <div className="checkout-content">
          <div className="fulfillment"><button className={fulfillment === "pickup" ? "selected" : ""} onClick={() => setFulfillment("pickup")}><Store/> Abholung</button><button className={fulfillment === "delivery" ? "selected" : ""} onClick={() => setFulfillment("delivery")}><Bike/> Lieferung</button></div>
          <label>Dein Name<input value={customer.name} onChange={e => setCustomer({...customer,name:e.target.value})} placeholder="Vor- und Nachname"/></label>
          <label>Telefonnummer<input value={customer.phone} onChange={e => setCustomer({...customer,phone:e.target.value})} placeholder="Für Rückfragen"/></label>
          {fulfillment === "delivery" && <label>Lieferadresse<input value={customer.address} onChange={e => setCustomer({...customer,address:e.target.value})} placeholder="Straße, Hausnummer, PLZ, Ort"/></label>}
          <label>Hinweis zur Bestellung (optional)<textarea value={customer.note} onChange={e => setCustomer({...customer,note:e.target.value})} placeholder="z. B. bitte klingeln"/></label>
          <label>Zahlungsart<select value={payment} onChange={e => setPayment(e.target.value)}><option>Barzahlung bei Abholung</option><option>Barzahlung bei Lieferung</option><option>Online-Zahlung (nur Demo)</option></select></label>
          <div className="checkout-total"><span>Gesamtbetrag (Demo)</span><b>{euro(total)}</b></div>
          {orderError && <p role="alert" className="legal-note">{orderError}</p>}
          <button className="primary-button full" onClick={submitDemo} disabled={submitting}>
            {submitting ? "Wird gesendet..." : "Bestellung abschicken"} <ArrowRight size={17}/>
          </button>
          <p className="legal-note">Die Bestellung wird an das Bestellsystem übermittelt. Eine Online-Zahlung ist noch nicht eingerichtet.</p>
        </div>}
      </section></div>}
    </main>
  );
}
