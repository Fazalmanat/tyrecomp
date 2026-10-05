const $ = s => document.querySelector(s);
const V0 = $('#v-home');
const PG = $('#v-page');
const CATS = [
  ['car', 'Car', 'Hatchback, sedan, EV'],
  ['suv', 'SUV & 4x4', 'Highway, all-terrain'],
  ['bike', 'Two-wheeler', 'Scooter, motorcycle'],
  ['truck', 'Truck & Bus', 'Radial, long haul'],
  ['farm', 'Farm', 'Tractor & implement']
];
const CN = Object.fromEntries(CATS.map(c => [c[0], c[1]]));
const BR = ['Velox', 'TerraMax', 'EcoGrip', 'AquaShield', 'RoadKing', 'Trailblazer', 'ZipRide', 'HaulPro', 'FieldMaster'];
const P = `Velox GT|Velox|car|205/55 R16|16|7450|4.6|New|#2f5d8a
EcoGrip Plus|EcoGrip|car|185/65 R15|15|4980|4.4|Best seller|#d4d7db
AquaShield W|AquaShield|car|215/60 R16|16|6820|4.5||#2c8a5b
Velox Touring|Velox|car|195/65 R15|15|5600|4.3||#7a3fb0
City Lite|EcoGrip|car|165/80 R14|14|3900|4.1||#e0661f
TerraMax AT|TerraMax|suv|265/65 R17|17|12900|4.7|Trending|#1f2937
RoadKing HT|RoadKing|suv|235/75 R15|15|9300|4.5|Top rated|#c9a227
Trailblazer MT|Trailblazer|suv|285/70 R17|17|15800|4.8|Off-road|#2c8a5b
Highland SUV|TerraMax|suv|225/60 R18|18|11200|4.4||#d4d7db
ZipRide Sport|ZipRide|bike|110/70 R17|17|2350|4.6|New|#d71920
ZipRide Scooter|ZipRide|bike|90/90 R12|12|1650|4.2||#2f5d8a
CruiseMax|ZipRide|bike|130/70 R18|18|3400|4.5||#1f2937
HaulPro XL|HaulPro|truck|10.00 R20|20|24500|4.5|Heavy duty|#2f5d8a
HaulPro City|HaulPro|truck|8.25 R16|16|16800|4.3||#e0661f
RoadKing Bus|RoadKing|truck|295/80 R22.5|22.5|28900|4.4||#c9a227
FieldMaster R2|FieldMaster|farm|18.4-30|30|31500|4.6|Farm pick|#2c8a5b
FieldMaster Front|FieldMaster|farm|7.5-16|16|6200|4.3||#2c8a5b`.split('\n').map((l, i) => {
  const a = l.split('|');
  return {
    id: i,
    name: a[0],
    brand: a[1],
    cat: a[2],
    size: a[3],
    rim: +a[4],
    price: +a[5],
    rate: +a[6],
    tag: a[7],
    col: a[8]
  };
});
const D = {
  cat: 'all',
  q: '',
  brand: '',
  max: 35000,
  rate: 0,
  rim: '',
  sort: 'feat',
  mode: 'v'
};
let S = { ...D };
let C = {};
const inr = n => '₹' + n.toLocaleString('en-IN');
/* image placeholders: tyre = N.png, with vehicle = Nc.png (N = product number 1-17). Set IMG to your image folder, e.g. 'images/' */
const IMG = '';
function scene(p, m) {
  const f = (p.id + 1) + (m == 't' ? '' : 'c') + '.png';
  const c = m == 't' ? 'tyre only' : 'with vehicle';
  return `<div class="pim">
    <div class="phd"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#tyre"/></svg><b>${f}</b><span>${p.name}, ${c}</span></div>
    <img src="${IMG}${f}" alt="${p.name} ${c}" loading="lazy" onerror="this.remove()"></div>`;
}
const card = p => `<article class="pc"><a class="im" href="#/product/${p.id}">${p.tag ? `<span class="tag">${p.tag}</span>` : ''}${scene(p, S.mode)}</a>
  <div class="bd"><span class="br">${p.brand}, ${CN[p.cat]}</span>
  <h3><a href="#/product/${p.id}">${p.name}</a></h3><span class="sz">${p.size}, ★ ${p.rate}</span>
  <div class="pr"><b>${inr(p.price)}</b><button aria-label="Add ${p.name} to cart" onclick="add(${p.id})"><svg class="i"><use href="#plus"/></svg></button></div></div></article>`;
