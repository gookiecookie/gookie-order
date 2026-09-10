"use strict";

const gookieCatalogue = [
  {id:"wonder-chip",group:"classic",name:"Wonder Chip",subtitle:"Classic Chocolate Chip",description:"Golden, chunky and loaded with chocolate in every bite.",image:"wonder-chip.png",allergens:["Wheat","Milk","Egg","Soy"]},
  {id:"dark-crush",group:"classic",name:"Dark Crush",subtitle:"Dark Chocolate & Sea Salt",description:"Deep cocoa, dark chocolate and a little sea salt for a bold, balanced bite.",image:"dark-crush.png",allergens:["Wheat","Milk","Egg","Soy"]},
  {id:"red-bloom",group:"classic",name:"Red Bloom",subtitle:"Red Velvet",description:"Soft red velvet with creamy white chocolate through every chunky bite.",image:"red-bloom.png",allergens:["Wheat","Milk","Egg","Soy"]},
  {id:"matcha-matchy",group:"classic",name:"Matcha Matchy",subtitle:"Matcha & Macadamia",description:"Earthy matcha, creamy white chocolate and roasted macadamia.",image:"matcha-matchy.png",allergens:["Wheat","Milk","Egg","Soy","Tree Nuts"]},
  {id:"mallow-melt",group:"classic",name:"Mallow Melt",subtitle:"S'mores",description:"Toasty marshmallow comfort with chocolate and cookie goodness.",image:"mallow-melt.png",allergens:["Wheat","Milk","Egg","Soy"]},
  {id:"biscoff-boom",group:"filled",name:"Biscoff Boom",subtitle:"Biscoff Filled",description:"Caramelised cookie flavour with a soft Biscoff centre.",image:"biscoff-boom.png",allergens:["Wheat","Milk","Egg","Soy"]},
  {id:"dream-cream",group:"filled",name:"Dream Cream",subtitle:"Cookies & Cream",description:"Cookies and cream with a dreamy creamy centre.",image:"dream-cream.png",allergens:["Wheat","Milk","Egg","Soy"]},
  {id:"coffee-kiss",group:"filled",name:"Coffee Kiss",subtitle:"Tiramisu Inspired",description:"Coffee and creamy tiramisu-inspired flavour inside a soft chunky cookie.",image:"coffee-kiss.png",allergens:["Wheat","Milk","Egg","Soy"]},
  {id:"berry-blast",group:"monthly",name:"Berry Blast",subtitle:"This Month's Wonder",description:"A berry-packed limited drop, here for this month only.",image:"berry-blast.png",allergens:["Wheat","Milk","Egg","Soy","Peanuts"]}
];

const $ = s => document.querySelector(s);
const classics=$("#classic-grid"), filled=$("#filled-grid");
const modal=$("#gookie-modal");

function card(c){
  const b=document.createElement("button");
  b.type="button"; b.className="gookie-card";
  b.innerHTML=`<span class="gookie-card-image"><img src="${c.image}" alt="${c.name}" loading="lazy"></span><span><h3>${c.name.toUpperCase()}</h3><p>${c.subtitle}</p><small>MEET THIS GOOKIE</small></span>`;
  b.addEventListener("click",()=>openCookie(c));
  return b;
}
gookieCatalogue.filter(c=>c.group==="classic").forEach(c=>classics.appendChild(card(c)));
gookieCatalogue.filter(c=>c.group==="filled").forEach(c=>filled.appendChild(card(c)));

function openCookie(c){
  $("#modal-image").src=c.image; $("#modal-image").alt=c.name;
  $("#modal-name").textContent=c.name.toUpperCase();
  $("#modal-subtitle").textContent=c.subtitle;
  $("#modal-description").textContent=c.description;
  $("#modal-allergens").innerHTML=c.allergens.map(a=>`<span class="allergen-chip">${a}</span>`).join("");
  modal.hidden=false; requestAnimationFrame(()=>modal.classList.add("is-open")); document.body.classList.add("modal-open");
}
function closeCookie(){modal.classList.remove("is-open");document.body.classList.remove("modal-open");setTimeout(()=>modal.hidden=true,200)}
$("#gookie-modal-close").addEventListener("click",closeCookie);
modal.addEventListener("click",e=>{if(e.target===modal)closeCookie()});
$("#monthly-button").addEventListener("click",()=>openCookie(gookieCatalogue.find(c=>c.group==="monthly")));

/* Menu */
const menu=$("#menu-overlay");
function openMenu(){menu.hidden=false;requestAnimationFrame(()=>menu.classList.add("is-open"));document.body.classList.add("menu-open")}
function closeMenu(){menu.classList.remove("is-open");document.body.classList.remove("menu-open");setTimeout(()=>menu.hidden=true,220)}
$("#menu-open").addEventListener("click",openMenu);$("#menu-close").addEventListener("click",closeMenu);
menu.addEventListener("click",e=>{if(e.target===menu)closeMenu()});

/* Search */
const search=$("#product-search-overlay"), input=$("#product-search-input"), results=$("#product-search-results");
function renderSearch(q=""){
  q=q.trim().toLowerCase();
  const found=q?gookieCatalogue.filter(c=>(c.name+" "+c.subtitle).toLowerCase().includes(q)):gookieCatalogue;
  results.innerHTML=found.map(c=>`<button type="button" class="search-result" data-id="${c.id}"><img src="${c.image}" alt=""><span><strong>${c.name}</strong><small>${c.subtitle}</small></span></button>`).join("") || "<p>No Gookie found.</p>";
  results.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>{const c=gookieCatalogue.find(x=>x.id===b.dataset.id);closeSearch();setTimeout(()=>openCookie(c),180)});
}
function openSearch(){search.hidden=false;renderSearch();requestAnimationFrame(()=>search.classList.add("is-open"));document.body.classList.add("search-open");setTimeout(()=>input.focus(),100)}
function closeSearch(){search.classList.remove("is-open");document.body.classList.remove("search-open");setTimeout(()=>search.hidden=true,200)}
$("#product-search-open").addEventListener("click",openSearch);$("#product-search-close").addEventListener("click",closeSearch);input.addEventListener("input",e=>renderSearch(e.target.value));search.addEventListener("click",e=>{if(e.target===search)closeSearch()});

/* Cart shell */
const cart=$("#cart-overlay");
function openCart(){cart.hidden=false;requestAnimationFrame(()=>cart.classList.add("is-open"));document.body.classList.add("cart-open")}
function closeCart(){cart.classList.remove("is-open");document.body.classList.remove("cart-open");setTimeout(()=>cart.hidden=true,280)}
$("#cart-open").addEventListener("click",openCart);$("#cart-close-btn").addEventListener("click",closeCart);cart.addEventListener("click",e=>{if(e.target===cart)closeCart()});

document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(!modal.hidden)closeCookie();if(!search.hidden)closeSearch();if(!cart.hidden)closeCart();if(!menu.hidden)closeMenu()});
