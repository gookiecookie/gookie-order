/* ========================================
   GOOKIE COOKIE LINEUP
======================================== */

const cookieLineup = [

  {
    name: "WONDER CHIP",
    image: "wonder-chip.png",
    description: "Classic chocolate chip, never goes out of style.",
    sticker: "OUR CLASSIC"
  },

  {
    name: "RED BLOOM",
    image: "red-bloom.png",
    description: "A soft red velvet favourite with a rich creamy bite.",
    sticker: "VELVET LOVE"
  },

  {
    name: "MATCHA MATCHY",
    image: "matcha-matchy.png",
    description: "Earthy matcha with a sweet creamy finish.",
    sticker: "MATCHA TIME"
  },

  {
    name: "MALLOW MELT",
    image: "mallow-melt.png",
    description: "Chocolate, marshmallow and all the cosy s'mores vibes.",
    sticker: "S'MORES FAVE"
  },

  {
    name: "DREAM CREAM",
    image: "dream-cream.png",
    description: "Cookies and cream with a dreamy centre.",
    sticker: "DREAMY"
  },

  {
    name: "DARK CRUSH",
    image: "dark-crush.png",
    description: "Deep chocolate flavour for serious chocolate lovers.",
    sticker: "CHOCO LOVE"
  },

  {
    name: "COFFEE KISS",
    image: "coffee-kiss.png",
    description: "A comforting coffee-inspired cookie with a rich finish.",
    sticker: "COFFEE TIME"
  },

  {
    name: "BISCOFF BOOM",
    image: "biscoff-boom.png",
    description: "Biscoff-filled and made for serious cravings.",
    sticker: "CROWD FAVE"
  },

  // ========================================
  // MONTHLY WONDER
  // TUKAR BAHAGIAN INI SETIAP BULAN
  // 1. name
  // 2. image
  // 3. description
  // 4. sticker
  // ========================================

  {
    name: "BERRY BLAST",
    image: "berry-blast.png",
    description: "A berry-packed limited drop, here for this month only.",
    sticker: "MONTHLY WONDER"
  }

];

/* ========================================
   COOKIE QUICK HIGHLIGHTS
======================================== */

const cookieHighlights = {

  "WONDER CHIP": [
    {
      icon: "🍫",
      title: "CHOCOLATE CHUNKS",
      text: "Classic chocolate chip goodness."
    },
    {
      icon: "🤎",
      title: "SOFT & CHUNKY",
      text: "A thick, chewy bite."
    },
    {
      icon: "⭐",
      title: "THE CLASSIC",
      text: "The one that started it all."
    }
  ],

  "RED BLOOM": [
    {
      icon: "❤️",
      title: "RED VELVET",
      text: "Soft cocoa velvet flavour."
    },
    {
      icon: "🤍",
      title: "CREAMY BITE",
      text: "A rich creamy finish."
    },
    {
      icon: "✨",
      title: "VELVET LOVE",
      text: "Pretty, soft and indulgent."
    }
  ],

  "MATCHA MATCHY": [
    {
      icon: "🍵",
      title: "MATCHA HIT",
      text: "Earthy matcha flavour."
    },
    {
      icon: "🤍",
      title: "CREAMY FINISH",
      text: "Sweet and smooth."
    },
    {
      icon: "🌿",
      title: "BALANCED BITE",
      text: "Earthy meets creamy."
    }
  ],

  "MALLOW MELT": [
    {
      icon: "🍫",
      title: "CHOCOLATE",
      text: "Chocolatey from first bite."
    },
    {
      icon: "☁️",
      title: "MARSHMALLOW",
      text: "Soft marshmallow goodness."
    },
    {
      icon: "🔥",
      title: "S'MORES VIBES",
      text: "Cosy campfire energy."
    }
  ],

  "DREAM CREAM": [
    {
      icon: "🍪",
      title: "COOKIES & CREAM",
      text: "A familiar favourite."
    },
    {
      icon: "🤍",
      title: "DREAMY CENTRE",
      text: "Creamy in the middle."
    },
    {
      icon: "☁️",
      title: "SOFT BITE",
      text: "Soft, chunky comfort."
    }
  ],

  "DARK CRUSH": [
    {
      icon: "🍫",
      title: "DEEP CHOCOLATE",
      text: "Made for chocolate lovers."
    },
    {
      icon: "🤎",
      title: "SOFT & CHUNKY",
      text: "Rich, thick and chewy."
    },
    {
      icon: "⭐",
      title: "CHOCO LOVE",
      text: "Serious chocolate energy."
    }
  ],

  "COFFEE KISS": [
    {
      icon: "☕",
      title: "COFFEE KICK",
      text: "Comforting coffee flavour."
    },
    {
      icon: "🤎",
      title: "RICH FINISH",
      text: "Warm and satisfying."
    },
    {
      icon: "✨",
      title: "COZY BITE",
      text: "Coffee break, cookie form."
    }
  ],

  "BISCOFF BOOM": [
    {
      icon: "🧡",
      title: "BISCOFF FILLED",
      text: "Big Biscoff flavour."
    },
    {
      icon: "💥",
      title: "BIG CENTRE",
      text: "A little surprise inside."
    },
    {
      icon: "⭐",
      title: "CROWD FAVE",
      text: "Built for serious cravings."
    }
  ],

  "BERRY BLAST": [
    {
      icon: "🍓",
      title: "BERRY PACKED",
      text: "Bright berry flavour."
    },
    {
      icon: "✨",
      title: "LIMITED DROP",
      text: "Here for this month only."
    },
    {
      icon: "💗",
      title: "MONTHLY WONDER",
      text: "A new little adventure."
    }
  ]

};