/* cart */
function badge() {
  $('#cc').textContent = Object.values(C).reduce((a, b) => a + b, 0);
}
function add(i) {
  C[i] = (C[i] || 0) + 1;
  badge();
  toast(P[i].name + ' added to cart');
}
function qty(i, d) {
  C[i] = Math.max(0, (C[i] || 0) + d);
  badge();
  cart();
}
function cart() {
  const ids = Object.keys(C).filter(i => C[i]);
  let t = 0;
  const bt = 'class="btn o" style="color:var(--ink);border-color:var(--ink);padding:2px 12px"';
  PG.innerHTML = `<div class="w pg">
    <div class="bc"><a href="#/">Home</a> / Cart</div>
    <h1>Your cart</h1>` + (ids.length ? ids.map(i => {
    const p = P[i];
    t += p.price * C[i];
    return `<div class="row">
      <div style="width:110px">${scene(p, 't')}</div>
      <div style="flex:1"><b>${p.name}</b><br>${p.size}</div>
      <div><button ${bt} onclick="qty(${i},-1)" aria-label="Less">−</button> ${C[i]} <button ${bt} onclick="qty(${i},1)" aria-label="More">+</button></div><b>${inr(p.price * C[i])}</b></div>`;
  }).join('') + `<h2 style="margin:20px 0">Total ${inr(t)}</h2><a class="btn" href="#/contact">Proceed to checkout</a>` : `<p>Your cart is empty.</p><a class="btn" href="#/shop/all">Browse tyres</a>`) + `</div>`;
}
/* shop with filters + sorting */
function list() {
  const q = S.q.toLowerCase().replace(/\s/g, '');
  let a = P.filter(p => (S.cat == 'all' || p.cat == S.cat) && p.price <= S.max && p.rate >= S.rate && (!S.rim || p.rim == S.rim) && (!S.brand || p.brand == S.brand) && (!q || (p.name + p.brand + p.size + CN[p.cat]).toLowerCase().replace(/\s/g, '').includes(q)));
  const f = {
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
    rate: (a, b) => b.rate - a.rate,
    new: (a, b) => b.id - a.id
  }[S.sort];
  if (f)
    a.sort(f);
  return a;
}
function grid() {
  const a = list();
  $('#pv').textContent = inr(S.max);
  $('#rv').textContent = S.rate + '★';
  $('#rc').textContent = a.length + ' tyres' + (S.q ? ' for "' + S.q + '"' : '');
  $('#gr').innerHTML = a.length ? a.map(card).join('') : '<p>No tyres match these filters. Raise the price limit or <a href="#/shop/all" style="color:var(--red)">view all tyres</a>.</p>';
  document.querySelectorAll('.seg button').forEach(b => b.classList.toggle('on', b.dataset.m == S.mode));
  const n = (S.max < 35000) + (S.rate > 0) + !!S.rim + !!S.brand;
  $('#fn').textContent = n || '';
  $('#fn').hidden = !n;
}
function shop() {
  const cn = S.cat == 'all' ? 'All tyres' : CN[S.cat];
  const o = a => a.map(x => `<option>${x}</option>`).join('');
  PG.innerHTML = `<div class="w pg">
    <div class="bc"><a href="#/">Home</a> / <a href="#/shop/all">Shop</a> / ${cn}</div>
    <h1>${cn}</h1>
    <div class="chips">${[['all', 'All tyres'], ...CATS].map(c => `<a href="#/shop/${c[0]}" class="${c[0] == S.cat ? 'on' : ''}">${c[1]} <small>${P.filter(p => c[0] == 'all' || p.cat == c[0]).length}</small></a>`).join('')}</div>
<div class="tb"><b id="rc"></b>
      <div class="ctl">
      <div class="dd"><button class="sm" id="fbtn" aria-expanded="false" aria-controls="fpn">Filters <span id="fn" class="bg2"></span><svg class="i"><use href="#right"/></svg></button>
      <div class="ddp" id="fpn" hidden>
<div>
      <h4>Max price: <span id="pv"></span></h4><input type="range" id="fp" min="1000" max="35000" step="500" aria-label="Maximum price"></div>
<div>
      <h4>Min rating: <span id="rv"></span></h4><input type="range" id="fr" min="0" max="5" step=".5" aria-label="Minimum rating"></div>
<div class="two">
      <div>
      <h4>Rim size</h4><select id="fm" aria-label="Rim size">
      <option value="">All</option>${o([...new Set(P.map(p => p.rim))].sort((a, b) => a - b))}</select></div>
<div>
      <h4>Brand</h4><select id="fb" aria-label="Brand">
      <option value="">All</option>${o(BR)}</select></div></div>
<button class="sm" id="rs">Reset filters</button></div></div>
<label>Sort <select id="so" class="sm">
      <option value="feat">Featured</option>
      <option value="low">Price: low to high</option>
      <option value="high">Price: high to low</option>
      <option value="rate">Top rated</option>
      <option value="new">Newest</option></select></label>
<div class="seg"><button data-m="v">With vehicle</button><button data-m="t">Tyre only</button></div></div></div>
      <div class="grid" id="gr"></div></div>`;
  $('#fp').value = S.max;
  $('#fr').value = S.rate;
  $('#fb').value = S.brand;
  $('#so').value = S.sort;
  $('#fbtn').onclick = () => {
    const p = $('#fpn');
    const h = p.hidden;
    p.hidden = !h;
    $('#fbtn').setAttribute('aria-expanded', h);
  };
  [
    ['fp', 'max', 1],
    ['fr', 'rate', 1],
    ['fm', 'rim', 0],
    ['fb', 'brand', 0],
    ['so', 'sort', 0]
  ].forEach(([id, k, n]) => $('#' + id).oninput = e => {
    S[k] = n ? +e.target.value : e.target.value;
    grid();
  });
  document.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
    S.mode = b.dataset.m;
    grid();
  });
  $('#rs').onclick = () => {
    S = { ...D, mode: S.mode, cat: S.cat };
    shop();
  };
  grid();
}
document.addEventListener('click', e => {
  const p = $('#fpn');
  if (p && !p.hidden && !e.target.closest('.dd'))
    p.hidden = true;
});
document.addEventListener('keydown', e => {
  const p = $('#fpn');
  if (e.key == 'Escape' && p)
    p.hidden = true;
});
function prod(p) {
  const rel = P.filter(x => x.cat == p.cat && x.id != p.id).slice(0, 3);
  PG.innerHTML = `<div class="w pg">
    <div class="bc"><a href="#/">Home</a> / <a href="#/shop/all">Shop</a> / <a href="#/shop/${p.cat}">${CN[p.cat]}</a> / ${p.name}</div>
    <div class="det">
    <div style="display:grid;gap:12px">${scene(p, 'v')}${scene(p, 't')}</div>
    <div><span class="br">${p.brand}</span>
    <h1>${p.name}</h1>
    <p>★ ${p.rate} customer rating</p>
    <h2 style="font-size:44px">${inr(p.price)}</h2>
    <table class="spec">
    <tr>
    <td>Tyre size</td>
    <td>${p.size}</td></tr>
    <tr>
    <td>Rim diameter</td>
    <td>${p.rim} inch</td></tr>
    <tr>
    <td>Fits</td>
    <td>${CN[p.cat]}</td></tr>
    <tr>
    <td>Warranty</td>
    <td>5 years</td></tr></table>
    <p style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn" onclick="add(${p.id})">Add to cart</button><a class="btn o" style="color:var(--ink);border-color:var(--ink)" href="#/shop/${p.cat}">Back to ${CN[p.cat]}</a></p></div></div>
    <div class="sh" style="margin-top:50px">
    <h2>More in ${CN[p.cat]}</h2></div>
    <div class="grid">${rel.map(card).join('')}</div></div>`;
}
/* info pages */
const PAGES = {
  about: ['Who we are', ['TyreComp has made tyres since 1980. Our plants in three states supply cars, bikes, trucks and tractors across the country.', 'Every tyre is tested for grip, braking and wear on our own proving ground before it reaches you.']],
  careers: ['Careers', ['We hire engineers, plant technicians and retail teams. Send your CV to careers@tyrecomp.example.']],
  press: ['Press & media', ['For interviews and brand assets, write to press@tyrecomp.example.']],
  sustainability: ['Sustainability', ['Our EcoGrip range cuts rolling resistance to save fuel, and our plants recycle 90% of process water.']],
  warranty: ['Warranty claims', ['All passenger tyres carry a 5-year warranty against manufacturing defects. Visit any dealer with your invoice to start a claim.']],
  care: ['Tyre care guide', ['Check pressure monthly, rotate every 8,000 km, and replace tyres once tread reaches 1.6 mm.']],
  faq: ['FAQs', ['How do I find my tyre size? It is printed on the sidewall, for example 205/55 R16.', 'Do you fit tyres? Yes, at every listed dealer and with our mobile fitting van.']],
  'become-dealer': [
    'Become a dealer',
    ['Join 2,800 dealers across India. Tell us about your shop and we will call you within two working days.'],
    ['Name', 'Email', 'Message']
  ],
  contact: [
    'Contact us',
    ['Toll free 1800-555-TYRE, Mon-Sat 9am to 7pm, or send us a message.'],
    ['Name', 'Email', 'Message']
  ],
  signin: [
    'Sign in',
    ['Sign in to track orders and manage your garage.'],
    ['Email', 'Password']
  ],
  track: [
    'Track order',
    ['Enter your order number to see its status.'],
    ['Order number']
  ],
  privacy: ['Privacy', ['We only use your details to process orders and service requests.']],
  terms: ['Terms', ['Prices include GST. Fitting is free above ₹20,000.']],
  sitemap: ['Sitemap', ['<a href="#/">Home</a>, <a href="#/shop/all">All tyres</a>, <a href="#/dealers">Dealers</a>, <a href="#/about">About</a>, <a href="#/contact">Contact</a>, <a href="#/cart">Cart</a>']]
};
function page(k) {
  const [t, ps, fs] = PAGES[k];
  PG.innerHTML = `${hero(t, "")}<div class="w pg">
    <div class="txt">${ps.map(x => `<p>${x}</p>`).join('')}</div>` + (fs ? `<form class="frm" onsubmit="return sub(event)">${fs.map(f => f == 'Message' ? `<textarea rows="4" placeholder="Message" aria-label="Message"></textarea>` : `<input placeholder="${f}" aria-label="${f}" type="${f == 'Email' ? 'email' : f == 'Password' ? 'password' : 'text'}" required>`).join('')}<button class="btn">${t}</button></form>` : '') + `</div>`;
}
const sub = e => {
  e.preventDefault();
  toast('Thanks, we have received your request');
  e.target.reset();
  return false;
};
const DL = [
  ['Kochi', 'TyreComp Hub, MG Road', '682001'],
  ['Thiruvananthapuram', 'Velox Tyres, Pattom', '695004'],
  ['Kozhikode', 'Mavoor Road Tyre Point', '673004'],
  ['Bengaluru', 'Koramangala Auto Care', '560034'],
  ['Chennai', 'Anna Salai Tyres', '600002'],
  ['Mumbai', 'Andheri Wheel Works', '400053'],
  ['Delhi', 'Karol Bagh Tyre Mart', '110005'],
  ['Hyderabad', 'Banjara Hills Tyre Hub', '500034']
];
function dealers(q) {
  PG.innerHTML = `<div class="w pg">
    <div class="bc"><a href="#/">Home</a> / Dealers</div>
    <h1>Find a dealer</h1>
    <div class="search" style="max-width:480px;margin-top:16px"><input id="dq" placeholder="City or pincode" aria-label="City or pincode"><button aria-label="Search"><svg class="i"><use href="#search"/></svg></button></div>
    <div class="dl" id="dl"></div></div>`;
  const f = () => {
    const v = $('#dq').value.toLowerCase().trim();
    const a = DL.filter(d => (d[0] + d[1] + d[2]).toLowerCase().includes(v));
    $('#dl').innerHTML = a.length ? a.map((d, i) => `<div><b>${d[1]}</b><br>${d[0]} ${d[2]}<br>1800-555-${1000 + i}</div>`).join('') : '<p>No dealer found. Try a nearby city name.</p>';
  };
  $('#dq').value = q;
  $('#dq').oninput = f;
  f();
}
/* home */
let i = 0;
let tm;
let F = [];
const per = () => innerWidth < 641 ? 1 : innerWidth < 1001 ? 2 : 3;
const max = () => F.length - per();
function show(n) {
  const m = max();
  i = n > m ? 0 : n < 0 ? m : n;
  $('#tr').style.transform = `translateX(-${i * 100 / per()}%)`;
  $('#dots').innerHTML = Array.from({ length: m + 1 }, (_, k) => `<button class="${k == i ? 'on' : ''}" aria-label="Slide ${k + 1}" onclick="show(${k});rs()"></button>`).join('');
}
function rs() {
  clearInterval(tm);
  tm = setInterval(() => show(i + 1), 4500);
}
function renderHome() {
  F = P.filter(p => p.tag);
  $('#tr').innerHTML = F.map(p => `<div class="slide">${card(p)}</div>`).join('');
  $('#catg').innerHTML = CATS.map(c => `<a class="cat" href="#/shop/${c[0]}"><svg class="t" viewBox="0 0 100 100" style="--hub:#d71920"><use href="#tyre"/></svg>
    <h3>${c[1]}</h3><span>${c[2]}</span></a>`).join('');
  show(0);
  rs();
}
$('.arr.l').onclick = () => {
  show(i - 1);
  rs();
};
$('.arr.r').onclick = () => {
  show(i + 1);
  rs();
};
addEventListener('resize', () => F.length && show(i));
/* rich info pages */
const hero = (t, s) => `<section class="ph2">
  <div class="w">
  <div class="bc"><a href="#/">Home</a> / ${t}</div>
  <h1>${t}</h1>
  <p>${s}</p></div><svg class="rt" viewBox="0 0 100 100" aria-hidden="true"><use href="#tyre"/></svg></section>`;
