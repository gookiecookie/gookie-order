(() => {
  const $ = (id) => document.getElementById(id);
  const button = $('searchButton');
  const modal = $('searchModal');
  const close = $('searchModalClose');
  const input = $('siteSearchInput');
  const results = $('siteSearchResults');
  if (!button || !modal || !results) return;
  const index = [
    ['Wonder Chip','The classic Gookie','gookies.html#wonder-chip','classic chocolate chip cookie'],
    ['Dark Crush','Deep chocolate, less sweet','gookies.html#dark-crush','dark chocolate cookie'],
    ['Red Bloom','Red velvet favourite','gookies.html#red-bloom','red velvet cookie'],
    ['Coffee Kiss','Coffee-forward Gookie','gookies.html#coffee-kiss','coffee cookie'],
    ['Matcha Matchy','Matcha & white chocolate','gookies.html#matcha-matchy','matcha cookie'],
    ['Dream Cream','Cookies & cream','gookies.html#dream-cream','cookies cream cookie'],
    ['Mallow Melt','Marshmallow-centred favourite','gookies.html#mallow-melt','mallow marshmallow smores cookie'],
    ['Biscoff Boom','Biscoff-filled favourite','gookies.html#biscoff-boom','biscoff cookie'],
    ['Best-Seller Box','Four crowd favourites in one box','order.html#best-seller','best seller assorted box 4'],
    ['The Whole Crew','All eight core Gookies','order.html#whole-crew','whole crew assorted box 8'],
    ['Build Your Own','Pick your favourites and build your box','order.html#build-your-own','build your own mix match'],
    ['Big Box','Box of 12 for sharing','order.html','big box 12 sharing gifting'],
    ['Mini Box','15 mini Gookies in three flavours','order.html','mini box 15 mini cookies'],
    ['Party Kit','Make your box celebration-ready','order.html#add-ons','party kit candle cake board sprinkles add on'],
    ['Wish Card','Add a custom message','order.html#add-ons','wish card custom message add on'],
    ['Meet the Gookies','Get to know the whole crew','gookies.html','flavours cookies crew'],
    ["Gookie's Goodies",'Gookie gifting for happy moments','goodies.html','goodies wedding birthday corporate gifting'],
    ['About Gookie','Meet the brand behind the cookies','about.html','about story brand gookie']
  ].map(([title,subtitle,href,keywords])=>({title,subtitle,href,keywords}));
  const esc=(s)=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  function render(q=''){
    q=String(q).trim().toLowerCase();
    const matches=(q?index.filter(x=>(`${x.title} ${x.subtitle} ${x.keywords}`).toLowerCase().includes(q)):index.slice(0,6)).slice(0,8);
    results.innerHTML=matches.length?matches.map(x=>`<a class="search-result-item" href="${esc(x.href)}"><span class="search-result-copy"><strong>${esc(x.title)}</strong><span>${esc(x.subtitle)}</span></span><i class="fa-solid fa-arrow-right search-result-arrow" aria-hidden="true"></i></a>`).join(''):'<p class="search-empty">No Gookie found. Try another flavour or box name.</p>';
  }
  function open(){modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');button.setAttribute('aria-expanded','true');document.body.classList.add('site-search-open');render(input?.value||'');setTimeout(()=>input?.focus(),120)}
  function shut(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');button.setAttribute('aria-expanded','false');document.body.classList.remove('site-search-open')}
  button.addEventListener('click',open);close?.addEventListener('click',shut);input?.addEventListener('input',e=>render(e.target.value));modal.addEventListener('click',e=>{if(e.target===modal)shut()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))shut()});render();
})();
