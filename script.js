/* =========================
   DESIGN TOKENS
========================= */

:root {
  --primary:#BB191A;
  --primary-dark:#941011;
  --cream:#FFF8F1;
  --cream-2:#F7E9DA;
  --coffee:#4B2E21;
  --text:#211B18;
  --muted:#7C6C61;
  --white:#fff;
  --gold:#FFE8B3;
  --shadow:0 22px 70px rgba(69,40,30,.13);
  --soft-shadow:0 14px 38px rgba(69,40,30,.10);
  --radius-lg:34px;
  --radius-pill:999px
}

/* =========================
   BASE
========================= */

* {
  box-sizing:border-box
}

html {
  scroll-behavior:smooth
}

body {
  margin:0;
  min-height:100vh;
  font-family:"DM Sans",system-ui,sans-serif;
  color:var(--text);
  background:radial-gradient(circle at 12% 10%,rgba(187,25,26,.07),transparent 26%),linear-gradient(180deg,#fffaf4 0%,var(--cream) 55%,#fffdf9 100%);
  padding-bottom:112px
}

/* =========================
   TOP BAR
========================= */

.topbar {
  background:var(--primary);
  color:#fff;
  text-align:center;
  padding:10px 14px;
  font-weight:900;
  font-size:14px
}

/* =========================
   HEADER / NAVIGATION
========================= */

.site-header {
  background:rgba(255,248,241,.92);
  backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(75,46,33,.07);
  box-shadow:0 10px 30px rgba(75,46,33,.05);
  position:sticky;
  top:0;
  z-index:20
}

.header-inner {
  max-width:1180px;
  margin:0 auto;
  padding:20px 18px;
  display:grid;
  grid-template-columns:170px 1fr 160px;
  align-items:center;
  gap:22px
}

.logo-wrap {
  display:flex;
  align-items:center;
  justify-self:start
}

.site-logo {
  width:112px;
  height:auto;
  display:block
}

.main-nav {
  display:flex;
  justify-content:center;
  align-items:center;
  gap:0
}

.main-nav a {
  color:var(--primary);
  text-decoration:none;
  font-weight:900;
  font-size:15px;
  letter-spacing:2px;
  padding:14px 38px;
  position:relative;
  transition:.2s ease
}

.main-nav a:not(:last-child)::after {
  content:"";
  position:absolute;
  right:0;
  top:50%;
  transform:translateY(-50%);
  width:1px;
  height:34px;
  background:rgba(187,25,26,.25)
}

.main-nav a:hover {
  color:var(--primary-dark);
  transform:translateY(-1px)
}

.header-cta {
  justify-self:end;
  background:var(--primary);
  color:white;
  text-decoration:none;
  font-weight:900;
  border-radius:var(--radius-pill);
  padding:16px 26px;
  box-shadow:0 14px 30px rgba(187,25,26,.25);
  transition:.25s ease
}

.header-cta:hover {
  transform:translateY(-2px);
  background:var(--primary-dark)
}

/* =========================
   HERO
========================= */

.hero {
  max-width:1180px;
  margin:0 auto;
  padding:34px 18px 26px
}

.hero-card {
  min-height:500px;
  border-radius:var(--radius-lg);
  overflow:hidden;
  box-shadow:var(--shadow);
  background:linear-gradient(90deg,rgba(187,25,26,.94) 0%,rgba(187,25,26,.82) 28%,rgba(187,25,26,.20) 100%),url("assets/images/hero.png"),url("assets/images/header.png");
  background-size:110%;
  background-position:center;
  display:flex;
  align-items:center;
  position:relative;
}

.hero-card::after {
  content:"";
  position:absolute;
  right:-55px;
  top:-55px;
  width:220px;
  height:220px;
  background:rgba(255,255,255,.17);
  border-radius:50%
}

.hero-content {
  position:relative;
  z-index:2;
  width:min(620px,100%);
  padding:56px 42px;
  color:white
}

.eyebrow {
  margin:0 0 14px;
  text-transform:uppercase;
  letter-spacing:4px;
  font-size:12px;
  font-weight:900
}

.hero h1,.section-title h2,.gift-card h2 {
  font-family:"Playfair Display",serif
}

.hero h1 {
  font-size:clamp(38px,5vw,64px);
  line-height:.96;
  margin:0;
  letter-spacing:-1px
}

.hero-line {
  display:flex;
  align-items:center;
  gap:10px;
  margin:22px 0 20px
}

.hero-line span {
  width:70px;
  height:3px;
  background:white;
  border-radius:999px
}

.hero-line i {
  width:7px;
  height:7px;
  background:white;
  display:block;
  border-radius:50%
}

.hero-text {
  max-width:480px;
  color:rgba(255,255,255,.93);
  font-size:19px;
  line-height:1.5;
  margin:0 0 26px
}

.hero-btn,.gift-btn {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  background:white;
  color:var(--primary);
  border-radius:var(--radius-pill);
  padding:16px 26px;
  text-decoration:none;
  font-weight:900;
  box-shadow:0 15px 30px rgba(0,0,0,.12);
  transition:.25s ease
}

.hero-btn:hover,.gift-btn:hover {
  transform:translateY(-2px)
}

/* =========================
   MENU SECTION
========================= */

.menu-section {
  max-width:1180px;
  margin:0 auto;
  padding:22px 18px 68px
}

.section-title {
  text-align:center;
  margin:0 auto 28px
}

.star-line {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:12px;
  color:var(--primary);
  margin-bottom:10px
}

.star-line span {
  width:42px;
  height:1px;
  background:rgba(187,25,26,.45)
}

.star-line b {
  letter-spacing:7px;
  font-size:12px
}

.section-title h2 {
  color:var(--coffee);
  font-size:clamp(34px,4vw,52px);
  line-height:1;
  margin:0 0 10px
}

.section-title p {
  margin:0;
  color:var(--muted);
  font-weight:700
}

/* =========================
   PRODUCT CARDS
========================= */

.product-grid {
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:22px
}

.product-card {
  background:white;
  border-radius:28px;
  border:1px solid rgba(75,46,33,.08);
  padding:12px;
  box-shadow:var(--soft-shadow);
  transition:.25s ease;
  display:flex;
  flex-direction:column;
  position:relative;
  overflow:hidden
}

.product-card:hover {
  transform:translateY(-6px);
  box-shadow:var(--shadow)
}

.badge{
    position:absolute;
    top:18px;
    left:18px;

    background:#FFE6D5;
    color:#BB191A;

    font-size:11px;
    font-weight:700;

    padding:8px 14px;

    border-radius:30px;

    letter-spacing:1px;

    text-transform:uppercase;

    z-index:5;
}

.image-wrap {
  background:linear-gradient(180deg,#fbecdc,#fff7ef);
  border-radius:22px;
  aspect-ratio:1/1;
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center
}

.image-wrap img {
  width:100%;
  height:100%;
  object-fit:cover;
  transition:.35s ease
}

.product-card:hover .image-wrap img {
  transform:scale(1.06)
}

.product-body {
  padding:16px 6px 4px;
  display:flex;
  flex-direction:column;
  flex:1
}

.product-body h3 {
  margin:0 0 7px;
  color:var(--coffee);
  font-size:22px;
  line-height:1.1
}

.product-body p {
  margin:0 0 18px;
  color:var(--muted);
  font-size:14px;
  line-height:1.45
}

.card-bottom {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-top:auto;
  gap:12px
}

.price {
  color:var(--primary);
  font-weight:900;
  font-size:22px
}

.qty {
  display:flex;
  align-items:center;
  gap:8px;
  padding:5px;
  border-radius:var(--radius-pill);
  background:var(--cream);
  border:1px solid rgba(187,25,26,.08)
}

.qty button,.mini-controls button {
  width:34px;
  height:34px;
  border:none;
  background:var(--primary);
  color:white;
  border-radius:50%;
  font-size:18px;
  font-weight:900;
  cursor:pointer;
  transition:.2s ease
}

.qty button:hover,.mini-controls button:hover {
  background:var(--primary-dark);
  transform:scale(1.04)
}

.qty span {
  min-width:22px;
  text-align:center;
  font-weight:900
}

/* =========================
   GIFTS
========================= */

.gifts-section {
  max-width:1180px;
  margin:0 auto;
  padding:0 18px 80px
}

.gift-card {
  border-radius:var(--radius-lg);
  background:radial-gradient(circle at 90% 20%,rgba(255,255,255,.25),transparent 25%),linear-gradient(135deg,var(--primary),var(--primary-dark));
  color:white;
  padding:44px;
  box-shadow:var(--shadow)
}

.gift-card h2 {
  font-size:clamp(32px,4vw,54px);
  margin:0 0 10px
}

.gift-card p:not(.eyebrow) {
  max-width:520px;
  font-size:18px;
  line-height:1.5;
  color:rgba(255,255,255,.88)
}

/* =========================
   FLOATING CART
========================= */

.cart-pill {
  position:fixed;
  left:50%;
  bottom:22px;
  transform:translateX(-50%);
  min-width:420px;
  max-width:92vw;
  background:linear-gradient(180deg,#d41518,var(--primary));
  color:#fff;
  border:none;
  border-radius:var(--radius-pill);
  padding:18px 30px;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:26px;
  box-shadow:0 20px 48px rgba(187,25,26,.35);
  cursor:pointer;
  z-index:40;
  transition:.25s;
}

.cart-pill:hover {
  transform:translateX(-50%) translateY(-5px)
}

.cart-icon {
  font-size:25px;
  line-height:1
}

.pill-divider {
  width:2px;
  height:30px;
  border-radius:999px;
  background:rgba(255,255,255,.32);
  flex:0 0 auto
}

#cartCount {
  min-width:120px;
  text-align:center;
  font-weight:900;
  font-size:17px;
  letter-spacing:.2px;
  white-space:nowrap
}

#cartTotal {
  min-width:70px;
  text-align:center;
  font-size:18px;
  color:var(--gold);
  white-space:nowrap
}

/* =========================
   CART DRAWER
========================= */

.overlay {
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.38);
  opacity:0;
  pointer-events:none;
  transition:.25s ease;
  z-index:50
}