const ic = n => `<svg class="i"><use href="#${n}"/></svg>`;
const out = h => {
  PG.innerHTML = h;
};
const chip = b => [...b.parentNode.children].forEach(x => x.classList.toggle('on', x == b));
const chips = (a, f) => `<div class="chips">${a.map((c, i) => `<button class="${i ? '' : 'on'}" onclick="chip(this);${f}('${c}')">${c}</button>`).join('')}</div>`;
let io;
function fx() {
  io && io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting)
      return;
    e.target.classList.add('in');
    if (e.target.dataset.n)
      cnt(e.target);
    io.unobserve(e.target);
  }), { threshold: .2 });
  document.querySelectorAll('.rv,[data-n]').forEach(x => io.observe(x));
}
function cnt(el) {
  const n = +el.dataset.n;
  const sf = el.dataset.s || '';
  const t0 = performance.now();
  (function f(t) {
    const k = Math.min(1, (t - t0) / 1400);
    el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN') + sf;
    if (k < 1)
      requestAnimationFrame(f);
  })(t0);
}
addEventListener('scroll', () => {
  const t = document.querySelector('.ph2 .rt');
  if (t && !matchMedia('(prefers-reduced-motion:reduce)').matches)
    t.style.transform = `rotate(${scrollY * .35}deg)`;
}, { passive: true });
const RICH = {};
RICH.about = () => {
  const T = [
    [1980, 'First plant opens in Kochi', 'Fifty workers, one press line and a promise to build tyres that last.'],
    [1992, 'Two-wheeler range', 'ZipRide brings grip and mileage to scooters and motorcycles.'],
    [2004, 'Proving ground opens', 'Wet braking, high-speed and endurance tests move in-house.'],
    [2012, 'Truck and bus radials', 'HaulPro tyres cut running costs for fleets on long hauls.'],
    [2019, 'EcoGrip launches', 'Our low rolling resistance compound saves fuel on every trip.'],
    [2026, 'Velox Series', '20% longer tread life and shorter wet braking.']
  ];
  out(hero('Who we are', 'From a single press line to 2,800 dealers, we have spent 45 years making tyres for Indian roads.') + `<div class="stats">
    <div class="w">${[[45, '+', 'years on the road'], [2800, '', 'dealers nationwide'], [60, 'M', 'tyres delivered'], [3, '', 'manufacturing plants']].map(x => `<div><b data-n="${x[0]}" data-s="${x[1]}">0</b>${x[2]}</div>`).join('')}</div></div>
      <div class="w pg">
      <h2 class="h2">Our story</h2>
      <div class="tl">${T.map((e, i) => `<div class="ti rv ${i % 2 ? 'r' : ''}"><b>${e[0]}</b>
        <h3>${e[1]}</h3>
        <p>${e[2]}</p></div>`).join('')}</div>
        <h2 class="h2">What we stand for</h2>
        <div class="why">${[['shield', 'Safety first', 'Every compound is tested on wet and dry tracks before sale.'], ['leaf', 'Built to last', 'Tread designs that wear evenly and run cooler.'], ['truck', 'Always nearby', 'A dealer or mobile fitting van within reach of most pincodes.']].map((x, i) => `<div class="rv" style="transition-delay:${i * .12}s">${ic(x[0])}<h3>${x[1]}</h3>
          <p>${x[2]}</p></div>`).join('')}</div>
          <p style="margin-top:30px"><a class="btn" href="#/careers">Join our team</a></p></div>`);
};
RICH.careers = () => {
  window.JB = [
    ['Tyre Compound Engineer', 'Engineering', 'Kochi', 'Full time', 'Develop rubber compounds that balance grip, wear and rolling resistance.'],
    ['Test Driver', 'Engineering', 'Chennai', 'Full time', 'Run braking and handling trials at our proving ground.'],
    ['Plant Technician', 'Plant', 'Kochi', 'Shift work', 'Operate and maintain curing presses on the production line.'],
    ['Quality Inspector', 'Plant', 'Bengaluru', 'Full time', 'Inspect finished tyres and sign off every batch.'],
    ['Store Manager', 'Retail', 'Kozhikode', 'Full time', 'Lead a dealership team and keep customers rolling.'],
    ['Fitting Specialist', 'Retail', 'Mumbai', 'Full time', 'Balance, align and fit tyres with care and speed.']
  ];
  out(hero('Careers', 'Build the tyres that carry millions of journeys.') + `<div class="w pg">
    <div class="perks">${[['shield', 'Health cover for your family'], ['truck', 'Relocation support'], ['leaf', 'Green commute allowance']].map((x, i) => `<div class="rv" style="transition-delay:${i * .12}s">${ic(x[0])}<b>${x[1]}</b></div>`).join('')}</div>
      <h2 class="h2">Open roles</h2>${chips(['All', 'Engineering', 'Plant', 'Retail'], 'jf')}<div id="jb"></div></div>`);
  jf('All');
};
function jf(c) {
  $('#jb').innerHTML = JB.filter(j => c == 'All' || j[1] == c).map(j => `<details class="jd">
    <summary><b>${j[0]}</b><span>${j[2]}, ${j[3]}</span><i class="pill">${j[1]}</i></summary>
    <p>${j[4]}</p><button class="btn" onclick="toast('Application started for ${j[0]}')">Apply</button></details>`).join('');
}
RICH.press = () => {
  window.NW = [
    ['12 Aug 2026', 'Product', 'Velox Series launches with 20% longer tread life', 'Three new sizes arrive at dealers this month, tested for shorter braking distances on wet roads.'],
    ['28 Jul 2026', 'Company', 'TyreComp opens its 2,800th dealership', 'The new Kochi hub offers same-day fitting and a customer lounge.'],
    ['15 Jun 2026', 'Awards', 'EcoGrip named a top fuel-saving tyre', 'Independent tests found lower rolling resistance than the segment average.'],
    ['02 May 2026', 'Product', 'TerraMax AT adds 18-inch sizes', 'All-terrain grip now reaches compact SUVs.'],
    ['19 Mar 2026', 'Company', 'Mobile fitting vans reach 40 cities', 'Book a van and get tyres changed at home or office.'],
    ['10 Jan 2026', 'Awards', 'Plant earns water stewardship certificate', 'The Kochi plant recycles 90% of its process water.']
  ];
  out(hero('Press & media', 'News, launches and brand assets. Sample content for this demo.') + `<div class="w pg">${chips(['All', 'Product', 'Company', 'Awards'], 'pf')}<div id="pn"></div>
    <div class="kit">
    <div>
    <h2>Media kit</h2>
    <p>Logos, product renders and executive bios.</p></div><button class="btn" onclick="toast('Media kit download is not available in this demo')">Download kit</button></div></div>`);
  pf('All');
};
function pf(c) {
  $('#pn').innerHTML = NW.filter(n => c == 'All' || n[1] == c).map(n => `<details class="nw">
    <summary><span class="dt">${n[0]}</span><i class="pill">${n[1]}</i><b>${n[2]}</b></summary>
    <p>${n[3]}</p></details>`).join('');
}
const ring = (p, l) => `<div class="rgw rv"><svg class="rg" viewBox="0 0 120 120" role="img" aria-label="${p}% ${l}"><circle class="bgc" cx="60" cy="60" r="50"/><circle class="fg" cx="60" cy="60" r="50" style="--o:${314 * (1 - p / 100)}" transform="rotate(-90 60 60)"/><text x="60" y="69" text-anchor="middle">${p}%</text></svg><span>${l}</span></div>`;
RICH.sustainability = () => {
  out(hero('Sustainability', 'Lower rolling resistance, recycled water and a plan for every tyre at end of life.') + `<div class="w pg">
    <h2 class="h2">Our progress</h2>
    <div class="rings">${ring(90, 'process water recycled') + ring(35, 'recycled materials') + ring(18, 'lower rolling resistance') + ring(70, 'renewable plant power')}</div>
    <h2 class="h2">Life of a tyre</h2>
    <div class="lcs">${[['Source', 'Natural rubber from certified plantations.'], ['Make', 'Efficient curing with recycled water.'], ['Drive', 'EcoGrip compounds save fuel every trip.'], ['Recycle', 'Worn tyres become road material and fuel.']].map((x, i) => `<div class="lc rv" style="transition-delay:${i * .15}s">
      <h3>${x[0]}</h3>
      <p>${x[1]}</p></div>`).join('')}</div>
      <h2 class="h2">Fuel saving calculator</h2>
      <div class="calc"><label>Distance driven per year: <b id="kv"></b><input type="range" id="km" min="5000" max="40000" step="1000" value="12000" oninput="sc()" style="width:100%;accent-color:#d71920"></label>
      <div class="res">
      <div><b id="r1"></b>litres saved</div>
      <div><b id="r2"></b>saved per year</div>
      <div><b id="r3"></b>kg CO₂ avoided</div></div><small>Illustrative estimate: 15 km per litre, ₹100 per litre and a 4% saving with EcoGrip.</small></div></div>`);
  sc();
};
function sc() {
  const k = +$('#km').value;
  const l = k / 15 * .04;
  $('#kv').textContent = k.toLocaleString('en-IN') + ' km';
  $('#r1').textContent = Math.round(l);
  $('#r2').textContent = inr(Math.round(l * 100));
  $('#r3').textContent = Math.round(l * 2.3);
}
RICH.care = () => {
  out(hero('Tyre care guide', 'Four habits that add thousands of kilometres to your tyres.') + `<div class="w pg">${chips(['Pressure', 'Rotation', 'Tread depth', 'Storage'], 'ctab')}<div id="cp" class="cpn"></div></div>`);
  ctab('Pressure');
};
const VP = [
  ['Hatchback', 32],
  ['Sedan', 33],
  ['SUV', 35],
  ['Scooter', 28],
  ['Motorcycle', 30]
];
const cards = a => `<div class="why">${a.map((x, i) => `<div class="rv" style="transition-delay:${i * .1}s">${ic(x[0])}<h3>${x[1]}</h3>
  <p>${x[2]}</p></div>`).join('')}</div>`;