function updateCookieHighlights(cookieName) {

  const highlightContainer =
    document.getElementById("cookie-highlights");

  const highlights =
    cookieHighlights[cookieName];

  if (!highlightContainer || !highlights) return;

  highlightContainer.innerHTML =
    highlights.map((item) => `
      <div class="cookie-highlight">

        <span class="cookie-highlight-icon">
          ${item.icon}
        </span>

        <div>
          <strong>${item.title}</strong>
          <p>${item.text}</p>
        </div>

      </div>
    `).join("");

}

/* ========================================
   ELEMENTS
======================================== */

const cookieImage =
  document.getElementById("featured-cookie-image");

const cookieName =
  document.getElementById("featured-cookie-name");

const cookieDescription =
  document.getElementById("featured-cookie-description");

const cookieSticker =
  document.getElementById("featured-cookie-sticker");

const previousButton =
  document.querySelector(".cookie-arrow-left");

const nextButton =
  document.querySelector(".cookie-arrow-right");


let currentCookieIndex = 0;
let isChangingCookie = false;


/* ========================================
   UPDATE COOKIE
======================================== */

function showCookie(index) {

  if (isChangingCookie) return;

  isChangingCookie = true;

  const cookie = cookieLineup[index];

  cookieImage.classList.add("is-changing");
  cookieName.classList.add("is-changing");

  setTimeout(() => {

    cookieImage.src = cookie.image;
    cookieImage.alt = cookie.name;

    cookieName.textContent = cookie.name;
    cookieDescription.textContent = cookie.description;

     updateCookieHighlights(cookie.name);

    const stickerLines =
      cookie.sticker.split(" ");

    if (stickerLines.length >= 2) {

      const firstLine =
        stickerLines
          .slice(0, Math.ceil(stickerLines.length / 2))
          .join(" ");

      const secondLine =
        stickerLines
          .slice(Math.ceil(stickerLines.length / 2))
          .join(" ");

      cookieSticker.querySelector(".sticker-label").innerHTML = `
        <span>${firstLine}</span>
        <span>${secondLine}</span>
      `;

    } else {

      cookieSticker.querySelector(".sticker-label").innerHTML = `
        <span>${cookie.sticker}</span>
      `;
    }


    cookieImage.classList.remove("is-changing");
    cookieName.classList.remove("is-changing");

    cookieImage.classList.add("is-entering");
    cookieName.classList.add("is-entering");


    setTimeout(() => {

      cookieImage.classList.remove("is-entering");
      cookieName.classList.remove("is-entering");

      isChangingCookie = false;

    }, 500);

  }, 160);

}

/* ========================================
   NEXT
======================================== */

function nextCookie() {

  currentCookieIndex =
    (currentCookieIndex + 1) % cookieLineup.length;

  showCookie(currentCookieIndex);

}


/* ========================================
   PREVIOUS
======================================== */

function previousCookie() {

  currentCookieIndex =
    (
      currentCookieIndex
      - 1
      + cookieLineup.length
    )
    % cookieLineup.length;

  showCookie(currentCookieIndex);

}


/* ========================================
   BUTTONS
======================================== */

nextButton.addEventListener("click", () => {
  nextCookie();
  startCookieAutoSlide();
});

previousButton.addEventListener("click", () => {
  previousCookie();
  startCookieAutoSlide();
});

/* ========================================
   AUTO SLIDE
======================================== */

let cookieAutoTimer;

function startCookieAutoSlide() {

  clearInterval(cookieAutoTimer);

  cookieAutoTimer = setInterval(() => {

    if (!isChangingCookie) {
      nextCookie();
    }

  }, 4000);

}

startCookieAutoSlide();

/* ========================================
   SWIPE — MOBILE
======================================== */

let touchStartX = 0;
let touchEndX = 0;


cookieImage.addEventListener(
  "touchstart",
  (event) => {

    touchStartX =
      event.changedTouches[0].screenX;

  },
  { passive: true }
);


cookieImage.addEventListener(
  "touchend",
  (event) => {

    touchEndX =
      event.changedTouches[0].screenX;

    handleSwipe();

  },
  { passive: true }
);


function handleSwipe() {

  const swipeDistance =
    touchEndX - touchStartX;


  if (Math.abs(swipeDistance) < 45) {
    return;
  }


  if (swipeDistance < 0) {

    nextCookie();

  } else {

    previousCookie();

  }

}