.overlay.show {
  opacity:1;
  pointer-events:auto
}

.cart-drawer {
  position:fixed;
  top:0;
  right:0;
  height:100vh;
  width:min(460px,100%);
  background:white;
  z-index:60;
  transform:translateX(105%);
  transition:.32s ease;
  box-shadow:-25px 0 70px rgba(0,0,0,.20);
  display:flex;
  flex-direction:column;
  padding:24px
}

.cart-drawer.open {
  transform:translateX(0)
}

.cart-header {
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:14px
}

.cart-header h3 {
  font-family:"Playfair Display",serif;
  margin:0;
  color:var(--coffee);
  font-size:34px;
  line-height:1
}

.close-cart {
  border:none;
  background:var(--cream);
  color:var(--coffee);
  width:42px;
  height:42px;
  border-radius:50%;
  font-size:30px;
  line-height:1;
  cursor:pointer
}

.combo-box {
  margin:18px 0 10px;
  background:var(--cream);
  border:1px dashed rgba(187,25,26,.45);
  color:var(--coffee);
  border-radius:20px;
  padding:14px 16px;
  font-weight:900;
  line-height:1.4
}

.combo-progress {
  height:9px;
  background:#f1e5d9;
  border-radius:999px;
  overflow:hidden;
  margin-bottom:14px
}

