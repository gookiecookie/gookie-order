"use strict";

const catalogue = [
{name:"Wonder Chip",subtitle:"Classic Chocolate Chip",description:"A timeless favourite with melty chocolate chips, crisp edges and a soft, chewy centre.",image:"wonder-chip.png",badge:"BEST SELLER",type:"best",allergens:["Wheat","Milk","Egg","Soy"]},
{name:"Dark Seasalt",subtitle:"Dark Chocolate & Sea Salt",description:"Deep dark chocolate with a touch of sea salt for a rich, balanced bite.",image:"dark-crush.png",badge:"BEST SELLER",type:"best",allergens:["Wheat","Milk","Egg","Soy"]},
{name:"Red Velvet",subtitle:"Red Velvet & White Chocolate",description:"Velvety cocoa cookie with creamy white chocolate in every chunky bite.",image:"red-bloom.png",allergens:["Wheat","Milk","Egg","Soy"]},
{name:"Matchadamia",subtitle:"Matcha, White Chocolate & Macadamia",description:"Earthy matcha with creamy white chocolate and crunchy roasted macadamia.",image:"matcha-matchy.png",allergens:["Wheat","Milk","Egg","Soy","Tree Nuts"]},
{name:"Pistachio",subtitle:"Pistachio & Milk Chocolate",description:"Nutty pistachio flavour with smooth milk chocolate in a soft chunky cookie.",image:"pistachio.png",badge:"BEST SELLER",type:"best",allergens:["Wheat","Milk","Egg","Soy","Tree Nuts"]},
{name:"OG S'mores",subtitle:"Marshmallow, Chocolate & Graham",description:"Classic s'mores comfort with chocolate, marshmallow and graham-style crunch.",image:"mallow-melt.png",allergens:["Wheat","Milk","Egg","Soy"]},
{name:"Dark S'mores",subtitle:"Dark Chocolate S'mores",description:"A deeper chocolate take on s'mores with a soft toasted marshmallow centre.",image:"dark-smores.png",allergens:["Wheat","Milk","Egg","Soy"]},
{name:"Rocky Road",subtitle:"Chocolate & Marshmallow",description:"A chocolatey, marshmallow-packed cookie inspired by classic rocky road.",image:"rocky-road.png",allergens:["Wheat","Milk","Egg","Soy","Tree Nuts"]},
{name:"Biscoff Boom",subtitle:"Biscoff Lava",description:"Caramelised cookie flavour with a rich Biscoff centre hiding inside.",image:"biscoff-boom.png",badge:"BEST SELLER",type:"best",allergens:["Wheat","Milk","Egg","Soy"]},
{name:"Choki Chomp",subtitle:"Hazelnut Chocolate Lava",description:"A soft chunky cookie filled with a creamy hazelnut chocolate centre.",image:"choki-chomp.png",allergens:["Wheat","Milk","Egg","Soy","Tree Nuts"]},
{name:"Tiramisu Lava",subtitle:"Coffee & Creamy Centre",description:"Coffee-forward cookie with a creamy tiramisu-inspired centre and cocoa finish.",image:"coffee-kiss.png",allergens:["Wheat","Milk","Egg","Soy"]},
{name:"Dream Cream",subtitle:"Cookies & Cream",description:"Cookies and cream with a smooth creamy centre inside a soft chunky cookie.",image:"dream-cream.png",allergens:["Wheat","Milk","Egg","Soy"]},
{name:"Berry Nutty",subtitle:"Monthly Wonder",description:"Freeze-dried strawberry and a peanut butter centre — here for a limited time only.",image:"berry-blast.png",badge:"LIMITED DROP",type:"limited",allergens:["Wheat","Milk","Egg","Soy","Peanuts"]}
];

const $=s=>document.querySelector(s);
const grid=$("#gookie-grid"), modal=$("#gookie-modal");

function makeCard(c){
 const b=document.createElement("button"); b.type="button"; b.className="gookie-card";
 b.innerHTML=`<span class="gookie-card-image">${c.badge?`<span class="cookie-badge ${c.type==="limited"?"limited":""}">${c.badge}</span>`:""}<img src="${c.image}" alt="${c.name}" loading="lazy"></span><h3>${c.name}</h3>`;
 b.onclick=()=>openCookie(c); return b;
}
catalogue.forEach(c=>grid.appendChild(makeCard(c)));

function openCookie(c){
 $("#modal-image").src=c.image; $("#modal-image").alt=c.name;
 $("#modal-name").textContent=c.name; $("#modal-subtitle").textContent=c.subtitle; $("#modal-description").textContent=c.description;
 $("#modal-allergens").innerHTML=c.allergens.map(a=>`<span class="allergen-chip">${a}</span>`).join("");
 modal.hidden=false; requestAnimationFrame(()=>modal.classList.add("is-open")); document.body.classList.add("modal-open");
}
function closeCookie(){modal.classList.remove("is-open");document.body.classList.remove("modal-open");setTimeout(()=>modal.hidden=true,200)}
$("#gookie-modal-close").onclick=closeCookie; modal.onclick=e=>{if(e.target===modal)closeCookie()};

const menu=$("#menu-overlay");
$("#menu-open").onclick=()=>{menu.hidden=false;requestAnimationFrame(()=>menu.classList.add("is-open"));document.body.classList.add("menu-open")};
$("#menu-close").onclick=()=>{menu.classList.remove("is-open");document.body.classList.remove("menu-open");setTimeout(()=>menu.hidden=true,220)};
menu.onclick=e=>{if(e.target===menu)$("#menu-close").click()};

const search=$("#product-search-overlay"), input=$("#product-search-input"), results=$("#product-search-results");
function render(q=""){q=q.trim().toLowerCase();const f=q?catalogue.filter(c=>(c.name+" "+c.subtitle).toLowerCase().includes(q)):catalogue;results.innerHTML=f.map((c,i)=>`<button class="search-result" type="button" data-i="${catalogue.indexOf(c)}"><img src="${c.image}" alt=""><span><strong>${c.name}</strong><small>${c.subtitle}</small></span></button>`).join("")||"<p>No Gookie found.</p>";results.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{const c=catalogue[+b.dataset.i];closeSearch();setTimeout(()=>openCookie(c),180)})}
function openSearch(){search.hidden=false;render();requestAnimationFrame(()=>search.classList.add("is-open"));document.body.classList.add("search-open");setTimeout(()=>input.focus(),100)}
function closeSearch(){search.classList.remove("is-open");document.body.classList.remove("search-open");setTimeout(()=>search.hidden=true,200)}
$("#product-search-open").onclick=openSearch;$("#product-search-close").onclick=closeSearch;input.oninput=e=>render(e.target.value);search.onclick=e=>{if(e.target===search)closeSearch()};

const cart=$("#cart-overlay");
$("#cart-open").onclick=()=>{cart.hidden=false;requestAnimationFrame(()=>cart.classList.add("is-open"));document.body.classList.add("cart-open")};
$("#cart-close-btn").onclick=()=>{cart.classList.remove("is-open");document.body.classList.remove("cart-open");setTimeout(()=>cart.hidden=true,280)};
cart.onclick=e=>{if(e.target===cart)$("#cart-close-btn").click()};

document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(!modal.hidden)closeCookie();if(!search.hidden)closeSearch();if(!cart.hidden)$("#cart-close-btn").click();if(!menu.hidden)$("#menu-close").click()});