function ctab(t) {
  const p = $('#cp');
  p.className = 'cpn';
  void p.offsetWidth;
  p.className = 'cpn';
  if (t == 'Pressure') {
    p.innerHTML = `<label>Vehicle <select id="vp" oninput="gp()" style="max-width:260px">${VP.map(v => `<option value="${v[1]}">${v[0]}</option>`).join('')}</select></label>
      <div class="gauge"><svg viewBox="0 0 200 120" role="img" aria-label="Pressure gauge"><path d="M20 100A80 80 0 0 1 180 100" fill="none" stroke="var(--line)" stroke-width="14" stroke-linecap="round"/><path d="M60 38A80 80 0 0 1 140 38" fill="none" stroke="#2c9e5b" stroke-width="14" opacity=".8"/><line id="nd" x1="100" y1="100" x2="100" y2="34" stroke="#d71920" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="100" r="7" fill="#d71920"/></svg><b id="pv2"></b></div>
      <p>Check pressure monthly when tyres are cold. Add 2 psi when carrying a full load.</p>`;
    $('#nd').style.transform = 'rotate(-90deg)';
    setTimeout(gp, 60);
  }
  else if (t == 'Rotation')
    p.innerHTML = cards([
      ['truck', 'Every 8,000 km', 'Swap front and rear tyres to even out wear.'],
      ['scale', 'Cross pattern', 'Move rear tyres to opposite fronts on front-wheel-drive cars.'],
      ['shield', 'Check alignment', 'Uneven wear on one edge points to misalignment.']
    ]);
  else if (t == 'Tread depth')
    p.innerHTML = `<label>Measured tread depth: <b id="tdv"></b><input type="range" id="td" min="0" max="9" step=".1" value="6" oninput="tdp()" style="width:100%;max-width:420px;accent-color:#d71920;display:block"></label>
      <div class="tbar"><i id="tdb"></i></div>
      <h3 id="tdt" style="margin:14px 0 4px"></h3>
      <p>The legal limit is 1.6 mm. Coin test: if you can see the whole rim of a coin in the groove, the tread is low.</p>`, tdp();
  else
    p.innerHTML = cards([
      ['shield', 'Keep it cool', 'Store tyres away from sunlight and heat.'],
      ['scale', 'Stack or hang', 'Stack flat tyres, hang tyres on rims.'],
      ['leaf', 'Clean first', 'Wash off oil and road salt before storing.']
    ]);
  chip([...document.querySelectorAll('.chips button')].find(b => b.textContent == t));
  fx();
}
function gp() {
  const v = +$('#vp').value;
  $('#nd').style.transform = `rotate(${(v - 20) / 25 * 180 - 90}deg)`;
  $('#pv2').textContent = v + ' psi';
}
function tdp() {
  const v = +$('#td').value;
  const b = $('#tdb');
  $('#tdv').textContent = v.toFixed(1) + ' mm';
  b.style.width = v / 9 * 100 + '%';
  b.style.background = v >= 4 ? '#2c9e5b' : v >= 1.6 ? '#f2a900' : '#d71920';
  $('#tdt').textContent = v >= 4 ? 'Good: keep checking monthly' : v >= 1.6 ? 'Watch: plan a replacement soon' : 'Replace now: below the legal limit';
}
RICH.faq = () => {
  window.FQ = [
    ['Sizing', 'How do I find my tyre size?', 'It is printed on the sidewall, for example 205/55 R16: width, aspect ratio and rim size.'],
    ['Sizing', 'Can I fit a different size?', 'Stay within 3% of the original rolling diameter and ask a dealer to confirm.'],
    ['Fitting', 'Do you fit tyres?', 'Yes, at every listed dealer and with our mobile fitting van in 40 cities.'],
    ['Fitting', 'How long does fitting take?', 'About 45 minutes for four tyres, including balancing.'],
    ['Warranty', 'What does the warranty cover?', 'Five years against manufacturing defects on passenger tyres.'],
    ['Warranty', 'How do I claim?', 'Visit a dealer with your invoice and the tyre. See Warranty claims for the steps.'],
    ['Orders', 'Can I return a tyre?', 'Unused tyres can be returned within 7 days in original condition.'],
    ['Orders', 'Is fitting free?', 'Fitting is free on orders above ₹20,000.']
  ];
  out(hero('FAQs', 'Quick answers about sizes, fitting, warranty and orders.') + `<div class="w pg">
    <div class="search" style="max-width:520px"><input id="fs" oninput="ff()" placeholder="Search questions" aria-label="Search questions"><button aria-label="Search">${ic('search')}</button></div>${chips(['All', 'Sizing', 'Fitting', 'Warranty', 'Orders'], 'ff')}<div id="fl"></div></div>`);
  ff('All');
};
function ff(c) {
  c = typeof c == 'string' ? c : (document.querySelector('.chips .on') || {}).textContent || 'All';
  const v = $('#fs').value.toLowerCase();
  const a = FQ.filter(f => (c == 'All' || f[0] == c) && (f[1] + f[2]).toLowerCase().includes(v));
  $('#fl').innerHTML = a.length ? a.map(f => `<div class="fq"><button aria-expanded="false" onclick="fo(this)">${f[1]}${ic('plus')}</button>
    <div class="fa">
    <div>
    <p>${f[2]}</p></div></div></div>`).join('') : '<p>No questions match. Try another word or <a href="#/contact" style="color:var(--red)">contact us</a>.</p>';
}
function fo(b) {
  const q = b.parentNode;
  const o = q.classList.toggle('open');
  b.setAttribute('aria-expanded', o);
}
RICH.warranty = () => {
  out(hero('Warranty claims', 'Five years of cover, with a four-step claim.') + `<div class="w pg">
    <div class="stp" id="sp">${[1, 2, 3, 4].map(n => `<button onclick="ws(${n - 1})">Step ${n}</button>`).join('')}</div>
      <div class="tbar"><i id="wb" style="background:var(--red)"></i></div>
      <div id="wp" class="cpn" style="min-height:130px"></div>
      <p><a class="btn" href="#/dealers">Find a dealer</a></p></div>`);
  ws(0);
};
function ws(i) {
  const S4 = [
    ['Visit a dealer', 'Bring the tyre and your invoice to any TyreComp dealer.'],
    ['Inspection', 'A technician checks the tyre for manufacturing defects.'],
    ['Decision', 'You get a result within 3 working days.'],
    ['Replace or refund', 'Approved claims are replaced or credited on the spot.']
  ];
  document.querySelectorAll('#sp button').forEach((b, k) => b.classList.toggle('on', k <= i));
  $('#wb').style.width = (i + 1) * 25 + '%';
  const p = $('#wp');
  p.className = '';
  void p.offsetWidth;
  p.className = 'cpn';
  p.innerHTML = `<h2 class="h2" style="margin-top:24px">${S4[i][0]}</h2>
    <p class="txt">${S4[i][1]}</p>`;
}
/* router */
function route() {
  const h = location.hash;
  if (h.length > 1 && !h.startsWith('#/'))
    return;
  const [p, qs] = h.slice(2).split('?');
  const s = p.split('/').filter(Boolean);
  const q = new URLSearchParams(qs || '');
  const k = s[0] || '';
  V0.hidden = !!k;
  PG.hidden = !k;
  if (!k)
    renderHome();
  else if (k == 'shop') {
    S = {
      ...D,
      mode: S.mode,
      cat: CN[s[1]] ? s[1] : 'all',
      q: q.get('q') || '',
      brand: q.get('brand') || ''
    };
    shop();
  }
  else if (k == 'product' && P[s[1]])
    prod(P[s[1]]);
  else if (k == 'cart')
    cart();
  else if (k == 'dealers')
    dealers(q.get('q') || '');
  else if (RICH[k])
    RICH[k]();
  else if (PAGES[k])
    page(k);
  else
    PG.innerHTML = '<div class="w pg"><h1>Page not found</h1><p><a class="btn" href="#/">Back to home</a></p></div>';
  const cur = '#/' + (k == 'shop' ? 'shop/' + S.cat : k);
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') == cur));
  fx();
  scrollTo(0, 0);
}
const MAP = {
  whoweare: 'about',
  ourstory: 'about',
  careers: 'careers',
  pressmedia: 'press',
  sustainability: 'sustainability',
  cartyres: 'shop/car',
  suv4x4: 'shop/suv',
  twowheeler: 'shop/bike',
  truckbus: 'shop/truck',
  farmtyres: 'shop/farm',
  contactus: 'contact',
  warrantyclaims: 'warranty',
  tyrecareguide: 'care',
  faqs: 'faq',
  becomeadealer: 'become-dealer',
  privacy: 'privacy',
  terms: 'terms',
  sitemap: 'sitemap',
  dealerlogin: 'signin',
  trackorder: 'track',
  support: 'contact',
  viewall: 'shop/all',
  tyrecomp: ''
};
document.querySelectorAll('a[href="#"]:not([onclick])').forEach(a => {
  const b = a.textContent.trim();
  const t = (b || a.getAttribute('aria-label') || '').replace(/\W+/g, '').toLowerCase();
  a.setAttribute('href', '#/' + (BR.includes(b) ? 'shop/all?brand=' + b : MAP[t] ?? 'contact'));
});
function toast(m) {
  const t = $('#toast');
  t.textContent = m;
  t.className = 's';
  setTimeout(() => t.className = '', 2200);
}
function go(e) {
  e.preventDefault();
  const q = $('#q').value.trim();
  location.hash = '#/shop/all' + (q ? '?q=' + encodeURIComponent(q) : '');
  return false;
}
function dl(e) {
  e.preventDefault();
  location.hash = '#/dealers?q=' + encodeURIComponent(e.target.querySelector('input').value);
  return false;
}
function th() {
  const r = document.documentElement;
  const d = r.dataset.theme ? r.dataset.theme == 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  r.dataset.theme = d ? 'light' : 'dark';
}
addEventListener('hashchange', route);
route();