#comboProgressFill {
  height:100%;
  width:0%;
  background:linear-gradient(90deg,var(--primary),#e25254);
  border-radius:999px;
  transition:.25s ease
}

.cart-items {
  flex:1;
  overflow:auto;
  display:flex;
  flex-direction:column;
  gap:10px;
  padding-right:2px
}

.empty-cart {
  text-align:center;
  color:var(--muted);
  padding:36px 10px
}

.cart-row {
  background:#fbf6ef;
  border:1px solid rgba(75,46,33,.06);
  border-radius:18px;
  padding:13px;
  display:grid;
  grid-template-columns:1fr auto;
  align-items:center;
  gap:12px
}

.cart-row strong {
  color:var(--coffee)
}

.cart-row small {
  color:var(--muted)
}

.mini-controls {
  display:flex;
  align-items:center;
  gap:8px
}

.mini-controls button {
  width:30px;
  height:30px;
  font-size:16px
}

.customer-form {
  display:grid;
  gap:9px;
  margin:15px 0
}

.customer-form input,.customer-form select,.customer-form textarea {
  width:100%;
  border:1px solid rgba(75,46,33,.09);
  background:#fbf6ef;
  border-radius:15px;
  padding:12px 13px;
  font:inherit;
  outline:none
}

.customer-form textarea {
  min-height:74px;
  resize:vertical
}

.cart-summary {
  border-top:1px solid rgba(75,46,33,.10);
  padding-top:14px;
  display:grid;
  gap:10px
}

.cart-summary div {
  display:flex;
  align-items:center;
  justify-content:space-between;
  color:var(--muted)
}

.cart-summary .grand {
  color:var(--text);
  font-size:22px;
  font-weight:900
}

.checkout-btn {
  margin-top:16px;
  width:100%;
  border:none;
  background:var(--primary);
  color:white;
  border-radius:var(--radius-pill);
  padding:16px 20px;
  font-weight:900;
  font-size:16px;
  cursor:pointer;
  box-shadow:0 14px 30px rgba(187,25,26,.25)
}

