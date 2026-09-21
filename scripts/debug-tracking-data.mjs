// Debug: verify sample tracking data produces non-empty sections.
import { withDemoEvents } from '../app/supplier-pricing-tool/adminData.ts';

const cfg = {
  currency: '\u00A3',
  trade: 'roofing',
  products: [
    { id: 'p1', name: 'Concrete tile', component: 'covering' },
    { id: 'p2', name: 'Clay tile', component: 'covering' },
    { id: 'p3', name: 'Ridge system', component: 'ridge' },
    { id: 'p4', name: 'Fixings', component: 'fixing' },
    { id: 'p5', name: 'Underlay', component: 'underlay' },
  ],
};

const events = withDemoEvents([], cfg);
const quotes = events.filter(e => e.type === 'quote');
const orders = events.filter(e => e.type === 'action' && e.action === 'order');
console.log('quotes:', quotes.length, 'orders:', orders.length, 'signups:', events.filter(e => e.type === 'signup').length);

const byEmail = new Map();
for (const e of events) {
  if (e.type === 'quote' && e.email) {
    const s = byEmail.get(e.email) ?? { quotes: 0, value: 0, orders: 0 };
    s.quotes++; s.value += e.total; byEmail.set(e.email, s);
  } else if (e.type === 'action' && e.email) {
    const s = byEmail.get(e.email) ?? { quotes: 0, value: 0, orders: 0 };
    if (e.action === 'order') s.orders++;
    byEmail.set(e.email, s);
  }
}
const TRADE = ['mike@harwoodroofing.co.uk', 'sarah.j@premierjones.co.uk', 'dan@dtfdevelopments.co.uk', 'amy@vaultconstructions.co.uk'];
const trade = [...byEmail.entries()].filter(([e]) => TRADE.includes(e));
const known = [...byEmail.entries()].filter(([e]) => !TRADE.includes(e));
const opps = known.filter(([, s]) => s.orders === 0 && s.quotes >= 3);
console.log('customers:', byEmail.size, '| trade rows:', trade.length, '| known rows:', known.length, '| opportunities:', opps.length);
console.log('sample emails:', [...byEmail.keys()].slice(0, 8));
console.log('anon quotes:', quotes.filter(q => !q.email).length);