/* =========================
   TOAST
========================= */

.toast {
  position:fixed;
  left:50%;
  bottom:102px;
  transform:translateX(-50%) translateY(18px);
  background:var(--coffee);
  color:white;
  padding:12px 18px;
  border-radius:999px;
  font-weight:900;
  opacity:0;
  pointer-events:none;
  transition:.25s ease;
  z-index:80
}

.toast.show {
  opacity:1;
  transform:translateX(-50%) translateY(0)
}

/* =========================
   RESPONSIVE
========================= */

@media(max-width:1050px) {
  .header-inner{grid-template-columns:130px 1fr 140px}.main-nav a{padding:13px 24px}.product-grid{grid-template-columns:repeat(3,1fr)}
}

@media(max-width:780px) {
  .header-inner{grid-template-columns:1fr;
  justify-items:center;
  gap:12px;
  padding:16px 14px 18px}.logo-wrap{justify-self:center}.site-logo{width:94px}.main-nav{width:100%;
  justify-content:center;
  flex-wrap:wrap}.main-nav a{padding:10px 16px;
  font-size:13px;
  letter-spacing:1.5px}.main-nav a:not(:last-child)::after{height:24px}.header-cta{display:none}.hero{padding:22px 12px 20px}.hero-card{min-height:390px;
  border-radius:28px;
  background:linear-gradient(90deg,rgba(187,25,26,.94) 0%,rgba(187,25,26,.86) 58%,rgba(187,25,26,.50) 100%),url("assets/images/hero.png"),url("assets/images/classic choc chip.png");
  background-size:cover;
  background-position:center}.hero-content{padding:38px 24px}.hero-text{font-size:16px}.menu-section{padding:20px 12px 54px}.product-grid{grid-template-columns:repeat(2,1fr);
  gap:16px}.cart-pill{min-width:0;
  width:92vw;
  gap:18px;
  padding:16px 22px}#cartCount{min-width:110px}#cartTotal{min-width:60px}
}

@media(max-width:520px) {
  body{padding-bottom:100px}.topbar{font-size:12px}.main-nav a{padding:9px 11px;
  font-size:12px}.hero h1{font-size:39px}.product-grid{grid-template-columns:1fr}.cart-pill{gap:14px;
  padding:15px 18px}#cartCount{min-width:96px;
  font-size:15px}#cartTotal{min-width:54px;
  font-size:16px}.pill-divider{height:26px}.gift-card{padding:32px 24px}
}

.cart-items{
  max-height:220px;
  overflow-y:auto;
  padding-right:6px;
}

.cart-row{
  min-height:74px;
}

.customer-form{
  margin-top:18px;
}

.checkout-btn{
  margin-bottom:8px;
}

.card{
    position:relative;
    background:#fff;
    border-radius:26px;
    overflow:hidden;
    transition:.35s;
    border:1px solid rgba(0,0,0,.05);
    box-shadow:0 12px 35px rgba(0,0,0,.08);
}

.card:hover{
    transform:translateY(-10px);
    box-shadow:0 30px 60px rgba(0,0,0,.15);
}

.card-img{
    background:#F7EEDF;
    padding:28px;
    display:flex;
    justify-content:center;
    align-items:center;
}

.card-img img{
    width:100%;
    max-width:240px;
    transition:.4s;
}

.card:hover .card-img img{
    transform:scale(1.07) rotate(-2deg);
}

.card h3{

    font-size:32px;

    margin-bottom:10px;

    color:#231815;

    font-family:"Cormorant Garamond",serif;

}

.card p{

    color:#6b6b6b;

    line-height:1.6;

    min-height:56px;

}

.price{

    font-size:34px;

    font-weight:800;

    color:#BB191A;

}

.qty{

display:flex;

align-items:center;

gap:14px;

}

.qty button{

width:42px;

height:42px;

border-radius:50%;

border:none;

background:#BB191A;

color:white;

font-size:24px;

cursor:pointer;

transition:.2s;

}

.qty button:hover{

transform:scale(1.08);

}

.qty button:active{

transform:scale(.92);

}

.cart-pill.cart-bounce{
  animation: cartBounce .45s ease;
}

@keyframes cartBounce{
  0%{
    transform:translateX(-50%) scale(1);
  }
  40%{
    transform:translateX(-50%) scale(1.08);
  }
  100%{
    transform:translateX(-50%) scale(1);
  }
}
